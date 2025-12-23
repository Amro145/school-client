'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchSubjectDetails, updateSubjectGrades } from '@/lib/redux/slices/teacherSlice';
import Swal from 'sweetalert2';
import Link from 'next/link';
import {
    Users,
    ChevronLeft,
    Save,
    Loader2,
    CheckCircle2,
    AlertCircle,
    UserCircle,
    BarChart
} from 'lucide-react';

export default function SubjectManagement() {
    const { id } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const { currentSubject, loading, error } = useSelector((state: RootState) => state.teacher);
    const [grades, setGrades] = useState<{ id: string, score: number }[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(fetchSubjectDetails(id as string));
        }
    }, [id, dispatch]);

    useEffect(() => {
        if (currentSubject) {
            setGrades(currentSubject.grades.map(g => ({ id: g.id, score: g.score })));
        }
    }, [currentSubject]);

    const handleScoreChange = (id: string, value: string) => {
        const score = parseInt(value) || 0;
        setGrades(prev => prev.map(g => g.id === id ? { ...g, score: Math.min(100, Math.max(0, score)) } : g));
    };

    const handleSave = async () => {
        const result = await Swal.fire({
            title: 'Confirm Grade Update',
            text: `Are you sure you want to update grades for ${grades.length} students?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#2563eb',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, Save Changes',
            background: '#ffffff',
            customClass: {
                title: 'text-2xl font-black text-slate-900',
                popup: 'rounded-[32px] p-8 pb-10',
                confirmButton: 'px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-sm',
                cancelButton: 'px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-sm'
            }
        });

        if (result.isConfirmed) {
            setIsSaving(true);
            try {
                await dispatch(updateSubjectGrades(grades)).unwrap();
                await Swal.fire({
                    title: 'Update Successful',
                    text: 'Evaluation records have been synchronized with the mainframe.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    background: '#ffffff',
                    customClass: {
                        popup: 'rounded-[32px]'
                    }
                });
                dispatch(fetchSubjectDetails(id as string));
            } catch  {
                Swal.fire('Error', 'Failed to update grades', 'error');
            } finally {
                setIsSaving(false);
            }
        }
    };

    if (loading && !currentSubject) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <p className="text-slate-500 font-medium italic">Loading subject intelligence...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-100 p-8 rounded-[32px] flex items-start space-x-4 max-w-2xl mx-auto">
                <AlertCircle className="w-6 h-6 text-red-600 mt-1" />
                <div>
                    <h3 className="text-lg font-bold text-red-900 uppercase tracking-tight">Access Restricted</h3>
                    <p className="text-red-700 mt-1">{error}</p>
                    <Link href="/admin/teacher" className="mt-4 inline-flex items-center text-red-600 font-bold hover:underline">
                        <ChevronLeft className="w-4 h-4 mr-1" /> Return to Subject Directory
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center space-x-6">
                    <Link href="/admin/teacher" className="p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm">
                        <ChevronLeft className="w-6 h-6 text-slate-400" />
                    </Link>
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg">Management Module</span>
                            <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg">{currentSubject?.class.name}</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">{currentSubject?.name}</h1>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={isSaving || grades.length === 0}
                    className="flex items-center justify-center space-x-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:active:scale-100 text-white rounded-[24px] shadow-xl shadow-blue-500/30 transition-all font-black uppercase tracking-widest text-sm"
                >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    <span>{isSaving ? 'Processing...' : 'Sync Database'}</span>
                </button>
            </div>

            <div className="bg-white rounded-[40px] border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.03)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-left border-b border-slate-100">
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Enrolled Student</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic Identity</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Current Score (0-100)</th>
                                <th className="px-10 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {currentSubject?.grades.map((grade) => {
                                const currentScore = grades.find(g => g.id === grade.id)?.score ?? grade.score;
                                return (
                                    <tr key={grade.id} className="hover:bg-slate-50/20 transition-colors group">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-md transition-all">
                                                    <UserCircle className="w-7 h-7" />
                                                </div>
                                                <Link href={`/admin/teacher/student/${grade.student.id}`} className="block font-black text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer capitalize">
                                                    {grade.student.userName}
                                                </Link>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="text-sm font-bold text-slate-400">{grade.student.email}</div>
                                            <div className="text-[10px] font-black text-blue-500 uppercase mt-1 tracking-widest">UID: {grade.student.id}</div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center justify-center">
                                                <div className="relative group/input">
                                                    <input
                                                        type="number"
                                                        value={currentScore}
                                                        onChange={(e) => handleScoreChange(grade.id, e.target.value)}
                                                        className={`w-28 text-center py-3 bg-slate-50 border-2 rounded-2xl font-black text-lg transition-all focus:outline-hidden focus:ring-4 focus:ring-blue-500/10 ${currentScore >= 50 ? 'border-transparent focus:border-blue-400 text-blue-600' : 'border-amber-100 text-amber-600 focus:border-amber-400'
                                                            }`}
                                                    />
                                                    <div className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover/input:opacity-100 transition-opacity">
                                                        {currentScore >= 50 ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-amber-500" />}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <Link href={`/admin/teacher/student/${grade.student.id}`} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl inline-flex items-center transition-all group/link">
                                                <BarChart className="w-4 h-4 text-slate-400 group-hover/link:text-blue-600" />
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                            {currentSubject?.grades.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-20 text-center">
                                        <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                        <p className="text-slate-400 font-bold italic">No evaluation records found for this cohort.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
