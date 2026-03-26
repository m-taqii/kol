import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import DailyChat from "./src/models/message.model";
import Room from "./src/models/room.model";
import User from "./src/models/user.model";
import compiledGraph from "./src/agents";

// Types
interface AuthenticatedSocket extends Socket {
    userId?: string;
    username?: string;
}

interface JoinRoomPayload {
    roomId: string;
}

interface SendMessagePayload {
    roomId: string;
    content: string;
}

interface TypingPayload {
    roomId: string;
}

// Socket Server    

async function initializeSocket(server: any) {
    const io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true,
        },
    });

    // Auth Middleware
    // Verify JWT before allowing any socket connection
    io.use(async (socket: AuthenticatedSocket, next) => {
        try {
            let token = socket.handshake.auth?.token;
            if (!token && socket.handshake.headers?.cookie) {
                // Parse similarly to cookie-parser (last value overrides)
                const parsedCookies = socket.handshake.headers.cookie.split(";").reduce((acc: Record<string, string>, current) => {
                    const parts = current.split("=");
                    const key = parts[0]?.trim();
                    const value = parts.slice(1).join("=").trim();
                    if (key) acc[key] = value;
                    return acc;
                }, {});

                token = parsedCookies["token"];
            }

            if (!token) {
                return next(new Error("Authentication required"));
            }

            const decodedToken = decodeURIComponent(token);
            const decoded = jwt.verify(decodedToken, process.env.JWT_SECRET!) as { id: string };
            const user = await User.findById(decoded.id);

            if (!user) {
                return next(new Error("User not found"));
            }

            socket.userId = decoded.id;
            socket.username = user.username;
            next();
        } catch (error: any) {
            console.error("Socket Auth Error Details:", error.message);
            next(new Error("Invalid or expired token"));
        }
    });

    // ── Connection Handler ─────────────────────────────────
    io.on("connection", (socket: AuthenticatedSocket) => {
        console.log(`✓ User connected: ${socket.username} (${socket.id})`);

        // ── JOIN ROOM ──────────────────────────────────────
        socket.on("join_room", async (data: JoinRoomPayload, callback?: (res: any) => void) => {
            const { roomId } = data;

            if (!roomId) {
                callback?.({ success: false, error: "Room ID is required" });
                return;
            }

            try {
                // Verify user is a member of this room
                const room = await Room.findById(roomId);
                if (!room) {
                    callback?.({ success: false, error: "Room not found" });
                    return;
                }

                const isMember = room.members.some(
                    (memberId) => memberId.toString() === socket.userId
                );

                if (!isMember) {
                    callback?.({ success: false, error: "You are not a member of this room" });
                    return;
                }

                socket.join(roomId);
                console.log(`→ ${socket.username} joined room: ${room.name}`);

                // Notify others in the room
                socket.to(roomId).emit("user_joined", {
                    userId: socket.userId,
                    username: socket.username,
                });

                callback?.({ success: true, room: { name: room.name, aiMembers: room.aiMembers } });
            } catch (err) {
                console.error("Join room error:", err);
                callback?.({ success: false, error: "Failed to join room" });
            }
        });

        // ── LEAVE ROOM ─────────────────────────────────────
        socket.on("leave_room", (data: { roomId: string }) => {
            socket.leave(data.roomId);
            socket.to(data.roomId).emit("user_left", {
                userId: socket.userId,
                username: socket.username,
            });
        });

        // ── SEND MESSAGE ───────────────────────────────────
        socket.on("send_message", async (data: SendMessagePayload) => {
            const { roomId, content } = data;

            // Validate input
            if (!roomId || !content?.trim()) {
                socket.emit("error", { message: "Room ID and message content are required" });
                return;
            }

            // Verify the user is in this socket room (joined previously)
            if (!socket.rooms.has(roomId)) {
                socket.emit("error", { message: "You must join the room before sending messages" });
                return;
            }

            const sanitizedContent = content.trim().slice(0, 5000);

            try {
                // 1. Save human message to DB (Daily Bucket)
                const todayDate = new Date().toISOString().split('T')[0];
                const msgId = new mongoose.Types.ObjectId();
                const createdAt = new Date();
                
                const humanMessage = {
                    _id: msgId,
                    senderId: new mongoose.Types.ObjectId(socket.userId),
                    senderName: socket.username,
                    senderType: "human",
                    content: sanitizedContent,
                    createdAt: createdAt,
                    isSummarized: false
                };

                await DailyChat.findOneAndUpdate(
                    { roomId: new mongoose.Types.ObjectId(roomId), date: todayDate },
                    { $push: { messages: humanMessage } },
                    { upsert: true, new: true }
                );

                // 2. Broadcast to everyone in the room
                io.to(roomId).emit("receive_message", {
                    _id: msgId.toString(),
                    roomId,
                    senderId: socket.userId,
                    senderName: socket.username,
                    senderType: "human",
                    content: sanitizedContent,
                    createdAt: createdAt,
                });

                // 3. Stop any human typing indicator
                socket.to(roomId).emit("typing_stop", {
                    userId: socket.userId,
                    username: socket.username,
                    type: "human",
                });

                // 4. Increment message count
                await Room.findByIdAndUpdate(roomId, { $inc: { messageCount: 1 } });

                // 5. Trigger AI pipeline
                await handleAIResponse(io, roomId);

            } catch (err) {
                console.error("Send message error:", err);
                socket.emit("error", { message: "Failed to send message" });
            }
        });

        // ── TYPING INDICATORS ──────────────────────────────
        socket.on("typing_start", (data: TypingPayload) => {
            if (!socket.rooms.has(data.roomId)) return;
            socket.to(data.roomId).emit("typing_start", {
                userId: socket.userId,
                username: socket.username,
                type: "human",
            });
        });

        socket.on("typing_stop", (data: TypingPayload) => {
            if (!socket.rooms.has(data.roomId)) return;
            socket.to(data.roomId).emit("typing_stop", {
                userId: socket.userId,
                username: socket.username,
                type: "human",
            });
        });

        // ── DISCONNECT ─────────────────────────────────────
        socket.on("disconnect", () => {
            console.log(`✗ User disconnected: ${socket.username} (${socket.id})`);
        });
    });

    // ── AI Response Handler ────────────────────────────────
    async function handleAIResponse(io: Server, roomId: string) {
        try {
            const room = await Room.findById(roomId);
            if (!room || !room.aiMembers || room.aiMembers.length === 0) return;

            // Fetch all unsummarized messages for context using aggregation
            const pipelines: any[] = [
                { $match: { roomId: new mongoose.Types.ObjectId(roomId) } },
                { $unwind: "$messages" },
                { $match: { "messages.isSummarized": false, "messages.senderType": { $ne: "system" } } },
                { $sort: { "messages.createdAt": 1 } },
                { $limit: 50 },
            ];
            
            const unsummarizedBuckets = await DailyChat.aggregate(pipelines);
            const unsummarizedMessages = unsummarizedBuckets.map(r => r.messages);

            const context = unsummarizedMessages.map((m) => ({
                id: m._id.toString(),
                senderName: m.senderName,
                senderType: m.senderType as "human" | "ai",
                modelId: m.modelId ?? undefined,
                content: m.content,
                timestamp: m.timestamp,
            }));

            // Emit thinking indicator (gate is processing)
            io.to(roomId).emit("ai_thinking", {
                models: room.aiMembers,
                status: "thinking",
            });

            const result = await compiledGraph.invoke({
                messages: context,
                modelsInRoom: room.aiMembers,
                roomId,
                roomMemory: room.memory || "",
                messageCount: room.messageCount || 0,
            });

            // Clear thinking indicator
            io.to(roomId).emit("ai_thinking", {
                models: [],
                status: "idle",
            });

            // Deliver each AI response sequentially with realistic typing
            if (result.modelResponses && result.modelResponses.length > 0) {
                for (const response of result.modelResponses) {
                    if (response.error) continue;

                    // Show this specific model typing
                    io.to(roomId).emit("typing_start", {
                        modelId: response.modelId,
                        username: response.modelId,
                        type: "ai",
                    });

                    // Realistic typing delay: 400ms base + 3ms per character, capped at 1500ms
                    const typingDelay = Math.min(1500, 400 + response.content.length * 3);
                    await new Promise((resolve) => setTimeout(resolve, typingDelay));

                    // Stop typing
                    io.to(roomId).emit("typing_stop", {
                        modelId: response.modelId,
                        username: response.modelId,
                        type: "ai",
                    });

                    // Save AI message to DB (Daily Bucket)
                    const aiMsgId = new mongoose.Types.ObjectId();
                    const aiCreatedAt = new Date();
                    
                    const aiMsgDoc = {
                        _id: aiMsgId,
                        senderName: response.modelId,
                        senderType: "ai",
                        modelId: response.modelId,
                        content: response.content,
                        createdAt: aiCreatedAt,
                        isSummarized: false
                    };

                    const todayDate = new Date().toISOString().split('T')[0];
                    await DailyChat.findOneAndUpdate(
                        { roomId: new mongoose.Types.ObjectId(roomId), date: todayDate },
                        { $push: { messages: aiMsgDoc } },
                        { upsert: true, new: true }
                    );

                    // Broadcast AI message
                    io.to(roomId).emit("receive_message", {
                        _id: aiMsgId.toString(),
                        roomId,
                        senderName: response.modelId,
                        senderType: "ai",
                        modelId: response.modelId,
                        content: response.content,
                        createdAt: aiCreatedAt,
                    });

                    // Track message count
                    await Room.findByIdAndUpdate(roomId, { $inc: { messageCount: 1 } });

                    // Small pause between multiple AI responses for natural pacing
                    if (result.modelResponses.indexOf(response) < result.modelResponses.length - 1) {
                        await new Promise((resolve) => setTimeout(resolve, 300));
                    }
                }
            }

            // Persist updated memory if summarizer ran and flag summarized messages
            if (result.roomMemory && result.roomMemory !== room.memory) {
                await Room.findByIdAndUpdate(roomId, { memory: result.roomMemory });
                
                if (result.summarizedMessageIds && result.summarizedMessageIds.length > 0) {
                    const objectIds = result.summarizedMessageIds.map((id: string) => new mongoose.Types.ObjectId(id));
                    await DailyChat.updateMany(
                        { "messages._id": { $in: objectIds } },
                        { $set: { "messages.$[elem].isSummarized": true } },
                        { arrayFilters: [{ "elem._id": { $in: objectIds } }] }
                    );
                }
            }
        } catch (err) {
            console.error("AI pipeline error:", err);
            io.to(roomId).emit("ai_thinking", { models: [], status: "idle" });
        }
    }

    return io;
}

export { initializeSocket };