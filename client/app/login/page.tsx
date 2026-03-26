"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const page = () => {
    const router = useRouter();
    const [formData, setformData] = useState({
        email: "",
        password: "",
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)
        axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
            email: formData.email,
            password: formData.password,
        }, {
            withCredentials: true,
        }).then((res) => {
            console.log(res.data);
            setSuccess("Login successful");
            router.push("/me");
        }).catch((err) => {
            console.log(err);
            setError(err.response.data.message);
        }).finally(() => {
            setLoading(false);
        });
    }

    return (
        <div className='min-h-screen w-full bg-[#0a0a0a] flex flex-col items-center justify-center p-4 font-sans selection:bg-white/10'>
            <div className='mb-8'>
                <Link href={"/"}><h1 className='text-[22px] font-bold text-white tracking-wide'>Kōl</h1></Link>
            </div>

            <div className='w-full max-w-[400px] bg-[#111111] p-8 rounded-[20px] border border-white/5 shadow-2xl'>
                <div className='mb-8'>
                    <h2 className='text-2xl font-bold text-white mb-2 tracking-tight'>Welcome back</h2>
                    <p className='text-[#888888] text-[14px]'>Enter your details to sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
                    <div className='flex flex-col gap-2'>
                        <label className='text-[13px] font-medium text-[#888888]'>Email</label>
                        <input
                            type="email"
                            className='w-full px-3.5 py-3 bg-[#171717] border border-white/5 rounded-lg text-white text-sm placeholder:text-[#444444] focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/10 transition-all'
                            placeholder='you@example.com'
                            value={formData.email}
                            onChange={(e) => setformData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className='flex flex-col gap-2'>
                        <div className='flex justify-between items-center'>
                            <label className='text-[13px] font-medium text-[#888888]'>Password</label>
                        </div>
                        <input
                            type="password"
                            className='w-full px-3.5 py-3 bg-[#171717] border border-white/5 rounded-lg text-white text-sm placeholder:text-[#444444] focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/10 transition-all font-sans'
                            placeholder='••••••••'
                            value={formData.password}
                            onChange={(e) => setformData({ ...formData, password: e.target.value })}
                            required
                        />
                        <Link href="/forgot-password" className='text-[12px] text-[#e2a868] hover:text-[#f3b979] transition-colors'>Forgot password?</Link>
                    </div>

                    <button
                        type="submit"
                        className='w-full mt-3 bg-[#ededed] hover:bg-white text-[#111111] font-semibold py-3 rounded-lg transition-colors text-[14px] shadow-sm cursor-pointer'
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                    {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
                    {success && <p className='text-green-500 text-sm mt-2'>{success}</p>}
                </form>

                <div className='mt-8 text-center text-[13px]'>
                    <span className='text-[#666666]'>Don&apos;t have an account? </span>
                    <Link href="/signup" className='text-[#e2a868] hover:text-[#f3b979] transition-colors font-medium'>Sign up</Link>
                </div>
            </div>
        </div>
    )
}

export default page