import Room from "../models/room.model";
import DailyChat from "../models/message.model";
import mongoose from "mongoose";
import type { Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware";
import User from "../models/user.model";
import Invite from "../models/invite.model";
import crypto from "crypto";

async function createRoom(req: AuthRequest, res: Response) {
    try {
        const { name, members, aiMembers }: { name: string; members: string[]; aiMembers: string[] } = req.body;
        const ownerId = req.userId;

        if (!ownerId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const owner = new mongoose.Types.ObjectId(ownerId);

        const users = await User.find({ username: { $in: members } });
        const memberIds = users.map(u => u._id as mongoose.Types.ObjectId);

        const room = await Room.create({ 
            name: name.trim(), 
            members: [...memberIds, owner], 
            aiMembers, 
            owner 
        });
        
        res.status(201).json(room);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create room" });
    }
}

async function getRooms(req: AuthRequest, res: Response) {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const rooms = await Room.find({
            $or: [
                { owner: userId },
                { members: userId }
            ]
        })
        .populate("members", "name username")
        .populate("owner", "name username")
        .sort({ updatedAt: -1 });

        res.status(200).json(rooms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch rooms" });
    }
}

async function getRoom(req: AuthRequest, res: Response) {
    try {
        const userId = req.userId;
        const roomId = req.params.roomId as string;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (!roomId || !mongoose.Types.ObjectId.isValid(roomId)) {
            return res.status(404).json({ error: "Room not found" });
        }

        const room = await Room.findById(roomId)
            .populate("members", "name username")
            .populate("owner", "name username");

        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }

        const isMember = room.members.some(
            (member: any) => member._id.toString() === userId
        );

        if (!isMember) {
            return res.status(403).json({ error: "You are not a member of this room" });
        }

        res.status(200).json(room);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch room" });
    }
}

async function getMessages(req: AuthRequest, res: Response) {
    try {
        const userId = req.userId;
        const roomId = req.params.roomId as string;
        const { cursor, limit = "30" } = req.query;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (!roomId || !mongoose.Types.ObjectId.isValid(roomId)) {
            return res.status(404).json({ error: "Room not found" });
        }

        // Verify room membership
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }

        const isMember = room.members.some(
            (memberId) => memberId.toString() === userId
        );

        if (!isMember) {
            return res.status(403).json({ error: "You are not a member of this room" });
        }

        const messageLimit = Math.min(parseInt(limit as string) || 30, 50);

        // Build query — cursor-based pagination for older messages
        const pipeline: any[] = [
            { $match: { roomId: new mongoose.Types.ObjectId(roomId) } },
            { $unwind: "$messages" }
        ];

        if (cursor) {
            pipeline.push({ 
                $match: { "messages.createdAt": { $lt: new Date(cursor as string) } } 
            });
        }

        pipeline.push(
            { $sort: { "messages.createdAt": -1 } },
            { $limit: messageLimit }
        );

        const result = await DailyChat.aggregate(pipeline);
        const messages = result.map(r => ({
            ...r.messages,
            roomId: r.roomId
        }));

        const hasMore = messages.length === messageLimit;

        res.status(200).json({
            messages: messages.reverse(), // Return in chronological order
            hasMore,
            nextCursor: hasMore ? messages[0]?.createdAt?.toISOString() : null,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch messages" });
    }
}

async function generateInvite(req: AuthRequest, res: Response) {
    try {
        const { roomId } = req.params;
        const room = await Room.findById(roomId);
        if (!room) return res.status(404).json({ error: "Room not found" });

        if (room.owner.toString() !== req.userId)
            return res.status(403).json({ error: "Only the owner can invite" });

        const code = crypto.randomBytes(4).toString("hex");

        await Invite.create({ room: room._id, code });

        const inviteUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/invite/${code}`;
        res.status(201).json({ inviteUrl, code });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create invite" });
    }
}

async function joinViaInvite(req: AuthRequest, res: Response) {
    try {
        const { code } = req.params;
        const invite = await Invite.findOne({ code }).populate("room");
        if (!invite) return res.status(404).json({ error: "Invalid invite" });

        const room = invite.room as any;
        if (!room.members.includes(req.userId)) {
            room.members.push(req.userId);
            await room.save();
        }

        res.status(200).json({ success: true, roomId: room._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to join via invite" });
    }
}

async function leaveRoom(req: AuthRequest, res: Response) {
    try {
        const { roomId } = req.params;
        const room = await Room.findById(roomId);
        if (!room) return res.status(404).json({ error: "Room not found" });

        if (room.owner.toString() === req.userId)
            return res.status(400).json({ error: "Owner cannot leave; delete or transfer ownership instead" });

        room.members = room.members.filter((m: any) => m.toString() !== req.userId);
        await room.save();

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to leave room" });
    }
}

async function deleteRoom(req: AuthRequest, res: Response) {
    try {
        const { roomId } = req.params;
        const room = await Room.findById(roomId);
        if (!room) return res.status(404).json({ error: "Room not found" });

        if (room.owner.toString() !== req.userId)
            return res.status(403).json({ error: "Only owner can delete room" });

        await Room.deleteOne({ _id: roomId });
        await Invite.deleteMany({ room: roomId });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete room" });
    }
}

async function addAiToRoom(req: AuthRequest, res: Response) {
    try {
        const { roomId } = req.params;
        const { aiModelId } = req.body;
        
        const room = await Room.findById(roomId);
        if (!room) return res.status(404).json({ error: "Room not found" });
        if (room.owner.toString() !== req.userId) return res.status(403).json({ error: "Only owner can modify models" });

        if (!room.aiMembers.includes(aiModelId)) {
            room.aiMembers.push(aiModelId);
            await room.save();
        }
        res.status(200).json(room);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add AI" });
    }
}

async function removeMember(req: AuthRequest, res: Response) {
    try {
        const { roomId, userId } = req.params;
        const room = await Room.findById(roomId);
        if (!room) return res.status(404).json({ error: "Room not found" });

        if (room.owner.toString() !== req.userId)
            return res.status(403).json({ error: "Only the owner can remove members" });

        if (room.owner.toString() === userId)
            return res.status(400).json({ error: "Owner cannot be removed; delete the room instead" });

        room.members = room.members.filter((m: any) => m.toString() !== userId);
        await room.save();

        res.status(200).json({ success: true, members: room.members });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to remove member" });
    }
}

export { 
    createRoom, 
    getRooms, 
    getRoom, 
    getMessages, 
    generateInvite, 
    joinViaInvite, 
    leaveRoom, 
    deleteRoom,
    addAiToRoom,
    removeMember
};