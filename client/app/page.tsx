"use client";

import { useRef, useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
    Sparkles, ArrowRight, Users, Zap, Shield,
    MessageCircle, Brain, Lock
} from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// --- Mock chat messages to animate ---
const CHAT_MESSAGES = [
    { role: "user", sender: "You", text: "Can someone help me plan my product launch for next month?" },
    { role: "ai", sender: "Gemini", text: "Sure! Let's start by defining your target audience and core value proposition.", color: "#4285F4" },
    { role: "ai", sender: "Llama", text: "Don't forget to line up your social media calendar at least 2 weeks ahead.", color: "#7C3AED" },
    { role: "user", sender: "You", text: "What about pricing strategy?" },
    { role: "ai", sender: "GPT", text: "A freemium tier can drive top-of-funnel growth quickly, then convert with a 14-day pro trial.", color: "#10A37F" },
];

function AnimatedChat() {
    const [visible, setVisible] = useState<number[]>([]);

    useEffect(() => {
        let idx = 0;
        const interval = setInterval(() => {
            if (idx < CHAT_MESSAGES.length) {
                setVisible(prev => [...prev, idx]);
                idx++;
            } else {
                clearInterval(interval);
                // Restart after a pause
                setTimeout(() => {
                    setVisible([]);
                    idx = 0;
                }, 3000);
            }
        }, 1200);
        return () => clearInterval(interval);
    }, [visible.length === 0 ? "reset" : ""]);

    return (
        <div className="flex flex-col gap-3 p-5 min-h-[320px]">
            {CHAT_MESSAGES.map((msg, i) => {
                const isVisible = visible.includes(i);
                const isUser = msg.role === "user";
                return (
                    <div
                        key={i}
                        style={{
                            opacity: isVisible ? 1 : 0,
                            transform: isVisible ? "translateY(0)" : "translateY(8px)",
                            transition: "opacity 0.4s ease, transform 0.4s ease",
                            transitionDelay: "0.05s",
                        }}
                        className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                    >
                        {/* Avatar */}
                        <div
                            className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[9px] font-bold text-white"
                            style={{ background: isUser ? "#c4a882" : msg.color }}
                        >
                            {msg.sender[0]}
                        </div>
                        {/* Bubble */}
                        <div
                            className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed ${isUser
                                ? "bg-[#c4a882] text-[#0c0c0c] rounded-br-sm font-medium"
                                : "bg-[#1c1c1c] border border-[#2e2e2e] text-[#ccc] rounded-bl-sm"
                                }`}
                        >
                            {!isUser && (
                                <span className="block text-[10px] font-bold mb-1 uppercase tracking-wider" style={{ color: msg.color }}>
                                    {msg.sender}
                                </span>
                            )}
                            {msg.text}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

const FEATURES = [
    {
        icon: Brain,
        title: "Multiple AI Minds",
        desc: "Invite Gemini, GPT, and Llama into a single room. Each model brings a unique perspective—like a panel of world-class experts ready for you.",
    },
    {
        icon: Users,
        title: "Real Collaboration",
        desc: "Mix humans and AI seamlessly. Your teammates and the AI respond in the same thread, keeping discussion natural and contextual.",
    },
    {
        icon: Zap,
        title: "Context That Lasts",
        desc: "Smart summaries keep the AI's memory sharp even over long conversations. No more repeating yourself after 20 messages.",
    },
    {
        icon: Shield,
        title: "Private by Default",
        desc: "Every room is invite-only. Your ideas, strategies, and brainstorming sessions stay strictly between you and the people you choose.",
    },
    {
        icon: MessageCircle,
        title: "Selective Responses",
        desc: "Mention a specific model to direct your question. The AI council only speaks when it has something meaningful to add.",
    },
    {
        icon: Lock,
        title: "You Own Your Data",
        desc: "We don't sell your conversations. We don't train on your private chats. Your intellectual property remains yours, full stop.",
    },
];

const STEPS = [
    { num: "01", title: "Create a Room", desc: "Start a private co-thinking space in seconds. Name it, set the vibe." },
    { num: "02", title: "Choose Your Council", desc: "Pick from Gemini, GPT, Llama, and more—or invite human collaborators." },
    { num: "03", title: "Think Together", desc: "Ask, challenge, and build ideas as a unified group of humans and AI." },
];

export default function Home() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.fromTo(".hero-line",
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power4.out", delay: 0.1 }
        );
        gsap.fromTo(".hero-sub",
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.4 }
        );
        gsap.fromTo(".hero-cta",
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.6 }
        );

        gsap.fromTo(".section-reveal",
            { y: 40, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: "power3.out",
                scrollTrigger: { trigger: ".features-section", start: "top 80%" }
            }
        );
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="min-h-screen bg-[#0c0c0c] text-[#ededed] flex flex-col selection:bg-[#c4a882]/30 overflow-x-hidden">
            <Navbar />

            {/* ─── HERO ─────────────────────────────────────────────── */}
            <section className="relative flex flex-col items-center pt-24 md:pt-36 pb-12 px-6 text-center overflow-hidden">
                {/* Glow orbs */}
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[70%] h-[55%] bg-[#c4a882]/8 blur-[140px] rounded-full" />
                    <div className="absolute top-[30%] left-[5%] w-[25%] h-[25%] bg-[#4285F4]/5 blur-[100px] rounded-full" />
                    <div className="absolute top-[20%] right-[5%] w-[20%] h-[20%] bg-[#7C3AED]/5 blur-[100px] rounded-full" />
                </div>

                {/* Badge */}
                <div className="hero-line inline-flex items-center gap-2 bg-[#1a1a1a] border border-[#2e2e2e] px-4 py-1.5 rounded-full mb-6">
                    <Sparkles className="w-3.5 h-3.5 text-[#c4a882]" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#c4a882]">
                        Group Intelligence · Now in Beta
                    </span>
                </div>

                {/* Headline */}
                <h1 className="max-w-5xl mx-auto">
                    <span className="hero-line block text-4xl sm:text-5xl md:text-8xl font-bold tracking-tight leading-[1.1]">
                        Your ideas deserve
                    </span>
                    <span className="hero-line block text-4xl sm:text-5xl md:text-8xl font-bold tracking-tight leading-[1.1] text-transparent bg-clip-text"
                        style={{ backgroundImage: "linear-gradient(90deg, #ededed 0%, #8a7057 100%)" }}>
                        a smarter room.
                    </span>
                </h1>

                <p className="hero-sub mt-6 max-w-xl text-[#666] text-sm md:text-lg leading-relaxed">
                    Kōl is the first group chat where multiple AI models collaborate alongside humans — in real-time, in the same room, with shared memory.
                </p>

                <div className="hero-cta mt-8 flex flex-col sm:flex-row gap-4 items-center justify-center">
                    <Link
                        href="/signup"
                        className="group inline-flex items-center gap-2 bg-[#ededed] text-[#0c0c0c] px-8 py-4 rounded-2xl font-bold text-[15px] hover:bg-white transition-all shadow-2xl shadow-white/10"
                    >
                        Get Started Free
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href="/how-it-works"
                        className="inline-flex items-center gap-2 text-[#888] text-[15px] hover:text-[#ededed] transition-colors"
                    >
                        See how it works →
                    </Link>
                </div>

                {/* Stats */}
                <div className="hero-cta mt-16 grid grid-cols-3 gap-8 border-t border-[#2a2a2a] pt-12 max-w-lg w-full">
                    {[
                        { val: "5+", label: "AI Models" },
                        { val: "∞", label: "Room Memory" },
                        { val: "100%", label: "Private" },
                    ].map(s => (
                        <div key={s.label} className="flex flex-col items-center">
                            <span className="text-2xl md:text-3xl font-bold tracking-tight text-[#ededed]">{s.val}</span>
                            <span className="text-[11px] text-[#555] uppercase tracking-widest mt-1">{s.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* LIVE PREVIEW */}
            <section className="relative px-6 py-20 flex justify-center">
                <div className="w-full max-w-3xl">
                    <div className="relative rounded-[2.5rem] bg-[#0e0e0e] border border-[#2a2a2a] overflow-hidden shadow-[0_0_100px_#0005,0_0_60px_#c4a88210]">
                        {/* Window bar */}
                        <div className="flex items-center gap-2 px-5 py-4 border-b border-[#1e1e1e]">
                            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                            <span className="ml-4 text-[12px] text-[#444] font-mono">kol · product-launch · 3 AI models active</span>
                        </div>
                        <AnimatedChat />
                        {/* Frosted input bar */}
                        <div className="border-t border-[#1e1e1e] px-5 py-4 flex items-center gap-3">
                            <div className="flex-1 bg-[#161616] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-[13px] text-[#444] font-mono">
                                Ask the room anything…
                            </div>
                            <button className="w-9 h-9 bg-[#c4a882] rounded-xl flex items-center justify-center shrink-0">
                                <ArrowRight className="w-4 h-4 text-[#0c0c0c]" />
                            </button>
                        </div>
                    </div>
                    <p className="text-center text-[12px] text-[#444] mt-4 uppercase tracking-widest">Live preview · responses are simulated</p>
                </div>
            </section>

            {/* HOW IT WORKS  */}
            <section className="px-6 py-24 max-w-6xl mx-auto w-full">
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#c4a882] mb-3 section-reveal">How it works</p>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-16 section-reveal max-w-xl leading-tight">
                    Three steps to your<br /> smartest conversation.
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {STEPS.map((step) => (
                        <div key={step.num} className="section-reveal group p-8 rounded-4xl border border-[#2a2a2a] hover:border-[#c4a882]/30 bg-[#111]/40 transition-all">
                            <span className="text-4xl font-bold text-[#2a2a2a] group-hover:text-[#c4a882]/30 transition-colors block mb-6">{step.num}</span>
                            <h3 className="text-lg font-bold mb-3">{step.title}</h3>
                            <p className="text-[#555] text-sm leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── FEATURES ─────────────────────────────────────────── */}
            <section className="features-section px-6 py-24 max-w-6xl mx-auto w-full">
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#c4a882] mb-3 section-reveal">Everything you need</p>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-16 section-reveal max-w-xl leading-tight">
                    Built for how great<br /> ideas actually happen.
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {FEATURES.map((feature) => (
                        <div
                            key={feature.title}
                            className="section-reveal group p-8 rounded-4xl border border-[#1e1e1e] hover:border-[#2e2e2e] bg-[#111]/30 hover:bg-[#141414] transition-all"
                        >
                            <div className="w-10 h-10 bg-[#1a1a1a] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <feature.icon className="w-5 h-5 text-[#c4a882]" />
                            </div>
                            <h3 className="font-bold text-[15px] mb-2 tracking-tight">{feature.title}</h3>
                            <p className="text-[#555] text-[13px] leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── MODELS STRIP ─────────────────────────────────────── */}
            <section className="px-6 py-20 border-y border-[#1e1e1e]">
                <p className="text-center text-[11px] uppercase tracking-[0.3em] text-[#444] mb-10">AI models ready in your room</p>
                <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-6">
                    {[
                        { name: "GPT", color: "linear-gradient(135deg, #10a37f 0%, #067d5f 100%)" },
                        { name: "Llama", color: "linear-gradient(135deg, #0668E1 0%, #764BA2 100%)" },
                        { name: "Qwen", color: "linear-gradient(135deg, #6c47ff 0%, #3e1eff 100%)" },
                        { name: "LongCat", color: "linear-gradient(135deg, #ff4b2b 0%, #ff416c 100%)" },
                        { name: "Gemini", color: "linear-gradient(135deg, #1A73E8 0%, #4285F4 100%)" },
                    ].map(m => (
                        <div key={m.name} className="flex items-center gap-2 group">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: m.color }} />
                            <span className="text-sm font-medium text-[#555] group-hover:text-[#ededed] transition-colors">{m.name}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── CTA ──────────────────────────────────────────────── */}
            <section className="relative px-6 py-40 flex flex-col items-center text-center overflow-hidden">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[50%] h-[60%] bg-[#c4a882]/6 blur-[120px] rounded-full" />
                </div>
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#c4a882] mb-4">Begin now</p>
                <h2 className="text-4xl md:text-7xl font-bold tracking-tight max-w-3xl leading-[1.05] mb-8">
                    Your next breakthrough<br />
                    <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(90deg,#ededed 0%,#6b5540 100%)" }}>
                        is one room away.
                    </span>
                </h2>
                <p className="text-[#555] text-base md:text-lg max-w-xl mb-12 leading-relaxed">
                    Join the users who've replaced their solo AI chat with a full council of intelligent voices.
                </p>
                <Link
                    href="/signup"
                    className="group inline-flex items-center gap-2 bg-[#ededed] text-[#0c0c0c] px-10 py-5 rounded-2xl font-bold text-[15px] hover:bg-white transition-all shadow-2xl shadow-white/10"
                >
                    Create Your First Room Free
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </section>

            <Footer />
        </div>
    );
}