"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Plus } from "lucide-react";
import StatsRow from "../../components/StatsRow";
import RoomCard from "../../components/RoomCard";
import CreateRoomModal from "../../components/CreateRoomModal";
import { FRIENDS as MOCK_FRIENDS } from "./data/mock";

export default function DashboardPage() {
    const [rooms, setRooms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchRooms = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/room/list`, {
                withCredentials: true
            });
            setRooms(res.data);
        } catch (error) {
            console.error("Failed to fetch rooms:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    return (
        <div className="p-6 lg:p-8 max-w-[1100px] mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-[28px] font-bold text-[#ededed]">
                    Your Rooms
                </h1>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-[#ededed] text-[#0c0c0c] font-bold text-[13px] px-4 py-2 rounded-xl hover:bg-white transition-all shadow-lg shadow-white/5"
                >
                    <Plus className="w-4 h-4" />
                    New Room
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="w-4 h-4 text-[#5a5a5a] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                    type="text"
                    placeholder="Search rooms..."
                    className="w-full bg-[#1c1c1c] border border-[#2a2a2a] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#ededed] placeholder:text-[#5a5a5a] outline-none focus:border-[#c4a882]/50 transition-all"
                />
            </div>

            {/* Stats */}
            <div className="mb-8">
                <StatsRow
                    totalRooms={rooms.length}
                    messagesSent={630} // Hardcoded for now
                    friends={MOCK_FRIENDS.length}
                />
            </div>

            {/* Rooms Grid */}
            <p className="text-[10px] font-semibold text-[#5a5a5a] uppercase tracking-widest mb-4">
                Active Rooms
            </p>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-[120px] bg-[#111111] animate-pulse rounded-2xl border border-[#2a2a2a]" />
                    ))}
                </div>
            ) : rooms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {rooms.map((room) => (
                        <RoomCard
                            key={room._id}
                            id={room._id}
                            name={room.name}
                            members={(room.members || []).map((m: any) => ({ id: m._id || m, name: m.name || "User" }))}
                            aiModels={(room.aiMembers || []).map((m: any) => ({ id: m, name: m, color: "#c4a882" }))}
                            lastActive={new Date(room.updatedAt).toLocaleDateString()}
                            unread={false}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-[#111111]/50 rounded-3xl border border-dashed border-[#2a2a2a]">
                    <div className="w-12 h-12 bg-[#1c1c1c] rounded-2xl flex items-center justify-center mb-4">
                        <Plus className="w-6 h-6 text-[#5a5a5a]" />
                    </div>
                    <p className="text-[#888888] text-sm mb-6 max-w-[200px]">
                        No rooms yet. Create your first room to get started.
                    </p>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-[#ededed] text-[#0c0c0c] font-bold text-sm px-8 py-3 rounded-2xl hover:bg-white transition-all"
                    >
                        Create your first room
                    </button>
                </div>
            )}

            <CreateRoomModal 
                isOpen={isModalOpen} 
                onClose={() => {
                    setIsModalOpen(false);
                    fetchRooms(); // Refresh rooms on close
                }} 
            />
        </div>
    );
}
