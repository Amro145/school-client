'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchStudentPerformance } from '@/lib/redux/slices/teacherSlice';
import Link from 'next/link';
import {
    ChevronLeft,
    UserCircle,
    BarChart3,
    Loader2,
    Calendar,
    Mail,
    Shield
} from 'lucide-react';

export default function StudentPerformanceView() {
    const { id } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const { currentStudent, loading, error } = useSelector((state: RootState) => state.teacher);
    const { user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (id) {
            dispatch(fetchStudentPerformance(id as string));
        }
    }, [id, dispatch]);

    // Filter grades to only show subjects taught by THIS teacher
    const relevantGrades = currentStudent?.grades.filter((g) =>
        g.subject.teacher?.id === user?.id
    ) || [];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <p className="text-slate-500 font-medium italic">Fetching student analytics...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-100 p-8 rounded-[32px] max-w-2xl mx-auto">
                <h3 className="text-lg font-bold text-red-900">Search Failed</h3>
                <p className="text-red-700 mt-1">{error}</p>
                <Link href="/admin/teacher" className="mt-4 inline-block text-red-600 font-bold hover:underline">Return to Portal</Link>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            <div className="flex items-center space-x-6">
                <button onClick={() => window.history.back()} className="p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm">
                    <ChevronLeft className="w-6 h-6 text-slate-400" />
                </button>
                <div>
                    <div className="flex items-center space-x-3 mb-2">
                        <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg">Student Profile</span>
                        <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg">{currentStudent?.class?.name}</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">{currentStudent?.userName}</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.03)] text-center">
                        <div className="w-32 h-32 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <UserCircle className="w-16 h-16 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 uppercase italic">Evaluation Target</h3>
                        <p className="text-slate-400 font-bold text-sm mt-1">{currentStudent?.email}</p>

                        <div className="mt-10 pt-10 border-t border-slate-50 space-y-4 text-left">
                            <div className="flex items-center text-slate-500 group">
                                <Mail className="w-5 h-5 mr-4 text-slate-300" />
                                <span className="text-xs font-bold">{currentStudent?.email}</span>
                            </div>
                            <div className="flex items-center text-slate-500">
                                <Calendar className="w-5 h-5 mr-4 text-slate-300" />
                                <span className="text-xs font-bold">Academic Year 2025</span>
                            </div>
                            <div className="flex items-center text-slate-500">
                                <Shield className="w-5 h-5 mr-4 text-slate-300" />
                                <span className="text-xs font-bold uppercase tracking-widest text-[10px]">VERIFIED STUDENT</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.03)]">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Performance Statistics</h2>
                                <p className="text-sm font-medium text-slate-400 mt-1">Evaluations under your jurisdiction</p>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-2xl">
                                <BarChart3 className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            {relevantGrades.map((grade) => (
                                <div key={grade.id} className="p-8 bg-slate-50/50 rounded-[32px] border border-transparent hover:border-slate-100 hover:bg-white transition-all duration-500 hover:shadow-xl hover:shadow-slate-200/50">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center space-x-6">
                                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm text-xl font-black text-blue-600 italic">
                                                {grade.subject.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-black text-slate-900 uppercase italic leading-none">{grade.subject.name}</h4>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 px-3 py-1 bg-white inline-block rounded-lg shadow-xs">Assigned Subject</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-4xl font-black text-slate-900 italic tracking-tighter">{grade.score}%</div>
                                            <div className={`text-[10px] font-black uppercase tracking-widest mt-1 ${grade.score >= 50 ? 'text-green-500' : 'text-amber-500'}`}>
                                                {grade.score >= 50 ? 'Satisfactory' : 'Needs Review'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-2 bg-white rounded-full overflow-hidden shadow-inner">
                                        <div
                                            className={`h-full transition-all duration-1000 ${grade.score >= 50 ? 'bg-blue-600' : 'bg-amber-500'}`}
                                            style={{ width: `${grade.score}%` }}
                                        />
                                    </div>
                                </div>
                            ))}

                            {relevantGrades.length === 0 && (
                                <div className="py-20 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-100">
                                    <BarChart3 className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                    <p className="text-slate-400 font-bold italic">No performance records found in your jurisdiction.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
