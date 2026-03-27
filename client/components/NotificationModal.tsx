"use client";

import React from "react";
import BaseModal from "./BaseModal";
import { CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";

interface NotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: "success" | "warning" | "error" | "info";
    title: string;
    message: string;
    actionLabel?: string;
    onAction?: () => void;
}

export default function NotificationModal({
    isOpen,
    onClose,
    type,
    title,
    message,
    actionLabel,
    onAction
}: NotificationModalProps) {
    const Icons = {
        success: <CheckCircle className="w-12 h-12 text-green-500" />,
        warning: <AlertTriangle className="w-12 h-12 text-[#c4a882]" />,
        error: <XCircle className="w-12 h-12 text-red-500" />,
        info: <Info className="w-12 h-12 text-[#1A73E8]" />,
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-sm">
            <div className="flex flex-col items-center justify-center text-center py-6 gap-4">
                {Icons[type]}
                <div className="space-y-2">
                    <p className="text-[#ededed] text-sm leading-relaxed">{message}</p>
                </div>
                
                <div className="flex flex-col w-full gap-2 mt-4">
                    {actionLabel && (
                        <button
                            onClick={() => {
                                if (onAction) onAction();
                                onClose();
                            }}
                            className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                                type === 'success' ? 'bg-[#ededed] text-[#0c0c0c]' : 
                                type === 'error' ? 'bg-red-500 text-white' : 
                                'bg-[#c4a882] text-[#0c0c0c]'
                            }`}
                        >
                            {actionLabel}
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 text-[#5a5a5a] hover:text-[#ededed] font-medium text-sm transition-colors"
                    >
                        Dismiss
                    </button>
                </div>
            </div>
        </BaseModal>
    );
}
