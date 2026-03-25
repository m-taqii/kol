import { Layers, MessageSquare, Zap, Users } from "lucide-react";

interface StatsRowProps {
    totalRooms: number;
    messagesSent: number;
    friends: number;
}

export default function StatsRow({
    totalRooms,
    messagesSent,
    friends,
}: StatsRowProps) {
    const cards = [
        { label: "Total Rooms", value: totalRooms, icon: Layers, accent: false },
        { label: "Messages Sent", value: messagesSent, icon: MessageSquare, accent: false },
        { label: "Friends", value: friends, icon: Users, accent: false },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {cards.map((card) => (
                <div
                    key={card.label}
                    className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-5"
                >
                    <div className="flex items-center justify-between mb-3">
                        <card.icon
                            className={`w-5 h-5 ${card.accent ? "text-[#c4a882]" : "text-[#5a5a5a]"}`}
                        />
                    </div>
                    <p className="text-2xl font-bold text-[#ededed]">{card.value}</p>
                    <p className="text-xs text-[#5a5a5a] mt-1">{card.label}</p>
                </div>
            ))}
        </div>
    );
}
