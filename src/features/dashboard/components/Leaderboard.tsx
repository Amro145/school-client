'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Trophy,
    TrendingUp,
    GraduationCap,
    ArrowRight
} from 'lucide-react';
import { Student } from '@shared/types/models';

interface LeaderboardProps {
    topStudents: Student[];
}

export default function Leaderboard({ topStudents }: LeaderboardProps) {
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={itemVariants}
            className="lg:col-span-2  dark:bg-slate-950 p-10 rounded-[56px] border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.02)] glass"
        >
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 rounded-3xl flex items-center justify-center text-amber-500 shadow-inner">
                        <Trophy className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-2">Academic Leaderboard</h2>
                        <p className="text-sm font-medium text-slate-400 dark:text-slate-500 tracking-wider">Top Performing Intelligence Nodes</p>
                    </div>
                </div>
                <div className="hidden sm:flex items-center px-6 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl">
                    <TrendingUp className="w-4 h-4 text-emerald-500 mr-3" />
                    <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Global Algorithm: Success Rate</span>
                </div>
            </div>

            <div className="space-y-4">
                {topStudents.map((student, idx) => (
                    <motion.div
                        key={student.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 + 0.5 }}
                        className="group flex items-center justify-between p-6 bg-slate-50/50 dark:bg-slate-800/30 rounded-[32px] hover: dark:hover:bg-slate-800 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-500 border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
                    >
                        <div className="flex items-center space-x-6">
                            <div className="relative">
                                <div className="w-14 h-14 rounded-2xl  dark:bg-slate-900 flex items-center justify-center border border-slate-100 dark:border-slate-800 text-xl font-black text-blue-600 dark:text-blue-400 shadow-sm group-hover:rotate-6 transition-transform">
                                    {student.userName.charAt(0)}
                                </div>
                                <div className={`absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black shadow-lg ${idx === 0 ? 'bg-amber-400 text-amber-900' :
                                    idx === 1 ? 'bg-slate-300 text-slate-700' :
                                        idx === 2 ? 'bg-orange-400 text-orange-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                                    }`}>
                                    #{idx + 1}
                                </div>
                            </div>
                            <div>
                                <Link href={`/students/${student.id}`}>
                                    <h4 className="text-xl font-black text-slate-900 dark:text-white leading-none mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer capitalize">{student.userName}</h4>
                                </Link>
                                <div className="flex items-center space-x-2">
                                    <span className="text-[10px] bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md font-black uppercase tracking-widest">Verified Performance</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right flex items-center space-x-8">
                            <div className="hidden md:block text-right">
                                <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1.5">Efficiency Score</div>
                                <div className="text-xl font-black text-slate-900 dark:text-white tabular-nums">{Number((student.averageScore ?? 0).toFixed(1))}%</div>
                            </div>
                            <Link href={`/students/${student.id}`} className="p-3  dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-900/50 transition-all active:scale-90">
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </motion.div>
                ))}
                {topStudents.length === 0 && (
                    <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/20 rounded-[48px] border-2 border-dashed border-slate-200 dark:border-slate-800/50">
                        <GraduationCap className="w-16 h-16 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
                        <p className="text-slate-400 dark:text-slate-500 font-bold italic">Awaiting Academic Performance Data streams...</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
