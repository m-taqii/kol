"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '/about', label: 'About' },
    { href: '/login', label: 'Login' },
  ];

  return (
    <nav className='w-full h-16 fixed top-0 left-0 border-b border-[#2a2a2a] bg-[#0c0c0c]/90 backdrop-blur-md flex justify-between px-6 md:px-12 items-center z-100'>
      {/* Logo */}
      <div className='text-[20px] font-bold tracking-tighter uppercase shrink-0'>
        <Link href="/">
          KŌL<span className='text-[#c4a882]'>.</span>
        </Link>
      </div>

      {/* Desktop Links */}
      <div className='hidden md:flex gap-8 items-center'>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className='text-[13px] font-medium text-[#888888] hover:text-[#ededed] transition-colors uppercase tracking-wider'
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/signup"
          className='bg-[#ededed] text-[#0c0c0c] px-5 py-2 rounded-xl text-[13px] font-bold hover:bg-white transition-all uppercase'
        >
          Get Started
        </Link>
      </div>

      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='md:hidden text-[#ededed] hover:text-[#c4a882] transition-colors p-2 z-200'
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 h-screen w-screen bg-[#0c0c0c] transition-all duration-300 transform ${
          isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        } md:hidden flex flex-col items-center justify-center gap-12 p-8 z-150`}
      >
        <div className='flex flex-col items-center gap-8 w-full'>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className='text-3xl font-bold text-[#888888] hover:text-[#ededed] transition-colors uppercase tracking-[0.2em]'
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/signup"
            onClick={() => setIsOpen(false)}
            className='w-full max-w-xs text-center bg-[#ededed] text-[#0c0c0c] px-8 py-5 rounded-2xl text-xl font-bold hover:bg-white transition-all uppercase shadow-2xl shadow-white/5'
          >
            Get Started
          </Link>
        </div>
        
        <div className='absolute bottom-16 flex flex-col items-center gap-4 opacity-30'>
           <div className='text-xl font-bold tracking-tighter'>KŌL<span className='text-[#c4a882]'>.</span></div>
           <p className='text-[10px] uppercase tracking-[0.4em] font-bold'>The Future of Intelligence</p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;