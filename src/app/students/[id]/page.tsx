'use client';

import React, { useEffect, useState, use } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { useFetchData, useMutateData } from '@/hooks/useFetchData';
import {
    UserCircle,
    Mail,
    Shield,
    BookOpen,
    GraduationCap,
    ChevronLeft,
    Loader2,
    AlertCircle,
    TrendingUp,
    Save,
    CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from "framer-motion";
import AutoSaveToggle from '@/features/grades/components/AutoSaveToggle';
import axios from 'axios';

export const runtime = 'edge';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function StudentProfilePage({ params }: PageProps) {
    const { id } = use(params);
    const { user: authUser } = useSelector((state: RootState) => state.auth);

    const [modifiedGrades, setModifiedGrades] = useState<{ [key: string]: number }>({});
    const [showSuccess, setShowSuccess] = useState(false);
    const [selectedType, setSelectedType] = useState<string>('All');

    const isAdmin = authUser?.role === 'admin';
    const isTeacher = authUser?.role === 'teacher';

    // Hook for Profile Data
    const { data: profileData, isLoading: loading, error: fetchError } = useFetchData<{ student: any }>(
        ['student', id],
        `
        query GetStudentProfile($id: String!) {
          student(id: $id) {
            id
            userName
            email
            role
            class {
                id
                name
            }
            averageScore
            grades {
                id
                score
                type
                subject {
                    id
                    name
                }
            }
          }
        }
        `,
        { id: String(id) }
    );

    // Mutation Hook
    const { mutateAsync: updateGrades, isPending: isSaving } = useMutateData(
        async (grades: { id: string | number, score: number }[]) => {
            const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://schoolapi.amroaltayeb14.workers.dev/graphql';
            const response = await axios.post(apiBase, {
                query: `
                    mutation UpdateBulkGrades($grades: [GradeUpdateInput!]!) {
                        updateBulkGrades(grades: $grades) {
                            id
                            score
                        }
                    }
                `,
                variables: { grades }
            }, {
                headers: { 'Authorization': `Bearer ${Cookies.get('auth_token')}` }
            });
            return response.data;
        },
        [['student', id]]
    );

    const student = profileData?.student;

    const handleScoreChange = (gradeId: string, newScore: string) => {
        const score = parseInt(newScore);
        if (isNaN(score) && newScore !== '') return;
        const validatedScore = newScore === '' ? 0 : Math.min(100, Math.max(0, score));
        setModifiedGrades(prev => ({
            ...prev,
            [gradeId]: validatedScore
        }));
    };

    const handleSaveAll = async () => {
        const gradesToUpdate = Object.entries(modifiedGrades).map(([gid, score]) => ({
            id: String(gid),
            score
        }));

        if (gradesToUpdate.length === 0) return;

        try {
            await updateGrades(gradesToUpdate);
            setModifiedGrades({});
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (err) {
            console.error('Failed to save grades:', err);
        }
    };

    const isAutoSaveEnabled = useSelector((state: RootState) => state.admin.isAutoSaveEnabled);

    useEffect(() => {
        if (Object.keys(modifiedGrades).length === 0 || isSaving || !isAutoSaveEnabled) return;
        const debouncedSave = setTimeout(() => {
            handleSaveAll();
        }, 2000);
        return () => clearTimeout(debouncedSave);
    }, [modifiedGrades, isSaving, isAutoSaveEnabled]);


    if (loading) {
        return (
            <div className="space-y-12 pb-20 p-8">
                <div className="h-40 bg-slate-100 animate-pulse rounded-[3rem]" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="h-64 bg-slate-50 animate-pulse rounded-3xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (fetchError) {
        return (
            <div className="max-w-xl mx-auto mt-20 p-10  rounded-3xl border border-rose-100 shadow-xl text-center">
                <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Access Denied</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">{(fetchError as any).message || 'An error occurred'}</p>
                <Link href="/students" className="text-blue-600 font-bold hover:underline">Return to Directory</Link>
            </div>
        );
    }

    if (!student) return null;

    const filteredGrades = student.grades ? student.grades.filter((g: any) => {
        if (selectedType === 'All') return true;
        return g.type === selectedType;
    }) : [];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20 p-4 md:p-8 max-w-7xl mx-auto">
            {/* Header / Breadcrumb */}
            <div className="flex items-center justify-between">
                <Link
                    href="/students"
                    className="group flex items-center text-slate-500 hover:text-slate-900 transition-colors font-bold"
                >
                    <div className="p-2  rounded-xl border border-slate-100 group-hover:border-slate-200 shadow-sm mr-3 transition-all">
                        <ChevronLeft className="w-5 h-5" />
                    </div>
                    Back to Directory
                </Link>
                <div className="flex space-x-3">

                </div>
            </div>

            {/* Profile Overview Card */}
            <div className=" rounded-[3rem] border border-slate-50 dark:border-slate-800 shadow-2xl shadow-slate-200/40 dark:shadow-slate-900/20 overflow-hidden">
                <div className="h-32 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                </div>
                <div className="px-10 pb-10 relative">
                    <div className="flex flex-col md:flex-row md:items-end justify-between -mt-16 gap-6">
                        <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-8">
                            <div className="w-40 h-40 rounded-[2.5rem]  p-2 shadow-2xl relative">
                                <div className="w-full h-full rounded-4xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-200 dark:text-slate-600 overflow-hidden border border-slate-100 dark:border-slate-700">
                                    <UserCircle className="w-24 h-24" />
                                </div>
                                <div className="absolute bottom-4 right-4 w-10 h-10 bg-emerald-500 border-4 border-white rounded-full flex items-center justify-center shadow-lg">
                                    <div className="w-2.5 h-2.5  rounded-full"></div>
                                </div>
                            </div>
                            <div className="pb-2">
                                <div className="flex items-center space-x-3 mb-2">
                                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">{student.userName}</h1>
                                    <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-[11px] font-black uppercase tracking-widest">{student.role || 'Student'}</span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 font-bold text-lg flex items-center">
                                    <Mail className="w-4 h-4 mr-2 opacity-50" />
                                    {student.email}
                                </p>
                            </div>
                        </div>
                        <div className="flex space-x-4 mb-4">
                            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 text-center">
                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Assigned Class</p>
                                <p className="text-lg font-black text-slate-900 dark:text-white flex items-center justify-center">
                                    <BookOpen className="w-5 h-5 mr-2 text-indigo-500" />
                                    {student.class ? (
                                        isAdmin ? (
                                            <Link href={`/admin/classes/${student.class.id}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer group/class">
                                                {student.class.name}
                                            </Link>
                                        ) : (
                                            student.class.name
                                        )
                                    ) : (
                                        'N/A'
                                    )}
                                </p>
                            </div>
                            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 text-center">
                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Status</p>
                                <p className="text-lg font-black text-emerald-600 flex items-center justify-center">
                                    <Shield className="w-5 h-5 mr-2 text-emerald-500" />
                                    Active
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Academic Performance */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center">
                            <TrendingUp className="w-6 h-6 mr-3 text-blue-600" />
                            Academic Performance
                        </h2>
                        <div className="flex items-center space-x-4">
                            <AutoSaveToggle />
                            {showSuccess && (
                                <div className="flex items-center space-x-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl animate-in fade-in slide-in-from-right-4">
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span className="text-xs font-black uppercase tracking-widest">Saved</span>
                                </div>
                            )}
                            {/* Enable saving for Teachers OR Admin if authorized */}
                            {(isTeacher || isAdmin) && Object.keys(modifiedGrades).length > 0 && (
                                <button
                                    onClick={handleSaveAll}
                                    disabled={isSaving}
                                    className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                                </button>
                            )}
                        </div>
                    </div>


                    {/* Tabs */}
                    <div className="flex space-x-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
                        {['All', 'Final', 'Midterm', 'Quiz'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setSelectedType(type)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${selectedType === type
                                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                        {selectedType === 'Final' ? (
                            <div>
                                <p className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Final Grades</p>
                                <p className="text-xs font-bold text-slate-400">Average: <span className="text-blue-600">{student.finalAverageScore ? student.finalAverageScore.toFixed(1) : 'N/A'}%</span></p>
                            </div>
                        ) : selectedType === 'Midterm' ? (
                            <div>
                                <p className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Midterm Grades</p>
                                <p className="text-xs font-bold text-slate-400">Average: <span className="text-blue-600">{student.midtermAverageScore ? student.midtermAverageScore.toFixed(1) : 'N/A'}%</span></p>
                            </div>
                        ) : selectedType === 'Quiz' ? (
                            <div>
                                <p className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Quiz Grades</p>
                                <p className="text-xs font-bold text-slate-400">Average: <span className="text-blue-600">{student.quizAverageScore ? student.quizAverageScore.toFixed(1) : 'N/A'}%</span></p>
                            </div>
                        ) : (
                            <div>
                                <p className="text-lg font-black text-slate-900 dark:text-white tracking-tight">All Grades</p>
                                <p className="text-xs font-bold text-slate-400">Average: <span className="text-blue-600">{student.averageScore ? student.averageScore.toFixed(1) : 'N/A'}%</span></p>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredGrades && filteredGrades.length > 0 ? (
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            filteredGrades.map((grade: any) => {
                                const currentScore = modifiedGrades[grade.id] !== undefined ? modifiedGrades[grade.id] : grade.score;
                                return (
                                    <div key={grade.id} className=" p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-slate-900/20 hover:border-blue-200 dark:hover:border-blue-900 transition-all group">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                    <GraduationCap className="w-6 h-6" />
                                                </div>
                                                {grade.subject ? (
                                                    <Link href={`/subjects/${grade.subject.id}`}>
                                                        <span className="font-black text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">{grade.subject.name}</span>
                                                    </Link>
                                                ) : (
                                                    <span className="font-black text-slate-900 dark:text-white">N/A</span>
                                                )}
                                            </div>
                                            {(isTeacher || isAdmin) ? (
                                                <div className="relative group/input">
                                                    <input
                                                        type="number"
                                                        value={currentScore}
                                                        onChange={(e) => handleScoreChange(grade.id, e.target.value)}
                                                        // Allow editing always for demo/unification, or restrict: readOnly={!isTeacher} if admin shouldn't edit
                                                        className={`w-20 bg-transparent text-2xl font-black tabular-nums border-b-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:border-blue-500 focus:outline-none transition-all py-1 ${currentScore >= 80 ? 'text-emerald-500' : currentScore >= 60 ? 'text-amber-500' : 'text-rose-500'
                                                            }`}
                                                        min="0"
                                                        max="100"
                                                    />
                                                    {modifiedGrades[grade.id] !== undefined && (
                                                        <span className="absolute -right-12 top-1/2 -translate-y-1/2 text-[9px] text-blue-500 font-black uppercase tracking-widest bg-blue-50 px-1.5 py-0.5 rounded-md">
                                                            *
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className={`text-2xl font-black ${grade.score >= 80 ? 'text-emerald-500' : grade.score >= 60 ? 'text-amber-500' : 'text-rose-500'
                                                    }`}>
                                                    {grade.score}%
                                                </div>
                                            )}
                                        </div>
                                        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ${currentScore >= 80 ? 'bg-emerald-500' : currentScore >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                                                    }`}
                                                style={{ width: `${currentScore}%` }}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">
                                            <span>Current Metrics</span>
                                            <div
                                                className="text-blue-600 flex items-center cursor-pointer hover:underline"
                                            >
                                                {grade.type}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="col-span-full py-12  border border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] text-center">
                                <p className="text-slate-400 dark:text-slate-500 font-bold">No academic evaluation records found.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Stats / Info */}
                <div className="space-y-8">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center">
                        <Shield className="w-6 h-6 mr-3 text-indigo-600" />
                        Details
                    </h2>

                    <div className=" rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-xl shadow-slate-200/20 dark:shadow-slate-900/20 space-y-6">
                        <div className="space-y-4">
                            <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1 text-center">Identity Verification</h4>
                            <div className="p-5 bg-slate-50 dark:bg-slate-800 flex flex-col items-center justify-center rounded-2xl border border-slate-100/50 dark:border-slate-700/50">
                                <div className="w-32 h-32  rounded-2xl flex items-center justify-center shadow-lg mb-4 text-[10px] font-black text-slate-300 dark:text-slate-600">
                                    QR ID CODE
                                </div>
                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Permanent ID: USR-{student.id}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
