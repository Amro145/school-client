'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubjectById, resetSubject, updateGradesBulk } from '@/lib/redux/slices/subjectSlice';
import { fetchTeacher, updateSubjectGrades } from '@/lib/redux/slices/teacherSlice';
import { RootState, AppDispatch } from '@/lib/redux/store';
import Link from 'next/link';
import {
    ArrowLeft,
    BarChart3,
    GraduationCap,
    AlertCircle,
    User,
    Layers,
    Trophy,
    TrendingUp,
    Save,
    Loader2 as Spinner,
    CheckCircle2
} from 'lucide-react';
import Swal from 'sweetalert2';
import AutoSaveToggle from '@/features/grades/components/AutoSaveToggle';

export const runtime = 'edge';

export default function SubjectDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const dispatch = useDispatch<AppDispatch>();

    const { user } = useSelector((state: RootState) => state.auth);

    // Admin Selector
    const { currentSubject: adminSubject, loading: adminLoading, error: adminError } = useSelector((state: RootState) => state.subject);
    // Teacher Selector
    const { currentTeacher, loading: teacherLoading, error: teacherError } = useSelector((state: RootState) => state.teacher);

    const [modifiedGrades, setModifiedGrades] = useState<{ [key: string]: number }>({});
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showExitModal, setShowExitModal] = useState(false);
    const [pendingDestination, setPendingDestination] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<string>('All');

    const isAdmin = user?.role === 'admin';
    const isTeacher = user?.role === 'teacher';

    const isDirty = Object.keys(modifiedGrades).length > 0;

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    const handleNavigation = (href: string) => {
        if (isDirty) {
            setPendingDestination(href);
            setShowExitModal(true);
        } else {
            router.push(href);
        }
    };

    const confirmExit = () => {
        if (pendingDestination) {
            router.push(pendingDestination);
        }
    };

    useEffect(() => {
        if (id) {
            if (isAdmin) {
                dispatch(fetchSubjectById(id));
            } else if (isTeacher) {
                dispatch(fetchTeacher());
            }
        }
        return () => {
            if (isAdmin) dispatch(resetSubject());
        };
    }, [id, dispatch, isAdmin, isTeacher]);

    // Derived Subject Data
    let subject: any = null;
    let loading = false;
    let error: string | null = null;

    if (isAdmin) {
        subject = adminSubject;
        loading = adminLoading;
        error = adminError;
    } else if (isTeacher) {
        // Find subject in subjectsTaught
        subject = currentTeacher?.subjectsTaught.find(s => s.id.toString() === id) || null;
        loading = teacherLoading;
        if (!loading && currentTeacher && !subject) {
            // Security: Teacher trying to access unauthorized subject
            router.push('/subjects');
        }
    }

    const handleScoreChange = (gradeId: string, newScore: string) => {
        // Allow Teachers and Admins to edit
        if (!isTeacher && !isAdmin) return;

        const score = parseInt(newScore);
        if (isNaN(score) && newScore !== '') return;

        // Strictly prevent entering any value greater than 100
        const validatedScore = newScore === '' ? 0 : Math.min(100, Math.max(0, score));
        setModifiedGrades(prev => ({
            ...prev,
            [gradeId]: validatedScore
        }));
    };

    const handleSaveAll = async () => {
        const gradesToUpdate = Object.entries(modifiedGrades).map(([id, score]) => ({
            id,
            score
        }));

        if (gradesToUpdate.length === 0) return;

        setIsSaving(true);
        try {
            if (isTeacher) {
                await dispatch(updateSubjectGrades(gradesToUpdate)).unwrap();
            } else if (isAdmin) {
                // Ideally Admins can also update if requested, using the bulk action
                await dispatch(updateGradesBulk(gradesToUpdate)).unwrap();
            }

            setModifiedGrades({});
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);

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
            console.error('Failed to save grades:', err);
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

    // Auto-save Mechanism: Automatically saves changes after 2 seconds of inactivity
    const isAutoSaveEnabled = useSelector((state: RootState) => state.admin.isAutoSaveEnabled);

    useEffect(() => {
        // Only trigger if there are changes and not currently saving, and auto-save is enabled
        if (Object.keys(modifiedGrades).length === 0 || isSaving || !isAutoSaveEnabled) return;

        const debouncedSave = setTimeout(() => {
            handleSaveAll();
        }, 2000);

        // Cleanup function to cancel the timeout if the user types again, manually saves, or component unmounts
        return () => clearTimeout(debouncedSave);
    }, [modifiedGrades, isSaving, isAutoSaveEnabled, handleSaveAll]);



    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <Spinner className="w-12 h-12 text-blue-600 animate-spin" />
                <div className="text-center">
                    <p className="text-slate-900 dark:text-white font-black text-xl tracking-tight animate-pulse">Analyzing Subject Metrics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-xl mx-auto mt-20 p-10  dark:bg-slate-900 rounded-3xl border border-rose-100 dark:border-rose-900/30 shadow-xl text-center">
                <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Error Loading Subject</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">{error}</p>
                <Link href="/subjects" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Return to Subjects</Link>
            </div>
        )
    }

    if (!subject) return null;

    const grades = subject.grades || [];
    const visibleGrades = grades.filter((g: any) => selectedType === 'All' || g.type === selectedType);

    // Calculate average based on ALL grades or Visible grades? Usually specific context matters. 
    // If I select 'Final', I probably want to see the average for Finals.
    const avgScore = visibleGrades.length > 0
        ? Number((visibleGrades.reduce((acc: number, g: any) => acc + (g.score || 0), 0) / visibleGrades.length).toFixed(1))
        : null;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20 p-4 md:p-8 max-w-7xl mx-auto">
            <button
                onClick={() => handleNavigation('/subjects')}
                className="inline-flex items-center space-x-3 px-6 py-3  dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-100 dark:hover:border-blue-900/50 font-black text-xs uppercase tracking-widest transition-all shadow-sm active:scale-95 group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Curriculum Index</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Header Section */}
                <div className="lg:col-span-2  dark:bg-slate-950 p-10 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-10">
                    <div className="flex items-center space-x-8">
                        <div className="w-20 h-20 bg-linear-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20 transform hover:scale-110 hover:rotate-3 transition-transform duration-500">
                            <BarChart3 className="w-10 h-10" />
                        </div>
                        <div>
                            <div className="flex items-center space-x-3 mb-2">
                                <span className="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full font-black uppercase tracking-[0.2em]">Subject Node</span>
                                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-full font-black uppercase tracking-[0.2em]">ID: {subject.id}</span>
                            </div>
                            <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{subject.name}</h1>
                            <div className="flex flex-wrap items-center mt-6 gap-6">
                                <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-800/50 px-4 py-2 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <div className="w-8 h-8  dark:bg-slate-700 rounded-lg flex items-center justify-center shadow-sm">
                                        <User className="w-4 h-4 text-slate-400 dark:text-slate-300" />
                                    </div>
                                    {/* Handle teacher display differently if needed, here just showing raw object data or handling null */}
                                    {subject.teacher || (subject as any).teacherName ? (
                                        <span className="text-slate-900 dark:text-white font-black text-sm">
                                            {subject.teacher?.userName || (subject as any).teacherName || 'Faculty'}
                                        </span>
                                    ) : (
                                        <span className="text-slate-400 dark:text-slate-500 font-black text-sm italic">TBA</span>
                                    )}
                                </div>
                                <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-800/50 px-4 py-2 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <div className="w-8 h-8  dark:bg-slate-700 rounded-lg flex items-center justify-center shadow-sm">
                                        <Layers className="w-4 h-4 text-slate-400 dark:text-slate-300" />
                                    </div>
                                    {subject.class ? (
                                        <span className="text-slate-900 dark:text-white font-black text-sm">{subject.class.name}</span>
                                    ) : (
                                        <span className="text-slate-400 dark:text-slate-500 font-black text-sm italic">Global</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Score Summary Card */}
                <div className="bg-linear-to-br from-slate-900 to-slate-800 p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-150 group-hover:rotate-12 transition-transform duration-1000">
                        <TrendingUp className="w-32 h-32" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Weighted Performance</span>
                            <Trophy className="w-6 h-6 text-amber-400" />
                        </div>
                        <div className="flex items-baseline space-x-2">
                            <span className="text-6xl font-black tracking-tighter tabular-nums">{avgScore !== null ? avgScore : '--'}</span>
                            <span className="text-2xl font-black text-slate-500 leading-none">%</span>
                        </div>
                        <p className="text-slate-400 font-medium mt-4 text-sm leading-relaxed">Composite average across {visibleGrades.length} active student nodes.</p>

                        <div className="mt-8 space-y-3">
                            <div className="h-2 /5 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ${avgScore && avgScore > 80 ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]' : 'bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.5)]'}`}
                                    style={{ width: `${avgScore || 0}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grades Table Section */}
            <div className=" dark:bg-slate-950 rounded-[56px] border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
                <div className="p-10 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 glass">
                    <div className="flex items-center space-x-6">
                        <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner">
                            <GraduationCap className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Intelligence Ledger</h2>
                            <p className="text-slate-400 dark:text-slate-500 font-medium mt-1.5 text-sm uppercase tracking-widest">{visibleGrades.length} Evaluated Student Nodes</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        {/* Tabs */}
                        <div className="flex space-x-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mr-4">
                            {['All', 'Final', 'Midterm', 'Quiz'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setSelectedType(type)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedType === type
                                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                        <AutoSaveToggle />
                        {showSuccess && (
                            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-xl animate-in fade-in slide-in-from-right-4">
                                <CheckCircle2 className="w-5 h-5" />
                                <span className="text-xs font-black uppercase tracking-widest">Grades Synchronized</span>
                            </div>
                        )}
                        {/* Only Allow Save if Teacher, or if Admin has edit rights (Requirement said Enable 'Mark Editing' only for Teachers) */}
                        {isTeacher && (
                            <button
                                onClick={handleSaveAll}
                                disabled={isSaving || !isDirty}
                                className={`flex items-center space-x-3 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${isDirty ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/50 animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                                    }`}
                            >
                                {isSaving ? <Spinner className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                <span>{isSaving ? 'Syncing...' : 'Save All Changes'}</span>
                            </button>
                        )}
                        <div className="hidden md:block px-6 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-tighter text-slate-500 dark:text-slate-500">
                            Academic Integrity: <span className="text-emerald-600 dark:text-emerald-400">Verified</span>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800">
                                <th className="px-12 py-8">Student Identification</th>
                                <th className="px-12 py-8">Academic Trajectory</th>
                                <th className="px-12 py-8 text-center">Outcome Status</th>
                                <th className="px-12 py-8 text-right">Operational Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {visibleGrades.map((grade: any) => {
                                const currentScore = modifiedGrades[grade.id] !== undefined ? modifiedGrades[grade.id] : grade.score;
                                return (
                                    <tr key={grade.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-all duration-300 group">
                                        <td className="px-12 py-8">
                                            <div className="flex items-center space-x-6">
                                                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-500">
                                                    <User className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <Link href={grade.student ? `/students/${grade.student.id}` : '#'}>
                                                        <span className="block font-black text-slate-900 dark:text-white text-lg hover:text-blue-600 dark:hover:text-blue-400 transition-colors leading-none mb-1.5 cursor-pointer">{grade.student?.userName || 'Anonymous Node'}</span>
                                                    </Link>
                                                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md font-black uppercase tracking-widest">SID: {grade.student?.id || grade.id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-12 py-8">
                                            <div className="flex flex-col space-y-3">
                                                <div className="flex items-center justify-between w-full max-w-[200px]">
                                                    {isTeacher ? (
                                                        <div className="relative group/input">
                                                            <input
                                                                type="number"
                                                                value={currentScore}
                                                                onChange={(e) => handleScoreChange(grade.id, e.target.value)}
                                                                className={`w-24 bg-transparent text-2xl font-black tabular-nums border-b-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all py-1 ${currentScore >= 85 ? 'text-emerald-500 dark:text-emerald-400' : currentScore >= 70 ? 'text-blue-500 dark:text-blue-400' : 'text-rose-500 dark:text-rose-400'}`}
                                                                min="0"
                                                                max="100"
                                                            />
                                                            {modifiedGrades[grade.id] !== undefined && (
                                                                <span className="absolute -right-16 top-1/2 -translate-y-1/2 text-[10px] text-blue-500 font-black uppercase tracking-widest bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md animate-pulse">
                                                                    Pending
                                                                </span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className={`text-xl font-black tabular-nums ${grade.score >= 85 ? 'text-emerald-500 dark:text-emerald-400' : grade.score >= 70 ? 'text-blue-500 dark:text-blue-400' : 'text-rose-500 dark:text-rose-400'
                                                            }`}>
                                                            {grade.score}%
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="w-full max-w-[200px] h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-1000 ${currentScore >= 85 ? 'bg-emerald-500' : currentScore >= 70 ? 'bg-blue-500' : 'bg-rose-500'}`}
                                                        style={{ width: `${currentScore}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-12 py-8 text-center">
                                            {grade.score >= 70 ? (
                                                <div className="inline-flex items-center px-4 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-100 dark:border-emerald-900/30 text-[10px] font-black uppercase tracking-widest shadow-sm">
                                                    Optimal Flow
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center px-4 py-1.5 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-full border border-rose-100 dark:border-rose-900/30 text-[10px] font-black uppercase tracking-widest shadow-sm">
                                                    Attention Required
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-12 py-8 text-right">
                                            <button className="px-6 py-3  dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-100 dark:hover:border-blue-900 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-sm transition-all active:scale-95">
                                                Adjust Metrics
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                {(!grades || grades.length === 0) && (
                    <div className="py-24 text-center  dark:bg-slate-950">
                        <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <Layers className="w-12 h-12 text-slate-200 dark:text-slate-600" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Outcome Data Unavailable</h3>
                        <p className="text-slate-400 dark:text-slate-500 max-w-sm mx-auto font-medium mt-2 italic">Evaluation scores for this subject node have not been synchronized yet.</p>
                    </div>
                )}
            </div>

            {/* Unsaved Changes Form Modal */}
            {showExitModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className=" dark:bg-slate-900 rounded-[32px] p-8 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-200">
                        <div className="flex flex-col items-center text-center space-y-6">
                            <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center text-amber-500 mb-2">
                                <AlertCircle className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Unsaved Alterations Detected</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium">
                                    You have unsaved grade modifications. Departing now will cause data loss in the active session.
                                </p>
                            </div>
                            <div className="flex flex-col w-full space-y-3">
                                <button
                                    onClick={confirmExit}
                                    className="w-full py-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors"
                                >
                                    Discard & Leave
                                </button>
                                <button
                                    onClick={() => setShowExitModal(false)}
                                    className="w-full py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 dark:hover:bg-blue-500 transition-colors shadow-lg"
                                >
                                    Cancel & Return
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
