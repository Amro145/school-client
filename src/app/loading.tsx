'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function Loading() {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background z-100 fixed inset-0">
            <div className="relative">
                {/* Outer Ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="w-20 h-20 rounded-full border-4 border-blue-100 border-t-blue-600 dark:border-slate-800 dark:border-t-blue-500"
                />

                {/* Inner Ring */}
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="absolute inset-0 m-auto w-12 h-12 rounded-full border-4 border-purple-100 border-t-purple-600 dark:border-slate-800 dark:border-t-purple-500"
                />

                {/* Center Dot */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="absolute inset-0 m-auto w-4 h-4 bg-linear-to-r from-blue-600 to-purple-600 rounded-full shadow-lg shadow-blue-500/50"
                />
            </div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                className="mt-8 text-sm font-black text-slate-400 uppercase tracking-[0.2em]"
            >
                Loading System
            </motion.p>
        </div>
    );
}
