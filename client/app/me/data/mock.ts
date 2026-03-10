// ── Shared Types ───────────────────────────────────────────

export interface Member {
    id: string;
    name: string;
}

export interface AiModel {
    id: string;
    name: string;
    role: string;
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
    role?: string;
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

export const ROOMS: Room[] = [
    {
        id: "1",
        name: "Product Strategy",
        members: [
            { id: "u1", name: "Alex Johnson" },
            { id: "u2", name: "Sarah Connor" },
            { id: "u3", name: "Mike Chen" },
            { id: "u4", name: "Lisa Park" },
        ],
        aiModels: [
            { id: "m1", name: "Gemini 2.0 Flash", role: "The Analyst", color: "#4285F4" },
            { id: "m2", name: "Claude Haiku", role: "The Synthesizer", color: "#D97706" },
            { id: "m3", name: "GPT-4o", role: "The Strategist", color: "#10B981" },
        ],
        lastActive: "2 min ago",
        messageCount: 142,
        unread: true,
        lastMessage: "Let's finalize the GTM plan",
        timeAgo: "2m",
    },
    {
        id: "2",
        name: "Design Review",
        members: [
            { id: "u1", name: "Alex Johnson" },
            { id: "u5", name: "Emma Wilson" },
        ],
        aiModels: [
            { id: "m1", name: "Gemini 2.0 Flash", role: "The Analyst", color: "#4285F4" },
            { id: "m4", name: "Llama 4 Scout", role: "The Creative", color: "#8B5CF6" },
        ],
        lastActive: "1 hour ago",
        messageCount: 56,
        unread: false,
        lastMessage: "Updated the mockups",
        timeAgo: "1h",
    },
    {
        id: "3",
        name: "Weekend Plans",
        members: [
            { id: "u1", name: "Alex Johnson" },
            { id: "u2", name: "Sarah Connor" },
            { id: "u6", name: "David Kim" },
            { id: "u7", name: "Priya Sharma" },
            { id: "u8", name: "Tom Baker" },
        ],
        aiModels: [
            { id: "m5", name: "Grok", role: "The Skeptic", color: "#EF4444" },
        ],
        lastActive: "3 hours ago",
        messageCount: 89,
        unread: true,
        lastMessage: "Anyone free Saturday?",
        timeAgo: "3h",
    },
    {
        id: "4",
        name: "Tech Architecture",
        members: [
            { id: "u1", name: "Alex Johnson" },
            { id: "u3", name: "Mike Chen" },
        ],
        aiModels: [
            { id: "m3", name: "GPT-4o", role: "The Strategist", color: "#10B981" },
            { id: "m2", name: "Claude Haiku", role: "The Synthesizer", color: "#D97706" },
            { id: "m4", name: "Llama 4 Scout", role: "The Creative", color: "#8B5CF6" },
        ],
        lastActive: "1 day ago",
        messageCount: 234,
        unread: false,
        lastMessage: "Switched to LangGraph",
        timeAgo: "1d",
    },
    {
        id: "5",
        name: "Book Club",
        members: [
            { id: "u2", name: "Sarah Connor" },
            { id: "u5", name: "Emma Wilson" },
            { id: "u6", name: "David Kim" },
        ],
        aiModels: [
            { id: "m1", name: "Gemini 2.0 Flash", role: "The Analyst", color: "#4285F4" },
        ],
        lastActive: "2 days ago",
        messageCount: 31,
        unread: false,
        lastMessage: "Chapter 4 discussion",
        timeAgo: "2d",
    },
    {
        id: "6",
        name: "Startup Ideas",
        members: [
            { id: "u1", name: "Alex Johnson" },
            { id: "u7", name: "Priya Sharma" },
        ],
        aiModels: [
            { id: "m1", name: "Gemini 2.0 Flash", role: "The Analyst", color: "#4285F4" },
            { id: "m3", name: "GPT-4o", role: "The Strategist", color: "#10B981" },
            { id: "m5", name: "Grok", role: "The Skeptic", color: "#EF4444" },
            { id: "m2", name: "Claude Haiku", role: "The Synthesizer", color: "#D97706" },
        ],
        lastActive: "3 days ago",
        messageCount: 78,
        unread: false,
        lastMessage: "Let's brainstorm more ideas",
        timeAgo: "3d",
    },
];

export const FRIENDS: Friend[] = [
    { id: "u2", name: "Sarah Connor", username: "sarahc", online: true },
    { id: "u3", name: "Mike Chen", username: "mikechen", online: true },
    { id: "u5", name: "Emma Wilson", username: "emmaw", online: false },
    { id: "u6", name: "David Kim", username: "davidk", online: false },
    { id: "u7", name: "Priya Sharma", username: "priya_s", online: true },
];

export const FRIEND_REQUESTS: FriendRequest[] = [
    { id: "r1", name: "Jordan Lee", username: "jordanl" },
    { id: "r2", name: "Nina Patel", username: "ninap" },
];

export const ACTIVITY: ActivityItem[] = [
    { id: "a1", description: "Sarah joined Product Strategy", timeAgo: "5m ago" },
    { id: "a2", description: "GPT-4o was added to Tech Architecture", timeAgo: "1h ago" },
    { id: "a3", description: "Mike sent 12 messages in Design Review", timeAgo: "3h ago" },
    { id: "a4", description: "New room 'Startup Ideas' created", timeAgo: "1d ago" },
];

export const ROOM_MESSAGES: Record<string, ChatMessage[]> = {
    "1": [
        { id: "m1", user: "Alex Johnson", type: "human", time: "10:24 AM", content: "What should our go-to-market strategy be for Kōl targeting small developer teams?" },
        { id: "m2", user: "GPT-4o", type: "ai", role: "The Strategist", color: "#10B981", time: "10:25 AM", content: "For small dev teams, friction is the enemy. Focus on a zero-config onboarding experience. Emphasize that Kōl is a low-latency \"thinking room\" rather than another bloated tool. Offer a generous free tier based on Groq to capture organic growth." },
        { id: "m3", user: "Sarah Connor", type: "human", time: "10:30 AM", content: "Should we prioritize the CLI tool or the web dashboard first?" },
        { id: "m4", user: "Claude Haiku", type: "ai", role: "The Synthesizer", color: "#D97706", time: "10:31 AM", content: "The web dashboard is essential for the multi-agent visual experience, but a CLI tool captures developers where they live. Build the dashboard for the \"aha\" moment, but follow fast with a CLI for daily retention." },
        { id: "m5", user: "Gemini 2.0 Flash", type: "ai", role: "The Analyst", color: "#4285F4", time: "10:32 AM", content: "Data point: 73% of developer tools that gained traction in 2024 offered a CLI-first experience. The web interface drove conversion but the CLI drove daily active usage. I recommend a parallel build with CLI as the primary interface." },
        { id: "m6", user: "Mike Chen", type: "human", time: "10:35 AM", content: "That data is interesting. What about pricing? Do we go freemium or credit-based from day one?" },
        { id: "m7", user: "GPT-4o", type: "ai", role: "The Strategist", color: "#10B981", time: "10:36 AM", content: "Credit-based from day one with a generous free tier (50 credits/day). This creates natural scarcity without a hard paywall. Users who hit the ceiling are already engaged enough to convert." },
    ],
    "2": [
        { id: "m1", user: "Emma Wilson", type: "human", time: "9:15 AM", content: "I updated the mockups for the room creation flow. Thoughts?" },
        { id: "m2", user: "Alex Johnson", type: "human", time: "9:20 AM", content: "Looks clean! I think the model selector could be more visual though." },
        { id: "m3", user: "Llama 4 Scout", type: "ai", role: "The Creative", color: "#8B5CF6", time: "9:22 AM", content: "What if each AI model had a signature color that pulses subtly when it's \"thinking\"? Visual personality before they even speak." },
    ],
    "3": [
        { id: "m1", user: "David Kim", type: "human", time: "2:00 PM", content: "Anyone free Saturday? Thinking we could do a board game night." },
        { id: "m2", user: "Sarah Connor", type: "human", time: "2:05 PM", content: "I'm in! What time?" },
        { id: "m3", user: "Grok", type: "ai", role: "The Skeptic", color: "#EF4444", time: "2:06 PM", content: "Statistically, Saturday plans made on a Monday have a 40% chance of actually happening. Just saying." },
        { id: "m4", user: "Priya Sharma", type: "human", time: "2:10 PM", content: "Haha Grok keeping it real. I'm free after 5pm!" },
    ],
};
