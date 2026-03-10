import { Search } from "lucide-react";
import StatsRow from "../../components/StatsRow";
import RoomCard from "../../components/RoomCard";
import { ROOMS, FRIENDS } from "./data/mock";

export default function DashboardPage() {
    return (
        <div className="p-6 lg:p-8 max-w-[1100px] mx-auto">
            {/* Header */}
            <h1 className="text-[28px] font-bold text-[#ededed] mb-6">
                Your Rooms
            </h1>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="w-4 h-4 text-[#5a5a5a] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                    type="text"
                    placeholder="Search rooms..."
                    className="w-full bg-[#1c1c1c] border border-[#2a2a2a] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#ededed] placeholder:text-[#5a5a5a] outline-none"
                />
            </div>

            {/* Stats */}
            <div className="mb-8">
                <StatsRow
                    totalRooms={ROOMS.length}
                    messagesSent={630}
                    creditsLeft={12}
                    friends={FRIENDS.length}
                />
            </div>

            {/* Rooms Grid */}
            <p className="text-[10px] font-semibold text-[#5a5a5a] uppercase tracking-widest mb-4">
                Your Rooms
            </p>

            {ROOMS.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {ROOMS.map((room) => (
                        <RoomCard
                            key={room.id}
                            id={room.id}
                            name={room.name}
                            members={room.members}
                            aiModels={room.aiModels}
                            lastActive={room.lastActive}
                            unread={room.unread}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p className="text-[#5a5a5a] text-sm mb-4">
                        No rooms yet. Create your first room to get started.
                    </p>
                    <button className="bg-[#ededed] text-[#0c0c0c] font-semibold text-sm px-6 py-2.5 rounded-lg">
                        Create your first room
                    </button>
                </div>
            )}
        </div>
    );
}
