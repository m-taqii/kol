"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, Layers, Users, LogOut, Hash } from "lucide-react";
import { useState, useEffect } from "react";
import CreateRoomModal from "./CreateRoomModal";
import axios from "axios";

const NAV_ITEMS = [
    { href: "/me", label: "Rooms", icon: Layers },
    { href: "/me/friends", label: "Friends", icon: Users },
    { href: "/me/settings", label: "Settings", icon: Settings },
];

interface Room {
    _id: string;
    name: string;
    members: any[];
    aiMembers: string[];
    owner: string;
    createdAt: string;
    updatedAt: string;
    lastMessage?: string;
    unread?: boolean;
}

export default function Sidebar() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [user, setUser] = useState<{ name: string; username: string } | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [roomsRes, userRes] = await Promise.all([
                    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/room/list`, { withCredentials: true }),
                    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`, { withCredentials: true })
                ]);
                setRooms(roomsRes.data);
                setUser(userRes.data);
            } catch (err) {
                console.error("Sidebar fetch error:", err);
            }
        };
        fetchData();
    }, [])

    const pathname = usePathname();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    return (
        <aside className="w-[260px] shrink-0 h-screen overflow-y-auto no-scrollbar bg-[#111111] border-r border-[#1a1a1a] flex flex-col">
            {/* User Info */}
            <div className="px-5 pt-5 pb-4">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-full bg-[#c4a882]/10 flex items-center justify-center text-[#c4a882] text-xs font-bold uppercase">
                        {user ? user.name.split(" ").map(n => n[0]).join("") : "..."}
                    </div>
                    <div>
                        <p className="text-[#ededed] text-[13px] font-semibold leading-tight">
                            {user ? user.name : "Loading..."}
                        </p>
                        <p className="text-[#4a4a4a] text-[11px]">{user ? `@${user.username}` : "..."}</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="block w-full bg-[#ededed] text-[#0c0c0c] font-semibold text-[13px] py-2 rounded-lg text-center hover:bg-white transition-colors"
                >
                    + New Room
                </button>
            </div>

            {/* Divider */}
            <div className="mx-5 h-px bg-[#1e1e1e]" />

            {/* Navigation */}
            <div className="px-3 py-3">
                <div className="flex flex-col gap-0.5">
                    {NAV_ITEMS.map((item) => {
                        const isActive =
                            item.href === "/me"
                                ? pathname === "/me"
                                : pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-2.5 px-3 py-[7px] rounded-md text-[13px] ${isActive
                                    ? "bg-[#1c1c1c] text-[#ededed] font-medium"
                                    : "text-[#5a5a5a] hover:text-[#999] hover:bg-[#161616]"
                                    }`}
                            >
                                <item.icon className="w-[15px] h-[15px]" />
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Divider */}
            <div className="mx-5 h-px bg-[#1e1e1e]" />

            {/* Rooms List */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-3 pt-3 pb-2">
                <p className="text-[10px] font-semibold text-[#444] uppercase tracking-widest mb-2 px-3">
                    Rooms
                </p>
                <div className="flex flex-col gap-px">
                    {rooms.map((room) => {
                        const isRoomActive = pathname === `/me/room/${room._id}`;
                        return (
                            <Link
                                key={room._id}
                                href={`/me/room/${room._id}`}
                                className={`flex items-start gap-2.5 px-3 py-2 rounded-md group ${isRoomActive
                                    ? "bg-[#1c1c1c]"
                                    : "hover:bg-[#161616]"
                                    }`}
                            >
                                <Hash className={`w-[14px] h-[14px] mt-[3px] shrink-0 ${isRoomActive ? "text-[#c4a882]" : "text-[#3a3a3a]"}`} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p className={`text-[13px] truncate ${isRoomActive ? "text-[#ededed] font-medium" : "text-[#888] group-hover:text-[#bbb]"}`}>
                                            {room.name}
                                        </p>
                                        <span className="text-[#3a3a3a] text-[10px] shrink-0 ml-2">
                                            {new Date(room.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                    <p className="text-[#3a3a3a] text-[11px] truncate">
                                        {room.lastMessage || "No messages yet"}
                                    </p>
                                </div>
                                {room.unread && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#c4a882] mt-[7px] shrink-0" />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Divider */}
            <div className="mx-5 h-px bg-[#1e1e1e]" />

            {/* Logout */}
            <div className="px-3 py-3">
                <button className="flex items-center gap-2.5 px-3 py-[7px] text-[#3a3a3a] hover:text-[#888] text-[13px] w-full rounded-md hover:bg-[#161616]">
                    <LogOut className="w-[15px] h-[15px]" />
                    Log out
                </button>
            </div>

            <CreateRoomModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </aside>
    );
}
