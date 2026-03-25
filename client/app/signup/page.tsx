"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import axios from 'axios'


const page = () => {

    const [formData, setformData] = useState({
        name: "",
        email: "",
        username: "",
        password: ""
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`, {
            name: formData.name,
            email: formData.email,
            username: formData.username,
            password: formData.password,
        }, {
            withCredentials: true,
        }).then((res) => {
            console.log(res.data);
            setSuccess("Registration successful");
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
                    <h2 className='text-2xl font-bold text-white mb-2 tracking-tight'>Create your account</h2>
                    <p className='text-[#888888] text-[14px]'>Start building your board of advisors</p>
                </div>

                <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
                    <div className='flex flex-col gap-2'>
                        <label className='text-[13px] font-medium text-[#888888]'>Full Name</label>
                        <input
                            type="text"
                            className='w-full px-3.5 py-3 bg-[#171717] border border-white/5 rounded-lg text-white text-sm placeholder:text-[#444444] focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/10 transition-all'
                            placeholder='Alex Johnson'
                            value={formData.name}
                            onChange={(e) => setformData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label className='text-[13px] font-medium text-[#888888]'>Username</label>
                        <input
                            type="text"
                            className='w-full px-3.5 py-3 bg-[#171717] border border-white/5 rounded-lg text-white text-sm placeholder:text-[#444444] focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/10 transition-all'
                            placeholder='alex_j'
                            value={formData.username}
                            onChange={(e) => setformData({ ...formData, username: e.target.value })}
                            required
                        />
                    </div>

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
                        <label className='text-[13px] font-medium text-[#888888]'>Password</label>
                        <input
                            type="password"
                            className='w-full px-3.5 py-3 bg-[#171717] border border-white/5 rounded-lg text-white text-sm placeholder:text-[#444444] focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/10 transition-all font-sans'
                            placeholder='••••••••'
                            value={formData.password}
                            onChange={(e) => setformData({ ...formData, password: e.target.value })}
                            required
                        />
                        <p className='text-[12px] text-[#555555] mt-0.5'>Minimum 8 characters</p>
                    </div>

                    <button
                        type="submit"
                        className='w-full mt-3 bg-[#ededed] hover:bg-white text-[#111111] font-semibold py-3 rounded-lg transition-colors text-[14px] shadow-sm cursor-pointer'
                    >
                        {loading ? "Creating account..." : "Create account"}
                    </button>
                    {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
                    {success && <p className='text-green-500 text-sm mt-2'>{success}</p>}
                </form>

                <div className='mt-8 text-center text-[13px]'>
                    <span className='text-[#666666]'>Already have an account? </span>
                    <Link href="/login" className='text-[#e2a868] hover:text-[#f3b979] transition-colors font-medium'>Sign in</Link>
                </div>

                <div className='mt-6 text-center'>
                    <p className='text-[12px] text-[#444444] leading-relaxed w-[200px] mx-auto'>
                        By signing up you agree to our Terms and Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    )
}

export default page