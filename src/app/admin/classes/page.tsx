"use client";

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchClassRooms, handleDeleteClassRoom } from '@/lib/redux/slices/adminSlice';
import { Plus, ChevronRight, BookOpen, Users, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import DeleteActionButton from '@/components/DeleteActionButton';

export const runtime = "edge";

export default function ClassesListPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { classRooms, loading, error } = useSelector((state: RootState) => state.admin);

    useEffect(() => {
        dispatch(fetchClassRooms());
    }, [dispatch]);

    if (loading && classRooms.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <p className="text-slate-500 font-medium italic">Synchronizing institutional cohorts...</p>
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
                        onClick={() => dispatch(fetchClassRooms())}
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
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Class Cohorts</h1>
                    <p className="text-slate-500 mt-3 font-medium text-lg italic">Strategic monitoring of classroom performance and student density...</p>
                </div>
                <Link
                    href="/admin/classes/new"
                    className="relative group overflow-hidden"
                >
                    <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-blue-600 text-white px-8 py-4 rounded-xl font-black text-sm hover:bg-blue-700 transition-all flex items-center justify-center shadow-lg active:scale-95 uppercase tracking-widest leading-none">
                        <Plus className="w-5 h-5 mr-3" /> Construct New Cohort
                    </div>
                </Link>
            </div>

            <div className="bg-white rounded-[48px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
                                <th className="px-10 py-6">Cohort Identification</th>
                                <th className="px-10 py-6">Operational Status</th>
                                <th className="px-10 py-6 text-right">Administrative Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {classRooms.map((cls) => (
                                <tr key={cls.id} className="hover:bg-slate-50/30 transition-all duration-300 group">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center space-x-5">
                                            <div className="w-14 h-14 bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                                <BookOpen className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <Link href={`/admin/classes/${cls.id}`}>
                                                    <h3 className="text-lg font-black text-slate-900 leading-none mb-1.5 hover:text-blue-600 transition-colors cursor-pointer">{cls.name}</h3>
                                                </Link>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-black uppercase tracking-widest whitespace-nowrap">ID: {cls.id}</span>
                                                    <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-black uppercase tracking-widest whitespace-nowrap">COHORT</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="inline-flex items-center px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl font-black text-[10px] uppercase tracking-widest">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                                            Active System Node
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex items-center justify-end space-x-3">
                                            <Link
                                                href={`/admin/classes/${cls.id}`}
                                                className="inline-flex items-center justify-center p-4 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all shadow-sm border border-slate-200/50 hover:border-blue-100 active:scale-95 group/btn"
                                            >
                                                <ChevronRight className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
                                            </Link>
                                            <DeleteActionButton
                                                userId={cls.id}
                                                userName={cls.name}
                                                warning="Deleting a classroom might affect assigned students and subjects. Are you sure?"
                                                action={handleDeleteClassRoom}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {classRooms.length === 0 && !loading && (
                    <div className="p-20 text-center">
                        <Users className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                        <h3 className="text-xl font-bold text-slate-900">No Cohorts Established</h3>
                        <p className="text-slate-500 mt-2">Begin by constructing your schools first academic cohort.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
