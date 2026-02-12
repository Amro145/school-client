'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { setPage } from '@/lib/redux/slices/adminSlice';
import { useFetchData } from '@/hooks/useFetchData';
import { Student, Teacher as TeacherProfile } from '@shared/types/models';
import {
    Plus,
    Mail,
    Search,
    UserCircle,
    GraduationCap,
    School,
    LayoutDashboard,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import { userService } from '@/services/user-service';
import DeleteActionButton from '@/components/DeleteActionButton';
import { calculateSuccessRate } from '@/lib/data';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';

const getStatusStyles = (rate: string | number) => {
    const numericRate = typeof rate === 'string' ? parseFloat(rate) : rate;
    if (numericRate >= 80) return { bg: 'bg-emerald-50 dark:bg-emerald-900/10', border: 'border-emerald-100 dark:border-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400', glow: 'shadow-lg shadow-emerald-500/10' };
    if (numericRate >= 60) return { bg: 'bg-amber-50 dark:bg-amber-900/10', border: 'border-amber-100 dark:border-amber-900/20', text: 'text-amber-600 dark:text-amber-400', glow: 'shadow-lg shadow-amber-500/10' };
    return { bg: 'bg-rose-50 dark:bg-rose-900/10', border: 'border-rose-100 dark:border-rose-900/20', text: 'text-rose-600 dark:text-rose-400', glow: 'shadow-lg shadow-rose-500/10' };
};

export const runtime = 'edge';

const LIMIT = 10;

import { useQueryClient } from '@tanstack/react-query'; // Add this import

export default function StudentsPage() {
    const queryClient = useQueryClient(); // Initialize hook
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { currentPage } = useSelector((state: RootState) => state.admin);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const isAdmin = user?.role?.toLowerCase() === 'admin';
    const isTeacher = user?.role?.toLowerCase() === 'teacher';

    // Admin Data Hook
    const { data: adminData, isLoading: adminLoading, error: adminError } = useFetchData<{
        students: any[];
        totalStudentsCount: number;
    }>(
        ['admin', 'students', currentPage.toString(), debouncedSearch],
        `
        query GetAdminStudents($offset: Int, $limit: Int, $search: String) {
          students: myStudents(offset: $offset, limit: $limit, search: $search) {
            id
            userName
            email
            role
            class {
                id
                name
            }
            averageScore
            successRate
            grades {
                id
                score
            }
          }
          totalStudentsCount
        }
        `,
        { offset: (currentPage - 1) * LIMIT, limit: LIMIT, search: debouncedSearch },
        { enabled: isAdmin }
    );

    // Teacher Data Hook
    const { data: teacherData, isLoading: teacherLoading } = useFetchData<{ me: TeacherProfile }>(
        ['teacher', 'me'],
        `
        query GetMyStudents {
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
                student {
                  id
                  userName
                  email
                }
              }
            }
          }
        }
        `,
        { page: currentPage, limit: LIMIT, search: debouncedSearch },
        { enabled: isAdmin }
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            if (searchTerm !== debouncedSearch && isAdmin) {
                dispatch(setPage(1));
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm, dispatch, debouncedSearch, isAdmin]);

    const handlePageChange = (newPage: number) => {
        if (isAdmin && newPage >= 1) {
            dispatch(setPage(newPage));
        }
    };

    // Calculate Teacher Students (from Subjects)
    const teacherStudents = useMemo(() => {
        if (!isTeacher || !teacherData?.me?.subjectsTaught) return [];
        const uniqueStudents = new Map();
        teacherData.me.subjectsTaught.forEach(sub => {
            sub.grades?.forEach(g => {
                if (g.student && !uniqueStudents.has(g.student.id)) {
                    uniqueStudents.set(g.student.id, {
                        ...g.student,
                        class: sub.class
                    });
                }
            });
        });

        let list = Array.from(uniqueStudents.values());
        if (debouncedSearch) {
            const lower = debouncedSearch.toLowerCase();
            list = list.filter((s: any) => s.userName.toLowerCase().includes(lower) || s.email.toLowerCase().includes(lower));
        }
        return list;
    }, [teacherData, isTeacher, debouncedSearch]);

    // Unify Data
    let displayStudents: any[] = [];
    let loading = false;
    let error = null;
    const totalStudentsCount = adminData?.totalStudentsCount || 0;
    let totalCount = 0;

    if (isAdmin) {
        displayStudents = adminData?.students || [];
        loading = adminLoading;
        error = adminError?.message;
        totalCount = adminData?.totalStudentsCount || 0;
    } else if (isTeacher) {
        displayStudents = teacherStudents;
        loading = teacherLoading;
        totalCount = teacherStudents.length;
    }

    const totalPages = isAdmin ? Math.ceil(totalCount / LIMIT) : 1;

    if (loading && displayStudents.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative"
                >
                    <div className="w-20 h-20 border-4 border-blue-50 dark:border-blue-900 border-t-blue-600 rounded-full animate-spin"></div>
                    <GraduationCap className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </motion.div>
                <div className="text-center">
                    <p className="text-slate-900 dark:text-white font-black text-xl tracking-tight">Syncing Records...</p>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1 italic">Retrieving institutional candidate directory...</p>
                </div>
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
                                <th className="px-10 py-6 text-center hidden md:table-cell">Academic Class</th>
                                <th className="px-10 py-6 text-center hidden sm:table-cell">Performance Matrix</th>
                                {isAdmin && <th className="px-10 py-6 text-right">Actions</th>}
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
                                            <td className="px-10 py-8 hidden md:table-cell">
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
                                            <td className="px-10 py-8 hidden sm:table-cell">
                                                {/* Only show Success Rate if actually available (Admin fetches deep, Teacher might not have all grades for success calculation unless refined) 
                                                    Teacher sees grades for THEIR subject. Success rate across ALL subjects might not be visible.
                                                    We'll show what we have.
                                                */}
                                                <div className="flex flex-col items-center group/success">
                                                    <div className={`relative px-6 py-3 rounded-2xl border ${styles.bg} ${styles.border} ${styles.glow} min-w-[140px] transition-all duration-500`}>
                                                        <div className="flex flex-col items-center relative z-10">
                                                            <span className={`text-2xl font-black tabular-nums ${styles.text}`}>
                                                                {student.averageScore?.toFixed(1) || '0.0'}
                                                            </span>
                                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Avg Performance</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="flex items-center justify-end space-x-3 transition-all duration-300">
                                                    <Link
                                                        href={`/students/${student.id}`}
                                                        className="flex items-center space-x-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all shadow-sm border border-blue-100 dark:border-blue-800/50 font-black text-[10px] uppercase tracking-widest active:scale-95"
                                                    >
                                                        <GraduationCap className="w-4 h-4" />
                                                        <span>View Node</span>
                                                    </Link>
                                                    {isAdmin && (
                                                        <div className="flex items-center space-x-2 px-4 py-1.5 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-all shadow-sm border border-rose-100 dark:border-rose-800/50 font-black text-[10px] uppercase tracking-widest active:scale-95">
                                                            <DeleteActionButton
                                                                userId={student.id}
                                                                userName={student.userName}
                                                                action={async (id) => {
                                                                    await userService.deleteUser(String(id));
                                                                    await queryClient.invalidateQueries({ queryKey: ['admin', 'students'] });
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
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
