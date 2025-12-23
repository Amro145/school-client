'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchAdminDashboardData } from '@/lib/redux/slices/adminSlice';
import {
    Users,
    GraduationCap,
    BookOpen,
    BarChart3,
    ArrowUpRight,
    Loader2,
    AlertCircle
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { stats, topStudents, loading, error } = useSelector((state: RootState) => state.admin);
    const { user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (user?.role === 'teacher') {
            router.push('/admin/teacher');
        } else {
            dispatch(fetchAdminDashboardData());
        }
    }, [dispatch, user, router]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <p className="text-slate-500 font-medium italic">Loading dashboard intelligence...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-100 p-8 rounded-3xl flex items-start space-x-4">
                <div className="p-3 bg-red-100 rounded-2xl">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-red-900">Connection Failed</h3>
                    <p className="text-red-700 mt-1">{error}</p>
                    <button
                        onClick={() => dispatch(fetchAdminDashboardData())}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition"
                    >
                        Retry Connection
                    </button>
                </div>
            </div>
        );
    }

    const dashboardStats = [
        {
            name: 'Total Students',
            value: stats?.totalStudents || 0,
            icon: GraduationCap,
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600'
        },
        {
            name: 'Total Teachers',
            value: stats?.totalTeachers || 0,
            icon: Users,
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600'
        },
        {
            name: 'Total Classes',
            value: stats?.totalClassRooms || 0,
            icon: BookOpen,
            bgColor: 'bg-green-50',
            textColor: 'text-green-600'
        },
        {
            name: 'Academic Status',
            value: 'Optimal',
            icon: BarChart3,
            bgColor: 'bg-orange-50',
            textColor: 'text-orange-600'
        },
    ];

    return (
        <div className="space-y-12 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Intelligence Hub</h1>
                    <p className="text-slate-500 mt-3 font-medium text-lg italic">Accessing real-time institutional analytics...</p>
                </div>
                <div className="flex items-center space-x-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                    <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-black uppercase tracking-widest">Global Overview</div>
                    <Link href="/admin/students" className="px-4 py-2 text-slate-400 text-xs font-black uppercase tracking-widest hover:text-slate-600 cursor-pointer transition-colors">Directory</Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {dashboardStats.map((stat, idx) => (
                    <div
                        key={stat.name}
                        className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden"
                        style={{ animationDelay: `${idx * 100}ms` }}
                    >
                        <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bgColor.replace('50', '500')}/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700`} />
                        <div className="flex items-start justify-between mb-8 relative z-10">
                            <div className={`p-4 rounded-3xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
                                <stat.icon className={`w-8 h-8 ${stat.textColor}`} />
                            </div>
                        </div>
                        <div className="relative z-10">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{stat.name}</p>
                            <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 bg-white p-10 rounded-[48px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">الطلاب المتفوقين</h2>
                            <p className="text-sm font-medium text-slate-400 mt-1">Top Performing Students Breakdown</p>
                        </div>
                        <Link href="/admin/students" className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all border border-slate-200/50">
                            <ArrowUpRight className="w-5 h-5 text-slate-400" />
                        </Link>
                    </div>
                    <div className="space-y-6">
                        {topStudents.map((student) => (
                            <div key={student.id} className="group flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 border border-transparent hover:border-slate-100 cursor-pointer">
                                <div className="flex items-center space-x-6">
                                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center border border-slate-100 text-xl font-black text-blue-600 shadow-sm group-hover:rotate-6 transition-transform">
                                        {student.userName.charAt(0)}
                                    </div>
                                    <div>
                                        <Link href={`/admin/students/${student.id}`}>
                                            <h4 className="text-lg font-black text-slate-900 leading-none mb-1 hover:text-blue-600 transition-colors cursor-pointer">{student.userName}</h4>
                                        </Link>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Academic Excellence</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-black text-slate-900">Avg. Score</div>
                                    <div className="mt-1 flex items-center justify-end">
                                        <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden mr-3">
                                            <div
                                                className="h-full bg-blue-600 rounded-full"
                                                style={{ width: `${student.averageScore || 0}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-black text-blue-600">{Math.round(student.averageScore || 0)}%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {topStudents.length === 0 && (
                            <div className="text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                                <GraduationCap className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                <p className="text-slate-400 font-bold italic">Awaiting Academic Performance Data</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-slate-900 p-10 rounded-[48px] text-white relative overflow-hidden group shadow-2xl">
                        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-blue-500/20 rounded-full blur-[80px] group-hover:bg-blue-500/30 transition-all duration-1000"></div>
                        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px]"></div>

                        <h2 className="text-2xl font-black mb-10 relative z-10 tracking-tight">Rapid Actions</h2>
                        <div className="space-y-4 relative z-10">
                            {[
                                { label: 'Enroll Student', href: '/admin/students/new', color: 'bg-white/5 hover:bg-white/10' },
                                { label: 'Register Teacher', href: '/admin/teachers/new', color: 'bg-white/5 hover:bg-white/10' },
                                { label: 'New Classroom', href: '/admin/classes/new', color: 'bg-white/5 hover:bg-white/10' }
                            ].map((btn) => (
                                <Link key={btn.label} href={btn.href} className={`w-full flex items-center justify-between p-5 ${btn.color} rounded-x-3xl rounded-[24px] transition-all font-bold text-sm backdrop-blur-md border border-white/5 group/btn`}>
                                    {btn.label} <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover/btn:text-white group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-all" />
                                </Link>
                            ))}
                            <button
                                onClick={() => window.print()}
                                className="w-full flex items-center justify-center p-6 bg-blue-600 hover:bg-blue-500 rounded-[28px] transition-all font-black text-sm shadow-xl shadow-blue-500/40 mt-6 active:scale-95"
                            >
                                GENERATE SYSTEM REPORT
                            </button>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-10 rounded-[48px] text-white shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-xl font-black mb-2 leading-tight tracking-tight">System Status</h3>
                            <p className="text-white/70 text-sm font-medium mb-8 leading-relaxed">All modules are operating within normal educational parameters.</p>
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-4 border-indigo-600 bg-slate-200 overflow-hidden shadow-lg relative">
                                        <Image src={`https://i.pravatar.cc/100?u=${i}`} alt="user" width={40} height={40} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                                <div className="w-10 h-10 rounded-full border-4 border-indigo-600 bg-white/20 backdrop-blur-sm flex items-center justify-center text-[10px] font-black">+12</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
