"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Socket } from "socket.io-client";
import { connectSocket, disconnectSocket, getSocket } from "../lib/socket";

// ── Types ──────────────────────────────────────────────────

export interface ChatMessage {
    _id: string;
    roomId: string;
    senderId?: string;
    senderName: string;
    senderType: "human" | "ai" | "system";
    modelId?: string;
    content: string;
    createdAt: string;
}

export interface TypingUser {
    userId?: string;
    username?: string;
    modelId?: string;
    type: "human" | "ai";
}

export interface AIThinkingState {
    models: string[];
    status: "thinking" | "idle";
}

interface UseSocketOptions {
    roomId: string;
    token?: string;
    onMessage?: (message: ChatMessage) => void;
}

interface UseSocketReturn {
    isConnected: boolean;
    isJoined: boolean;
    joinError: string | null;
    messages: ChatMessage[];
    typingUsers: TypingUser[];
    aiThinking: AIThinkingState;
    sendMessage: (content: string) => void;
    startTyping: () => void;
    stopTyping: () => void;
    addMessages: (msgs: ChatMessage[]) => void;
}

export function useSocket({ roomId, token, onMessage }: UseSocketOptions): UseSocketReturn {
    const [isConnected, setIsConnected] = useState(false);
    const [isJoined, setIsJoined] = useState(false);
    const [joinError, setJoinError] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
    const [aiThinking, setAIThinking] = useState<AIThinkingState>({ models: [], status: "idle" });

    const socketRef = useRef<Socket | null>(null);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const onMessageRef = useRef(onMessage);
    onMessageRef.current = onMessage;

    // Connect and join room
    useEffect(() => {
        if (!roomId) return;

        const socket = connectSocket(token);
        socketRef.current = socket;

        // ── Connection Events ──────────────────────────────
        const handleConnect = () => {
            setIsConnected(true);
            console.log("Socket connected");

            // Join room after connection
            socket.emit("join_room", { roomId }, (res: any) => {
                if (res.success) {
                    setIsJoined(true);
                    setJoinError(null);
                    console.log("Joined room:", res.room?.name);
                } else {
                    setIsJoined(false);
                    setJoinError(res.error || "Failed to join room");
                    console.error("Join room error:", res.error);
                }
            });
        };

        const handleDisconnect = () => {
            setIsConnected(false);
            setIsJoined(false);
            console.log("Socket disconnected");
        };

        const handleConnectError = (err: Error) => {
            console.error("Socket connection error:", err.message);
            setIsConnected(false);
        };

        // ── Message Events ─────────────────────────────────
        const handleReceiveMessage = (message: ChatMessage) => {
            setMessages((prev) => {
                // Avoid duplicates
                if (prev.some((m) => m._id === message._id)) return prev;
                return [...prev, message];
            });
            onMessageRef.current?.(message);
        };

        // ── Typing Events ──────────────────────────────────
        const handleTypingStart = (data: TypingUser) => {
            setTypingUsers((prev) => {
                const key = data.type === "human" ? data.userId : data.modelId;
                if (prev.some((t) => (t.type === "human" ? t.userId : t.modelId) === key)) {
                    return prev;
                }
                return [...prev, data];
            });
        };

        const handleTypingStop = (data: TypingUser) => {
            setTypingUsers((prev) =>
                prev.filter((t) => {
                    const key = data.type === "human" ? data.userId : data.modelId;
                    const tKey = t.type === "human" ? t.userId : t.modelId;
                    return tKey !== key;
                })
            );
        };

        // ── AI Thinking Events ─────────────────────────────
        const handleAIThinking = (data: AIThinkingState) => {
            setAIThinking(data);
        };

        // ── User Events ────────────────────────────────────
        const handleUserJoined = (data: { userId: string; username: string }) => {
            console.log(`${data.username} joined the room`);
        };

        const handleUserLeft = (data: { userId: string; username: string }) => {
            console.log(`${data.username} left the room`);
        };

        // ── Error Events ───────────────────────────────────
        const handleError = (data: { message: string }) => {
            console.error("Socket error:", data.message);
        };

        // Register all listeners
        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on("connect_error", handleConnectError);
        socket.on("receive_message", handleReceiveMessage);
        socket.on("typing_start", handleTypingStart);
        socket.on("typing_stop", handleTypingStop);
        socket.on("ai_thinking", handleAIThinking);
        socket.on("user_joined", handleUserJoined);
        socket.on("user_left", handleUserLeft);
        socket.on("error", handleError);

        // Connect if not already connected
        if (!socket.connected) {
            socket.connect();
        } else {
            // Already connected, just emit join
            handleConnect();
        }

        // Cleanup
        return () => {
            socket.emit("leave_room", { roomId });
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("connect_error", handleConnectError);
            socket.off("receive_message", handleReceiveMessage);
            socket.off("typing_start", handleTypingStart);
            socket.off("typing_stop", handleTypingStop);
            socket.off("ai_thinking", handleAIThinking);
            socket.off("user_joined", handleUserJoined);
            socket.off("user_left", handleUserLeft);
            socket.off("error", handleError);
            setMessages([]);
            setTypingUsers([]);
            setAIThinking({ models: [], status: "idle" });
            setIsJoined(false);
        };
    }, [roomId, token]);

    // ── Actions ────────────────────────────────────────────

    const sendMessage = useCallback(
        (content: string) => {
            const socket = socketRef.current;
            if (!socket?.connected || !isJoined) return;

            socket.emit("send_message", { roomId, content });
        },
        [roomId, isJoined]
    );

    const startTyping = useCallback(() => {
        const socket = socketRef.current;
        if (!socket?.connected || !isJoined) return;

        socket.emit("typing_start", { roomId });

        // Auto-stop typing after 3 seconds of inactivity
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit("typing_stop", { roomId });
        }, 3000);
    }, [roomId, isJoined]);

    const stopTyping = useCallback(() => {
        const socket = socketRef.current;
        if (!socket?.connected || !isJoined) return;

        socket.emit("typing_stop", { roomId });

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
        }
    }, [roomId, isJoined]);

    // Allows prepending older messages (for pagination)
    const addMessages = useCallback((msgs: ChatMessage[]) => {
        setMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m._id));
            const newMsgs = msgs.filter((m) => !existingIds.has(m._id));
            return [...newMsgs, ...prev];
        });
    }, []);

    return {
        isConnected,
        isJoined,
        joinError,
        messages,
        typingUsers,
        aiThinking,
        sendMessage,
        startTyping,
        stopTyping,
        addMessages,
    };
}
