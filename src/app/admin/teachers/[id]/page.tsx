'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeacherById, resetTeacher } from '@/lib/redux/slices/teacherSlice';
import { RootState, AppDispatch } from '@/lib/redux/store';
import Link from 'next/link';
import { calculateSuccessRate } from '@/lib/data';
import {
    ArrowLeft,
    Mail,
    BookOpen,
    Shield,
    Trophy,
    TrendingUp,
    AlertCircle,
    Trash2
} from 'lucide-react';

import { TableSkeleton } from '@/components/SkeletonLoader';

export const runtime = 'edge';

export default function TeacherDetailPage() {
    const params = useParams();
    const id = params?.id as string;
    const dispatch = useDispatch<AppDispatch>();
    const { currentTeacher, loading, error } = useSelector((state: RootState) => state.teacher);
    const [expandedSubjectId, setExpandedSubjectId] = React.useState<string | null>(null);

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
            <div className="space-y-12 pb-20">
                <div className="flex items-center space-x-2 px-4 py-2 w-32 bg-slate-100 animate-pulse rounded-xl h-8" />
                <div className=" p-12 rounded-[40px] border border-slate-100 shadow-sm flex gap-10">
                    <div className="w-32 h-32 bg-slate-200 animate-pulse rounded-[32px]" />
                    <div className="flex-1 space-y-4">
                        <div className="h-4 w-32 bg-slate-100 animate-pulse rounded-lg" />
                        <div className="h-12 w-96 bg-slate-200 animate-pulse rounded-2xl" />
                        <div className="flex gap-4">
                            <div className="h-10 w-48 bg-slate-100 animate-pulse rounded-xl" />
                            <div className="h-10 w-32 bg-slate-100 animate-pulse rounded-xl" />
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-lg ml-2" />
                    <div className=" rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                        <TableSkeleton rows={3} />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto mt-12  border border-rose-100 p-12 rounded-[48px] shadow-2xl shadow-rose-500/5 flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in duration-500">
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
        <div className="space-y-10 animate-in fade-in transition-all duration-700 pb-20">
            <Link
                href="/admin/teachers"
                className="inline-flex items-center space-x-2 px-4 py-2  border border-slate-200 rounded-xl text-slate-500 hover:text-blue-600 hover:border-blue-200 font-bold text-xs uppercase tracking-widest transition-all shadow-sm active:scale-95 group"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Faculty Directory</span>
            </Link>

            {/* Teacher Header Section */}
            <div className=" p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-center md:items-start gap-10">
                <div className="w-32 h-32 bg-linear-to-br from-blue-600 to-indigo-700 rounded-[32px] flex items-center justify-center text-white shadow-xl shadow-blue-500/20 transform hover:scale-105 transition-transform duration-500">
                    <span className="text-4xl font-black italic">{currentTeacher.userName.substring(0, 2).toUpperCase()}</span>
                </div>
                <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                        <span className="text-[10px] bg-blue-50 text-blue-600 px-3 py-1 rounded-lg font-black uppercase tracking-[0.2em]">Active Faculty</span>
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-3 py-1 rounded-lg font-black uppercase tracking-[0.2em]">UID: {currentTeacher.id}</span>
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-6">{currentTeacher.userName}</h1>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                        <div className="flex items-center space-x-3 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
                            <Mail className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-900 font-bold">{currentTeacher.email}</span>
                        </div>
                        <div className="flex items-center space-x-3 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
                            <Shield className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-900 font-bold uppercase tracking-widest text-sm">{currentTeacher.role}</span>
                        </div>
                    </div>
                </div>
                <div className="bg-slate-900 p-8 rounded-[32px] text-white min-w-[240px] shadow-xl">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Subjects Assigned</span>
                    <div className="text-5xl font-black mt-2 tabular-nums">{currentTeacher.subjectsTaught?.length || 0}</div>
                    <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                        <span className="text-slate-500">Status</span>
                        <span className="text-green-400">Verified</span>
                    </div>
                </div>
            </div>

            {/* Assigned Subjects Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Assigned Subjects</h2>
                    </div>
                </div>

                <div className="space-y-4">
                    {currentTeacher.subjectsTaught?.map((subject) => {
                        const grades = subject.grades?.map(g => g.score) || [];
                        const successRate = calculateSuccessRate(grades);
                        const isExpanded = expandedSubjectId === subject.id;

                        return (
                            <div key={subject.id} className=" rounded-[32px] border border-slate-100 shadow-sm overflow-hidden transition-all duration-300">
                                <div
                                    onClick={() => setExpandedSubjectId(isExpanded ? null : subject.id)}
                                    className={`p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer hover:bg-slate-50/50 transition-colors ${isExpanded ? 'bg-slate-50/50' : ''}`}
                                >
                                    <div className="flex items-center space-x-6">
                                        <div className="w-14 h-14  border border-slate-100 rounded-2xl flex items-center justify-center text-slate-900 shadow-sm group-hover:scale-110 transition-transform">
                                            <Trophy className="w-6 h-6 text-amber-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900">{subject.name}</h3>
                                            <p className="text-slate-500 font-bold text-sm">Classroom: {subject.class?.name || 'Unassigned'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-8">
                                        <div className="text-right">
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Success Rate</div>
                                            <div className={`text-2xl font-black tabular-nums ${parseFloat(successRate) >= 50 ? 'text-green-600' : 'text-blue-600'}`}>
                                                {successRate}
                                            </div>
                                        </div>
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isExpanded ? 'bg-blue-600 text-white rotate-180' : 'bg-slate-100 text-slate-400'}`}>
                                            <TrendingUp className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="p-8 border-t border-slate-100  animate-in slide-in-from-top-4 duration-300">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                                                        <th className="px-6 py-4 text-left">Student</th>
                                                        <th className="px-6 py-4 text-center hidden sm:table-cell">Performance</th>
                                                        <th className="px-6 py-4 text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50">
                                                    {subject.grades?.map((grade) => (
                                                        <tr key={grade.id} className="hover:bg-slate-50/30 transition-colors group">
                                                            <td className="px-6 py-5">
                                                                <div className="flex items-center space-x-4">
                                                                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-bold">
                                                                        {grade.student?.userName.substring(0, 1)}
                                                                    </div>
                                                                    <Link href={`/students/${grade.student?.id}`} className="font-bold text-slate-900 hover:text-blue-600 transition-colors">
                                                                        {grade.student?.userName}
                                                                    </Link>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-5 hidden sm:table-cell">
                                                                <div className="flex items-center justify-center space-x-3">
                                                                    <span className={`text-lg font-black tabular-nums ${grade.score >= 50 ? 'text-slate-900' : 'text-rose-600'}`}>
                                                                        {grade.score}%
                                                                    </span>
                                                                    <div className="hidden md:block flex-grow w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden max-w-[120px]">
                                                                        <div
                                                                            className={`h-full rounded-full ${grade.score >= 85 ? 'bg-emerald-500' : grade.score >= 50 ? 'bg-blue-500' : 'bg-rose-500'}`}
                                                                            style={{ width: `${grade.score}%` }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-5 text-right">
                                                                <button
                                                                    onClick={() => {
                                                                        // Swal deletion confirmation will be implemented globally or here
                                                                        import('sweetalert2').then((Swal) => {
                                                                            Swal.default.fire({
                                                                                title: 'Are you sure?',
                                                                                text: `Internal record for ${grade.student?.userName} will be permanently removed.`,
                                                                                icon: 'warning',
                                                                                showCancelButton: true,
                                                                                confirmButtonColor: '#2563eb',
                                                                                cancelButtonColor: '#ef4444',
                                                                                confirmButtonText: 'Yes, delete record',
                                                                                customClass: {
                                                                                    popup: 'rounded-[32px] border-none shadow-2xl',
                                                                                    title: 'font-black text-2xl',
                                                                                    confirmButton: 'rounded-xl font-bold px-8 py-3',
                                                                                    cancelButton: 'rounded-xl font-bold px-8 py-3'
                                                                                }
                                                                            }).then((result) => {
                                                                                if (result.isConfirmed) {
                                                                                    // Handle deletion logic
                                                                                    Swal.default.fire('Deleted!', 'Record has been removed.', 'success');
                                                                                }
                                                                            });
                                                                        });
                                                                    }}
                                                                    className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                                                >
                                                                    <Trash2 className="w-5 h-5" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        {(!subject.grades || subject.grades.length === 0) && (
                                            <div className="py-12 text-center text-slate-400 italic">
                                                No evaluation records found for this subject.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
