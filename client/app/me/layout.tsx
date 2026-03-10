"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "../../components/Sidebar";

export default function MeLayout({ children }: { children: React.ReactNode }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex h-screen bg-[#0c0c0c]">
            {/* Desktop sidebar */}
            <div className="hidden lg:block">
                <Sidebar />
            </div>

            {/* Mobile sidebar overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/60"
                        onClick={() => setMobileOpen(false)}
                    />
                    <div className="relative z-10">
                        <Sidebar />
                    </div>
                </div>
            )}

            {/* Main area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile header */}
                <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-[#2a2a2a] bg-[#111111]">
                    <span className="text-[#ededed] font-bold text-lg">Kōl</span>
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="text-[#ededed]"
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Page content */}
                <div className="flex-1 overflow-y-auto no-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
}
