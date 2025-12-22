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
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <div className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                        Curriculum Management
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Academic Subjects</h1>
                    <p className="text-slate-500 mt-3 font-bold text-lg">Define learning objectives, faculty assignments, and classroom linkage.</p>
                </div>
                <Link
                    href="/admin/subjects/new"
                    className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-slate-800 transition-all flex items-center justify-center shadow-2xl shadow-slate-200 active:scale-95 group"
                >
                    <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform duration-300" /> Create New Subject
                </Link>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="relative flex-grow max-w-2xl group">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                            <Search className="w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            placeholder="Filter by subject identity, faculty, or code..."
                            className="w-full pl-14 pr-8 py-5 bg-slate-50/50 rounded-[2rem] border-2 border-transparent focus:border-blue-100 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-bold text-slate-900 placeholder-slate-400 outline-none"
                        />
                    </div>
                    <div className="flex items-center space-x-3">
                        <button className="p-4 bg-slate-50 rounded-2xl text-slate-500 hover:text-slate-900 transition-colors">
                            <Layers className="w-5 h-5" />
                        </button>
                        <button className="p-4 bg-slate-50 rounded-2xl text-slate-500 hover:text-slate-900 transition-colors">
                            <BarChart3 className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto px-4">
                    <table className="w-full text-left border-separate border-spacing-y-2">
                        <thead>
                            <tr className="text-slate-400 text-xs font-black uppercase tracking-[0.2em]">
                                <th className="px-8 py-5">Subject Identity</th>
                                <th className="px-8 py-5">Lead Faculty</th>
                                <th className="px-8 py-5">Assigned Class</th>
                                <th className="px-8 py-5">Assessment Analytics</th>
                                <th className="px-8 py-5 text-right w-20">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects?.map((subject) => {
                                const avgScore = subject.grades?.length > 0
                                    ? Math.round(subject.grades.reduce((acc, g) => acc + g.score, 0) / subject.grades.length)
                                    : null;

                                return (
                                    <tr key={subject.id} className="group cursor-pointer">
                                        <td className="px-8 py-6 bg-white border-y border-l border-slate-50 rounded-l-[2rem] group-hover:bg-slate-50/50 transition-colors">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                                                    <BookOpen className="w-7 h-7" />
                                                </div>
                                                <div>
                                                    <span className="block font-black text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{subject.name}</span>
                                                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1 inline-block">Ref: {subject.id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 bg-white border-y border-slate-50 group-hover:bg-slate-50/50 transition-colors">
                                            <div className="flex items-center space-x-3 text-slate-700 font-black">
                                                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                                                    <User className="w-4 h-4 text-slate-400" />
                                                </div>
                                                <span>{subject.teacher?.userName || 'TBA'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 bg-white border-y border-slate-50 group-hover:bg-slate-50/50 transition-colors">
                                            <div className="inline-flex items-center px-4 py-2 bg-indigo-50/50 text-indigo-700 rounded-xl font-black text-sm border border-indigo-100/50">
                                                <Layers className="w-4 h-4 mr-2 opacity-50" />
                                                {subject.class?.name || 'Open Enrollment'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 bg-white border-y border-slate-50 group-hover:bg-slate-50/50 transition-colors">
                                            <div className="flex items-center space-x-3">
                                                {avgScore !== null ? (
                                                    <>
                                                        <div className="flex-grow w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full transition-all duration-1000 ${avgScore > 80 ? 'bg-emerald-500' : avgScore > 60 ? 'bg-amber-500' : 'bg-rose-500'
                                                                    }`}
                                                                style={{ width: `${avgScore}%` }}
                                                            />
                                                        </div>
                                                        <span className={`font-black text-sm ${avgScore > 80 ? 'text-emerald-600' : avgScore > 60 ? 'text-amber-600' : 'text-rose-600'
                                                            }`}>
                                                            {avgScore}%
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-xs text-slate-400 font-bold italic">Awaiting Results</span>
                                                )}
                                            </div>
                                            <div className="text-[10px] text-slate-400 font-black mt-1 uppercase tracking-tighter">
                                                Based on {subject.grades?.length || 0} Assessments
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 bg-white border-y border-r border-slate-50 rounded-r-[2rem] group-hover:bg-slate-50/50 transition-colors">
                                            <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-all">
                                                <button className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all">
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                                <button className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
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
                    <div className="py-24 text-center">
                        <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 animate-bounce transition-all duration-1000">
                            <BookOpen className="w-16 h-16 text-slate-200" />
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">Empty Curriculum</h3>
                        <p className="text-slate-500 mt-2 font-bold max-w-sm mx-auto text-lg leading-relaxed">No subjects have been registered in the academic directory yet.</p>
                        <Link
                            href="/admin/subjects/new"
                            className="mt-8 inline-flex items-center justify-center bg-blue-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95"
                        >
                            <Plus className="w-6 h-6 mr-3" /> Initialize First Subject
                        </Link>
                    </div>
                )}

                <div className="p-8 bg-slate-50/30 border-t border-slate-50 text-center">
                    <p className="text-slate-400 font-bold text-sm">System synchronized with Academic Core Node Beta v1.2</p>
                </div>
            </div>
        </div>
    );
}
