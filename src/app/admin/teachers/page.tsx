'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { useFetchData } from '@/hooks/useFetchData';
import { Teacher } from '@shared/types/models';
import { userService } from '@/services/user-service';
import {
    Plus,
    Mail,

    Loader2,
    AlertCircle,
    UserCircle,
    GraduationCap,
    Users,
    Eye
} from 'lucide-react';
import Link from 'next/link';
import DeleteActionButton from '@/components/DeleteActionButton';
import { motion } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query'; // Add this import

export const runtime = 'edge';

export default function TeachersListPage() {
    const queryClient = useQueryClient(); // Initialize hook
    const { user } = useSelector((state: RootState) => state.auth);

    const { data: teachersData, isLoading: loading, error: fetchError, refetch } = useFetchData<{ teachers: Teacher[] }>(
        ['admin', 'teachers'],
        `
        query GetAdminTeachers {
          teachers: myTeachers {
            id
            userName
            email
            subjectsTaught {
              id
              name
              grades {
                score
              }
            }
          }
        }
        `
    );

    const teachers = teachersData?.teachers || [];
    const error = fetchError ? (fetchError as any).message : null;

    if (loading && teachers.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <p className="text-slate-500 dark:text-slate-400 font-medium italic">Retrieving faculty records...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 p-8 rounded-3xl flex items-start space-x-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-2xl">
                    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-red-900 dark:text-red-400">Sync Error</h3>
                    <p className="text-red-700 dark:text-red-300 mt-1">{error}</p>
                    <button
                        onClick={() => refetch()}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition"
                    >
                        Retry Sync
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Faculty Registry</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium text-lg italic">Overseeing academic expertise and teaching staff...</p>
                </div>
                {user?.role === 'admin' && (
                    <Link
                        href="/admin/users/new?role=teacher"
                        className="relative group overflow-hidden"
                    >
                        <div className="absolute -inset-1 bg-linear-to-r from-purple-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-purple-600 text-white px-8 py-4 rounded-xl font-black text-sm hover:bg-purple-700 transition-all flex items-center justify-center shadow-lg active:scale-95 uppercase tracking-widest leading-none">
                            <Plus className="w-5 h-5 mr-3" /> Register New Faculty
                        </div>
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {teachers?.map((teacher, idx) => (
                    <motion.div
                        key={teacher.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass group rounded-[40px] border-slate-100 dark:border-slate-800 hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-500 shadow-xl shadow-slate-100/50 dark:shadow-none overflow-hidden"
                    >
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-linear-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-500/20 group-hover:rotate-6 transition-transform">
                                        <UserCircle className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <Link href={`/admin/teachers/${teacher.id}`}>
                                            <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors uppercase tracking-tight">
                                                {teacher.userName}
                                            </h3>
                                        </Link>
                                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Faculty ID: {teacher.id}</p>
                                    </div>
                                </div>
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-slate-50/50 dark:bg-slate-900/50 p-4 rounded-3xl border border-slate-100/50 dark:border-slate-800/50">
                                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">Subjects</span>
                                    <span className="text-lg font-black text-slate-900 dark:text-white">{teacher.subjectsTaught?.length || 0}</span>
                                </div>
                                <div className="bg-slate-50/50 dark:bg-slate-900/50 p-4 rounded-3xl border border-slate-100/50 dark:border-slate-800/50">
                                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">Expertise</span>
                                    <span className="text-lg font-black text-slate-900 dark:text-white">Active</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center text-slate-500 dark:text-slate-400 font-bold text-xs bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 group-hover:border-purple-100 dark:group-hover:border-purple-900/30 transition-colors">
                                    <Mail className="w-4 h-4 mr-3 text-purple-600 dark:text-purple-400" />
                                    {teacher.email}
                                </div>
                            </div>
                        </div>

                        <div className="px-8 py-5 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <Link
                                href={`/admin/teachers/${teacher.id}`}
                                className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest hover:text-purple-600 dark:hover:text-purple-400 flex items-center group/btn transition-colors"
                            >
                                <Eye className="w-4 h-4 mr-2" />
                                View Full Profile
                            </Link>
                            {user?.role === 'admin' && (
                                <DeleteActionButton
                                    userId={teacher.id}
                                    userName={teacher.userName}
                                    action={async (id) => {
                                        await userService.deleteUser(String(id));
                                        await queryClient.invalidateQueries({ queryKey: ['admin', 'teachers'] });
                                    }}
                                />
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {teachers.length === 0 && !loading && (
                <div className="p-32 text-center  rounded-[64px] border-4 border-dashed border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-50 dark:bg-purple-900/20 rounded-full blur-[100px] opacity-50 group-hover:scale-150 transition-transform duration-1000" />
                    <div className="relative z-10">
                        <div className="w-32 h-32 bg-slate-50 dark:bg-slate-800 rounded-[48px] flex items-center justify-center mx-auto mb-10 shadow-inner group-hover:rotate-12 transition-transform duration-500">
                            <Users className="w-16 h-16 text-slate-200 dark:text-slate-600" />
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-4">No Faculty Detected</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium text-lg leading-relaxed mb-10 italic">The institutional registry is currently awaiting initial faculty member onboarding.</p>
                        <Link
                            href="/admin/users/new?role=teacher"
                            className="inline-flex items-center justify-center bg-slate-900 text-white px-12 py-5 rounded-[24px] font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl hover:-translate-y-1 active:scale-95"
                        >
                            Register First Faculty Member
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
