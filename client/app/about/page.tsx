"use client";

import { useRef } from "react";
import { Sparkles, Binary, Users, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function AboutPage() {
    const containerRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        
        // Using .fromTo to ensure we have a defined start and end state
        tl.fromTo(".reveal-text", 
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 }
        )
        .fromTo(".reveal-card",
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 },
            "-=0.4"
        );
    }, { scope: containerRef });

    const values = [
        {
            icon: Users,
            title: "A Chat Among Equals",
            desc: "Stop treating AI like a static text box. At Kōl, AI models are active members of your group. They brainstorm, challenge, and grow ideas alongside you in real-time conversations."
        },
        {
            icon: Binary,
            title: "Living Memory",
            desc: "Our rooms don't just 'save' text; they understand context. Kōl automatically organizes your long-term discussions so you never lose the core of a great idea, no matter how long the chat gets."
        },
        {
            icon: Shield,
            title: "Your Private Think-Tank",
            desc: "Your brainstorms stay within your walls. We use secure, high-speed vaults to ensure that every word spoken and every idea generated remains strictly between you and your chosen group."
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

            <main className="max-w-6xl mx-auto px-6 pt-24 pb-12 relative z-10 w-full flex-1">
                <div className="mb-12">
                    <div className="flex items-center gap-2 mb-4 reveal-text opacity-1">
                        <Sparkles className="w-4 h-4 text-[#c4a882]" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c4a882]">Where Intelligence Gathers</span>
                    </div>
                    
                    <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-5 leading-[1.1] reveal-text opacity-1">
                        Where great ideas <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-[#ededed] via-[#ededed] to-[#5a5a5a]">
                            find a home
                        </span>
                    </h1>
                    
                    <p className="max-w-xl text-[#888888] text-base md:text-lg leading-relaxed reveal-text opacity-1">
                        Kōl is a new kind of group chat. It’s a space where the world’s most advanced AI models aren't just tools—they are teammates. Collaborate, innovate, and build the future with a group that includes both human brilliance and artificial intelligence.
                    </p>
                </div>

                <div className="reveal-text mb-12 max-w-2xl opacity-1">
                    <h2 className="text-2xl font-bold mb-3 italic tracking-tight text-[#ededed]">The Vision</h2>
                    <p className="text-[#888888] mb-3 text-sm md:text-base leading-relaxed">
                        We started Kōl because we felt something was missing in the way humans interact with AI. Most AI interfaces are lonely—just you and a blank prompt. But the best ideas come from the friction and energy of a group conversation. 
                    </p>
                    <p className="text-[#888888] text-sm md:text-base leading-relaxed">
                        By bringing multiple different AI personalities into a single room with you and your friends, we recreate the magic of a high-energy workshop or a late-night whiteboard session. It's more than a chat; it’s a shared brain.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {values.map((item, i) => (
                        <div key={i} className="reveal-card group bg-[#111111]/60 border border-[#2a2a2a] p-8 rounded-4xl hover:border-[#c4a882]/30 transition-all flex flex-col opacity-1">
                            <div className="w-10 h-10 bg-[#1c1c1c] rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                <item.icon className="w-5 h-5 text-[#ededed]" />
                            </div>
                            <h3 className="text-lg font-bold mb-3 tracking-tight">{item.title}</h3>
                            <p className="text-[#5a5a5a] text-[13px] leading-relaxed tracking-wide">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}
