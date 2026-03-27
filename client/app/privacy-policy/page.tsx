"use client";

import { useRef } from "react";
import { ShieldCheck, Lock, EyeOff, Database } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function PrivacyPolicyPage() {
    const containerRef = useRef(null);

    useGSAP(() => {
        gsap.from(".reveal-content", {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out"
        });
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="min-h-screen bg-[#0c0c0c] text-[#ededed] selection:bg-[#c4a882]/30 flex flex-col">
            <Navbar />
            
            <main className="max-w-4xl mx-auto px-6 pt-40 pb-40 w-full relative z-10">
                <header className="mb-16 reveal-content">
                    <div className="flex items-center gap-2 mb-4">
                        <ShieldCheck className="w-5 h-5 text-[#c4a882]" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c4a882]">Security First</span>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
                    <p className="text-[#5a5a5a] text-sm italic">Last updated: March 27, 2026</p>
                </header>

                <div className="space-y-12">
                    <section className="reveal-content">
                        <div className="flex items-center gap-3 mb-4">
                            <Lock className="w-5 h-5 text-[#ededed]" />
                            <h2 className="text-xl font-bold italic tracking-tight underline decoration-[#c4a882] underline-offset-8">1. Ownership of Ideas</h2>
                        </div>
                        <p className="text-[#888888] leading-relaxed text-[15px]">
                            Everything you create in Kōl is yours. We believe that when you brainstorm with an AI, you are the director of that creative process. We do not claim ownership of any thoughts, code, or strategies generated within your private rooms.
                        </p>
                    </section>

                    <section className="reveal-content">
                        <div className="flex items-center gap-3 mb-4">
                            <Database className="w-5 h-5 text-[#ededed]" />
                            <h2 className="text-xl font-bold italic tracking-tight underline decoration-[#c4a882] underline-offset-8">2. How We Handle Your Chats</h2>
                        </div>
                        <p className="text-[#888888] leading-relaxed text-[15px] mb-4">
                            To make the group chat feel alive and responsive, we store your messages in secure, high-speed vaults. We split this data into:
                        </p>
                        <ul className="list-disc list-inside text-[#888888] space-y-4 text-[14px] ml-4">
                            <li><strong className="text-[#ededed]">Live Conversation:</strong> The actual messages you see in the chat window, kept for your own history.</li>
                            <li><strong className="text-[#ededed]">Smart Summaries:</strong> When a conversation gets very long, our system creates a "memory map" of the discussion so the AI models don't lose the thread. This summary is private to that specific room.</li>
                            <li><strong className="text-[#ededed]">Account Data:</strong> Basic info like your email and chosen nickname to identify you in the group.</li>
                        </ul>
                    </section>

                    <section className="reveal-content">
                        <div className="flex items-center gap-3 mb-4">
                            <EyeOff className="w-5 h-5 text-[#ededed]" />
                            <h2 className="text-xl font-bold italic tracking-tight underline decoration-[#c4a882] underline-offset-8">3. AI Interaction Safety</h2>
                        </div>
                        <p className="text-[#888888] leading-relaxed text-[15px]">
                            When you speak to an AI model in Kōl, your message is sent through a temporary, secure bridge to the AI. This bridge is like a "brain session" that ends as soon as the response is delivered. We use professional-grade connections that guarantee your data is never used to train global AI models without your explicit permission.
                        </p>
                    </section>
                </div>
            </main>
            
            <Footer />
        </div>
    );
}
