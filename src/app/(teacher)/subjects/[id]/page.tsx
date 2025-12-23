'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { fetchTeacher, updateSubjectGrades } from '@/lib/redux/slices/teacherSlice';
import {
    ArrowLeft,
    Users,
    TrendingUp,
    Save,
    Loader2,
    Info
} from 'lucide-react';
import Link from 'next/link';
import Swal from 'sweetalert2';

export default function SubjectDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const dispatch = useDispatch<AppDispatch>();
    const { currentTeacher, loading } = useSelector((state: RootState) => state.teacher);

    const [marks, setMarks] = useState<Record<string, number>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        if (!currentTeacher) {
            dispatch(fetchTeacher());
        }
    }, [dispatch, currentTeacher]);


    // Find the subject from the loaded teacher data
    const subject = currentTeacher?.subjectsTaught.find(s => s.id.toString() === id);

    useEffect(() => {
        if (subject) {
            const initialMarks: Record<string, number> = {};
            subject.grades.forEach(g => {
                initialMarks[g.id] = g.score;
            });
            setMarks(initialMarks);
        }
    }, [subject]);

    // Redirect if subject not found (security)
    useEffect(() => {
        if (!loading && currentTeacher && !subject) {
            router.push('/subjects');
        }
    }, [loading, currentTeacher, subject, router]);

    const handleMarkChange = (gradeId: string, value: string) => {
        const num = parseInt(value);
        if (value === '' || (num >= 0 && num <= 100)) {
            setMarks(prev => ({ ...prev, [gradeId]: value === '' ? 0 : num }));
            setHasChanges(true);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const updates = Object.entries(marks).map(([id, score]) => ({ id, score }));
            await dispatch(updateSubjectGrades(updates)).unwrap();
            setHasChanges(false);

            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });

            Toast.fire({
                icon: 'success',
                title: 'Grades synchronized successfully'
            });
        } catch (err) {
            Swal.fire({
                title: 'Sync Failed',
                text: err as string,
                icon: 'error',
                customClass: {
                    popup: 'rounded-[32px] border-none shadow-2xl',
                    confirmButton: 'rounded-xl font-bold px-8 py-3 bg-rose-600'
                }
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (loading && !subject) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
                <p className="text-slate-500 font-medium italic">Loading academic records...</p>
            </div>
        );
    }

    if (!subject) return null;

    const grades = subject.grades || [];

    // Subject Success Rate: "Sum of student scores in this subject / 1" => Sum of marks
    const totalScoreSum = Object.values(marks).reduce((acc, curr) => acc + curr, 0);

    return (
        <div className="space-y-10 animate-in fade-in transition-all duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <Link
                    href="/subjects"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-purple-600 hover:border-purple-200 font-black text-xs uppercase tracking-widest transition-all shadow-sm active:scale-95 group w-fit"
                >
                    <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Index</span>
                </Link>

                <div className="flex items-center space-x-4">
                    <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-3">
                        <Users className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-black text-slate-900 tabular-nums">{grades.length} Students</span>
                    </div>
                    {hasChanges && (
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center shadow-lg shadow-purple-500/20 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            Save Changes
                        </button>
                    )}
                </div>
            </div>

            {/* Subject Info Card */}
            <div className="bg-white p-8 md:p-12 rounded-[48px] border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-center md:items-start gap-10">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-[36px] flex items-center justify-center text-white shadow-xl shadow-purple-500/20">
                    <span className="text-4xl font-black italic">{subject.name.substring(0, 2).toUpperCase()}</span>
                </div>
                <div className="flex-1 text-center md:text-left">
                    <span className="text-[10px] bg-purple-50 text-purple-600 px-3 py-1 rounded-lg font-black uppercase tracking-[0.2em] mb-3 inline-block">Module {subject.id}</span>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-2 uppercase">{subject.name}</h1>
                    <p className="text-slate-500 font-bold text-lg">Class: {subject.class?.name}</p>
                </div>

                <div className="bg-slate-900 p-8 rounded-[40px] text-white min-w-[240px] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-150 transition-transform duration-1000">
                        <TrendingUp className="w-16 h-16" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Success Points</span>
                    <div className="text-5xl font-black mt-2 tabular-nums text-green-400">{totalScoreSum}</div>
                    <span className="text-[9px] text-slate-500 font-bold block mt-2">Sum of all scores</span>
                </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-[48px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
                <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Student Grades</h2>
                    <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-xl">
                        <Info className="w-4 h-4 text-purple-400" />
                        <span>Max: 100</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
                                <th className="px-10 py-6">Student Name</th>
                                <th className="px-10 py-6">Email</th>
                                <th className="px-10 py-6 text-center">Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {grades.map((grade) => {
                                return (
                                    <tr key={grade.id} className="hover:bg-slate-50/30 transition-all duration-300">
                                        <td className="px-10 py-8 font-black text-slate-900 text-lg uppercase tracking-tight">
                                            {grade.student.userName}
                                        </td>
                                        <td className="px-10 py-8 font-bold text-slate-500 text-sm">
                                            {grade.student.email}
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex justify-center">
                                                <input
                                                    type="number"
                                                    value={marks[grade.id] ?? grade.score}
                                                    onChange={(e) => handleMarkChange(grade.id, e.target.value)}
                                                    className="w-24 text-center py-3 bg-slate-50 border border-slate-100 rounded-2xl font-black text-xl text-slate-900 focus:bg-white focus:ring-4 focus:ring-purple-50 focus:border-purple-300 transition-all outline-none tabular-nums"
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {grades.length === 0 && (
                    <div className="py-20 text-center text-slate-400 font-bold italic">No students enrolled.</div>
                )}
            </div>
        </div>
    );
}
