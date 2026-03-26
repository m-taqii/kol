"use client";

import { useState, useEffect, use } from "react";
import { Send, Bot, ArrowLeft, UserPlus, Cpu, Zap, Loader2 } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useSocket, ChatMessage as SocketChatMessage } from "../../../../hooks/useSocket";
import { AI_MODELS } from "../../data/mock";

interface RoomPageProps {
    params: Promise<{ id: string }>;
}

export default function RoomPage({ params }: RoomPageProps) {
    const { id } = use(params);
    const [input, setInput] = useState("");
    const [room, setRoom] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const {
        messages,
        aiThinking,
        typingUsers,
        sendMessage,
        startTyping,
        isConnected,
        isJoined,
        addMessages
    } = useSocket({ roomId: id });

    // Fetch initial room data and messages
    useEffect(() => {
        const fetchRoomData = async () => {
            try {
                const [roomRes, msgRes] = await Promise.all([
                    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/room/${id}`, {
                        withCredentials: true
                    }),
                    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/room/${id}/messages`, {
                        withCredentials: true
                    })
                ]);

                setRoom(roomRes.data);
                addMessages(msgRes.data.messages);
            } catch (error) {
                console.error("Failed to fetch room or messages", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRoomData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 text-[#5a5a5a] animate-spin" />
            </div>
        );
    }

    if (!room) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-[#5a5a5a]">Room not found.</p>
            </div>
        );
    }

    const uniqueAiModels = room.aiMembers || [];

    const handleSendMessage = () => {
        if (!input.trim() || !isJoined) return;
        sendMessage(input);
        setInput("");
    };

    return (
        <div className="flex flex-col h-full">
            {/* Room Header */}
            <div className="shrink-0 px-6 py-4 border-b border-[#2a2a2a] bg-[#111111] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link
                        href="/me"
                        className="text-[#5a5a5a] hover:text-[#ededed] lg:hidden"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-[#ededed] font-semibold text-[16px]">
                            {room.name}
                        </h1>
                        <p className="text-[#5a5a5a] text-[12px]">
                            {room.members?.length || 0} members · {uniqueAiModels.length} AIs
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {/* Status Indicator */}
                    <div className="flex items-center gap-2 mr-4">
                        <div className={`w-2 h-2 rounded-full ${isConnected && isJoined ? "bg-green-500" : "bg-red-500"}`} />
                        <span className="text-xs text-[#5a5a5a] hidden sm:inline">
                            {isConnected && isJoined ? "Connected" : "Disconnected"}
                        </span>
                    </div>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1c1c1c] border border-[#2a2a2a] text-[#5a5a5a] hover:text-[#ededed] text-xs transition-colors">
                        <UserPlus className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Invite</span>
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1c1c1c] border border-[#2a2a2a] text-[#c4a882] text-xs transition-colors">
                        <Cpu className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Add AI</span>
                    </button>
                </div>
            </div>

            {/* AI Models Bar */}
            {uniqueAiModels.length > 0 && (
                <div className="shrink-0 px-6 py-2.5 border-b border-[#2a2a2a] bg-[#0c0c0c] flex items-center gap-4 overflow-x-auto no-scrollbar">
                    {uniqueAiModels.map((modelName: string) => {
                        const modelData = AI_MODELS.find(m => m.id === modelName.toLowerCase() || m.name === modelName);
                        return (
                            <div key={modelName} className="flex items-center gap-2 shrink-0">
                                <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ background: modelData?.color || "#c4a882" }}
                                />
                                <span className="text-[12px] text-[#5a5a5a]">{modelName}</span>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-6" id="messages-container">
                <div className="max-w-3xl mx-auto flex flex-col gap-5 w-full">
                    {messages.length === 0 ? (
                        <p className="text-[#5a5a5a] text-center text-sm py-10">Be the first to say something...</p>
                    ) : (
                        messages.map((msg) => (
                            <div key={msg._id} className="flex gap-3">
                                {/* Avatar */}
                                <div className="shrink-0 mt-0.5">
                                    {msg.senderType === "ai" ? (
                                        <div
                                            className="w-8 h-8 rounded-full flex items-center justify-center opacity-80"
                                            style={{ background: AI_MODELS.find(m => m.id === msg.modelId?.toLowerCase() || m.name === msg.senderName)?.color || "#c4a882" }}
                                        >
                                            <Bot className="w-4 h-4 text-white" />
                                        </div>
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-[#1c1c1c] flex items-center justify-center text-[11px] font-medium text-[#ededed]">
                                            {(msg.senderName || "U").split(" ").map((n) => n[0]).join("")}
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span
                                            className="text-sm font-medium"
                                            style={{
                                                background: msg.senderType === 'ai' ? (AI_MODELS.find(m => m.id === msg.modelId?.toLowerCase() || m.name === msg.senderName)?.color || "#c4a882") : "none",
                                                WebkitBackgroundClip: msg.senderType === 'ai' ? "text" : "none",
                                                WebkitTextFillColor: msg.senderType === 'ai' ? "transparent" : "#ededed"
                                            }}
                                        >
                                            {msg.senderName}
                                        </span>
                                        <span className="text-[#3a3a3a] text-[11px]">
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    {msg.senderType === "ai" ? (
                                        <div className="text-[14px] leading-relaxed text-[#b0b0b0] prose prose-invert prose-sm max-w-none">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                                        </div>
                                    ) : (
                                        <p className="text-[14px] leading-relaxed text-[#b0b0b0] whitespace-pre-wrap">
                                            {msg.content}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                    )}

                    {/* Feedback Modifiers */}
                    <div className="flex flex-col gap-2">
                        {typingUsers.length > 0 && (
                            <div className="flex gap-3 items-center">
                                <div className="shrink-0 w-8 h-8 flex justify-center items-center">
                                    <span className="flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-[#5a5a5a] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                                        <span className="w-1.5 h-1.5 bg-[#5a5a5a] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                                        <span className="w-1.5 h-1.5 bg-[#5a5a5a] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                                    </span>
                                </div>
                                <span className="text-[#5a5a5a] text-xs">
                                    {typingUsers.map(u => u.username || u.modelId).join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
                                </span>
                            </div>
                        )}

                        {aiThinking.status === "thinking" && (
                            <div className="flex gap-3 items-center">
                                <div className="shrink-0 w-8 h-8 flex justify-center items-center">
                                    <Zap
                                        className="w-4 h-4 animate-pulse"
                                        style={{ color: AI_MODELS.find(m => m.name === aiThinking.models[0])?.color.match(/#[a-fA-F0-0]{6}/)?.[0] || "#c4a882" }}
                                    />
                                </div>
                                <span className="text-[#c4a882] text-xs animate-pulse font-medium">
                                    AI is thinking: {aiThinking.models.join(", ")}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Input Form */}
            <div className="shrink-0 px-6 py-4 border-t border-[#2a2a2a] bg-[#111111]">
                <div className="max-w-3xl mx-auto flex items-end gap-3">
                    <div className="flex-1 bg-[#1c1c1c] border border-[#2a2a2a] rounded-lg flex items-end focus-within:border-[#c4a882]/50 transition-colors">
                        <textarea
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                                startTyping(); // Emit typing socket event natively
                            }}
                            placeholder={isConnected && isJoined ? "Message the room... (use @ to mention an AI)" : "Connecting to socket..."}
                            disabled={!isConnected || !isJoined}
                            className="flex-1 bg-transparent px-4 py-3 text-[14px] text-[#ededed] placeholder:text-[#5a5a5a] outline-none resize-none max-h-[120px] min-h-[44px] disabled:opacity-50"
                            rows={1}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!isJoined || !input.trim()}
                            className={`p-3 transition-colors ${input.trim() && isJoined ? "text-[#c4a882] hover:bg-[#c4a882]/10" : "text-[#3a3a3a]"} rounded-r-lg`}
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
