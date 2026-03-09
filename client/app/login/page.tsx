import React from 'react'
import Link from 'next/link'

const page = () => {
    return (
        <div className='min-h-screen w-full bg-[#0a0a0a] flex flex-col items-center justify-center p-4 font-sans selection:bg-white/10'>
            <div className='mb-8'>
                <h1 className='text-[22px] font-bold text-white tracking-wide'>Kōl</h1>
            </div>

            <div className='w-full max-w-[400px] bg-[#111111] p-8 rounded-[20px] border border-white/5 shadow-2xl'>
                <div className='mb-8'>
                    <h2 className='text-2xl font-bold text-white mb-2 tracking-tight'>Welcome back</h2>
                    <p className='text-[#888888] text-[14px]'>Enter your details to sign in to your account</p>
                </div>

                <form className='flex flex-col gap-5'>
                    <div className='flex flex-col gap-2'>
                        <label className='text-[13px] font-medium text-[#888888]'>Email</label>
                        <input
                            type="email"
                            className='w-full px-3.5 py-3 bg-[#171717] border border-white/5 rounded-lg text-white text-sm placeholder:text-[#444444] focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/10 transition-all'
                            placeholder='you@example.com'
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
                        />
                        <Link href="/forgot-password" className='text-[12px] text-[#e2a868] hover:text-[#f3b979] transition-colors'>Forgot password?</Link>
                    </div>

                    <button
                        type="submit"
                        className='w-full mt-3 bg-[#ededed] hover:bg-white text-[#111111] font-semibold py-3 rounded-lg transition-colors text-[14px] shadow-sm'
                    >
                        Sign in
                    </button>
                </form>

                <div className='mt-8 text-center text-[13px]'>
                    <span className='text-[#666666]'>Don't have an account? </span>
                    <Link href="/signup" className='text-[#e2a868] hover:text-[#f3b979] transition-colors font-medium'>Sign up</Link>
                </div>
            </div>
        </div>
    )
}

export default page