"use client";

import { useEffect, useState, use } from "react";
import { Loader2, UserPlus, CheckCircle, XCircle } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface InvitePageProps {
    params: Promise<{ code: string }>;
}

export default function InvitePage({ params }: InvitePageProps) {
    const { code } = use(params);
    const router = useRouter();
    const [status, setStatus] = useState<"loading" | "success" | "error" | "auth_needed">("loading");
    const [roomId, setRoomId] = useState("");

    useEffect(() => {
        const joinRoom = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/room/invite/${code}`, {
                    withCredentials: true
                });
                setRoomId(res.data.roomId);
                setStatus("success");
                // Auto redirect after 2 seconds
                setTimeout(() => {
                    router.push(`/me/room/${res.data.roomId}`);
                }, 2000);
            } catch (error: any) {
                if (error.response?.status === 401) {
                    setStatus("auth_needed");
                } else {
                    setStatus("error");
                }
            }
        };

        joinRoom();
    }, [code, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0c0c0c] p-6 text-center">
            <div className="max-w-md w-full bg-[#111111] border border-[#2a2a2a] rounded-2xl p-8 shadow-2xl">
                {status === "loading" && (
                    <>
                        <Loader2 className="w-12 h-12 text-[#c4a882] animate-spin mx-auto mb-4" />
                        <h1 className="text-xl font-bold text-[#ededed] mb-2">Joining Room...</h1>
                        <p className="text-[#5a5a5a] text-sm">Please wait while we set up your board.</p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                        <h1 className="text-xl font-bold text-[#ededed] mb-2">Success!</h1>
                        <p className="text-[#5a5a5a] text-sm mb-6">You've joined the room. Redirecting you now...</p>
                        <Link 
                            href={`/me/room/${roomId}`}
                            className="inline-block bg-[#ededed] text-[#0c0c0c] font-bold px-6 py-2.5 rounded-xl text-sm"
                        >
                            Go to Room
                        </Link>
                    </>
                )}

                {status === "auth_needed" && (
                    <>
                        <UserPlus className="w-12 h-12 text-[#c4a882] mx-auto mb-4" />
                        <h1 className="text-xl font-bold text-[#ededed] mb-2">Almost there!</h1>
                        <p className="text-[#5a5a5a] text-sm mb-8">You need to have a Kōl account to join this room. Log in or sign up to continue.</p>
                        <div className="flex flex-col gap-3">
                            <Link 
                                href={`/signup?invite=${code}`}
                                className="bg-[#ededed] text-[#0c0c0c] font-bold px-6 py-2.5 rounded-xl text-sm"
                            >
                                Create Account
                            </Link>
                            <Link 
                                href={`/login?invite=${code}`}
                                className="text-[#5a5a5a] hover:text-[#ededed] text-sm font-medium py-2"
                            >
                                Already have an account? Log in
                            </Link>
                        </div>
                    </>
                )}

                {status === "error" && (
                    <>
                        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h1 className="text-xl font-bold text-[#ededed] mb-2">Invalid Invite</h1>
                        <p className="text-[#5a5a5a] text-sm mb-8">This invite link is invalid or has expired.</p>
                        <Link 
                            href="/me"
                            className="inline-block bg-[#1c1c1c] border border-[#2a2a2a] text-[#ededed] font-bold px-6 py-2.5 rounded-xl text-sm"
                        >
                            Return Home
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
