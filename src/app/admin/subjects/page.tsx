'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchSubjects } from '@/lib/redux/slices/adminSlice';
import {
    Plus,
    BookOpen,
    User,
    Layers,
    BarChart3,
    AlertCircle,
    Search,
    Trash2,
    Eye
} from 'lucide-react';
import Link from 'next/link';

export const runtime = 'edge';

export default function SubjectsListPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { subjects, loading, error } = useSelector((state: RootState) => state.admin);

    useEffect(() => {
        dispatch(fetchSubjects());
    }, [dispatch]);

    if (loading && subjects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                    <BookOpen className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-slate-500 font-bold tracking-tight animate-pulse">Cataloging Academic Subjects...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white border border-red-100 p-10 rounded-[2.5rem] shadow-xl shadow-red-500/5 flex flex-col items-center text-center space-y-6">
                <div className="p-4 bg-red-50 rounded-2xl">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <div className="max-w-md">
                    <h3 className="text-2xl font-black text-slate-900 leading-tight">Sync Encountered an Obstacle</h3>
                    <p className="text-slate-500 mt-2 font-medium">{error}</p>
                </div>
                <button
                    onClick={() => dispatch(fetchSubjects())}
                    className="px-8 py-3 bg-red-600 text-white rounded-2xl font-black hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-200"
                >
                    Attempt Re-Sync
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Curriculum Index</h1>
                    <p className="text-slate-500 mt-3 font-medium text-lg italic">Defining institutional learning pathways and faculty assignments...</p>
                </div>
                <Link
                    href="/admin/subjects/new"
                    className="relative group overflow-hidden"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-slate-900 text-white px-8 py-4 rounded-xl font-black text-sm hover:bg-slate-800 transition-all flex items-center justify-center shadow-lg active:scale-95 uppercase tracking-widest leading-none">
                        <Plus className="w-5 h-5 mr-3" /> Architect New Subject
                    </div>
                </Link>
            </div>

            <div className="bg-white rounded-[48px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
                <div className="p-8 border-b border-slate-50 relative group glass">
                    <div className="absolute left-14 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                        <Search className="w-6 h-6" />
                    </div>
                    <input
                        type="text"
                        placeholder="Scan curriculum by subject name, faculty lead or academic class..."
                        className="w-full pl-16 pr-8 py-6 bg-slate-50/50 rounded-3xl border border-transparent focus:border-blue-100 focus:bg-white focus:ring-4 focus:ring-blue-50 placeholder:text-slate-300 transition-all font-bold text-slate-900 outline-none"
                    />
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
                                <th className="px-10 py-6">Subject Specification</th>
                                <th className="px-10 py-6">Lead Instructor</th>
                                <th className="px-10 py-6">Target Cohort</th>
                                <th className="px-10 py-6 text-center">Outcome Analytics</th>
                                <th className="px-10 py-6 text-right">Operational Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {subjects?.map((subject) => {
                                const avgScore = subject.grades?.length > 0
                                    ? Math.round(subject.grades.reduce((acc, g) => acc + g.score, 0) / subject.grades.length)
                                    : null;

                                return (
                                    <tr key={subject.id} className="hover:bg-slate-50/30 transition-all duration-300 group">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center space-x-5">
                                                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                                    <BookOpen className="w-8 h-8" />
                                                </div>
                                                <div>
                                                    <Link href={`/admin/subjects/${subject.id}`}>
                                                        <span className="block font-black text-slate-900 text-lg group-hover:text-blue-600 transition-colors leading-none mb-1.5">{subject.name}</span>
                                                    </Link>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-black uppercase tracking-widest">SID: {subject.id}</span>
                                                        <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-black uppercase tracking-widest">ACTIVE</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center space-x-3 text-slate-900 font-black">
                                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 group-hover:border-blue-100 transition-colors">
                                                    <User className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                                                </div>
                                                <span className="group-hover:translate-x-1 transition-transform">{subject.teacher?.userName || 'Pending Assignment'}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="inline-flex items-center px-4 py-2 bg-white border border-slate-100 shadow-sm rounded-2xl font-black text-sm group-hover:border-blue-100 transition-colors">
                                                <Layers className="w-4 h-4 mr-2.5 text-blue-600" />
                                                {subject.class?.name || 'Cross-Institutional'}
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex flex-col items-center">
                                                {avgScore !== null ? (
                                                    <>
                                                        <div className="flex items-center space-x-4 w-full max-w-[140px]">
                                                            <div className="flex-grow h-2 bg-slate-100 rounded-full overflow-hidden">
                                                                <div
                                                                    className={`h-full rounded-full transition-all duration-1000 ${avgScore > 80 ? 'bg-emerald-500' : avgScore > 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                                                    style={{ width: `${avgScore}%` }}
                                                                />
                                                            </div>
                                                            <span className={`font-black text-sm tabular-nums ${avgScore > 80 ? 'text-emerald-600' : avgScore > 60 ? 'text-amber-600' : 'text-rose-600'}`}>
                                                                {avgScore}%
                                                            </span>
                                                        </div>
                                                        <div className="text-[10px] text-slate-400 font-black mt-2 uppercase tracking-widest">
                                                            Avg from {subject.grades?.length || 0} Learners
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest">Awaiting Data</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex items-center justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <button className="p-4 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all shadow-sm border border-slate-200/50 hover:border-blue-100 active:scale-95">
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                                <button className="p-4 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all shadow-sm border border-slate-200/50 hover:border-red-100 active:scale-95">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {subjects?.length === 0 && !loading && (
                    <div className="py-32 text-center bg-white relative overflow-hidden group">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-50 rounded-full blur-[100px] opacity-30 group-hover:scale-150 transition-transform duration-1000" />
                        <div className="relative z-10">
                            <div className="w-32 h-32 bg-slate-50 rounded-[48px] flex items-center justify-center mx-auto mb-10 shadow-inner group-hover:rotate-12 transition-transform duration-500">
                                <BookOpen className="w-16 h-16 text-slate-200" />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Educational Void</h3>
                            <p className="text-slate-500 max-w-sm mx-auto font-medium text-lg leading-relaxed mb-10 italic">The academic catalog is currently empty and requires initial curriculum architecting.</p>
                            <Link
                                href="/admin/subjects/new"
                                className="inline-flex items-center justify-center bg-blue-600 text-white px-12 py-5 rounded-[24px] font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-2xl active:scale-95"
                            >
                                <Plus className="w-6 h-6 mr-3" /> Initialize Core Subject
                            </Link>
                        </div>
                    </div>
                )}

                <div className="p-8 bg-slate-50/30 border-t border-slate-100 text-center glass">
                    <button className="bg-white text-slate-800 border border-slate-200 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-xl shadow-slate-200/50 active:scale-95">
                        Synchronize Knowledge Nodes
                    </button>
                </div>
            </div>
        </div>
    );
}
