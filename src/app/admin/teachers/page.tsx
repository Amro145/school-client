'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchMyTeachers } from '@/lib/redux/slices/adminSlice';
import {
    Plus,
    Mail,

    Loader2,
    AlertCircle,
    UserCircle,
    GraduationCap,
    Users,
    Trash2,
    Eye
} from 'lucide-react';
import Link from 'next/link';

export const runtime = 'edge';

export default function TeachersListPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { teachers, loading, error } = useSelector((state: RootState) => state.admin);

    useEffect(() => {
        dispatch(fetchMyTeachers());
    }, [dispatch]);

    if (loading && teachers.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <p className="text-slate-500 font-medium italic">Retrieving faculty records...</p>
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
                    <h3 className="text-lg font-bold text-red-900">Sync Error</h3>
                    <p className="text-red-700 mt-1">{error}</p>
                    <button
                        onClick={() => dispatch(fetchMyTeachers())}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition"
                    >
                        Retry Sync
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Faculty Registry</h1>
                    <p className="text-slate-500 mt-3 font-medium text-lg italic">Overseeing academic expertise and teaching staff...</p>
                </div>
                <Link
                    href="/admin/teachers/new"
                    className="relative group overflow-hidden"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-purple-600 text-white px-8 py-4 rounded-xl font-black text-sm hover:bg-purple-700 transition-all flex items-center justify-center shadow-lg active:scale-95 uppercase tracking-widest leading-none">
                        <Plus className="w-5 h-5 mr-3" /> Register New Faculty
                    </div>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {teachers?.map((teacher, idx) => (
                    <div
                        key={teacher.id}
                        className="bg-white rounded-[40px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_48px_96px_-16px_rgba(0,0,0,0.1)] transition-all duration-700 group overflow-hidden flex flex-col"
                        style={{ animationDelay: `${idx * 150}ms` }}
                    >
                        <div className="p-10 flex-1">
                            <div className="flex items-start justify-between mb-10">
                                <div className="flex items-center space-x-5">
                                    <div className="relative">
                                        <div className="w-20 h-20 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-[28px] flex items-center justify-center text-purple-600 shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-transform duration-700">
                                            <UserCircle className="w-12 h-12" />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full shadow-lg shadow-green-500/20" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-purple-600 transition-colors">{teacher.userName}</h3>
                                        <div className="flex items-center space-x-2 mt-1.5">
                                            <span className="text-[10px] bg-slate-100 text-slate-500 px-2.5 py-1 rounded-lg font-black uppercase tracking-widest">ID: {teacher.id}</span>
                                            <span className="text-[10px] bg-purple-50 text-purple-600 px-2.5 py-1 rounded-lg font-black uppercase tracking-widest">FACULTY</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 mb-10 bg-slate-50/50 p-6 rounded-3xl border border-slate-100/50">
                                <div className="flex items-center text-slate-600 font-bold text-sm">
                                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center mr-4 group-hover:bg-purple-100 group-hover:border-purple-200 transition-colors">
                                        <Mail className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
                                    </div>
                                    {teacher.email}
                                </div>
                                <div className="flex items-center text-slate-600 font-bold text-sm">
                                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center mr-4 group-hover:bg-purple-100 group-hover:border-purple-200 transition-colors">
                                        <GraduationCap className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
                                    </div>
                                    <span className="text-slate-900 mr-2">{teacher.subjectsTaught.length}</span> Specializations
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Academic Expertise</h4>
                                    <div className="h-0.5 grow mx-4 bg-slate-100 rounded-full" />
                                </div>
                                <div className="flex flex-wrap gap-2.5">
                                    {teacher.subjectsTaught.length > 0 ? (
                                        teacher.subjectsTaught.map((subject) => {
                                            const avgGrade = subject.grades.length > 0
                                                ? Math.round(subject.grades.reduce((acc, g) => acc + g.score, 0) / subject.grades.length)
                                                : null;

                                            return (
                                                <div key={subject.id} className="bg-white border border-slate-100 px-4 py-2.5 rounded-2xl flex items-center group/tag hover:border-purple-200 hover:shadow-lg hover:shadow-purple-100 transition-all duration-300">
                                                    <span className="text-sm font-black text-slate-700 group-hover/tag:text-purple-700">{subject.name}</span>
                                                    {avgGrade !== null && (
                                                        <span className="ml-3 text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-lg font-black border border-green-100/50">
                                                            {avgGrade}% AVG
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="w-full py-4 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100">
                                            <p className="text-xs text-slate-400 font-black italic uppercase tracking-widest">Awaiting Assignment</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between glass">
                            <button className="text-[10px] font-black text-slate-900 uppercase tracking-widest hover:text-purple-600 px-6 py-3 bg-white rounded-xl border border-slate-200/50 shadow-sm transition-all hover:shadow-lg active:scale-95">Detailed Profile</button>
                            <div className="flex items-center space-x-2">
                                <Link href={`/admin/teachers/${teacher.id}`} className="p-3 text-slate-400 hover:text-blue-500 hover:bg-white rounded-xl transition-all"><Eye className="w-5 h-5" /></Link>
                                <button className="p-3 text-slate-400 hover:text-red-500 hover:bg-white rounded-xl transition-all"><Trash2 className="w-5 h-5" /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {teachers.length === 0 && !loading && (
                <div className="p-32 text-center bg-white rounded-[64px] border-4 border-dashed border-slate-100 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-50 rounded-full blur-[100px] opacity-50 group-hover:scale-150 transition-transform duration-1000" />
                    <div className="relative z-10">
                        <div className="w-32 h-32 bg-slate-50 rounded-[48px] flex items-center justify-center mx-auto mb-10 shadow-inner group-hover:rotate-12 transition-transform duration-500">
                            <Users className="w-16 h-16 text-slate-200" />
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-4">No Faculty Detected</h3>
                        <p className="text-slate-500 max-w-sm mx-auto font-medium text-lg leading-relaxed mb-10 italic">The institutional registry is currently awaiting initial faculty member onboarding.</p>
                        <Link
                            href="/admin/teachers/new"
                            className="inline-flex items-center justify-center bg-slate-900 text-white px-12 py-5 rounded-[24px] font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl hover:-translate-y-1 active:scale-95"
                        >
                            Register First Faculty Member
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
