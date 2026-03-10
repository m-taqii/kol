import { Send, Bell } from "lucide-react";
import { FRIENDS, FRIEND_REQUESTS, ACTIVITY } from "../data/mock";

export default function FriendsPage() {
    return (
        <div className="p-6 lg:p-8 max-w-[600px] mx-auto">
            <h1 className="text-[28px] font-bold text-[#ededed] mb-6">Friends</h1>

            {/* Add Friend */}
            <div className="mb-8">
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Add by username..."
                        className="flex-1 bg-[#1c1c1c] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-[#ededed] placeholder:text-[#5a5a5a] outline-none"
                    />
                    <button className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-lg px-4 hover:border-[#3a3a3a]">
                        <Send className="w-4 h-4 text-[#5a5a5a]" />
                    </button>
                </div>
            </div>

            {/* Online Friends */}
            <div className="mb-8">
                <p className="text-[10px] font-semibold text-[#5a5a5a] uppercase tracking-widest mb-3">
                    Online — {FRIENDS.filter((f) => f.online).length}
                </p>
                <div className="flex flex-col gap-1">
                    {FRIENDS.filter((f) => f.online).map((friend) => (
                        <div
                            key={friend.id}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#1c1c1c]"
                        >
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-[#1c1c1c] flex items-center justify-center text-[12px] font-medium text-[#ededed]">
                                    {friend.name.split(" ").map((n) => n[0]).join("")}
                                </div>
                                <div
                                    className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0c0c0c]"
                                    style={{ backgroundColor: "#22c55e" }}
                                />
                            </div>
                            <div>
                                <p className="text-[#ededed] text-sm">{friend.name}</p>
                                <p className="text-[#5a5a5a] text-xs">@{friend.username}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Offline Friends */}
            <div className="mb-8">
                <p className="text-[10px] font-semibold text-[#5a5a5a] uppercase tracking-widest mb-3">
                    Offline — {FRIENDS.filter((f) => !f.online).length}
                </p>
                <div className="flex flex-col gap-1">
                    {FRIENDS.filter((f) => !f.online).map((friend) => (
                        <div
                            key={friend.id}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#1c1c1c] opacity-60"
                        >
                            <div className="w-10 h-10 rounded-full bg-[#1c1c1c] flex items-center justify-center text-[12px] font-medium text-[#ededed]">
                                {friend.name.split(" ").map((n) => n[0]).join("")}
                            </div>
                            <div>
                                <p className="text-[#ededed] text-sm">{friend.name}</p>
                                <p className="text-[#5a5a5a] text-xs">@{friend.username}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Requests */}
            {FRIEND_REQUESTS.length > 0 && (
                <div className="mb-8">
                    <p className="text-[10px] font-semibold text-[#5a5a5a] uppercase tracking-widest mb-3">
                        Requests — {FRIEND_REQUESTS.length}
                    </p>
                    <div className="flex flex-col gap-1">
                        {FRIEND_REQUESTS.map((req) => (
                            <div
                                key={req.id}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#1c1c1c] border border-[#2a2a2a]"
                            >
                                <div className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center text-[12px] font-medium text-[#ededed]">
                                    {req.name.split(" ").map((n) => n[0]).join("")}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[#ededed] text-sm">{req.name}</p>
                                    <p className="text-[#5a5a5a] text-xs">@{req.username}</p>
                                </div>
                                <button className="text-[#c4a882] border border-[#c4a882] rounded-lg px-3 py-1 text-xs font-medium">
                                    Accept
                                </button>
                                <button className="text-[#5a5a5a] text-xs">Decline</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Activity */}
            <div>
                <p className="text-[10px] font-semibold text-[#5a5a5a] uppercase tracking-widest mb-3">
                    Activity
                </p>
                <div className="flex flex-col gap-1">
                    {ACTIVITY.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-start gap-2.5 px-3 py-2"
                        >
                            <Bell className="w-3.5 h-3.5 text-[#5a5a5a] mt-0.5 shrink-0" />
                            <div>
                                <p className="text-[#ededed] text-xs">{item.description}</p>
                                <p className="text-[#5a5a5a] text-[10px]">{item.timeAgo}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
