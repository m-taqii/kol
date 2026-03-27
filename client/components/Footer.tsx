"use client";

import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t border-[#2a2a2a] py-20 px-6 mt-auto bg-[#0c0c0c] relative z-20">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-10">
                <div>
                    <div className="text-[20px] font-bold tracking-tighter mb-4 uppercase text-[#ededed]">
                        KŌL<span className="text-[#c4a882]">.</span>
                    </div>
                    <p className="text-[#5a5a5a] text-[13px] max-w-[200px]">
                        Built for the next era of collaborative intelligence.
                    </p>
                </div>
                
                <div className="flex gap-16">
                    <div className="flex flex-col gap-4">
                        <span className="text-[10px] font-bold text-[#5a5a5a] uppercase tracking-widest">Platform</span>
                        <Link href="/about" className="text-[13px] text-[#888888] hover:text-[#ededed] transition-colors">About</Link>
                        <Link href="/me" className="text-[13px] text-[#888888] hover:text-[#ededed] transition-colors">Dashboard</Link>
                    </div>
                    <div className="flex flex-col gap-4">
                        <span className="text-[10px] font-bold text-[#5a5a5a] uppercase tracking-widest">Legal</span>
                        <Link href="/privacy-policy" className="text-[13px] text-[#888888] hover:text-[#ededed] transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="text-[13px] text-[#888888] hover:text-[#ededed] transition-colors">Terms of Use</Link>
                    </div>
                    <div className="flex flex-col gap-4">
                        <span className="text-[10px] font-bold text-[#5a5a5a] uppercase tracking-widest">Connect</span>
                        <a href="#" className="text-[13px] text-[#888888] hover:text-[#ededed] transition-colors">GitHub</a>
                        <a href="#" className="text-[13px] text-[#888888] hover:text-[#ededed] transition-colors">Twitter</a>
                    </div>
                </div>
            </div>
            
            <div className="max-w-6xl mx-auto mt-20 pt-8 border-t border-[#1c1c1c] flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-[#3a3a3a] text-[11px] uppercase tracking-widest">© 2026 KŌL. ALL RIGHTS RESERVED.</p>
                <div className="flex gap-6">
                    <span className="text-[#3a3a3a] text-[11px] uppercase tracking-widest">GLOBAL CLOUD NODE: ACTIVE</span>
                </div>
            </div>
        </footer>
    );
}
