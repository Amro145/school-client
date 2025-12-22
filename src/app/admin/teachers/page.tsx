'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchMyTeachers } from '@/lib/redux/slices/adminSlice';
import {
    Plus,
    Mail,
    Search,
    Loader2,
    AlertCircle,
    UserCircle,
    GraduationCap,
    Users,
    Trash2
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
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Teachers & Faculty</h1>
                    <p className="text-slate-500 mt-2 font-medium">Manage teacher assignments, subject expertise, and performance tracking.</p>
                </div>
                <Link
                    href="/admin/teachers/new"
                    className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 transition-all flex items-center justify-center shadow-lg shadow-purple-500/20 active:scale-95"
                >
                    <Plus className="w-5 h-5 mr-2" /> Add New Teacher
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teachers?.map((teacher) => (
                    <div key={teacher.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden">
                        <div className="p-8">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 shadow-sm group-hover:scale-110 transition-transform">
                                        <UserCircle className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 line-clamp-1">{teacher.userName}</h3>
                                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider mt-1 inline-block">ID: #{teacher.id}</span>
                                    </div>
                                </div>
                                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{teacher.role}</div>
                            </div>

                            <div className="space-y-3 mb-8">
                                <div className="flex items-center text-slate-600 font-medium text-sm">
                                    <Mail className="w-4 h-4 mr-3 text-slate-300" />
                                    {teacher.email}
                                </div>
                                <div className="flex items-center text-slate-600 font-medium text-sm">
                                    <GraduationCap className="w-4 h-4 mr-3 text-slate-300" />
                                    {teacher.subjectsTaught.length} Subjects Taught
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Curriculum</h4>
                                <div className="flex flex-wrap gap-2">
                                    {teacher.subjectsTaught.length > 0 ? (
                                        teacher.subjectsTaught.map((subject) => {
                                            const avgGrade = subject.grades.length > 0
                                                ? Math.round(subject.grades.reduce((acc, g) => acc + g.score, 0) / subject.grades.length)
                                                : null;

                                            return (
                                                <div key={subject.id} className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl flex items-center group/tag hover:bg-purple-50 hover:border-purple-100 transition-colors">
                                                    <span className="text-sm font-bold text-slate-700 group-hover/tag:text-purple-700">{subject.name}</span>
                                                    {avgGrade !== null && (
                                                        <span className="ml-2 text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-lg font-bold">
                                                            {avgGrade}%
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <span className="text-xs text-slate-400 italic">No assigned subjects</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
                            <button className="text-xs font-bold text-slate-500 hover:text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-all">View Full Profile</button>
                            <div className="flex space-x-1">
                                <button className="p-2 text-slate-400 hover:text-blue-500 transition-colors"><Search className="w-4 h-4" /></button>
                                <button className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {teachers.length === 0 && !loading && (
                <div className="p-20 text-center bg-white rounded-3xl border border-slate-100 border-dashed">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Users className="w-12 h-12 text-slate-200" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">No Teachers Found</h3>
                    <p className="text-slate-500 mt-2 font-medium">Your school registry doesn&apos;t have any active faculty yet.</p>
                    <Link
                        href="/admin/teachers/new"
                        className="mt-6 inline-flex items-center justify-center bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all"
                    >
                        Register First Teacher
                    </Link>
                </div>
            )}
        </div>
    );
}
