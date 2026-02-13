"use client";

import { RootState } from '@/lib/redux/store';
import { useSelector } from 'react-redux';
import { useFetchData, useMutateData, fetchData } from '@/hooks/useFetchData';
import { ClassRoom, Subject } from '@shared/types/models';
import { Plus, ChevronRight, BookOpen, Users, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import DeleteActionButton from '@/components/DeleteActionButton';
import { TableSkeleton } from '@/components/SkeletonLoader';
import { motion, AnimatePresence } from 'framer-motion';

export const runtime = "edge";

export default function ClassesListPage() {
    const { user } = useSelector((state: RootState) => state.auth);

    const { data: adminData, isLoading: loading, error: fetchError, refetch } = useFetchData<{ classRooms: ClassRoom[], subjects: Subject[] }>(
        ['admin', 'classes-and-subjects'],
        `
        query GetAdminClassesAndSubjects {
          classRooms {
            id
            name
          }
          subjects {
            id
            name
            class {
                id
            }
            teacher {
                id
            }
          }
        }
        `
    );

    const { mutateAsync: performDeleteClass } = useMutateData(
        async (classId: string | number) => {
            const data = await fetchData<{ deleteClassRoom: { id: number } }>(
                `
                    mutation DeleteClass($id: Int!) {
                        deleteClassRoom(id: $id) { id }
                    }
                `,
                { id: Number(classId) }
            );

            return data.deleteClassRoom;
        },
        [['admin', 'classes-and-subjects']]
    );

    const classRooms = adminData?.classRooms || [];
    const subjects = adminData?.subjects || [];
    const error = fetchError ? (fetchError as any).message : null;

    // Filter classes for teachers: only show classes where teacher has subjects
    const filteredClassRooms = user?.role === 'teacher'
        ? classRooms.filter(cls =>
            subjects.some(s => s.class?.id === cls.id && s.teacher?.id === user?.id)
        )
        : classRooms;

    if (loading && classRooms.length === 0) {
        return (
            <div className="space-y-12 pb-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <div className="h-10 w-64 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl" />
                        <div className="h-4 w-96 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg" />
                    </div>
                </div>
                <div className=" rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                    <TableSkeleton rows={5} />
                </div>
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
                    <h3 className="text-lg font-bold text-red-900">Sync Failure</h3>
                    <p className="text-red-700 mt-1">{error}</p>
                    <button
                        onClick={() => refetch()}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition"
                    >
                        Retry Connection
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Class Cohorts</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium text-lg italic">Strategic monitoring of classroom performance and student density...</p>
                </div>
                {user?.role === 'admin' && (
                    <Link
                        href="/admin/classes/new"
                        className="relative group overflow-hidden"
                    >
                        <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-blue-600 text-white px-8 py-4 rounded-xl font-black text-sm hover:bg-blue-700 transition-all flex items-center justify-center shadow-lg active:scale-95 uppercase tracking-widest leading-none">
                            <Plus className="w-5 h-5 mr-3" /> Construct New Cohort
                        </div>
                    </Link>
                )}
            </div>

            <div className=" rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800">
                                <th className="px-10 py-6">Cohort Identification</th>
                                <th className="px-10 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            <AnimatePresence>
                                {filteredClassRooms.map((cls, idx) => (
                                    <motion.tr
                                        key={cls.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="hover:bg-slate-50/30 transition-all duration-300 group"
                                    >
                                        <td className="px-10 py-8">
                                            <div className="flex items-center space-x-5">
                                                <div className="w-14 h-14 bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                                    <BookOpen className="w-8 h-8" />
                                                </div>
                                                <div>
                                                    <Link href={`/admin/classes/${cls.id}`}>
                                                        <h3 className="text-lg font-black text-slate-900 dark:text-white leading-none mb-1.5 hover:text-blue-600 transition-colors cursor-pointer">{cls.name}</h3>
                                                    </Link>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md font-black uppercase tracking-widest whitespace-nowrap">ID: {cls.id}</span>
                                                        <span className="text-[10px] bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-md font-black uppercase tracking-widest whitespace-nowrap">COHORT</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex items-center justify-end space-x-3">
                                                <Link
                                                    href={`/admin/classes/${cls.id}`}
                                                    className="inline-flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl transition-all shadow-sm border border-slate-200/50 dark:border-slate-700/50 hover:border-blue-100 active:scale-95 group/btn"
                                                >
                                                    <ChevronRight className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
                                                </Link>
                                                {user?.role === 'admin' && (
                                                    <DeleteActionButton
                                                        userId={cls.id}
                                                        userName={cls.name}
                                                        warning="Deleting a classroom might affect assigned students and subjects. Are you sure?"
                                                        action={async (id) => {
                                                            await performDeleteClass(id);
                                                            refetch();
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {filteredClassRooms.length === 0 && !loading && (
                    <div className="p-20 text-center">
                        <Users className="w-16 h-16 text-slate-200 dark:text-slate-800 mx-auto mb-6" />
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Cohorts Established</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Begin by constructing your schools first academic cohort.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
