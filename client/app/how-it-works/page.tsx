"use client";

import { useRef } from "react";
import { 
  Sparkles, MessageSquare, Database, Users, 
  ArrowRight, Shield, Zap, Cpu
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";

export default function HowItWorks() {
    const containerRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        
        tl.fromTo(".reveal-header", 
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, delay: 0.2 }
        )
        .fromTo(".reveal-step",
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.2 },
            "-=0.4"
        );
    }, { scope: containerRef });

    const steps = [
        {
            icon: MessageSquare,
            title: "The Multi-Mind Thread",
            subtitle: "Unified Conversation",
            desc: "Unlike standard AI chats that are 1-on-1, Kōl rooms allow multiple distinct AI models and human teammates to coexist in a single thread. You don't prompt an AI; you host a discussion.",
            color: "#4285F4"
        },
        {
            icon: Database,
            title: "Contextual Anchoring",
            subtitle: "Adaptive Memory",
            desc: "Our 'Living Memory' system automatically parses your conversation history. When the room gets busy, Kōl ensures the AI models stay grounded in the core facts of your project, preventing hallucination.",
            color: "#c4a882"
        },
        {
            icon: Cpu,
            title: "Intelligent Routing",
            subtitle: "The AI Council",
            desc: "Models within Kōl are aware of each other. Gemini can ask GPT for a code review, and Llama can summarize a debate between humans. It's a self-organizing network of specialized intelligence.",
            color: "#10A37F"
        }
    ];

    return (
        <div ref={containerRef} className="min-h-screen flex flex-col bg-[#0c0c0c] text-[#ededed] selection:bg-[#c4a882]/30 overflow-x-hidden">
            <Navbar />
            
            {/* Background elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#c4a882]/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-[#4285F4]/5 blur-[100px] rounded-full" />
            </div>

            <main className="max-w-6xl mx-auto px-6 pt-32 pb-24 relative z-10 w-full flex-1">
                {/* Header */}
                <div className="mb-24 text-center reveal-header">
                    <div className="inline-flex items-center gap-2 bg-[#1a1a1a] border border-[#2e2e2e] px-4 py-1.5 rounded-full mb-6">
                        <Zap className="w-3.5 h-3.5 text-[#c4a882]" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#c4a882]">The Mechanics of Kōl</span>
                    </div>
                    <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.05]">
                        How we synchronized <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-[#ededed] via-[#ededed] to-[#5a5a5a]">
                            the machine world.
                        </span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-[#888888] text-base md:text-xl leading-relaxed">
                        Kōl is more than just a frontend for LLMs. It's a complex orchestration layer designed to facilitate a high-fidelity workspace for humans and artificial intelligence.
                    </p>
                </div>

                {/* Steps Flow */}
                <div className="grid grid-cols-1 gap-8">
                    {steps.map((step, i) => (
                        <div key={i} className="reveal-step overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-8 md:p-10 rounded-[2.5rem] bg-[#111111]/40 border border-[#2a2a2a] hover:border-[#c4a882]/20 transition-all">
                            <div className="flex flex-col">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="text-[10px] font-bold text-[#c4a882] bg-[#c4a882]/10 px-2 py-0.5 rounded-md border border-[#c4a882]/20">0{i+1}</span>
                                    <span className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: step.color }}>{step.subtitle}</span>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight text-[#ededed]">{step.title}</h2>
                                <p className="text-[#888888] text-sm md:text-lg leading-relaxed mb-8">
                                    {step.desc}
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#1c1c1c] border border-[#2a2a2a] flex items-center justify-center">
                                        <step.icon className="w-5 h-5 text-[#ededed]" />
                                    </div>
                                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#333]">Capability Matrix</span>
                                </div>
                            </div>

                            <div className="relative rounded-2xl overflow-hidden border border-[#2a2a2a] bg-[#0c0c0c] aspect-video flex items-center justify-center p-10">
                                {/* Visual Representation Placeholder */}
                                <div className="w-full h-full flex flex-col gap-4 opacity-40">
                                    <div className="h-3 w-3/4 bg-[#1c1c1c] rounded-full" />
                                    <div className="h-3 w-full bg-[#1c1c1c] rounded-full" />
                                    <div className="h-3 w-2/3 bg-[#1c1c1c] rounded-full" style={{ background: step.color + '30' }} />
                                    <div className="mt-4 flex gap-3">
                                        <div className="w-6 h-6 rounded-full bg-[#1c1c1c]" />
                                        <div className="w-6 h-6 rounded-full bg-[#1c1c1c]" />
                                        <div className="w-6 h-6 rounded-full" style={{ background: step.color }} />
                                    </div>
                                </div>
                                <div className="absolute inset-0 bg-linear-to-t from-[#0c0c0c] via-transparent to-transparent pointer-events-none" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Final CTA */}
                <div className="mt-32 text-center reveal-step">
                    <h3 className="text-3xl font-bold mb-8 text-[#ededed]">Ready to start the conversation?</h3>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link 
                            href="/signup" 
                            className="bg-[#ededed] text-[#0c0c0c] px-10 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-white transition-all shadow-xl shadow-white/5"
                        >
                            Get Started <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link 
                            href="/me" 
                            className="bg-[#111111] text-[#ededed] border border-[#2a2a2a] px-10 py-4 rounded-2xl font-bold hover:bg-[#1a1a1a] transition-all"
                        >
                            Guest Mode
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
