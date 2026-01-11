'use client';

import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export const runtime = 'edge';

export default function NotFound() {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-[var(--background)] text-[var(--foreground)] overflow-hidden relative">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 translate-y-1/2" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-2xl text-center relative z-10"
            >
                {/* 404 Typography */}
                <h1 className="text-[10rem] sm:text-[14rem] font-black leading-none tracking-tighter text-[var(--accent)] select-none mix-blend-multiply dark:mix-blend-overlay opacity-50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    404
                </h1>

                <div className="relative z-10 space-y-8 glass p-12 rounded-[2.5rem] shadow-2xl border border-[var(--border)] backdrop-blur-md">
                    <div className="flex justify-center">
                        <div className="w-20 h-20 bg-[var(--background)] rounded-2xl flex items-center justify-center shadow-inner border border-[var(--border)] transform rotate-3">
                             <Search className="w-10 h-10 text-[var(--muted-foreground)]" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-[var(--foreground)]">
                            Page Not Found
                        </h2>
                        <p className="text-xl text-[var(--muted-foreground)] font-medium max-w-lg mx-auto leading-relaxed">
                            The academic resource or page you are looking for seems to be missing from our records.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        
                        <button 
                            onClick={() => window.history.back()}
                            className="w-full sm:w-auto px-8 py-4 bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--accent)] rounded-xl font-bold transition-all duration-300 flex items-center justify-center"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Go Back
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
