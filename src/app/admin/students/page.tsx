'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchMyStudents } from '@/lib/redux/slices/adminSlice';
import {
    Plus,
    Trash2,
    Mail,
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
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Student Directory</h1>
                    <p className="text-slate-500 mt-3 font-medium text-lg italic">Comprehensive management of institutional learners...</p>
                </div>
                <Link
                    href="/admin/students/new"
                    className="relative group overflow-hidden"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-blue-600 text-white px-8 py-4 rounded-xl font-black text-sm hover:bg-blue-700 transition-all flex items-center justify-center shadow-lg active:scale-95 uppercase tracking-widest leading-none">
                        <Plus className="w-5 h-5 mr-3" /> Enroll New Candidate
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
                        placeholder="Scan directory by name, ID or email index..."
                        className="w-full pl-16 pr-8 py-6 bg-slate-50/50 rounded-3xl border border-transparent focus:border-blue-100 focus:bg-white focus:ring-4 focus:ring-blue-50 placeholder:text-slate-300 transition-all font-bold text-slate-900 outline-none"
                    />
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
                                <th className="px-10 py-6">Identity & Profile</th>
                                <th className="px-10 py-6">Academic Class</th>
                                <th className="px-10 py-6">Connectivity Info</th>
                                <th className="px-10 py-6 text-center">Academic Standing</th>
                                <th className="px-10 py-6 text-right">Administrative Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {students?.map((student) => (
                                <tr key={student.id} className="hover:bg-slate-50/30 transition-all duration-300 group">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center space-x-5">
                                            <div className="relative">
                                                <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                                    <UserCircle className="w-8 h-8" />
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full" title="Active Account" />
                                            </div>
                                            <div>
                                                <Link href={`/admin/students/${student.id}`} className="block font-black text-slate-900 text-lg hover:text-blue-600 transition-colors leading-none mb-1.5">
                                                    {student.userName}
                                                </Link>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-black uppercase tracking-widest">UID: {student.id}</span>
                                                    <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-black uppercase tracking-widest">STUDENT</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center text-slate-900 font-black bg-white border border-slate-100 shadow-sm px-4 py-2 rounded-2xl w-fit group-hover:border-blue-100 transition-colors">
                                            <div className="w-2 h-2 rounded-full bg-blue-600 mr-3" />
                                            {student.class?.name || 'Provisionally Waitlisted'}
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-sm">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center text-slate-600 font-bold group-hover:text-slate-900 transition-colors">
                                                <Mail className="w-4 h-4 mr-2.5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                                                {student.email}
                                            </div>
                                            <div className="text-[10px] text-slate-400 font-black uppercase tracking-wider pl-6.5">Official Communications Only</div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex flex-col items-center">
                                            <div className="flex -space-x-3 hover:space-x-1 transition-all">
                                                {student.grades.length > 0 ? (
                                                    student.grades.slice(0, 4).map((grade) => (
                                                        <div
                                                            key={grade.id}
                                                            className={`inline-block h-10 w-10 rounded-2xl ring-4 ring-white shadow-lg flex items-center justify-center text-[10px] font-black text-white ${grade.score >= 80 ? 'bg-indigo-600' : grade.score >= 60 ? 'bg-blue-600' : 'bg-slate-400'
                                                                } transform transition-transform hover:-translate-y-2 cursor-default`}
                                                            title={`Subject Grade: ${grade.score}%`}
                                                        >
                                                            {grade.score}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest">Records Pending</div>
                                                )}
                                                {student.grades.length > 4 && (
                                                    <div className="h-10 w-10 rounded-2xl ring-4 ring-white bg-white border border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 shadow-lg">
                                                        +{student.grades.length - 4}
                                                    </div>
                                                )}
                                            </div>
                                            {student.grades.length > 0 && (
                                                <div className="mt-3 text-[10px] font-black text-blue-600 uppercase tracking-widest">Real-time Performance Metrics</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex items-center justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <button className="p-4 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all shadow-sm border border-slate-200/50 hover:border-blue-100 active:scale-95">
                                                <GraduationCap className="w-5 h-5" />
                                            </button>
                                            <button className="p-4 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all shadow-sm border border-slate-200/50 hover:border-red-100 active:scale-95">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-8 bg-slate-50/30 border-t border-slate-100 text-center glass">
                    <button className="bg-white text-slate-800 border border-slate-200 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-xl shadow-slate-200/50 active:scale-95">
                        Initialize Advanced Filter Engines
                    </button>
                </div>
            </div>
        </div>
    );
}

