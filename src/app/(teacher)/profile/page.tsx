'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { fetchTeacher } from '@/lib/redux/slices/teacherSlice';
import {
    User,
    Mail,
    Shield,
    Loader2,
    Briefcase
} from 'lucide-react';

export default function TeacherProfilePage() {
    const dispatch = useDispatch<AppDispatch>();
    const { currentTeacher, loading } = useSelector((state: RootState) => state.teacher);

    useEffect(() => {
        dispatch(fetchTeacher());
    }, [dispatch]);

    if (loading && !currentTeacher) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
                <p className="text-slate-500 font-medium italic">Retrieving personnel file...</p>
            </div>
        );
    }

    if (!currentTeacher) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Faculty Profile</h1>

            <div className="bg-white rounded-[48px] border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden relative">
                {/* Decorative Background */}
                <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-r from-purple-600 to-indigo-700"></div>
                <div className="absolute top-0 right-0 p-10 opacity-10 text-white">
                    <Shield className="w-64 h-64 translate-x-20 -translate-y-20" />
                </div>

                <div className="relative pt-24 px-10 pb-12">
                    <div className="flex flex-col md:flex-row items-end md:items-end gap-6 mb-8">
                        <div className="w-32 h-32 bg-white rounded-3xl p-2 shadow-2xl">
                            <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center text-white text-4xl font-black uppercase">
                                {currentTeacher.userName.substring(0, 2)}
                            </div>
                        </div>
                        <div className="mb-2">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{currentTeacher.userName}</h2>
                            <div className="flex items-center space-x-2 text-purple-600 font-bold bg-purple-50 px-3 py-1 rounded-lg w-fit mt-2">
                                <Shield className="w-4 h-4" />
                                <span className="text-xs uppercase tracking-widest">{currentTeacher.role}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-100 pt-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                                <Mail className="w-3 h-3 mr-2" /> Contact Email
                            </label>
                            <p className="text-lg font-bold text-slate-900">{currentTeacher.email}</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                                <User className="w-3 h-3 mr-2" /> System ID
                            </label>
                            <p className="text-lg font-bold text-slate-900 font-mono">#{currentTeacher.id}</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                                <Briefcase className="w-3 h-3 mr-2" /> Active Modules
                            </label>
                            <p className="text-lg font-bold text-slate-900">{currentTeacher.subjectsTaught?.length || 0} Subjects Assigned</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
