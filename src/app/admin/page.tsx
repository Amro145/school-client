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
    TrendingUp,
    ArrowUpRight,
    Loader2,
    AlertCircle
} from 'lucide-react';

export default function AdminDashboard() {
    const dispatch = useDispatch<AppDispatch>();
    const { stats, subjects, loading, error } = useSelector((state: RootState) => state.admin);

    useEffect(() => {
        dispatch(fetchAdminDashboardData());
    }, [dispatch]);

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
            name: 'Registered Subjects',
            value: subjects?.length || 0,
            icon: BarChart3,
            bgColor: 'bg-orange-50',
            textColor: 'text-orange-600'
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
                <p className="text-slate-500 mt-2 font-medium">Welcome back, Administrator. Here&apos;s your real-time school analytics.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardStats.map((stat) => (
                    <div key={stat.name} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-2xl ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                            </div>
                            <div className="flex items-center text-green-600 text-sm font-bold bg-green-50 px-2 py-1 rounded-lg">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                LIVE
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{stat.name}</p>
                            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-900">School Subjects & Performance</h2>
                        <button className="text-blue-600 text-sm font-bold hover:underline">View All</button>
                    </div>
                    <div className="space-y-4">
                        {subjects.map((subject) => (
                            <div key={subject.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-slate-100 text-lg font-bold text-blue-600 shadow-sm">
                                        {subject.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">{subject.name}</h4>
                                        <p className="text-xs text-slate-500 font-medium uppercase tracking-tight">Active Curriculum</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-slate-900">{subject.grades.length} Grades Recorded</div>
                                    <div className="text-xs text-slate-400 font-medium">Latest: {subject.grades[0]?.score || 0}%</div>
                                </div>
                            </div>
                        ))}
                        {subjects.length === 0 && (
                            <p className="text-center py-8 text-slate-400 font-medium italic">No subjects found in system.</p>
                        )}
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-3xl text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all"></div>
                    <h2 className="text-xl font-bold mb-6 relative z-10">Quick Management</h2>
                    <div className="space-y-3 relative z-10">
                        <button className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all font-bold text-sm backdrop-blur-md border border-white/10">
                            Enroll New Student <ArrowUpRight className="w-4 h-4" />
                        </button>
                        <button className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all font-bold text-sm backdrop-blur-md border border-white/10">
                            Onboard Faculty <ArrowUpRight className="w-4 h-4" />
                        </button>
                        <button className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all font-bold text-sm backdrop-blur-md border border-white/10">
                            Schedule New Class <ArrowUpRight className="w-4 h-4" />
                        </button>
                        <button className="w-full flex items-center justify-between p-4 bg-blue-600 hover:bg-blue-500 rounded-2xl transition-all font-bold text-sm shadow-lg shadow-blue-500/20 mt-4">
                            System Reports
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
