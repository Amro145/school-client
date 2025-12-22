'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubjectById, resetSubject } from '@/lib/redux/slices/subjectSlice';
import { RootState, AppDispatch } from '@/lib/redux/store';
import Link from 'next/link';
import {
    ArrowLeft,
    BarChart3,
    GraduationCap,
    AlertCircle,
    User,
    Layers,
    Trophy,
    TrendingUp
} from 'lucide-react';

export const runtime = 'edge';

export default function SubjectDetailPage() {
    const params = useParams();
    const id = params?.id as string;
    const dispatch = useDispatch<AppDispatch>();
    const { currentSubject, loading, error } = useSelector((state: RootState) => state.subject);

    useEffect(() => {
        if (id) {
            dispatch(fetchSubjectById(id));
        }
        return () => {
            dispatch(resetSubject());
        };
    }, [id, dispatch]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                    <BarChart3 className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="text-center">
                    <p className="text-slate-900 font-black text-xl tracking-tight animate-pulse">Analyzing Subject Metrics...</p>
                    <p className="text-slate-500 font-medium text-sm mt-1 italic">Retrieving academic performance data from edge nodes...</p>
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
                    <h3 className="text-3xl font-black text-slate-900 leading-tight">Data Synchronization Error</h3>
                    <p className="text-slate-500 font-medium text-lg leading-relaxed">{error}</p>
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => dispatch(fetchSubjectById(id))}
                        className="px-10 py-4 bg-rose-600 text-white rounded-2xl font-black hover:bg-rose-700 transition-all active:scale-95 shadow-lg shadow-rose-200 uppercase tracking-widest text-xs"
                    >
                        Retry Connection
                    </button>
                    <Link
                        href="/admin/subjects"
                        className="px-10 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all active:scale-95 uppercase tracking-widest text-xs"
                    >
                        Return to Index
                    </Link>
                </div>
            </div>
        );
    }

    if (!currentSubject) return null;

    const avgScore = currentSubject.grades?.length > 0
        ? Math.round(currentSubject.grades.reduce((acc, g) => acc + g.score, 0) / currentSubject.grades.length)
        : null;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
            <Link
                href="/admin/subjects"
                className="inline-flex items-center space-x-3 px-6 py-3 bg-white border border-slate-100 rounded-2xl text-slate-500 hover:text-blue-600 hover:border-blue-100 font-black text-xs uppercase tracking-widest transition-all shadow-sm active:scale-95 group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Curriculum Index</span>
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Header Section */}
                <div className="lg:col-span-2 bg-white p-10 rounded-[48px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-10">
                    <div className="flex items-center space-x-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20 transform hover:scale-110 hover:rotate-3 transition-transform duration-500">
                            <BarChart3 className="w-10 h-10" />
                        </div>
                        <div>
                            <div className="flex items-center space-x-3 mb-2">
                                <span className="text-[10px] bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-black uppercase tracking-[0.2em]">Subject Node</span>
                                <span className="text-[10px] bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-black uppercase tracking-[0.2em]">ID: {currentSubject.id}</span>
                            </div>
                            <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{currentSubject.name}</h1>
                            <div className="flex flex-wrap items-center mt-6 gap-6">
                                <div className="flex items-center space-x-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                        <User className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <span className="text-slate-900 font-black text-sm">{currentSubject.teacher?.userName || 'TBA'}</span>
                                </div>
                                <div className="flex items-center space-x-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                        <Layers className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <span className="text-slate-900 font-black text-sm">{currentSubject.class?.name || 'Global'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Score Summary Card */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-150 group-hover:rotate-12 transition-transform duration-1000">
                        <TrendingUp className="w-32 h-32" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Weighted Performance</span>
                            <Trophy className="w-6 h-6 text-amber-400" />
                        </div>
                        <div className="flex items-baseline space-x-2">
                            <span className="text-6xl font-black tracking-tighter tabular-nums">{avgScore !== null ? avgScore : '--'}</span>
                            <span className="text-2xl font-black text-slate-500 leading-none">%</span>
                        </div>
                        <p className="text-slate-400 font-medium mt-4 text-sm leading-relaxed">Composite average across {currentSubject.grades?.length || 0} active student nodes.</p>

                        <div className="mt-8 space-y-3">
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ${avgScore && avgScore > 80 ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]' : 'bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.5)]'}`}
                                    style={{ width: `${avgScore || 0}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                                <span>Minimum Scope</span>
                                <span>Optimal Threshold</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grades Table Section */}
            <div className="bg-white rounded-[56px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
                <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6 glass">
                    <div className="flex items-center space-x-6">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                            <GraduationCap className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Intelligence Ledger</h2>
                            <p className="text-slate-400 font-medium mt-1.5 text-sm uppercase tracking-widest">{currentSubject.grades?.length || 0} Evaluated Student Nodes</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-tighter text-slate-500">
                            Academic Integrity: <span className="text-emerald-600">Verified</span>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
                                <th className="px-12 py-8">Student Identification</th>
                                <th className="px-12 py-8">Academic Trajectory</th>
                                <th className="px-12 py-8 text-center">Outcome Status</th>
                                <th className="px-12 py-8 text-right">Operational Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {currentSubject.grades?.map((grade) => (
                                <tr key={grade.id} className="hover:bg-slate-50/30 transition-all duration-300 group">
                                    <td className="px-12 py-8">
                                        <div className="flex items-center space-x-6">
                                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-all duration-500">
                                                <User className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <span className="block font-black text-slate-900 text-lg group-hover:text-blue-600 transition-colors leading-none mb-1.5">{grade.student?.userName || 'Anonymous Node'}</span>
                                                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-black uppercase tracking-widest">SID: {grade.student?.id || grade.id}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-12 py-8">
                                        <div className="flex flex-col space-y-3">
                                            <div className="flex items-center justify-between w-full max-w-[200px]">
                                                <span className={`text-xl font-black tabular-nums ${grade.score >= 85 ? 'text-emerald-500' : grade.score >= 70 ? 'text-blue-500' : 'text-rose-500'}`}>
                                                    {grade.score}%
                                                </span>
                                            </div>
                                            <div className="w-full max-w-[200px] h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 ${grade.score >= 85 ? 'bg-emerald-500' : grade.score >= 70 ? 'bg-blue-500' : 'bg-rose-500'}`}
                                                    style={{ width: `${grade.score}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-12 py-8 text-center">
                                        {grade.score >= 70 ? (
                                            <div className="inline-flex items-center px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 text-[10px] font-black uppercase tracking-widest shadow-sm">
                                                Optimal Flow
                                            </div>
                                        ) : (
                                            <div className="inline-flex items-center px-4 py-1.5 bg-rose-50 text-rose-600 rounded-full border border-rose-100 text-[10px] font-black uppercase tracking-widest shadow-sm">
                                                Attention Required
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-12 py-8 text-right">
                                        <button className="px-6 py-3 bg-white border border-slate-100 text-slate-400 hover:text-blue-600 hover:border-blue-100 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-sm transition-all active:scale-95">
                                            Adjust Metrics
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {(!currentSubject.grades || currentSubject.grades.length === 0) && (
                    <div className="py-24 text-center bg-white">
                        <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <Layers className="w-12 h-12 text-slate-200" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Outcome Data Unavailable</h3>
                        <p className="text-slate-400 max-w-sm mx-auto font-medium mt-2 italic">Evaluation scores for this subject node have not been synchronized yet.</p>
                    </div>
                )}

                <div className="p-10 bg-slate-50/30 border-t border-slate-100 text-center glass">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">Subject Performance Analytics Node</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button className="bg-slate-900 text-white px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl active:scale-95">
                            Generate Aggregate Report
                        </button>
                        <button className="bg-white text-slate-800 border border-slate-200 px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-xl shadow-slate-200/50 active:scale-95">
                            Export Raw Data Matrix
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
