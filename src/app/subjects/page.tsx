'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { useFetchData, useMutateData } from '@/hooks/useFetchData';
import axios from 'axios';
import { Teacher as TeacherProfile } from '@shared/types/models';
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
    GraduationCap,
    LayoutDashboard
} from 'lucide-react';
import Link from 'next/link';
import DeleteActionButton from '@/components/DeleteActionButton';
import { motion, AnimatePresence } from 'framer-motion';
import { TableSkeleton } from '@/components/SkeletonLoader';

export const runtime = 'edge';

export default function SubjectsPage() {
    const { user } = useSelector((state: RootState) => state.auth);

    const [searchTerm, setSearchTerm] = useState('');

    const isAdmin = user?.role === 'admin';
    const isTeacher = user?.role === 'teacher';

    // Admin Hook
    // Admin Hook
    const { data: adminData, isLoading: adminLoading, error: adminError, refetch: adminRefetch } = useFetchData<{ subjects: any[] }>(
        ['admin', 'subjects'],
        `
        query GetAdminSubjects {
          subjects {
            id
            name
            teacher {
              id
              userName
            }
            class {
              id
              name
            }
            grades {
              id
              score
            }
          }
        }
        `,
        {},
        { enabled: isAdmin }
    );

    // Teacher Hook
    const { data: teacherData, isLoading: teacherLoading } = useFetchData<{ me: TeacherProfile }>(
        ['teacher', 'me'],
        `
        query GetTeacherSubjects {
          me {
            subjectsTaught {
              id
              name
              class {
                id
                name
              }
              grades {
                id
                score
              }
            }
          }
        }
        `,
        {},
        { enabled: isTeacher }
    );

    const { mutateAsync: performDeleteSubject } = useMutateData(
        async (id: string | number) => {
            const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://schoolapi.amroaltayeb14.workers.dev/graphql';
            const response = await axios.post(apiBase, {
                query: `
                    mutation DeleteSubject($id: Int!) {
                        deleteSubject(id: $id) { id }
                    }
                `,
                variables: { id: Number(id) }
            }, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            return response.data;
        },
        [['admin', 'subjects'], ['teacher', 'me'], ['subjects'], ['dashboard']]
    );

    const handleDeleteSubject = async (id: string | number) => {
        await performDeleteSubject(id);
        if (isAdmin) adminRefetch();
    };

    // Data Unification
    let displaySubjects = [];
    let isLoading = false;
    let error = null;

    if (isAdmin) {
        displaySubjects = adminData?.subjects || [];
        isLoading = adminLoading;
        error = adminError?.message;
    } else if (isTeacher) {
        displaySubjects = teacherData?.me?.subjectsTaught || [];
        isLoading = teacherLoading;
    }

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <AlertCircle className="w-12 h-12 text-red-500" />
            <div className="text-red-500 text-center font-black uppercase tracking-widest">{error}</div>
            <button
                onClick={() => isAdmin ? adminRefetch() : window.location.reload()}
                className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all"
            >
                Retry Request
            </button>
        </div>
    );

    // Filter
    const filteredSubjects = displaySubjects.filter(subject =>
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (subject.class?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (isAdmin && subject.teacher?.userName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (isLoading && displaySubjects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative"
                >
                    <div className="w-20 h-20 border-4 border-indigo-50 dark:border-indigo-900 border-t-indigo-600 rounded-full animate-spin"></div>
                    <BookOpen className="w-8 h-8 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </motion.div>
                <div className="text-center">
                    <p className="text-slate-900 dark:text-white font-black text-xl tracking-tight">Accessing Curriculum...</p>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1 italic">Fetching syllabic architecture...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20 p-4 md:p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                        {isAdmin ? 'Curriculum Index' : 'My Subjects'}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium text-lg italic">
                        {isAdmin ? 'Defining institutional learning pathways and faculty assignments...' : 'Manage your assigned academic modules.'}
                    </p>
                </div>

                {isAdmin && (
                    <Link
                        href="/subjects/new"
                        className="relative group overflow-hidden"
                    >
                        <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-slate-900 dark:bg-slate-800 text-white px-8 py-4 rounded-xl font-black text-sm hover:bg-slate-800 dark:hover:bg-slate-700 transition-all flex items-center justify-center shadow-lg active:scale-95 uppercase tracking-widest leading-none">
                            <Plus className="w-5 h-5 mr-3" /> Architect New Subject
                        </div>
                    </Link>
                )}
            </div>

            {/* Search Bar Shared */}
            {isAdmin ? (
                <div className=" rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
                    <div className="p-8 border-b border-slate-50 dark:border-slate-800 relative group glass">
                        <div className="absolute left-14 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                            <Search className="w-6 h-6" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Scan curriculum by subject name, faculty lead or academic class..."
                            className="w-full pl-16 pr-8 py-6 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl border border-transparent focus:border-blue-100 focus: focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/20 placeholder:text-slate-300 dark:placeholder:text-slate-600 transition-all font-bold text-slate-900 dark:text-white outline-none"
                        />
                    </div>

                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800">
                                    <th className="px-10 py-6">Subject Specification</th>
                                    <th className="px-10 py-6 hidden sm:table-cell">Lead instructor</th>
                                    <th className="px-10 py-6 hidden md:table-cell">Cohort</th>
                                    <th className="px-10 py-6 text-center hidden lg:table-cell">Outcome Analytics</th>
                                    <th className="px-10 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
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
                                                        <div className="w-14 h-14 bg-linear-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                                            <BookOpen className="w-8 h-8" />
                                                        </div>
                                                        <div>
                                                            <Link href={`/subjects/${subject.id}`}>
                                                                <span className="block font-black text-slate-900 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-none mb-1.5">{subject.name}</span>
                                                            </Link>
                                                            <div className="flex items-center space-x-2">
                                                                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md font-black uppercase tracking-widest">SID: {subject.id}</span>
                                                                <span className="text-[10px] bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-md font-black uppercase tracking-widest">ACTIVE</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8 hidden sm:table-cell">
                                                    <div className="flex items-center space-x-3 text-slate-900 dark:text-white font-black">
                                                        <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center border border-slate-100 dark:border-slate-800 group-hover:border-blue-100 dark:group-hover:border-blue-800 transition-colors">
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
                                                <td className="px-10 py-8 hidden md:table-cell">
                                                    {subject.class ? (
                                                        <div className="inline-flex items-center px-4 py-2  border border-slate-100 dark:border-slate-800 shadow-sm rounded-2xl font-black text-sm text-blue-600 dark:text-blue-400">
                                                            <Layers className="w-4 h-4 mr-2.5 text-blue-600 dark:text-blue-400" />
                                                            {subject.class.name}
                                                        </div>
                                                    ) : (
                                                        <div className="inline-flex items-center px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl font-black text-sm text-slate-400 dark:text-slate-500">
                                                            <Layers className="w-4 h-4 mr-2.5 opacity-50" />
                                                            Cross-Institutional
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-10 py-8 hidden lg:table-cell">
                                                    <div className="flex flex-col items-center">
                                                        {avgScore !== null ? (
                                                            <>
                                                                <div className="flex items-center space-x-4 w-full max-w-[140px]">
                                                                    <div className="grow h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
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
                                                    <div className="flex items-center justify-end space-x-3 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        <Link href={`/subjects/${subject.id}`} className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl transition-all shadow-sm border border-slate-200/50 dark:border-slate-700/50 hover:border-blue-100 active:scale-95">
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
                                className="block w-full pl-12 pr-4 py-3  border border-slate-200 rounded-2xl text-slate-900 font-bold placeholder:text-slate-400 focus:ring-4 focus:ring-purple-50 focus:border-purple-200 transition-all outline-none shadow-sm"
                            />
                        </div>
                        <button className="p-3  border border-slate-200 rounded-2xl text-slate-500 hover:text-purple-600 hover:border-purple-200 transition-all shadow-sm active:scale-95">
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSubjects.map(subject => {
                            const enrollment = subject.grades.length;

                            return (
                                <Link key={subject.id} href={`/subjects/${subject.id}`} className="group relative bg-white dark:bg-slate-950 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-purple-200 dark:hover:border-purple-900 transition-all duration-300 overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
                                        <BookOpen className="w-32 h-32" />
                                    </div>

                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center font-black text-2xl text-purple-600 shadow-inner group-hover:scale-110 transition-transform duration-500">
                                                {subject.name.charAt(0)}
                                            </div>
                                            <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800">
                                                <GraduationCap className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                                <span className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">{subject.class?.name || 'N/A'}</span>
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-purple-600 transition-colors tracking-tight uppercase leading-none">{subject.name}</h3>
                                        <p className="text-slate-400 dark:text-slate-500 font-bold text-sm italic mb-8">Module ID: {subject.id}</p>

                                        <div className="pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between group-hover:border-slate-100 transition-colors">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Enrolled</span>
                                                <span className="text-xl font-black text-slate-900 dark:text-white tabular-nums">{enrollment}</span>
                                            </div>
                                            <div className="w-10 h-10 rounded-full  flex items-center justify-center text-slate-400 group-hover:bg-purple-600 group-hover:text-white transition-all transform group-hover:-rotate-45">
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
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-12">
                        <AlertCircle className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No Modules Found</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium italic">Adjust your search parameters or contact administration.</p>
                </div>
            )}
        </div>
    );
}
