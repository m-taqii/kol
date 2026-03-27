"use client";

import { useState, useEffect, use, useRef, useCallback } from "react";
import { Send, Bot, ArrowLeft, UserPlus, Cpu, Zap, Loader2, Check, Settings, Info, Copy } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useSocket, ChatMessage as SocketChatMessage } from "../../../../hooks/useSocket";
import { AI_MODELS } from "../../data/mock";
import RoomSettingsModal from "../../../../components/RoomSettingsModal";
import NotificationModal from "../../../../components/NotificationModal";

interface RoomPageProps {
    params: Promise<{ id: string }>;
}

export default function RoomPage({ params }: RoomPageProps) {
    const { id } = use(params);
    const [input, setInput] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [room, setRoom] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showAiDropdown, setShowAiDropdown] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [hasMore, setHasMore] = useState(false);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [loadingMore, setLoadingMore] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [notification, setNotification] = useState<{
        isOpen: boolean;
        type: "success" | "error" | "warning" | "info";
        title: string;
        message: string;
    }>({
        isOpen: false,
        type: "info",
        title: "",
        message: ""
    });

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
                const [roomRes, msgRes, userRes] = await Promise.all([
                    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/room/${id}`, { withCredentials: true }),
                    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/room/${id}/messages`, { withCredentials: true }),
                    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`, { withCredentials: true })
                ]);

                setRoom(roomRes.data);
                addMessages(msgRes.data.messages);
                setHasMore(msgRes.data.hasMore);
                setNextCursor(msgRes.data.nextCursor);
                setCurrentUser(userRes.data);
                
                // Initial scroll to bottom
                setTimeout(() => scrollToBottom(true), 100);
            } catch (error) {
                console.error("Failed to fetch room or messages", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRoomData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const scrollToBottom = (instant = false) => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: instant ? "auto" : "smooth" });
        }
    };

    // Auto-scroll on new messages
    useEffect(() => {
        if (messages.length > 0) {
            const container = scrollContainerRef.current;
            if (container) {
                const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 200;
                if (isNearBottom || messages.length <= 30) {
                    scrollToBottom();
                }
            }
        }
    }, [messages]);

    const handleLoadMore = async () => {
        if (loadingMore || !nextCursor) return;
        setLoadingMore(true);
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/room/${id}/messages`, {
                params: { cursor: nextCursor },
                withCredentials: true
            });
            addMessages(res.data.messages);
            setHasMore(res.data.hasMore);
            setNextCursor(res.data.nextCursor);
        } catch (error) {
            console.error("Load more failed", error);
        } finally {
            setLoadingMore(false);
        }
    };


    const handleInvite = async () => {
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/room/${id}/invite`, {}, { withCredentials: true });
            const inviteUrl = res.data.inviteUrl;
            await navigator.clipboard.writeText(inviteUrl);
            setNotification({
                isOpen: true,
                type: "success",
                title: "Invite Link Copied!",
                message: "A secure, short-lived invite link has been copied to your clipboard. Share it with your collaborators to bring them into the board."
            });
        } catch (e) {
            setNotification({
                isOpen: true,
                type: "error",
                title: "Failed to Generate Invite",
                message: "We encountered a problem while creating your invite link. Please try again or contact support if the issue persists."
            });
        }
    };

    const handleAddAi = async (modelId: string) => {
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/room/${id}/ai/add`, { aiModelId: modelId }, { withCredentials: true });
            setRoom(res.data);
            setShowAiDropdown(false);
            setNotification({
                isOpen: true,
                type: "success",
                title: "AI Injected Successfully",
                message: `${modelId} has joined the room and is ready to contribute to your brainstorm. Mention it with @ to start a direct dialogue.`
            });
        } catch (e) {
            setNotification({
                isOpen: true,
                type: "error",
                title: "AI Addition Failed",
                message: `We couldn't add the AI model to this room right now. This can happen if the model is currently hitting rate limits or if there's a connectivity issue.`
            });
        }
    };

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
    const isOwner = currentUser?._id === room.owner?._id || currentUser?._id === room.owner;

    const handleSendMessage = () => {
        if (!input.trim() || !isJoined) return;
        sendMessage(input);
        setInput("");
        // Reset textarea height
        if (textareaRef.current) {
            textareaRef.current.style.height = "44px";
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#0c0c0c]">
            {/* Room Header */}
            <div className="shrink-0 px-6 py-4 border-b border-[#2a2a2a] bg-[#111111] flex items-center justify-between shadow-sm lg:shadow-none">
                <div className="flex items-center gap-3">
                    <Link
                        href="/me"
                        className="p-2 -ml-2 text-[#5a5a5a] hover:text-[#ededed] lg:hidden transition-all rounded-lg hover:bg-[#1c1c1c]"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-[#ededed] font-semibold text-[16px]">
                            {room.name}
                        </h1>
                        <p className="text-[#5a5a5a] text-[12px] flex items-center gap-2">
                             <div className={`w-1.5 h-1.5 rounded-full ${isConnected && isJoined ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-red-500 animate-pulse"}`} />
                            {room.members?.length || 0} members · {uniqueAiModels.length} AIs
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {isOwner && (
                        <>
                            <button 
                                onClick={handleInvite}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1c1c1c] border border-[#2a2a2a] text-[#5a5a5a] hover:text-[#ededed] hover:border-[#3a3a3a] text-xs transition-all font-medium"
                            >
                                <UserPlus className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Invite</span>
                            </button>
                            
                            <div className="relative">
                                <button 
                                    onClick={() => setShowAiDropdown(!showAiDropdown)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1c1c1c] border border-[#2a2a2a] text-[#c4a882] text-xs transition-all font-medium hover:border-[#c4a882]/50 hover:bg-[#c4a882]/5"
                                >
                                    <Cpu className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Add AI</span>
                                </button>
                                
                                {showAiDropdown && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setShowAiDropdown(false)} />
                                        <div className="absolute right-0 mt-2 w-48 bg-[#161616] border border-[#2a2a2a] rounded-xl shadow-2xl z-50 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                            <p className="px-3 py-2 text-[10px] font-bold text-[#5a5a5a] uppercase tracking-widest">Available Models</p>
                                            {AI_MODELS.map(model => (
                                                <button
                                                    key={model.id}
                                                    onClick={() => handleAddAi(model.id)}
                                                    disabled={room.aiMembers.includes(model.id)}
                                                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-[13px] hover:bg-[#1c1c1c] transition-colors ${room.aiMembers.includes(model.id) ? "opacity-30 grayscale cursor-not-allowed" : "text-[#ededed]"}`}
                                                >
                                                    <div className="w-2 h-2 rounded-full" style={{ background: model.color }} />
                                                    {model.name}
                                                    {room.aiMembers.includes(model.id) && <Check className="w-3.5 h-3.5 ml-auto text-[#5a5a5a]" />}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </>
                    )}

                    <button 
                        onClick={() => setShowSettingsModal(true)}
                        className="p-2 text-[#5a5a5a] hover:text-[#ededed] transition-all rounded-lg hover:bg-[#1c1c1c] ml-1"
                        title="Room Board Settings"
                    >
                        <Settings className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Modals */}
            <RoomSettingsModal
                isOpen={showSettingsModal}
                onClose={() => setShowSettingsModal(false)}
                room={room}
                currentUser={currentUser}
                onRoomUpdated={(upd) => setRoom(upd)}
            />

            <NotificationModal
                isOpen={notification.isOpen}
                onClose={() => setNotification({ ...notification, isOpen: false })}
                type={notification.type}
                title={notification.title}
                message={notification.message}
                actionLabel="Awesome"
            />

            {/* AI Models Bar */}
            {uniqueAiModels.length > 0 && (
                <div className="shrink-0 px-6 py-2 border-b border-[#2a2a2a] bg-[#0c0c0c] flex items-center gap-4 overflow-x-auto no-scrollbar scroll-smooth shadow-inner">
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
            <div 
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto no-scrollbar px-6 py-6" id="messages-container"
            >
                <div className="max-w-3xl mx-auto flex flex-col gap-5 w-full">
                    {hasMore && (
                        <div className="flex justify-center pb-4">
                            <button 
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                className="text-[12px] text-[#5a5a5a] hover:text-[#ededed] transition-all bg-[#1c1c1c] px-4 py-1.5 rounded-full border border-[#2a2a2a] disabled:opacity-50"
                            >
                                {loadingMore ? "Loading history..." : "Load earlier messages"}
                            </button>
                        </div>
                    )}
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
                {/* Anchor for scrolling */}
                <div ref={messagesEndRef} className="h-0" />
            </div>

            {/* Input Form */}
            <div className="shrink-0 px-6 py-4 border-t border-[#2a2a2a] bg-[#111111]">
                <div className="max-w-3xl mx-auto flex items-end gap-3">
                    <div className="flex-1 bg-[#1c1c1c] border border-[#2a2a2a] rounded-lg flex items-end focus-within:border-[#c4a882]/50 transition-colors">
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                                startTyping();
                                // Auto-grow
                                const el = e.target;
                                el.style.height = "44px";
                                el.style.height = Math.min(el.scrollHeight, 160) + "px";
                            }}
                            placeholder={isConnected && isJoined ? "Message the room... (Shift+Enter for new line)" : "Connecting..."}
                            disabled={!isConnected || !isJoined}
                            className="flex-1 bg-transparent px-4 py-3 text-[14px] text-[#ededed] placeholder:text-[#5a5a5a] outline-none resize-none disabled:opacity-50 no-scrollbar"
                            rows={1}
                            style={{ minHeight: "44px", maxHeight: "160px", overflowY: "auto" }}
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
