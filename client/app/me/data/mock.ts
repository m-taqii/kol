// ── Shared Types ───────────────────────────────────────────

export interface Member {
    id: string;
    name: string;
}

export interface AiModel {
    id: string;
    name: string;
    color: string;
}

export interface Room {
    id: string;
    name: string;
    members: Member[];
    aiModels: AiModel[];
    lastActive: string;
    messageCount: number;
    unread: boolean;
    lastMessage: string;
    timeAgo: string;
}

export interface Friend {
    id: string;
    name: string;
    username: string;
    online: boolean;
}

export interface FriendRequest {
    id: string;
    name: string;
    username: string;
}

export interface ActivityItem {
    id: string;
    description: string;
    timeAgo: string;
}

export interface ChatMessage {
    id: string;
    user: string;
    type: "human" | "ai";
    color?: string;
    time: string;
    content: string;
}

// ── Mock Data ──────────────────────────────────────────────

export const CURRENT_USER = {
    name: "Alex Johnson",
    username: "alex_j",
    initials: "AJ",
};

export const ROOMS: Room[] = [];

export const FRIENDS: Friend[] = [
    { id: "u2", name: "Sarah Connor", username: "sarahc", online: true },
    { id: "u3", name: "Mike Chen", username: "mikechen", online: true },
    { id: "u5", name: "Emma Wilson", username: "emmaw", online: false },
    { id: "u6", name: "David Kim", username: "davidk", online: false },
    { id: "u7", name: "Priya Sharma", username: "priya_s", online: true },
];

export const AI_MODELS: AiModel[] = [
    { id: "gpt", name: "GPT", color: "linear-gradient(135deg, #10a37f 0%, #067d5f 100%)" },
    { id: "llama", name: "Llama", color: "linear-gradient(135deg, #0668E1 0%, #764BA2 100%)" },
    { id: "kimi", name: "Kimi", color: "linear-gradient(135deg, #00E5FF 0%, #0052D4 100%)" },
    { id: "qwen", name: "Qwen", color: "linear-gradient(135deg, #6c47ff 0%, #3e1eff 100%)" },
    { id: "longcat", name: "LongCat", color: "linear-gradient(135deg, #ff4b2b 0%, #ff416c 100%)" },
    { id: "gemini", name: "Gemini", color: "linear-gradient(135deg, #1A73E8 0%, #4285F4 100%)" },
];

export const FRIEND_REQUESTS: FriendRequest[] = [];

export const ACTIVITY: ActivityItem[] = [];

export const ROOM_MESSAGES: Record<string, ChatMessage[]> = {};
