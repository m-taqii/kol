"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { UserPlus, Search, Loader2, Check, X, Clock, Users } from "lucide-react";
import axios from "axios";

interface UserResult {
    _id: string;
    name: string;
    username: string;
    online: boolean;
    isFriend?: boolean;
    requestSent?: boolean;
}

interface Friend {
    _id: string;
    name: string;
    username: string;
    online: boolean;
}

interface FriendRequest {
    _id: string;
    name: string;
    username: string;
    online: boolean;
}

const API = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function FriendsPage() {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [requests, setRequests] = useState<FriendRequest[]>([]);
    const [searchResults, setSearchResults] = useState<UserResult[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [pendingAction, setPendingAction] = useState<string | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const fetchFriends = async () => {
        try {
            const res = await axios.get(`${API}/friends/list`, { withCredentials: true });
            setFriends(res.data.friends || []);
            setRequests(res.data.friendRequests || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = useCallback(async (q: string) => {
        if (!q.trim()) { setSearchResults([]); return; }
        setSearching(true);
        try {
            const res = await axios.get(`${API}/friends/search`, {
                params: { q },
                withCredentials: true
            });
            setSearchResults(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setSearching(false);
        }
    }, []);

    const onSearchChange = (val: string) => {
        setSearchQuery(val);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => handleSearch(val), 400);
    };

    const handleSendRequest = async (username: string) => {
        setPendingAction(username);
        try {
            await axios.post(`${API}/friends/request`, { username }, { withCredentials: true });
            setSearchResults(prev => prev.map(u =>
                u.username === username ? { ...u, requestSent: true } : u
            ));
        } catch (e) {
            console.error(e);
        } finally {
            setPendingAction(null);
        }
    };

    const handleRespond = async (fromUserId: string, action: "accept" | "decline") => {
        setPendingAction(fromUserId + action);
        try {
            await axios.post(`${API}/friends/respond`, { fromUserId, action }, { withCredentials: true });
            setRequests(prev => prev.filter(r => r._id !== fromUserId));
            if (action === "accept") await fetchFriends();
        } catch (e) {
            console.error(e);
        } finally {
            setPendingAction(null);
        }
    };

    useEffect(() => { fetchFriends(); }, []);

    const onlineFriends = friends.filter(f => f.online);
    const offlineFriends = friends.filter(f => !f.online);

    const Avatar = ({ name, size = 10 }: { name: string; size?: number }) => (
        <div className={`w-${size} h-${size} rounded-full bg-[#1c1c1c] border border-[#2a2a2a] flex items-center justify-center text-[11px] font-bold text-[#ededed] shrink-0`}>
            {name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
        </div>
    );

    return (
        <div className="p-6 lg:p-8 max-w-[640px] mx-auto">
            <h1 className="text-[26px] font-bold text-[#ededed] mb-2">Friends</h1>
            <p className="text-[#5a5a5a] text-sm mb-7">Connect with collaborators and build your board.</p>

            {/* Search */}
            <div className="mb-8">
                <div className="flex items-center gap-2 bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl px-3 focus-within:border-[#c4a882]/60 transition-colors">
                    {searching ? (
                        <Loader2 className="w-4 h-4 text-[#5a5a5a] animate-spin shrink-0" />
                    ) : (
                        <Search className="w-4 h-4 text-[#5a5a5a] shrink-0" />
                    )}
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => onSearchChange(e.target.value)}
                        placeholder="Search by name or @username..."
                        className="flex-1 bg-transparent py-3 text-sm text-[#ededed] placeholder:text-[#5a5a5a] outline-none"
                    />
                    {searchQuery && (
                        <button onClick={() => { setSearchQuery(""); setSearchResults([]); }} className="text-[#5a5a5a] hover:text-[#ededed] transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {searchResults.length > 0 && (
                    <div className="mt-2 bg-[#111111] border border-[#2a2a2a] rounded-xl overflow-hidden shadow-2xl">
                        <p className="text-[10px] font-semibold text-[#5a5a5a] uppercase tracking-widest px-4 pt-3 pb-2">Results</p>
                        {searchResults.map(user => (
                            <div key={user._id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#1c1c1c] transition-colors">
                                <Avatar name={user.name} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-[#ededed] text-sm font-medium truncate">{user.name}</p>
                                    <p className="text-[#5a5a5a] text-xs">@{user.username}</p>
                                </div>
                                {user.isFriend ? (
                                    <span className="flex items-center gap-1 text-[#c4a882] text-xs font-semibold">
                                        <Check className="w-3.5 h-3.5" /> Friends
                                    </span>
                                ) : user.requestSent ? (
                                    <span className="flex items-center gap-1 text-[#5a5a5a] text-xs">
                                        <Clock className="w-3.5 h-3.5" /> Requested
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => handleSendRequest(user.username)}
                                        disabled={pendingAction === user.username}
                                        className="flex items-center gap-1.5 bg-[#1c1c1c] border border-[#2a2a2a] text-[#ededed] rounded-lg px-3 py-1.5 text-xs font-medium hover:border-[#c4a882]/60 hover:text-[#c4a882] transition-all disabled:opacity-50"
                                    >
                                        {pendingAction === user.username ? <Loader2 className="w-3 h-3 animate-spin" /> : <UserPlus className="w-3 h-3" />}
                                        Add
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 text-[#5a5a5a] animate-spin" />
                </div>
            ) : (
                <>
                    {/* Pending Requests */}
                    {requests.length > 0 && (
                        <section className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <p className="text-[10px] font-semibold text-[#5a5a5a] uppercase tracking-widest">
                                    Pending Requests
                                </p>
                                <span className="bg-[#c4a882]/20 text-[#c4a882] text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                                    {requests.length}
                                </span>
                            </div>
                            <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl overflow-hidden divide-y divide-[#1a1a1a]">
                                {requests.map(req => (
                                    <div key={req._id} className="flex items-center gap-3 px-4 py-3.5">
                                        <Avatar name={req.name} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[#ededed] text-sm font-medium truncate">{req.name}</p>
                                            <p className="text-[#5a5a5a] text-xs">@{req.username} wants to connect</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleRespond(req._id, "accept")}
                                                disabled={!!pendingAction}
                                                className="flex items-center gap-1.5 bg-[#c4a882] text-[#0c0c0c] font-semibold rounded-lg px-3 py-1.5 text-xs hover:bg-white transition-colors disabled:opacity-50"
                                            >
                                                {pendingAction === req._id + "accept" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleRespond(req._id, "decline")}
                                                disabled={!!pendingAction}
                                                className="p-1.5 text-[#5a5a5a] hover:text-red-500 transition-colors rounded-lg hover:bg-[#1c1c1c] disabled:opacity-50"
                                            >
                                                {pendingAction === req._id + "decline" ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Online Friends */}
                    {onlineFriends.length > 0 && (
                        <section className="mb-6">
                            <p className="text-[10px] font-semibold text-[#5a5a5a] uppercase tracking-widest mb-3">
                                Online — {onlineFriends.length}
                            </p>
                            <div className="flex flex-col gap-1">
                                {onlineFriends.map(f => (
                                    <div key={f._id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#111111] transition-colors group">
                                        <div className="relative">
                                            <Avatar name={f.name} />
                                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-[#0c0c0c]" />
                                        </div>
                                        <div>
                                            <p className="text-[#ededed] text-sm font-medium">{f.name}</p>
                                            <p className="text-[#5a5a5a] text-xs">@{f.username}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Offline Friends */}
                    {offlineFriends.length > 0 && (
                        <section className="mb-6">
                            <p className="text-[10px] font-semibold text-[#5a5a5a] uppercase tracking-widest mb-3">
                                Offline — {offlineFriends.length}
                            </p>
                            <div className="flex flex-col gap-1">
                                {offlineFriends.map(f => (
                                    <div key={f._id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#111111] transition-colors opacity-60 hover:opacity-100">
                                        <Avatar name={f.name} size={10} />
                                        <div>
                                            <p className="text-[#ededed] text-sm font-medium">{f.name}</p>
                                            <p className="text-[#5a5a5a] text-xs">@{f.username}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {friends.length === 0 && requests.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="w-16 h-16 rounded-full bg-[#1c1c1c] flex items-center justify-center">
                                <Users className="w-7 h-7 text-[#3a3a3a]" />
                            </div>
                            <div className="text-center">
                                <p className="text-[#ededed] font-semibold mb-1">No connections yet</p>
                                <p className="text-[#5a5a5a] text-sm">Search for someone to start building your board.</p>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
