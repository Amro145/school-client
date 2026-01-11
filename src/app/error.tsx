'use client'; // Error components must be Client Components

import React, { useEffect } from 'react';
import { AlertCircle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export const runtime = 'edge';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
            {/* Background Decorations */}
            <div className="absolute top-1/4 -left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg relative z-10"
            >
                <div className="glass rounded-3xl p-8 md:p-12 shadow-2xl border border-[var(--border)] text-center relative overflow-hidden group">
                    
                     {/* Decorative top accent */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-orange-500 to-red-500" />
                    
                    <motion.div 
                         initial={{ y: -20, opacity: 0 }}
                         animate={{ y: 0, opacity: 1 }}
                         transition={{ delay: 0.2 }}
                         className="flex justify-center mb-8"
                    >
                        <div className="w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center relative">
                            <AlertCircle className="w-12 h-12 text-red-500" />
                            <div className="absolute inset-0 rounded-full border-2 border-red-500/20 animate-ping" />
                        </div>
                    </motion.div>

                    <motion.h2 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl font-black mb-4 tracking-tight"
                    >
                        Something went wrong!
                    </motion.h2>

                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-[var(--muted-foreground)] font-medium text-lg mb-8 leading-relaxed"
                    >
                        We encountered an unexpected error while processing your request. Our team has been notified.
                    </motion.p>
                    
                    {error.digest && (
                         <p className="text-xs text-[var(--muted-foreground)] mb-6 font-mono bg-[var(--muted)] py-2 px-4 rounded-lg inline-block">
                            Error ID: {error.digest}
                         </p>
                    )}

                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <button
                            onClick={reset}
                            className="flex items-center justify-center px-6 py-4 bg-[var(--foreground)] text-[var(--background)] rounded-xl font-bold hover:opacity-90 transition-all transform active:scale-95 shadow-lg group-hover:shadow-xl"
                        >
                            <RefreshCw className="w-5 h-5 mr-2" />
                            Try Again
                        </button>
                        
                        <Link 
                            href="/"
                            className="flex items-center justify-center px-6 py-4 bg-[var(--muted)] text-[var(--foreground)] rounded-xl font-bold hover:bg-[var(--accent)] transition-all transform active:scale-95"
                        >
                            <Home className="w-5 h-5 mr-2" />
                            Back Home
                        </Link>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
