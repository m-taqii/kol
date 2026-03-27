"use client";

import { useRef } from "react";
import { BookOpen, Scale, FileText, AlertTriangle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function TermsOfUsePage() {
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
                        <Scale className="w-5 h-5 text-[#c4a882]" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c4a882]">Legal Framework</span>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight mb-4">Terms of Use</h1>
                    <p className="text-[#5a5a5a] text-sm italic">Last updated: March 27, 2026</p>
                </header>

                <div className="space-y-12">
                    <section className="reveal-content">
                        <div className="flex items-center gap-3 mb-4">
                            <BookOpen className="w-5 h-5 text-[#ededed]" />
                            <h2 className="text-xl font-bold italic tracking-tight underline decoration-[#c4a882] underline-offset-8">1. The Rules of the Room</h2>
                        </div>
                        <p className="text-[#888888] leading-relaxed text-[15px]">
                            When you create a room in Kōl, you are the moderator. You have the power to invite friends and choose which AI models join the discussion. We expect all users to keep the environment constructive. While we encourage debate and the "devil's advocate" nature of some AI models, Kōl should not be used for harassment, generating harmful content, or automated spam.
                        </p>
                    </section>

                    <section className="reveal-content">
                        <div className="flex items-center gap-3 mb-4">
                            <FileText className="w-5 h-5 text-[#ededed]" />
                            <h2 className="text-xl font-bold italic tracking-tight underline decoration-[#c4a882] underline-offset-8">2. AI Output & Accuracy</h2>
                        </div>
                        <p className="text-[#888888] leading-relaxed text-[15px] mb-4">
                            Our AI models are brilliant, but they aren't perfect. Sometimes they make mistakes (hallucinations). By using Kōl, you acknowledge that:
                        </p>
                        <ul className="list-disc list-inside text-[#888888] space-y-4 text-[14px] ml-4">
                            <li><strong className="text-[#ededed]">Verify Critical Info:</strong> Always double-check important facts, code, or legal advice provided by the AI.</li>
                            <li><strong className="text-[#ededed]">Model Perspectives:</strong> Different models have different "personalities." Some are designed to be critical or opinionated. These responses are simulations and do not reflect the views of Kōl as a platform.</li>
                        </ul>
                    </section>

                    <section className="reveal-content">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertTriangle className="w-5 h-5 text-[#ededed]" />
                            <h2 className="text-xl font-bold italic tracking-tight underline decoration-[#c4a882] underline-offset-8">3. Access & Termination</h2>
                        </div>
                        <p className="text-[#888888] leading-relaxed text-[15px]">
                            We want Kōl to be a lasting home for your ideas. However, we reserve the right to suspend accounts that engage in malicious behavior or attempt to interfere with our systems. You can close your account and export your data at any time through your dashboard settings.
                        </p>
                    </section>
                </div>

                <section className="reveal-content border border-[#c4a882]/20 p-8 rounded-3xl bg-[#c4a882]/5 mt-20">
                    <h2 className="text-lg font-bold mb-4 text-[#c4a882]">Prohibited Use</h2>
                    <p className="text-[#888888] text-[14px] leading-relaxed mb-4">
                        Kōl may not be used for illegal activities, mass-automated spam, or the creation of malicious software. We reserve the right to suspend accounts that violate these core ethics.
                    </p>
                </section>
            </main>
            
            <Footer />
        </div>
    );
}
