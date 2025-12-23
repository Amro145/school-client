'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchSubjects, handleDeleteSubject } from '@/lib/redux/slices/adminSlice';
import { fetchTeacher } from '@/lib/redux/slices/teacherSlice';
import {
    Plus,
    BookOpen,
    User,
    Layers,
    Search,
    Eye,
    AlertCircle,
    Filter,
    ArrowRight,
    GraduationCap
} from 'lucide-react';
import Link from 'next/link';
import DeleteActionButton from '@/components/DeleteActionButton';
import { motion, AnimatePresence } from 'framer-motion';
import { TableSkeleton } from '@/components/SkeletonLoader';

export const runtime = 'edge';

export default function SubjectsPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);

    // Admin State
    const { subjects: adminSubjects, loading: adminLoading, error: adminError } = useSelector((state: RootState) => state.admin);

    // Teacher State
    const { currentTeacher, loading: teacherLoading } = useSelector((state: RootState) => state.teacher);

    const [searchTerm, setSearchTerm] = useState('');

    const isAdmin = user?.role === 'admin';
    const isTeacher = user?.role === 'teacher';

    useEffect(() => {
        if (isAdmin) {
            dispatch(fetchSubjects());
        } else if (isTeacher) {
            dispatch(fetchTeacher());
        }
    }, [dispatch, isAdmin, isTeacher]);

    // Data Unification
    let displaySubjects = [];
    let isLoading = false;
    let error = null;

    if (isAdmin) {
        displaySubjects = adminSubjects;
        isLoading = adminLoading;
        error = adminError;
    } else if (isTeacher) {
        displaySubjects = currentTeacher?.subjectsTaught || [];
        isLoading = teacherLoading;
        error = null;
    }

    if (error) return <div className="text-red-500 text-center p-10">{error}</div>;

    // Filter
    const filteredSubjects = displaySubjects.filter(subject =>
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (subject.class?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (isAdmin && subject.teacher?.userName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (isLoading && displaySubjects.length === 0) {
        return (
            <div className="space-y-12 pb-20 p-8">
                <div className="h-10 w-64 bg-slate-200 animate-pulse rounded-xl mb-4" />
                <TableSkeleton rows={6} />
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20 p-4 md:p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
                        {isAdmin ? 'Curriculum Index' : 'My Subjects'}
                    </h1>
                    <p className="text-slate-500 mt-3 font-medium text-lg italic">
                        {isAdmin ? 'Defining institutional learning pathways and faculty assignments...' : 'Manage your assigned academic modules.'}
                    </p>
                </div>

                {isAdmin && (
                    <Link
                        href="/subjects/new"
                        className="relative group overflow-hidden"
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-slate-900 text-white px-8 py-4 rounded-xl font-black text-sm hover:bg-slate-800 transition-all flex items-center justify-center shadow-lg active:scale-95 uppercase tracking-widest leading-none">
                            <Plus className="w-5 h-5 mr-3" /> Architect New Subject
                        </div>
                    </Link>
                )}
            </div>

            {/* Search Bar Shared */}
            {isAdmin ? (
                <div className="bg-white rounded-[48px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
                    <div className="p-8 border-b border-slate-50 relative group glass">
                        <div className="absolute left-14 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                            <Search className="w-6 h-6" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
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
                                <AnimatePresence>
                                    {filteredSubjects?.map((subject: any, idx) => {
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        const avgScore = subject.grades?.length > 0
                                            ? Math.round(subject.grades.reduce((acc: number, g: any) => acc + (g.score || 0), 0) / subject.grades.length)
                                            : null;

                                        return (
                                            <motion.tr
                                                key={subject.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="hover:bg-slate-50/30 transition-all duration-300 group"
                                            >
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center space-x-5">
                                                        <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                                            <BookOpen className="w-8 h-8" />
                                                        </div>
                                                        <div>
                                                            <Link href={`/subjects/${subject.id}`}>
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
                                                        {subject.teacher ? (
                                                            <span className="text-blue-600">
                                                                {subject.teacher.userName}
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-400 italic">Pending Assignment</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    {subject.class ? (
                                                        <div className="inline-flex items-center px-4 py-2 bg-white border border-slate-100 shadow-sm rounded-2xl font-black text-sm text-blue-600">
                                                            <Layers className="w-4 h-4 mr-2.5 text-blue-600" />
                                                            {subject.class.name}
                                                        </div>
                                                    ) : (
                                                        <div className="inline-flex items-center px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl font-black text-sm text-slate-400">
                                                            <Layers className="w-4 h-4 mr-2.5 opacity-50" />
                                                            Cross-Institutional
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="flex flex-col items-center">
                                                        {avgScore !== null ? (
                                                            <>
                                                                <div className="flex items-center space-x-4 w-full max-w-[140px]">
                                                                    <div className="grow h-2 bg-slate-100 rounded-full overflow-hidden">
                                                                        <div
                                                                            className={`h-full rounded-full transition-all duration-1000 ${avgScore > 80 ? 'bg-emerald-500' : avgScore > 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                                                            style={{ width: `${avgScore}%` }}
                                                                        />
                                                                    </div>
                                                                    <span className={`font-black text-sm tabular-nums ${avgScore > 80 ? 'text-emerald-600' : avgScore > 60 ? 'text-amber-600' : 'text-rose-600'}`}>
                                                                        {avgScore}%
                                                                    </span>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className="px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest">Awaiting Data</div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8 text-right">
                                                    <div className="flex items-center justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        <Link href={`/subjects/${subject.id}`} className="p-4 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all shadow-sm border border-slate-200/50 hover:border-blue-100 active:scale-95">
                                                            <Eye className="w-5 h-5" />
                                                        </Link>
                                                        <DeleteActionButton
                                                            userId={subject.id}
                                                            userName={subject.name}
                                                            action={handleDeleteSubject}
                                                        />
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                // Teacher View (Cards)
                <>
                    <div className="flex items-center space-x-4 w-full md:w-auto mb-8">
                        <div className="relative group w-full md:w-80">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-purple-600 transition-colors">
                                <Search className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search modules or cohorts..."
                                className="block w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-900 font-bold placeholder:text-slate-400 focus:ring-4 focus:ring-purple-50 focus:border-purple-200 transition-all outline-none shadow-sm"
                            />
                        </div>
                        <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-purple-600 hover:border-purple-200 transition-all shadow-sm active:scale-95">
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSubjects.map(subject => {
                            const enrollment = subject.grades.length;

                            return (
                                <Link key={subject.id} href={`/subjects/${subject.id}`} className="group relative bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all duration-300 overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
                                        <BookOpen className="w-32 h-32" />
                                    </div>

                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-2xl text-purple-600 shadow-inner group-hover:scale-110 transition-transform duration-500">
                                                {subject.name.charAt(0)}
                                            </div>
                                            <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                                <GraduationCap className="w-4 h-4 text-slate-400" />
                                                <span className="text-xs font-black text-slate-600 uppercase tracking-wider">{subject.class?.name || 'N/A'}</span>
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-purple-600 transition-colors tracking-tight uppercase leading-none">{subject.name}</h3>
                                        <p className="text-slate-400 font-bold text-sm italic mb-8">Module ID: {subject.id}</p>

                                        <div className="pt-6 border-t border-slate-50 flex items-center justify-between group-hover:border-slate-100 transition-colors">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Enrolled</span>
                                                <span className="text-xl font-black text-slate-900 tabular-nums">{enrollment}</span>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-purple-600 group-hover:text-white transition-all transform group-hover:-rotate-45">
                                                <ArrowRight className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </>
            )}

            {filteredSubjects.length === 0 && (
                <div className="py-24 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-12">
                        <AlertCircle className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">No Modules Found</h3>
                    <p className="text-slate-500 font-medium italic">Adjust your search parameters or contact administration.</p>
                </div>
            )}
        </div>
    );
}
