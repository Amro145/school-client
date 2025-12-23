'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeacherById, resetTeacher } from '@/lib/redux/slices/teacherSlice';
import { RootState, AppDispatch } from '@/lib/redux/store';
import Link from 'next/link';
import {
    ArrowLeft,
    Mail,
    BookOpen,
    ArrowRight,
    User,
    Shield,
    GraduationCap,
    Trophy,
    TrendingUp,
    Search,
    AlertCircle
} from 'lucide-react';

export const runtime = 'edge';

export default function TeacherDetailPage() {
    const params = useParams();
    const id = params?.id as string;
    const dispatch = useDispatch<AppDispatch>();
    const { currentTeacher, loading, error } = useSelector((state: RootState) => state.teacher);

    useEffect(() => {
        if (id) {
            dispatch(fetchTeacherById(id));
        }
        return () => {
            dispatch(resetTeacher());
        };
    }, [id, dispatch]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                    <User className="w-8 h-8 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="text-center">
                    <p className="text-slate-900 font-black text-xl tracking-tight animate-pulse">Syncing Faculty Portfolio...</p>
                    <p className="text-slate-500 font-medium text-sm mt-1 italic">Retrieving academic credentials and subject metrics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto mt-12 bg-white border border-rose-100 p-12 rounded-[48px] shadow-2xl shadow-rose-500/5 flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="p-6 bg-rose-50 rounded-[32px]">
                    <AlertCircle className="w-12 h-12 text-rose-500" />
                </div>
                <div className="space-y-3">
                    <h3 className="text-3xl font-black text-slate-900 leading-tight">Faculty Sync Interrupted</h3>
                    <p className="text-slate-500 font-medium text-lg leading-relaxed">{error}</p>
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => dispatch(fetchTeacherById(id))}
                        className="px-10 py-4 bg-rose-600 text-white rounded-2xl font-black hover:bg-rose-700 transition-all active:scale-95 shadow-lg shadow-rose-200 uppercase tracking-widest text-xs"
                    >
                        Re-initialize Sync
                    </button>
                    <Link
                        href="/admin/teachers"
                        className="px-10 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all active:scale-95 uppercase tracking-widest text-xs"
                    >
                        Return to Faculty Index
                    </Link>
                </div>
            </div>
        );
    }

    if (!currentTeacher) return null;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
            <Link
                href="/admin/teachers"
                className="inline-flex items-center space-x-3 px-6 py-3 bg-white border border-slate-100 rounded-2xl text-slate-500 hover:text-indigo-600 hover:border-indigo-100 font-black text-xs uppercase tracking-widest transition-all shadow-sm active:scale-95 group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Faculty Index</span>
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Header Card */}
                <div className="lg:col-span-2 bg-white p-10 rounded-[48px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-10">
                    <div className="flex items-center space-x-8">
                        <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[32px] flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 transform hover:scale-110 hover:rotate-3 transition-transform duration-500">
                            <span className="text-3xl font-black italic">{currentTeacher.userName.substring(0, 2).toUpperCase()}</span>
                        </div>
                        <div>
                            <div className="flex items-center space-x-3 mb-2">
                                <span className="text-[10px] bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-black uppercase tracking-[0.2em]">Validated Profile</span>
                                <span className="text-[10px] bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-black uppercase tracking-[0.2em]">ID: {currentTeacher.id}</span>
                            </div>
                            <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{currentTeacher.userName}</h1>
                            <div className="flex flex-wrap items-center mt-6 gap-6">
                                <div className="flex items-center space-x-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-slate-400">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <span className="text-slate-900 font-black text-sm">{currentTeacher.email}</span>
                                </div>
                                <div className="flex items-center space-x-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-slate-400">
                                        <Shield className="w-4 h-4" />
                                    </div>
                                    <span className="text-slate-900 font-black text-sm uppercase tracking-widest">{currentTeacher.role}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Faculty Stats Cards */}
                <div className="bg-slate-900 p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-150 group-hover:rotate-12 transition-transform duration-1000">
                        <GraduationCap className="w-32 h-32" />
                    </div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Curriculum Scope</span>
                            <div className="flex items-baseline space-x-2 mt-4">
                                <span className="text-6xl font-black tracking-tighter tabular-nums">{currentTeacher.subjectsTaught?.length || 0}</span>
                                <span className="text-2xl font-black text-slate-500 leading-none">Modules</span>
                            </div>
                        </div>
                        <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                                <span className="text-slate-500">Academic Standing</span>
                                <span className="text-indigo-400">Exemplary</span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <div className="w-11/12 h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subjects Led by Teacher */}
            <div className="space-y-12">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Pedagogical Domain</h2>
                        <p className="text-slate-400 font-medium mt-1.5 text-sm uppercase tracking-widest">Managed Subjects & Outcome Tables</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-12">
                    {currentTeacher.subjectsTaught?.map((subject) => (
                        <div key={subject.id} className="bg-white rounded-[56px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden group/card hover:shadow-2xl transition-all duration-700">
                            <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6 glass">
                                <div className="flex items-center space-x-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/10 group-hover/card:scale-110 transition-transform duration-500">
                                        <Trophy className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none group-hover/card:text-indigo-600 transition-colors">{subject.name}</h3>
                                        <div className="flex items-center mt-2 space-x-4">
                                            <span className="text-[10px] bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-black uppercase tracking-widest leading-none">Subject ID: {subject.id}</span>
                                            <span className="text-[10px] bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-black uppercase tracking-widest leading-none">{subject.grades?.length || 0} Evaluations</span>
                                        </div>
                                    </div>
                                </div>
                                <Link
                                    href={`/admin/subjects/${subject.id}`}
                                    className="px-8 py-4 bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center space-x-3"
                                >
                                    <span>Subject Deep-Dive</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>

                            <div className="overflow-x-auto custom-scrollbar">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
                                            <th className="px-12 py-8">Evaluated Learner</th>
                                            <th className="px-12 py-8">Performance Spectrum</th>
                                            <th className="px-12 py-8 text-center">Score Delta</th>
                                            <th className="px-12 py-8 text-right">Integrity Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {subject.grades?.map((grade) => (
                                            <tr key={grade.id} className="hover:bg-slate-50/30 transition-all duration-300 group/row">
                                                <td className="px-12 py-8">
                                                    <div className="flex items-center space-x-6">
                                                        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-300 group-hover/row:bg-indigo-100 group-hover/row:text-indigo-600 transition-all duration-500">
                                                            <User className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <Link href={grade.student ? `/admin/students/${grade.student.id}` : '#'}>
                                                                <span className="block font-black text-slate-900 text-lg leading-none mb-1.5 hover:text-indigo-600 transition-colors cursor-pointer">{grade.student?.userName || 'Anonymous Node'}</span>
                                                            </Link>
                                                            <span className="text-[10px] font-bold text-slate-400 lowercase tracking-tight">{grade.student?.email}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-12 py-8">
                                                    <div className="flex flex-col space-y-3">
                                                        <div className="flex items-center justify-between w-full max-w-[180px]">
                                                            <span className={`text-xl font-black tabular-nums ${grade.score >= 85 ? 'text-emerald-500' : grade.score >= 70 ? 'text-blue-500' : 'text-rose-500'}`}>
                                                                {grade.score}%
                                                            </span>
                                                        </div>
                                                        <div className="w-full max-w-[180px] h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                                            <div
                                                                className={`h-full rounded-full transition-all duration-1000 ${grade.score >= 85 ? 'bg-emerald-500' : grade.score >= 70 ? 'bg-blue-500' : 'bg-rose-500'}`}
                                                                style={{ width: `${grade.score}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-12 py-8 text-center">
                                                    <div className="flex items-center justify-center space-x-2 text-emerald-500 font-black">
                                                        <TrendingUp className="w-4 h-4" />
                                                        <span className="text-sm">+2.4%</span>
                                                    </div>
                                                </td>
                                                <td className="px-12 py-8 text-right">
                                                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest shadow-sm ${grade.score >= 70 ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                                        {grade.score >= 70 ? 'Optimal' : 'Needs Focus'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {(!subject.grades || subject.grades.length === 0) && (
                                <div className="py-20 text-center bg-white">
                                    <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-inner">
                                        <AlertCircle className="w-10 h-10 text-slate-200" />
                                    </div>
                                    <p className="text-slate-400 font-medium italic">Evaluation matrix empty for this module node.</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {(!currentTeacher.subjectsTaught || currentTeacher.subjectsTaught.length === 0) && (
                    <div className="py-32 text-center bg-white rounded-[56px] border border-slate-100 shadow-xl overflow-hidden relative group">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-50 rounded-full blur-[100px] opacity-30 group-hover:scale-150 transition-transform duration-1000" />
                        <div className="relative z-10">
                            <div className="w-32 h-32 bg-slate-50 rounded-[48px] flex items-center justify-center mx-auto mb-10 shadow-inner group-hover:rotate-12 transition-transform duration-500">
                                <Search className="w-16 h-16 text-slate-200" />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-4">No Curriculum Mapping</h3>
                            <p className="text-slate-500 max-w-sm mx-auto font-medium text-lg leading-relaxed mb-10 italic">This faculty node has not yet been assigned to any primary subject modules.</p>
                            <button className="inline-flex items-center justify-center bg-slate-900 text-white px-12 py-5 rounded-[24px] font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl active:scale-95">
                                Initiate Curricular Assignment
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
