'use client';

import React, { useEffect, useState, use } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchStudentById, updateGradesBulk } from '@/lib/redux/slices/adminSlice';
import { fetchTeacher, updateSubjectGrades } from '@/lib/redux/slices/teacherSlice';
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
    ArrowUpRight,
    Save,
    CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

export const runtime = 'edge';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function StudentProfilePage({ params }: PageProps) {
    const { id } = use(params);
    const dispatch = useDispatch<AppDispatch>();
    const { user: authUser } = useSelector((state: RootState) => state.auth);

    // Admin Selector
    const { currentStudent: adminStudent, loading: adminLoading, error: adminError } = useSelector((state: RootState) => state.admin);

    // Teacher Selector
    const { currentTeacher, loading: teacherLoading } = useSelector((state: RootState) => state.teacher);

    const [modifiedGrades, setModifiedGrades] = useState<{ [key: string]: number }>({});
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const isAdmin = authUser?.role === 'admin';
    const isTeacher = authUser?.role === 'teacher';

    useEffect(() => {
        if (id) {
            if (isAdmin) {
                dispatch(fetchStudentById(Number(id)));
            } else if (isTeacher) {
                dispatch(fetchTeacher());
            }
        }

    }, [dispatch, id, isAdmin, isTeacher]);

    // Data Resolution
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let student: any = null;
    let loading = false;
    let error: string | null = null;

    if (isAdmin) {
        student = adminStudent;
        loading = adminLoading;
        error = adminError;
    } else if (isTeacher) {
        // Construct Student Profile from Teacher Data
        // Teacher can only see the student if they are in one of the subjects
        loading = teacherLoading;
        if (currentTeacher && currentTeacher.subjectsTaught) {
            const studentId = id.toString();
            // Find all grades for this student across all subjects taught by this teacher
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const relevantGrades: any[] = [];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let studentInfo: any = null;

            currentTeacher.subjectsTaught.forEach(sub => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const grade = sub.grades.find((g: any) => g.student && g.student.id.toString() === studentId);
                if (grade) {
                    relevantGrades.push({
                        ...grade,
                        subject: { name: sub.name, id: sub.id } // Mock subject relation for display
                    });
                    if (!studentInfo) studentInfo = grade.student;
                }
            });

            if (studentInfo) {
                student = {
                    ...studentInfo,
                    grades: relevantGrades,
                    role: 'student'
                };
            } else if (!loading) {
                error = "Student not found in your classes.";
            }
        }
    }

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
        const gradesToUpdate = Object.entries(modifiedGrades).map(([id, score]) => ({
            id,
            score
        }));

        if (gradesToUpdate.length === 0) return;

        setIsSaving(true);
        try {
            if (isTeacher) {
                await dispatch(updateSubjectGrades(gradesToUpdate)).unwrap();
            } else {
                await dispatch(updateGradesBulk(gradesToUpdate)).unwrap();
            }
            setModifiedGrades({});
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (err) {
            console.error('Failed to save grades:', err);
        } finally {
            setIsSaving(false);
        }
    };

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

    if (error) {
        return (
            <div className="max-w-xl mx-auto mt-20 p-10 bg-white rounded-3xl border border-rose-100 shadow-xl text-center">
                <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h3>
                <p className="text-slate-500 mb-6">{error}</p>
                <Link href="/students" className="text-blue-600 font-bold hover:underline">Return to Directory</Link>
            </div>
        );
    }

    if (!student) return null;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20 p-4 md:p-8 max-w-7xl mx-auto">
            {/* Header / Breadcrumb */}
            <div className="flex items-center justify-between">
                <Link
                    href="/students"
                    className="group flex items-center text-slate-500 hover:text-slate-900 transition-colors font-bold"
                >
                    <div className="p-2 bg-white rounded-xl border border-slate-100 group-hover:border-slate-200 shadow-sm mr-3 transition-all">
                        <ChevronLeft className="w-5 h-5" />
                    </div>
                    Back to Directory
                </Link>
                <div className="flex space-x-3">
                    {/* Teachers generally don't edit student profiles (metadata), only grades */}
                    {isAdmin && <button className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95 shadow-sm">Edit Record</button>}
                </div>
            </div>

            {/* Profile Overview Card */}
            <div className="bg-white rounded-[3rem] border border-slate-50 shadow-2xl shadow-slate-200/40 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                </div>
                <div className="px-10 pb-10 relative">
                    <div className="flex flex-col md:flex-row md:items-end justify-between -mt-16 gap-6">
                        <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-8">
                            <div className="w-40 h-40 rounded-[2.5rem] bg-white p-2 shadow-2xl relative">
                                <div className="w-full h-full rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-200 overflow-hidden border border-slate-100">
                                    <UserCircle className="w-24 h-24" />
                                </div>
                                <div className="absolute bottom-4 right-4 w-10 h-10 bg-emerald-500 border-4 border-white rounded-full flex items-center justify-center shadow-lg">
                                    <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                                </div>
                            </div>
                            <div className="pb-2">
                                <div className="flex items-center space-x-3 mb-2">
                                    <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">{student.userName}</h1>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[11px] font-black uppercase tracking-widest">{student.role || 'Student'}</span>
                                </div>
                                <p className="text-slate-500 font-bold text-lg flex items-center">
                                    <Mail className="w-4 h-4 mr-2 opacity-50" />
                                    {student.email}
                                </p>
                            </div>
                        </div>
                        <div className="flex space-x-4 mb-4">
                            <div className="px-6 py-4 bg-slate-50 rounded-3xl border border-slate-100 text-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Assigned Class</p>
                                <p className="text-lg font-black text-slate-900 flex items-center justify-center">
                                    <BookOpen className="w-5 h-5 mr-2 text-indigo-500" />
                                    {student.class ? (
                                        isAdmin ? (
                                            <Link href={`/admin/classes/${student.class.id}`} className="hover:text-indigo-600 transition-colors cursor-pointer group/class">
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
                            <div className="px-6 py-4 bg-slate-50 rounded-3xl border border-slate-100 text-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
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
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
                            <TrendingUp className="w-6 h-6 mr-3 text-blue-600" />
                            Academic Performance
                        </h2>
                        <div className="flex items-center space-x-4">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {student.grades && student.grades.length > 0 ? (
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            student.grades.map((grade: any) => (
                                <div key={grade.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/20 hover:border-blue-200 transition-all group">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                                <GraduationCap className="w-6 h-6" />
                                            </div>
                                            {grade.subject ? (
                                                <Link href={`/subjects/${grade.subject.id}`}>
                                                    <span className="font-black text-slate-900 hover:text-blue-600 transition-colors cursor-pointer">{grade.subject.name}</span>
                                                </Link>
                                            ) : (
                                                <span className="font-black text-slate-900">N/A</span>
                                            )}
                                        </div>
                                        {(isTeacher || isAdmin) ? (
                                            <div className="relative group/input">
                                                <input
                                                    type="number"
                                                    value={modifiedGrades[grade.id] !== undefined ? modifiedGrades[grade.id] : grade.score}
                                                    onChange={(e) => handleScoreChange(grade.id, e.target.value)}
                                                    // Allow editing always for demo/unification, or restrict: readOnly={!isTeacher} if admin shouldn't edit
                                                    className={`w-20 bg-transparent text-2xl font-black tabular-nums border-b-2 border-transparent hover:border-slate-200 focus:border-blue-500 focus:outline-none transition-all py-1 ${grade.score >= 80 ? 'text-emerald-500' : grade.score >= 60 ? 'text-amber-500' : 'text-rose-500'
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
                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ${grade.score >= 80 ? 'bg-emerald-500' : grade.score >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                                                }`}
                                            style={{ width: `${modifiedGrades[grade.id] !== undefined ? modifiedGrades[grade.id] : grade.score}%` }}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                                        <span>Current Metrics</span>
                                        <Link
                                            href={grade.subject ? `/subjects/${grade.subject.id}` : '#'}
                                            className="text-blue-600 flex items-center cursor-pointer hover:underline"
                                        >
                                            Details <ArrowUpRight className="w-3 h-3 ml-1" />
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-12 bg-white border border-dashed border-slate-200 rounded-[2.5rem] text-center">
                                <p className="text-slate-400 font-bold">No academic evaluation records found.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Stats / Info */}
                <div className="space-y-8">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
                        <Shield className="w-6 h-6 mr-3 text-indigo-600" />
                        Details
                    </h2>

                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-xl shadow-slate-200/20 space-y-6">
                        <div className="space-y-4">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1 text-center">Identity Verification</h4>
                            <div className="p-5 bg-slate-50 flex flex-col items-center justify-center rounded-2xl border border-slate-100/50">
                                <div className="w-32 h-32 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-4 text-[10px] font-black text-slate-300">
                                    QR ID CODE
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Permanent ID: USR-{student.id}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
