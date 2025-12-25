'use client';

export const runtime = 'edge';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchAdminDashboardData } from '@/lib/redux/slices/adminSlice';
import {
    ShieldCheck,
    AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import StatsCards from '@/features/dashboard/components/StatsCards';
import Leaderboard from '@/features/dashboard/components/Leaderboard';
import QuickActions from '@/features/dashboard/components/QuickActions';

export default function AdminDashboard() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { stats, topStudents, loading, error } = useSelector((state: RootState) => state.admin);
    const { user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (user?.role === 'teacher') {
            router.push('/admin/teacher');
        } else if (user?.role === 'student') {
            // Student restriction logic will be handled in ProtectedRoute but adding here for safety
            // router.push('/dashboard');
        } else {
            dispatch(fetchAdminDashboardData());
        }
    }, [dispatch, user, router]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative"
                >
                    <div className="w-20 h-20 border-4 border-blue-50 dark:border-blue-900 border-t-blue-600 rounded-full animate-spin"></div>
                    <ShieldCheck className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </motion.div>
                <div className="text-center">
                    <p className="text-slate-900 dark:text-white font-black text-xl tracking-tight">Accessing Mainframe...</p>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1 italic">Decrypting institutional analytics layers...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto mt-12  dark:bg-slate-900 border border-rose-100 dark:border-rose-900/30 p-12 rounded-[48px] shadow-2xl shadow-rose-500/5 flex flex-col items-center text-center space-y-8"
            >
                <div className="p-6 bg-rose-50 dark:bg-rose-900/20 rounded-[32px]">
                    <AlertCircle className="w-12 h-12 text-rose-500" />
                </div>
                <div className="space-y-3">
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">Sync Protocol Failure</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed">{error}</p>
                </div>
                <button
                    onClick={() => dispatch(fetchAdminDashboardData())}
                    className="px-10 py-4 bg-rose-600 text-white rounded-2xl font-black hover:bg-rose-700 transition-all active:scale-95 shadow-lg shadow-rose-200 dark:shadow-rose-900/20 uppercase tracking-widest text-xs"
                >
                    Attempt Re-Link
                </button>
            </motion.div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-12 pb-20"
        >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center space-x-3 mb-3"
                    >
                        <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">Mainframe Console</span>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </motion.div>
                    <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Intelligence Hub</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-4 font-medium text-lg italic">Accessing real-time institutional analytics...</p>
                </div>
                <div className="flex items-center space-x-3  dark:bg-slate-950 p-2 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 glass">
                    <div className="px-6 py-2.5 bg-slate-950 dark:bg-slate-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Live Metrics</div>
                    <Link href="/students" className="px-6 py-2.5 text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-slate-900 dark:hover:text-white transition-colors">Directory Access</Link>
                </div>
            </div>

            {/* Bento Grid Layout - Extracted to StatsCards */}
            <StatsCards stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Leaderboard Section - Extracted to Leaderboard */}
                <Leaderboard topStudents={topStudents} />

                {/* Sidebar Rapid Actions - Extracted to QuickActions */}
                <QuickActions />
            </div>
        </motion.div>
    );
}
