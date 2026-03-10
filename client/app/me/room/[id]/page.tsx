"use client";

import { useState } from "react";
import { Send, Bot, ArrowLeft, UserPlus, Cpu, Zap } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { ROOMS, ROOM_MESSAGES } from "../../data/mock";
import type { ChatMessage } from "../../data/mock";

interface RoomPageProps {
    params: Promise<{ id: string }>;
}

export default function RoomPage({ params }: RoomPageProps) {
    const { id } = use(params);
    const [input, setInput] = useState("");

    const room = ROOMS.find((r) => r.id === id);
    const messages: ChatMessage[] = ROOM_MESSAGES[id] || [];

    if (!room) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-[#5a5a5a]">Room not found.</p>
            </div>
        );
    }

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
                            {room.members.length} members · {room.aiModels.length} AIs
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1c1c1c] border border-[#2a2a2a] text-[#5a5a5a] hover:text-[#ededed] text-xs">
                        <UserPlus className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Invite</span>
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1c1c1c] border border-[#2a2a2a] text-[#c4a882] text-xs">
                        <Cpu className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Add AI</span>
                    </button>
                </div>
            </div>

            {/* AI Models Bar */}
            <div className="shrink-0 px-6 py-2.5 border-b border-[#2a2a2a] bg-[#0c0c0c] flex items-center gap-4 overflow-x-auto">
                {room.aiModels.map((model) => (
                    <div key={model.id} className="flex items-center gap-2 shrink-0">
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: model.color }}
                        />
                        <span className="text-[12px] text-[#5a5a5a]">{model.name}</span>
                        <span className="text-[10px] text-[#3a3a3a]">· {model.role}</span>
                    </div>
                ))}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-6">
                <div className="max-w-3xl mx-auto flex flex-col gap-5">
                    {messages.map((msg) => (
                        <div key={msg.id} className="flex gap-3">
                            {/* Avatar */}
                            <div className="shrink-0 mt-0.5">
                                {msg.type === "ai" ? (
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center"
                                        style={{ backgroundColor: msg.color + "20" }}
                                    >
                                        <Bot className="w-4 h-4" style={{ color: msg.color }} />
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-[#1c1c1c] flex items-center justify-center text-[11px] font-medium text-[#ededed]">
                                        {msg.user.split(" ").map((n) => n[0]).join("")}
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[#ededed] text-sm font-medium">
                                        {msg.user}
                                    </span>
                                    {msg.type === "ai" && msg.role && (
                                        <span
                                            className="text-[10px] px-1.5 py-0.5 rounded-full"
                                            style={{
                                                color: msg.color,
                                                backgroundColor: msg.color + "15",
                                            }}
                                        >
                                            {msg.role}
                                        </span>
                                    )}
                                    <span className="text-[#3a3a3a] text-[11px]">{msg.time}</span>
                                </div>
                                <p className="text-[14px] leading-relaxed text-[#b0b0b0] whitespace-pre-wrap">
                                    {msg.content}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Input */}
            <div className="shrink-0 px-6 py-4 border-t border-[#2a2a2a] bg-[#111111]">
                <div className="max-w-3xl mx-auto flex items-end gap-3">
                    <div className="flex-1 bg-[#1c1c1c] border border-[#2a2a2a] rounded-lg flex items-end">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Message the board... (use @ to mention an AI)"
                            className="flex-1 bg-transparent px-4 py-3 text-[14px] text-[#ededed] placeholder:text-[#5a5a5a] outline-none resize-none max-h-[120px] min-h-[44px]"
                            rows={1}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    if (input.trim()) setInput("");
                                }
                            }}
                        />
                        <button
                            className={`p-3 ${input.trim() ? "text-[#c4a882]" : "text-[#3a3a3a]"}`}
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
