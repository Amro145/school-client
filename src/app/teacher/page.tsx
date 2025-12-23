'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchMe } from '@/lib/redux/slices/authSlice';
import Link from 'next/link';
import {
    BookOpen,
    Users,
    ArrowUpRight,
    Loader2
} from 'lucide-react';

export default function TeacherSubjectOverview() {
    const dispatch = useDispatch<AppDispatch>();
    const { user, loading } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        dispatch(fetchMe());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <p className="text-slate-500 font-medium italic">Synchronizing academic data...</p>
            </div>
        );
    }

    const subjects = user?.subjectsTaught || [];

    return (
        <div className="space-y-12 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Teacher Portal</h1>
                    <p className="text-slate-500 mt-3 font-medium text-lg italic">Welcome back, {user?.userName}. Here are the subjects you teach.</p>
                </div>
                <div className="flex items-center space-x-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                    <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-black uppercase tracking-widest">Active Curriculum</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {subjects.map((subject) => (
                    <Link
                        key={subject.id}
                        href={`/admin/teacher/subject/${subject.id}`}
                        className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_32px_64px_-16px_rgba(37,99,235,0.1)] hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />

                        <div className="flex items-start justify-between mb-8 relative z-10">
                            <div className="p-4 rounded-3xl bg-blue-50 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                                <BookOpen className="w-8 h-8 text-blue-600" />
                            </div>
                            <div className="p-3 bg-slate-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowUpRight className="w-5 h-5 text-slate-400" />
                            </div>
                        </div>

                        <div className="relative z-10 space-y-4">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tighter group-hover:text-blue-600 transition-colors uppercase italic">{subject.name}</h3>
                                <p className="text-sm font-bold text-slate-400 mt-1 flex items-center">
                                    <Users className="w-4 h-4 mr-2" />
                                    {subject.class?.name || 'Assigned Class'}
                                </p>
                            </div>

                            <div className="pt-6 border-t border-slate-50">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject Success Rate</span>
                                    <span className={`text-xs font-black ${subject.successRate >= 75 ? 'text-green-600' : subject.successRate >= 50 ? 'text-blue-600' : 'text-amber-600'}`}>
                                        {Math.round(subject.successRate)}%
                                    </span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-1000 ${subject.successRate >= 75 ? 'bg-green-500' : subject.successRate >= 50 ? 'bg-blue-600' : 'bg-amber-500'}`}
                                        style={{ width: `${subject.successRate}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}

                {subjects.length === 0 && !loading && (
                    <div className="col-span-full py-20 bg-slate-50 rounded-[48px] border-2 border-dashed border-slate-200 text-center">
                        <Loader2 className="w-12 h-12 text-slate-300 mx-auto mb-4 animate-pulse" />
                        <p className="text-slate-400 font-bold italic">No subjects matching your profile found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
