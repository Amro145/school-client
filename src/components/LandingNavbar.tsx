'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GraduationCap, Menu, X } from 'lucide-react';

export default function LandingNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between relative z-50">
            <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <GraduationCap className="text-white w-6 h-6" />
                </div>
                <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">EDUDASH</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
                <Link href="#features" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</Link>
                <Link href="#about" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</Link>
                <Link href="/login" className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full text-sm font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-all shadow-lg hover:shadow-slate-200 dark:hover:shadow-slate-800">Get Started</Link>
            </div>

            {/* Mobile Nav Toggle */}
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-slate-600 dark:text-slate-400 focus:outline-none"
                aria-label="Toggle Menu"
            >
                {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>

            {/* Mobile Nav Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 bg-white dark:bg-slate-950 z-40 md:hidden flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in duration-300">
                    <Link href="#features" onClick={() => setIsMenuOpen(false)} className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Features</Link>
                    <Link href="#about" onClick={() => setIsMenuOpen(false)} className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">About</Link>
                    <Link href="/login" onClick={() => setIsMenuOpen(false)} className="px-12 py-4 bg-blue-600 text-white rounded-2xl text-lg font-black uppercase tracking-widest shadow-xl shadow-blue-500/25">Get Started</Link>
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className="mt-8 p-4 bg-slate-100 dark:bg-slate-800 rounded-full"
                    >
                        <X className="w-6 h-6 text-slate-500" />
                    </button>
                </div>
            )}
        </nav>
    );
}
