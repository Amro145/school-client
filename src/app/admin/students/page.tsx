'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchMyStudents } from '@/lib/redux/slices/adminSlice';
import {
    Plus,
    Trash2,
    Mail,
    BookOpen,
    Search,
    Loader2,
    AlertCircle,
    UserCircle,
    GraduationCap
} from 'lucide-react';
import Link from 'next/link';

export const runtime = 'edge';

export default function StudentsListPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { students, loading, error } = useSelector((state: RootState) => state.admin);

    useEffect(() => {
        dispatch(fetchMyStudents());
    }, [dispatch]);

    if (loading && students.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <p className="text-slate-500 font-medium italic">Synchronizing student records...</p>
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
                    <h3 className="text-lg font-bold text-red-900">Data Retrieval Failed</h3>
                    <p className="text-red-700 mt-1">{error}</p>
                    <button
                        onClick={() => dispatch(fetchMyStudents())}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition"
                    >
                        Retry Fetch
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Students Management</h1>
                    <p className="text-slate-500 mt-2 font-medium">Manage student credentials, class assignments, and grade history.</p>
                </div>
                <Link
                    href="/admin/students/new"
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center shadow-lg shadow-blue-500/20 active:scale-95"
                >
                    <Plus className="w-5 h-5 mr-2" /> Add New Student
                </Link>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 relative group">
                    <div className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                        <Search className="w-5 h-5" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search student directories..."
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-blue-100 placeholder-slate-400 transition-all font-medium text-slate-900 outline-none"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest border-b border-slate-100">
                                <th className="px-8 py-5">Profile & Name</th>
                                <th className="px-8 py-5">Assigned Class</th>
                                <th className="px-8 py-5">Contact & Role</th>
                                <th className="px-8 py-5">Grade  %</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {students?.map((student) => (
                                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                                                <UserCircle className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <span className="block font-bold text-slate-900">{student.userName}</span>
                                                <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider mt-1 inline-block">ID: #{student.id}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center text-slate-700 font-bold bg-slate-100/50 px-3 py-1.5 rounded-xl w-fit">
                                            <BookOpen className="w-4 h-4 mr-2 text-slate-400" />
                                            {student.class?.name || 'Waitlisted'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <div className="flex items-center text-slate-600 font-medium text-sm">
                                                <Mail className="w-4 h-4 mr-2 text-slate-300" />
                                                {student.email}
                                            </div>
                                            <div className="text-[11px] text-slate-400 font-bold uppercase ml-6">{student.role}</div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-2">
                                            <div className="flex -space-x-2 overflow-hidden">
                                                {student.grades.length > 0 ? (
                                                    student.grades.slice(0, 3).map((grade) => (
                                                        <div key={grade.id} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-green-500 text-white flex items-center justify-center text-[10px] font-bold">
                                                            {grade.score}%
                                                        </div>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-slate-400 font-medium italic">No scores yet</span>
                                                )}
                                            </div>
                                            {student.grades.length > 3 && (
                                                <span className="text-xs font-bold text-slate-400">+{student.grades.length - 3}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all shadow-sm border border-transparent hover:border-blue-100">
                                                <GraduationCap className="w-5 h-5" />
                                            </button>
                                            <button className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shadow-sm border border-transparent hover:border-red-100">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {students.length === 0 && !loading && (
                    <div className="p-16 text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-10 h-10 text-slate-200" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">No students found</h3>
                        <p className="text-slate-500 mt-1 font-medium">The student directory is currently empty.</p>
                    </div>
                )}

                <div className="p-6 bg-slate-50/50 border-t border-slate-100 text-center">
                    <button className="bg-white text-slate-600 border border-slate-200 px-6 py-2 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors shadow-sm active:scale-95">Load Advanced Filter</button>
                </div>
            </div>
        </div>
    );
}

function Users(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}
