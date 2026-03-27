"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    maxWidth?: string;
}

export default function BaseModal({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = "max-w-lg"
}: BaseModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/85 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className={`relative w-full ${maxWidth} bg-[#111111] border border-[#2a2a2a] rounded-2xl flex flex-col max-h-[90vh] shadow-2xl overflow-hidden ring-1 ring-white/5 animate-in zoom-in-95 fade-in duration-300`}>
                {/* Header */}
                <div className="px-6 py-4 border-b border-[#2a2a2a] flex items-center justify-between bg-[#161616]">
                    <h2 className="text-[#ededed] font-bold text-lg">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-[#5a5a5a] hover:text-[#ededed] transition-colors rounded-lg hover:bg-[#1c1c1c]"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto no-scrollbar p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
