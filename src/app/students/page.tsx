'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchMyStudents, setPage } from '@/lib/redux/slices/adminSlice';
import { fetchTeacher } from '@/lib/redux/slices/teacherSlice';
import {
    Plus,
    Mail,
    Search,
    Loader2,
    AlertCircle,
    UserCircle,
    GraduationCap,
    School
} from 'lucide-react';
import Link from 'next/link';
import DeleteActionButton from '@/components/DeleteActionButton';
import { calculateSuccessRate } from '@/lib/data';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const runtime = 'edge';

const LIMIT = 10;

export default function StudentsPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);

    // Admin State
    const { students: adminStudents, loading: adminLoading, error: adminError, totalStudentsCount, currentPage } = useSelector((state: RootState) => state.admin);

    // Teacher State
    const { currentTeacher, loading: teacherLoading } = useSelector((state: RootState) => state.teacher);

    const [searchTerm, setSearchTerm] = React.useState('');
    const [debouncedSearch, setDebouncedSearch] = React.useState('');

    const isAdmin = user?.role === 'admin';
    const isTeacher = user?.role === 'teacher';

    const getStatusStyles = (rate: string) => {
        const value = parseFloat(rate);
        if (value >= 75) return {
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20',
            text: 'text-emerald-600',
            glow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]',
            progress: 'bg-emerald-500'
        };
        if (value >= 50) return {
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/20',
            text: 'text-amber-600',
            glow: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]',
            progress: 'bg-amber-500'
        };
        return {
            bg: 'bg-rose-500/10',
            border: 'border-rose-500/20',
            text: 'text-rose-600',
            glow: 'shadow-[0_0_20px_rgba(244,63,94,0.15)]',
            progress: 'bg-rose-500'
        };
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            if (searchTerm !== debouncedSearch && isAdmin) {
                dispatch(setPage(1));
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm, dispatch, debouncedSearch, isAdmin]);

    useEffect(() => {
        if (isAdmin) {
            dispatch(fetchMyStudents({ page: currentPage, limit: LIMIT, search: debouncedSearch }));
        } else if (isTeacher) {
            dispatch(fetchTeacher());
        }
    }, [dispatch, currentPage, debouncedSearch, isAdmin, isTeacher]);

    const handlePageChange = (newPage: number) => {
        if (isAdmin && newPage >= 1) {
            dispatch(fetchMyStudents({ page: newPage, limit: LIMIT, search: debouncedSearch }));
        }
    };

    // Calculate Teacher Students (from Subjects)
    const teacherStudents = React.useMemo(() => {
        if (!isTeacher || !currentTeacher?.subjectsTaught) return [];
        const uniqueStudents = new Map();
        currentTeacher.subjectsTaught.forEach(sub => {
            sub.grades.forEach(g => {
                // Ensure we have a valid student object
                if (g.student && !uniqueStudents.has(g.student.id)) {
                    uniqueStudents.set(g.student.id, {
                        ...g.student,
                        // Use the class from the subject as a proxy if student class is missing, 
                        // but ideal would be student.class. However 'me' query might not return student.class deep structure
                        // Check teacherSlice types. Grade.student is simple {id, userName, email}.
                        // So 'class' might be missing for teacher view. We can handle that display.
                        class: sub.class // Attach subject class context if needed
                    });
                }
            });
        });

        // Client-side Filter for Teacher
        let list = Array.from(uniqueStudents.values());
        if (debouncedSearch) {
            const lower = debouncedSearch.toLowerCase();
            list = list.filter((s: any) => s.userName.toLowerCase().includes(lower) || s.email.toLowerCase().includes(lower));
        }
        return list;
    }, [currentTeacher, isTeacher, debouncedSearch]);

    // Unify Data
    let displayStudents: any[] = [];
    let loading = false;
    let error = null;
    let totalCount = 0;

    if (isAdmin) {
        displayStudents = adminStudents;
        loading = adminLoading;
        error = adminError;
        totalCount = totalStudentsCount;
    } else if (isTeacher) {
        displayStudents = teacherStudents;
        loading = teacherLoading;
        error = null;
        totalCount = teacherStudents.length;
    }

    const totalPages = isAdmin ? Math.ceil(totalCount / LIMIT) : 1;

    if (loading && displayStudents.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <p className="text-slate-500 dark:text-slate-400 font-medium italic">Synchronizing student records...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20 p-4 md:p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                        {isTeacher ? 'My Students' : 'Student Directory'}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium text-lg italic">
                        {isTeacher ? 'Learners enrolled in your modules...' : 'Comprehensive management of institutional learners...'}
                    </p>
                </div>
                {isAdmin && (
                    <Link
                        href="/admin/users/new?role=student"
                        className="relative group overflow-hidden"
                    >
                        <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-blue-600 text-white px-8 py-4 rounded-xl font-black text-sm hover:bg-blue-700 transition-all flex items-center justify-center shadow-lg active:scale-95 uppercase tracking-widest leading-none">
                            <Plus className="w-5 h-5 mr-3" /> Enroll New Candidate
                        </div>
                    </Link>
                )}
            </div>

            <div className="rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
                <div className="p-8 border-b border-slate-50 dark:border-slate-800 relative group glass">
                    <div className="absolute left-14 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                        {loading && searchTerm !== debouncedSearch ? <Loader2 className="w-6 h-6 animate-spin text-blue-500" /> : <Search className="w-6 h-6" />}
                    </div>
                    <input
                        type="text"
                        placeholder="Scan directory by name, ID or email index..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-16 pr-8 py-6 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl border border-transparent focus:border-blue-100 focus: focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/20 placeholder:text-slate-300 dark:placeholder:text-slate-600 transition-all font-bold text-slate-900 dark:text-white outline-none"
                    />
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800">
                                <th className="px-10 py-6">Identity & Profile</th>
                                <th className="px-10 py-6 text-center">Academic Class</th>
                                <th className="px-10 py-6 text-center">Performance Matrix</th>
                                {isAdmin && <th className="px-10 py-6 text-right">Administrative Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            <AnimatePresence mode="popLayout">
                                {displayStudents?.map((student: any, index: number) => {
                                    // Calculate success rate if grades available (Admin typically has them populated in student object, Teacher needs logic)
                                    // For simplicity, if grades missing, show N/A
                                    const grades = student.grades || [];
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    const successRate = grades.length > 0 ? calculateSuccessRate(grades.map((g: any) => g.score)) : '0.0';
                                    const styles = getStatusStyles(successRate);

                                    return (
                                        <motion.tr
                                            key={student.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.4, delay: index * 0.05 }}
                                            className="hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-all duration-300 group"
                                        >
                                            <td className="px-10 py-8">
                                                <div className="flex items-center space-x-5">
                                                    <div className="relative">
                                                        <div className="w-14 h-14 bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                                            <UserCircle className="w-8 h-8" />
                                                        </div>
                                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full" title="Active Account" />
                                                    </div>
                                                    <div>
                                                        <Link href={`/students/${student.id}`} className="block font-black text-slate-900 dark:text-white text-lg hover:text-blue-600 dark:hover:text-blue-400 transition-colors leading-none mb-1.5">
                                                            {student.userName}
                                                        </Link>
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md font-black uppercase tracking-widest">UID: {student.id}</span>
                                                            <div className="hidden md:flex items-center text-[10px] text-slate-400 dark:text-slate-500 font-bold ml-2">
                                                                <Mail className="w-3 h-3 mr-1" /> {student.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex justify-center">
                                                    {student.class ? (
                                                        <span className="flex items-center text-slate-900 dark:text-white font-black  border border-slate-100 dark:border-slate-800 shadow-sm px-4 py-2 rounded-2xl w-fit">
                                                            <div className="w-2 h-2 rounded-full bg-blue-600 mr-3" />
                                                            {student.class.name}
                                                        </span>
                                                    ) : (
                                                        <div className="flex items-center text-slate-400 dark:text-slate-500 font-bold bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 px-4 py-2 rounded-2xl w-fit">
                                                            <School className="w-4 h-4 mr-2 opacity-50" />
                                                            N/A
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                {/* Only show Success Rate if actually available (Admin fetches deep, Teacher might not have all grades for success calculation unless refined) 
                                                    Teacher sees grades for THEIR subject. Success rate across ALL subjects might not be visible.
                                                    We'll show what we have.
                                                */}
                                                <div className="flex flex-col items-center group/success">
                                                    <div className={`relative px-6 py-3 rounded-2xl border ${styles.bg} ${styles.border} ${styles.glow} min-w-[140px] transition-all duration-500`}>
                                                        <div className="flex flex-col items-center relative z-10">
                                                            <span className={`text-2xl font-black tabular-nums ${styles.text}`}>
                                                                {student.averageScore}
                                                            </span>
                                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Avg Performance</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            {isAdmin && (
                                                <td className="px-10 py-8 text-right">
                                                    <div className="flex items-center justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                                                        <Link href={`/students/${student.id}`} className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl transition-all shadow-sm border border-slate-200/50 dark:border-slate-700/50 hover:border-blue-100 active:scale-95">
                                                            <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                        </Link>
                                                        <span className="text-red-700">
                                                            <DeleteActionButton userId={student.id} userName={student.userName} />
                                                        </span>
                                                    </div>
                                                </td>
                                            )}
                                        </motion.tr>
                                    );
                                })}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {isAdmin && totalPages > 1 && (
                    <div className="p-8 bg-slate-50/30 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between glass">
                        <div className="text-slate-400 dark:text-slate-500 text-xs font-black uppercase tracking-widest">
                            Showing Page {currentPage} of {totalPages} ({totalStudentsCount} records)
                        </div>
                        <div className="flex items-center space-x-2">
                            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2  rounded-lg disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
                            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2  rounded-lg disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
