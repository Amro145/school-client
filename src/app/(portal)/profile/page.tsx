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
    Briefcase,
    Settings,
    ShieldCheck,
    BookOpen,
    GraduationCap,
    Printer
} from 'lucide-react';
import { StudentUser, Teacher } from '@/types/portal';

export const runtime = 'edge';

export default function ProfilePage() {
    const dispatch = useDispatch<AppDispatch>();
    const { currentTeacher, loading: teacherLoading } = useSelector((state: RootState) => state.teacher);
    const { user, loading: authLoading } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (user?.role === 'teacher') {
            dispatch(fetchTeacher());
        }
    }, [dispatch, user]);

    if (authLoading || (user?.role === 'teacher' && teacherLoading)) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
                <p className="text-slate-500 font-medium italic">Retrieving profile data...</p>
            </div>
        );
    }

    if (!user) return null;

    if (user.role === 'student') {
        return <StudentProfileView user={user as unknown as StudentUser} />;
    }

    return <TeacherProfilePage currentTeacher={(currentTeacher || user) as unknown as Teacher} />;
}

function StudentProfileView({ user }: { user: StudentUser }) {
    const [filterType, setFilterType] = React.useState('All');

    const processedGrades = React.useMemo(() => {
        const rawGrades = user.grades || [];
        const uniqueMap = new Map();

        // Deduplicate: Keep only one entry per Subject+Type
        rawGrades.forEach(g => {
            const key = `${g.subject.id}-${g.type}`;
            uniqueMap.set(key, g);
        });

        const uniqueGrades = Array.from(uniqueMap.values());

        if (filterType === 'All') return uniqueGrades;
        return uniqueGrades.filter(g => g.type === filterType);
    }, [user.grades, filterType]);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
            {/* ... (Header and Identity Card sections remain unchanged) ... */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                        Student Profile
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium text-lg italic">
                        Permanent Academic Record
                    </p>
                </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Identity Card */}
                <div className="lg:col-span-1 space-y-8">
                    <div className=" dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none overflow-hidden p-8 text-center relative">
                        <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full mx-auto flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 shadow-inner relative z-10">
                            <GraduationCap className="w-16 h-16" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">{user.userName}</h2>
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-black uppercase tracking-widest mb-6">
                            Student ID: {user.id}
                        </div>

                        <div className="space-y-4 text-left">
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Email Address</p>
                                <p className="font-bold text-slate-700 dark:text-slate-200 truncate">{user.email}</p>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Academic Class</p>
                                <p className="font-bold text-slate-700 dark:text-slate-200">{user.class?.name || 'Unassigned'}</p>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Performance Overview</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase">Overall</p>
                                        <p className="font-black text-slate-900 dark:text-white text-lg">{user.averageScore ? Number(user.averageScore.toFixed(1)) : 'N/A'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase">Finals</p>
                                        <p className="font-black text-blue-600 dark:text-blue-400 text-lg">{user.finalAverageScore ? Number(user.finalAverageScore.toFixed(1)) : 'N/A'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase">Midterms</p>
                                        <p className="font-black text-indigo-600 dark:text-indigo-400 text-lg">{user.midtermAverageScore ? Number(user.midtermAverageScore.toFixed(1)) : 'N/A'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase">Quizzes</p>
                                        <p className="font-black text-purple-600 dark:text-purple-400 text-lg">{user.quizAverageScore ? Number(user.quizAverageScore.toFixed(1)) : 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Performance Table */}
                <div className="lg:col-span-2">
                    <div className=" dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none overflow-hidden h-full flex flex-col">
                        <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Academic Performance</h3>

                            {/* Filter Controls */}
                            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                                {['All', 'Midterm', 'Final', 'Quiz'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setFilterType(type)}
                                        className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${filterType === type
                                            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 dark:bg-slate-800/50">
                                    <tr>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Subject Module</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">Score Achieved</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Status</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Type</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                    {processedGrades.map((grade, i) => {
                                        const isPass = grade.score >= 50;
                                        return (
                                            <tr key={grade.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="px-8 py-6 font-bold text-slate-700 dark:text-slate-200">{grade.subject.name}</td>
                                                <td className="px-8 py-6 font-black text-slate-900 dark:text-white text-center text-lg">{grade.score}</td>
                                                <td className="px-8 py-6 text-right">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${isPass ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400'}`}>
                                                        {isPass ? 'Satisfactory' : 'Unsatisfactory'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${isPass ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400'}`}>
                                                        {grade.type}
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    {processedGrades.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-12 text-center text-slate-400 dark:text-slate-500 font-bold italic">
                                                {user.grades?.length === 0
                                                    ? "No grades recorded in the system yet."
                                                    : "No grades found for the selected filter."}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TeacherProfilePage({ currentTeacher }: { currentTeacher: Teacher }) {
    if (!currentTeacher) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Faculty Profile</h1>

            <div className=" dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/50 dark:shadow-none overflow-hidden relative">
                {/* Decorative Background */}
                <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-r from-purple-600 to-indigo-700"></div>
                <div className="absolute top-0 right-0 p-10 opacity-10 text-white">
                    <Shield className="w-64 h-64 translate-x-20 -translate-y-20" />
                </div>

                <div className="relative pt-24 px-10 pb-12">
                    <div className="flex flex-col md:flex-row items-end md:items-end gap-6 mb-8">
                        <div className="w-32 h-32  dark:bg-slate-950 rounded-3xl p-2 shadow-2xl">
                            <div className="w-full h-full bg-slate-900 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-white text-4xl font-black uppercase">
                                {currentTeacher.userName.substring(0, 2)}
                            </div>
                        </div>
                        <div className="mb-2">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{currentTeacher.userName}</h2>
                            <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 font-bold bg-purple-50 dark:bg-purple-900/20 px-3 py-1 rounded-lg w-fit mt-2">
                                <Shield className="w-4 h-4" />
                                <span className="text-xs uppercase tracking-widest">{currentTeacher.role}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-100 dark:border-slate-800 pt-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center">
                                <Mail className="w-3 h-3 mr-2" /> Contact Email
                            </label>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">{currentTeacher.email}</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center">
                                <User className="w-3 h-3 mr-2" /> System ID
                            </label>
                            <p className="text-lg font-bold text-slate-900 dark:text-white font-mono">#{currentTeacher.id}</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center">
                                <Briefcase className="w-3 h-3 mr-2" /> Active Modules
                            </label>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">{currentTeacher.subjectsTaught?.length || 0} Subjects Assigned</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
