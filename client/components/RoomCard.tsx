interface RoomCardProps {
    id: string;
    name: string;
    members: { id: string; name: string }[];
    aiModels: { id: string; name: string; color: string }[];
    lastActive: string;
    unread: boolean;
}

export default function RoomCard({
    id,
    name,
    members,
    aiModels,
    lastActive,
    unread,
}: RoomCardProps) {
    const visibleMembers = members.slice(0, 3);
    const extraCount = Math.max(0, members.length - 3);

    return (
        <a
            href={`/me/room/${id}`}
            className="block bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-5 hover:border-[#3a3a3a]"
        >
            {/* Name + unread */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#ededed] font-semibold text-[15px] truncate">
                    {name}
                </h3>
                {unread && (
                    <div className="w-2 h-2 rounded-full bg-[#c4a882] shrink-0" />
                )}
            </div>

            {/* Member avatars */}
            <div className="flex items-center mb-3">
                {visibleMembers.map((member, i) => (
                    <div
                        key={member.id}
                        className="w-7 h-7 rounded-full bg-[#2a2a2a] border-2 border-[#1c1c1c] flex items-center justify-center text-[10px] font-medium text-[#ededed]"
                        style={{ marginLeft: i > 0 ? -8 : 0 }}
                    >
                        {member.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                ))}
                {extraCount > 0 && (
                    <div
                        className="w-7 h-7 rounded-full bg-[#2a2a2a] border-2 border-[#1c1c1c] flex items-center justify-center text-[10px] text-[#5a5a5a]"
                        style={{ marginLeft: -8 }}
                    >
                        +{extraCount}
                    </div>
                )}
            </div>

            {/* AI model dots */}
            <div className="flex flex-wrap gap-x-3 gap-y-1.5 mb-4">
                {aiModels.map((model) => (
                    <div key={model.id} className="flex items-center gap-1.5">
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: model.color }}
                        />
                        <span className="text-[#5a5a5a] text-xs">{model.name}</span>
                    </div>
                ))}
            </div>

            {/* Bottom row */}
            <div className="flex items-center justify-between pt-3 border-t border-[#2a2a2a]">
                <span className="text-[#5a5a5a] text-xs">{lastActive}</span>
                <span className="text-[#c4a882] text-xs font-medium">
                    Enter →
                </span>
            </div>
        </a>
    );
}
