"use client";

import React, { useState, useEffect } from "react";
import { X, Check, Users, Cpu, Hash, Loader2 } from "lucide-react";
import { AI_MODELS } from "../app/me/data/mock";
import axios from "axios";

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateRoomModal({ isOpen, onClose }: CreateRoomModalProps) {
  const [roomName, setRoomName] = useState("");
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(false);

  useEffect(() => {
    if (isOpen) {
        setLoadingFriends(true);
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/friends/list`, { withCredentials: true })
            .then(res => setFriends(res.data.friends || []))
            .catch(e => console.error(e))
            .finally(() => setLoadingFriends(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCreateRoom = () => {
    axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/room/create`, {
      name: roomName,
      members: selectedFriends, // array of usernames
      aiMembers: selectedModels, // array of model IDs
    }, {
      withCredentials: true,
    }).then(() => {
      onClose();
      window.location.reload(); // Refresh to show new room
    }).catch((error) => {
      console.error(error);
    });
  }

  const toggleFriend = (username: string) => {
    setSelectedFriends((prev) =>
      prev.includes(username) ? prev.filter((u) => u !== username) : [...prev, username]
    );
  };

  const toggleModel = (id: string) => {
    setSelectedModels((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-[#111111] border border-[#2a2a2a] rounded-2xl flex flex-col max-h-[90vh] shadow-2xl overflow-hidden ring-1 ring-white/5">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#2a2a2a] flex items-center justify-between bg-[#161616]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#c4a882]/10 flex items-center justify-center">
              <Hash className="w-4 h-4 text-[#c4a882]" />
            </div>
            <h2 className="text-[#ededed] font-bold text-lg">Create New Room</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#5a5a5a] hover:text-[#ededed] transition-colors rounded-lg hover:bg-[#1c1c1c]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
          {/* Room Name */}
          <section>
            <label className="block text-[10px] font-semibold text-[#5a5a5a] uppercase tracking-widest mb-3">
              Room Name
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Project Apollo"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full bg-[#0c0c0c] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-[#ededed] placeholder:text-[#3a3a3a] outline-none focus:border-[#c4a882] transition-colors"
              />
            </div>
          </section>

          {/* AI Models */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <label className="text-[10px] font-semibold text-[#5a5a5a] uppercase tracking-widest">
                Select AI Models
              </label>
              <span className="text-[10px] text-[#3a3a3a] font-medium">{selectedModels.length} selected</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {AI_MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => toggleModel(model.id)}
                  type="button"
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${selectedModels.includes(model.id)
                      ? "bg-[#c4a882]/5 border-[#c4a882] shadow-lg shadow-[#c4a882]/5"
                      : "bg-[#0c0c0c] border-[#2a2a2a] hover:border-[#3a3a3a]"
                    }`}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: model.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-[13px] truncate ${selectedModels.includes(model.id) ? "text-[#ededed] font-medium" : "text-[#5a5a5a]"}`}>
                      {model.name}
                    </p>
                  </div>
                  {selectedModels.includes(model.id) && (
                    <Check className="w-3.5 h-3.5 text-[#c4a882]" />
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Add Members */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <label className="text-[10px] font-semibold text-[#5a5a5a] uppercase tracking-widest">
                Add Members
              </label>
              <span className="text-[10px] text-[#3a3a3a] font-medium">{selectedFriends.length} selected</span>
            </div>
            <div className="space-y-2">
              {loadingFriends ? (
                <div className="flex justify-center py-6">
                    <Loader2 className="w-6 h-6 animate-spin text-[#5a5a5a]" />
                </div>
              ) : friends.length === 0 ? (
                <p className="text-xs text-[#3a3a3a] text-center py-4">No friends found. Add some in the Friends tab!</p>
              ) : (
                friends.map((friend) => (
                    <button
                      key={friend._id}
                      onClick={() => toggleFriend(friend.username)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${selectedFriends.includes(friend.username)
                        ? "bg-[#c4a882]/5 border-[#c4a882]"
                        : "bg-[#0c0c0c] border-[#2a2a2a] hover:border-[#3a3a3a]"
                        }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-[#1c1c1c] flex items-center justify-center text-[11px] font-bold text-[#ededed] group-hover:bg-[#2a2a2a]">
                        {friend.name.split(" ").map((n: string) => n[0]).join("")}
                      </div>
                      <div className="flex-1 text-left">
                        <p className={`text-[13px] font-medium ${selectedFriends.includes(friend.username) ? "text-[#ededed]" : "text-[#888]"}`}>{friend.name}</p>
                        <p className="text-[#3a3a3a] text-[11px]">@{friend.username}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${selectedFriends.includes(friend.username)
                        ? "bg-[#c4a882] border-[#c4a882]"
                        : "border-[#2a2a2a]"
                        }`}>
                        {selectedFriends.includes(friend.username) && (
                          <Check className="w-3 h-3 text-[#111111]" />
                        )}
                      </div>
                    </button>
                  ))
              )}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#2a2a2a] bg-[#161616] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[#5a5a5a] hover:text-[#ededed] transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={!roomName.trim() || (selectedModels.length === 0 && selectedFriends.length === 0)}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${(!roomName.trim() || (selectedModels.length === 0 && selectedFriends.length === 0))
              ? "bg-[#1c1c1c] text-[#3a3a3a] cursor-not-allowed border border-[#2a2a2a]"
              : "bg-[#ededed] text-[#0c0c0c] hover:bg-white shadow-lg shadow-white/5"
              }`}
            onClick={handleCreateRoom}
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
}
