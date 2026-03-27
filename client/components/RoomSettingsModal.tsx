"use client";

import React, { useState } from "react";
import BaseModal from "./BaseModal";
import { User, Shield, LogOut, Trash2, Cpu, Check, Loader2, Copy, Brain, UserMinus } from "lucide-react";
import { AI_MODELS } from "../app/me/data/mock";
import axios from "axios";

interface RoomSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    room: any;
    currentUser: any;
    onRoomUpdated: (room: any) => void;
}

export default function RoomSettingsModal({
    isOpen,
    onClose,
    room,
    currentUser,
    onRoomUpdated
}: RoomSettingsModalProps) {
    const isOwner = currentUser?._id === room?.owner?._id || currentUser?._id === room?.owner;
    const [deleting, setDeleting] = useState(false);
    const [leaving, setLeaving] = useState(false);
    const [confirmAction, setConfirmAction] = useState<"none" | "delete" | "leave">("none");

    if (!room) return null;

    const handleLeave = async () => {
        setLeaving(true);
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/room/${room._id}/leave`, {}, { withCredentials: true });
            window.location.href = "/me";
        } catch (e) {
            console.error(e);
            setConfirmAction("none");
            setLeaving(false);
        }
    };

    const handleRemoveMember = async (userId: string) => {
        try {
            const res = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/room/${room._id}/member/${userId}`, { withCredentials: true });
            // Refresh room data after removal
            const updatedRoom = { ...room, members: room.members.filter((m: any) => m._id !== userId) };
            onRoomUpdated(updatedRoom);
        } catch (e) {
            console.error(e);
            alert("Failed to remove member");
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/room/${room._id}`, { withCredentials: true });
            window.location.href = "/me";
        } catch (e) {
            console.error(e);
            setConfirmAction("none");
            setDeleting(false);
        }
    };

    return (
        <BaseModal 
            isOpen={isOpen} 
            onClose={() => {
                setConfirmAction("none");
                onClose();
            }} 
            title={confirmAction !== "none" ? "Danger Zone" : "Room Settings"}
        >
            <div className="space-y-8 animate-in fade-in duration-300">
                {confirmAction === "delete" ? (
                    <div className="py-8 text-center space-y-4">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                            <Trash2 className="w-8 h-8 text-red-500" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-[#ededed] font-bold text-lg">Permanently Delete Room?</h3>
                            <p className="text-[#5a5a5a] text-sm leading-relaxed px-4"> This action is irreversible. All messages, configurations, and invite links associated with <span className="text-[#ededed] font-semibold">{room.name}</span> will be purged from our systems.</p>
                        </div>
                        <div className="flex flex-col gap-2 pt-4">
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="w-full bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                            >
                                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Yes, Purge Everything"}
                            </button>
                            <button
                                onClick={() => setConfirmAction("none")}
                                className="w-full py-2.5 text-[#5a5a5a] hover:text-[#ededed] font-medium text-sm"
                            >
                                No, Keep my board
                            </button>
                        </div>
                    </div>
                ) : confirmAction === "leave" ? (
                    <div className="py-8 text-center space-y-4">
                        <div className="w-16 h-16 bg-[#c4a882]/10 rounded-full flex items-center justify-center mx-auto">
                            <LogOut className="w-8 h-8 text-[#c4a882]" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-[#ededed] font-bold text-lg">Leave this discussion?</h3>
                            <p className="text-[#5a5a5a] text-sm leading-relaxed px-4">You will lose access to <span className="text-[#ededed] font-semibold">{room.name}</span> instantly. You can only return if you are invited back or have a valid invite link.</p>
                        </div>
                        <div className="flex flex-col gap-2 pt-4">
                            <button
                                onClick={handleLeave}
                                disabled={leaving}
                                className="w-full bg-[#ededed] text-[#0c0c0c] font-bold py-3 rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2"
                            >
                                {leaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Leave"}
                            </button>
                            <button
                                onClick={() => setConfirmAction("none")}
                                className="w-full py-2.5 text-[#5a5a5a] hover:text-[#ededed] font-medium text-sm"
                            >
                                Stay in the room
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Room Info Section */}
                        <section>
                            <label className="block text-[10px] font-semibold text-[#5a5a5a] uppercase tracking-widest mb-4">
                                Room Identity
                            </label>
                            <div className="bg-[#0c0c0c] border border-[#2a2a2a] rounded-xl p-4 flex flex-col gap-1">
                                <p className="text-[#ededed] font-medium text-lg">{room.name}</p>
                                <div className="flex items-center gap-2 text-[#5a5a5a] text-xs">
                                    <Shield className="w-3.5 h-3.5" />
                                    <span>Owner: {room.owner?.name || "Member"} (@{room.owner?.username})</span>
                                </div>
                            </div>
                        </section>

                        {/* AI Members Section */}
                        <section>
                            <label className="block text-[10px] font-semibold text-[#5a5a5a] uppercase tracking-widest mb-4">
                                Active Intelligence (AI)
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {room.aiMembers.map((modelId: string) => {
                                    const modelData = AI_MODELS.find(m => m.id === modelId.toLowerCase());
                                    return (
                                        <div key={modelId} className="flex items-center gap-2.5 bg-[#0c0c0c] border border-[#2a2a2a] rounded-xl px-3 py-2.5">
                                            <div className="w-2 h-2 rounded-full" style={{ background: modelData?.color || "#c4a882" }} />
                                            <span className="text-[13px] text-[#ededed] font-medium">{modelData?.name || modelId}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Room Memory Section */}
                        <section>
                            <label className="block text-[10px] font-semibold text-[#5a5a5a] uppercase tracking-widest mb-4 items-center gap-2">
                                <Brain className="w-3 h-3" />
                                Board Intelligence (Memory)
                            </label>
                            <div className="bg-[#0c0c0c] border border-[#2a2a2a] rounded-xl p-4 min-h-[80px] max-h-[160px] overflow-y-auto no-scrollbar">
                                {room.memory ? (
                                    <p className="text-[13px] text-[#b0b0b0] leading-relaxed italic">"{room.memory}"</p>
                                ) : (
                                    <p className="text-[11px] text-[#3a3a3a] text-center py-4">This room hasn't developed a persistent memory yet. Continue discussing to build context.</p>
                                )}
                            </div>
                        </section>

                        {/* Human Members Section */}
                        <section>
                            <label className="block text-[10px] font-semibold text-[#5a5a5a] uppercase tracking-widest mb-4">
                                Human Collaborators ({room.members?.length || 0})
                            </label>
                            <div className="bg-[#0c0c0c] border border-[#2a2a2a] rounded-xl divide-y divide-[#2a2a2a]">
                                {room.members?.map((member: any) => (
                                    <div key={member._id} className="flex items-center gap-3 px-3 py-2.5 group">
                                        <div className="w-8 h-8 rounded-full bg-[#1c1c1c] border border-[#2a2a2a] flex items-center justify-center text-[11px] font-bold text-[#ededed]">
                                            {member.name.split(" ").map((n: string) => n[0]).join("")}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[#ededed] text-[13px] font-medium truncate">{member.name}</p>
                                            <p className="text-[#5a5a5a] text-[11px]">@{member.username}</p>
                                        </div>
                                        {member._id === (room.owner?._id || room.owner) ? (
                                            <span className="text-[9px] font-bold text-[#c4a882] bg-[#c4a882]/10 px-2 py-0.5 rounded-full uppercase tracking-widest">Owner</span>
                                        ) : (
                                            isOwner && (
                                                <button
                                                    onClick={() => handleRemoveMember(member._id)}
                                                    className="p-1.5 text-[#3a3a3a] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Remove Member"
                                                >
                                                    <UserMinus className="w-4 h-4" />
                                                </button>
                                            )
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* dangerous Area */}
                        <section className="pt-4 border-t border-[#2a2a2a] flex flex-col gap-3">
                            {isOwner ? (
                                <button
                                    onClick={() => setConfirmAction("delete")}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/5 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all font-bold text-sm"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete Room Permanently
                                </button>
                            ) : (
                                <button
                                    onClick={() => setConfirmAction("leave")}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/5 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all font-bold text-sm"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Leave Room
                                </button>
                            )}
                        </section>
                    </>
                )}
            </div>
        </BaseModal>
    );
}
