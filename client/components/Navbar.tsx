import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (
   <div className='w-full h-15 fixed top-0 border-b border-b-gray-700 flex justify-between p-2 items-center'>
    <h1 className='text-2xl font-bold m-5'>Kōl</h1>
    <div className='flex gap-5 items-center'>
        <Link href={"#"} className='font-semibold'>About</Link>
        <Link href={"/login"} className='font-semibold'>Login</Link>
        <Link href={"/signup"} className='bg-white text-black p-2 px-4 rounded-2xl font-semibold'>Signup</Link>
    </div>
   </div>
  )
}

export default Navbar