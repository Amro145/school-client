'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Users,
    GraduationCap,
    BookOpen,
    TrendingUp,
    ArrowRight
} from 'lucide-react';

export default function QuickActions() {
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div variants={itemVariants} className="space-y-8">
            <div className="bg-slate-950 p-10 rounded-[56px] text-white overflow-hidden relative group shadow-2xl">
                <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] group-hover:bg-blue-600/30 transition-all duration-1000"></div>

                <h2 className="text-2xl font-black mb-10 relative z-10 tracking-tight flex items-center uppercase">
                    <TrendingUp className="w-6 h-6 mr-3 text-blue-500" />
                    Operational
                </h2>

                <div className="space-y-4 relative z-10">
                    {[
                        { label: 'Enroll Student', href: '/admin/users/new?role=student', icon: GraduationCap },
                        { label: 'Register Teacher', href: '/admin/users/new?role=teacher', icon: Users },
                        { label: 'New Classroom', href: '/admin/classes/new', icon: BookOpen }
                    ].map((btn) => (
                        <Link
                            key={btn.label}
                            href={btn.href}
                            className="w-full flex items-center justify-between p-5 /5 hover:/10 rounded-[32px] transition-all font-black text-xs uppercase tracking-widest border border-white/5 group/btn"
                        >
                            <div className="flex items-center">
                                <btn.icon className="w-4 h-4 mr-4 text-blue-500" />
                                {btn.label}
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-600 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all" />
                        </Link>
                    ))}
                    <button
                        onClick={() => window.print()}
                        className="w-full flex items-center justify-center p-6 bg-blue-600 hover:bg-blue-500 rounded-[32px] transition-all font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/40 mt-6 active:scale-95"
                    >
                        Generate Insight Report
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
