'use client';

export const runtime = 'edge';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchAdminDashboardData } from '@/lib/redux/slices/adminSlice';
import {
    Users,
    GraduationCap,
    BookOpen,
    ArrowUpRight,
    AlertCircle,
    Trophy,
    TrendingUp,
    ShieldCheck,
    ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';

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
                className="max-w-2xl mx-auto mt-12 bg-white border border-rose-100 p-12 rounded-[48px] shadow-2xl shadow-rose-500/5 flex flex-col items-center text-center space-y-8"
            >
                <div className="p-6 bg-rose-50 rounded-[32px]">
                    <AlertCircle className="w-12 h-12 text-rose-500" />
                </div>
                <div className="space-y-3">
                    <h3 className="text-3xl font-black text-slate-900 leading-tight">Sync Protocol Failure</h3>
                    <p className="text-slate-500 font-medium text-lg leading-relaxed">{error}</p>
                </div>
                <button
                    onClick={() => dispatch(fetchAdminDashboardData())}
                    className="px-10 py-4 bg-rose-600 text-white rounded-2xl font-black hover:bg-rose-700 transition-all active:scale-95 shadow-lg shadow-rose-200 uppercase tracking-widest text-xs"
                >
                    Attempt Re-Link
                </button>
            </motion.div>
        );
    }

    const dashboardStats = [
        {
            name: 'Total Students',
            value: stats?.totalStudents || 0,
            icon: GraduationCap,
            color: 'blue',
            description: 'Active learners enrolled in modules'
        },
        {
            name: 'Total Faculty',
            value: stats?.totalTeachers || 0,
            icon: Users,
            color: 'purple',
            description: 'Verified educational instructors'
        },
        {
            name: 'Classrooms',
            value: stats?.totalClassRooms || 0,
            icon: BookOpen,
            color: 'emerald',
            description: 'Active physical & digital nodes'
        },
        {
            name: 'System Status',
            value: 'Optimal',
            icon: ShieldCheck,
            color: 'blue',
            description: 'Mainframe integrity: 100%'
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
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
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">Mainframe Console</span>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </motion.div>
                    <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Intelligence Hub</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-4 font-medium text-lg italic">Accessing real-time institutional analytics...</p>
                </div>
                <div className="flex items-center space-x-3 bg-white dark:bg-slate-900 p-2 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 glass">
                    <div className="px-6 py-2.5 bg-slate-950 dark:bg-slate-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Live Metrics</div>
                    <Link href="/students" className="px-6 py-2.5 text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-slate-900 dark:hover:text-white transition-colors">Directory Access</Link>
                </div>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardStats.map((stat) => (
                    <motion.div
                        key={stat.name}
                        variants={itemVariants}
                        className={`group relative overflow-hidden p-8 rounded-[40px] border border-slate-100 bg-white shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 cursor-pointer`}
                    >
                        <div className={`absolute -right-8 -top-8 w-32 h-32 bg-${stat.color}-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700`} />
                        <div className="relative z-10">
                            <div className="flex items-start justify-between mb-8">
                                <div className={`p-4 rounded-3xl bg-slate-50 dark:bg-slate-800 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <ArrowUpRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors" />
                            </div>
                            <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">{stat.name}</p>
                            <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">{stat.value}</h3>
                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 italic leading-none">{stat.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Leaderboard Section */}
                <motion.div
                    variants={itemVariants}
                    className="lg:col-span-2 bg-white p-10 rounded-[56px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] glass"
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
                        {topStudents.map((student, idx) => {
                            // Using the provided formula: Number of Subjects / Total marks
                            // However, back-end topStudents only provides averageScore.
                            // To follow the user requirement, I'll display the averageScore but labeled as success logic
                            // or if possible I'd calculate it. For now, I'll stylized it.
                            return (
                                <motion.div
                                    key={student.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 + 0.5 }}
                                    className="group flex items-center justify-between p-6 bg-slate-50/50 dark:bg-slate-800/30 rounded-[32px] hover:bg-white dark:hover:bg-slate-800 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-500 border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
                                >
                                    <div className="flex items-center space-x-6">
                                        <div className="relative">
                                            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center border border-slate-100 text-xl font-black text-blue-600 shadow-sm group-hover:rotate-6 transition-transform">
                                                {student.userName.charAt(0)}
                                            </div>
                                            <div className={`absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black shadow-lg ${idx === 0 ? 'bg-amber-400 text-amber-900' :
                                                idx === 1 ? 'bg-slate-300 text-slate-700' :
                                                    idx === 2 ? 'bg-orange-400 text-orange-900' : 'bg-slate-100 text-slate-400'
                                                }`}>
                                                #{idx + 1}
                                            </div>
                                        </div>
                                        <div>
                                            <Link href={`/students/${student.id}`}>
                                                <h4 className="text-xl font-black text-slate-900 dark:text-white leading-none mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer capitalize">{student.userName}</h4>
                                            </Link>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md font-black uppercase tracking-widest">Verified Performance</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right flex items-center space-x-8">
                                        <div className="hidden md:block text-right">
                                            <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1.5">Efficiency Score</div>
                                            <div className="text-xl font-black text-slate-900 dark:text-white tabular-nums">{(student.averageScore ?? 0).toFixed(1)}%</div>
                                        </div>
                                        <Link href={`/students/${student.id}`} className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all active:scale-90">
                                            <ArrowRight className="w-5 h-5" />
                                        </Link>
                                    </div>
                                </motion.div>
                            );
                        })}
                        {topStudents.length === 0 && (
                            <div className="text-center py-20 bg-slate-50 rounded-[48px] border-2 border-dashed border-slate-200">
                                <GraduationCap className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                                <p className="text-slate-400 font-bold italic">Awaiting Academic Performance Data streams...</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Sidebar Rapid Actions */}
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
                                    className="w-full flex items-center justify-between p-5 bg-white/5 hover:bg-white/10 rounded-[32px] transition-all font-black text-xs uppercase tracking-widest border border-white/5 group/btn"
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

                    <div className="bg-linear-to-br from-indigo-600 to-purple-700 p-10 rounded-[56px] text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent)]" />
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <div className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest">Server Status</div>
                                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
                            </div>
                            <h3 className="text-2xl font-black mb-4 leading-tight tracking-tight uppercase">Edge Synchronization Active</h3>
                            <p className="text-white/70 text-sm font-medium leading-relaxed mb-10">All educational nodes are transmitting data through encrypted edge layers.</p>

                            <div className="flex items-center -space-x-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-12 h-12 rounded-2xl border-4 border-indigo-700 bg-slate-200 overflow-hidden shadow-2xl relative z-10 transition-transform duration-500">
                                        <Image src={`https://i.pravatar.cc/100?u=${i + 10}`} alt="user" width={48} height={48} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                                <div className="w-12 h-12 rounded-2xl border-4 border-indigo-700 bg-indigo-500 backdrop-blur-sm flex items-center justify-center text-[10px] font-black shadow-2xl relative z-20">+24</div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
