'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { fetchTeacher } from '@/lib/redux/slices/teacherSlice';
import {
    BookOpen,
    Users,
    TrendingUp,
    Star,
    Award,
    ChevronRight,
    Loader2,
    Calendar,
    Clock
} from 'lucide-react';
import Link from 'next/link';
import { StudentUser, Teacher } from '@/types/portal';
import TodaysScheduleWidget from '@/components/TodaysScheduleWidget';

export const runtime = 'edge';

export default function DashboardPage() {
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
                <p className="text-slate-500 font-medium italic">Synchronizing academic data...</p>
            </div>
        );
    }

    if (!user) return null;

    if (user.role === 'student') {
        return <StudentDashboard user={user as unknown as StudentUser} />;
    }

    if (user.role === 'teacher') {
        return <TeacherDashboardView currentTeacher={currentTeacher as unknown as Teacher} />;
    }

    return null;
}

function StudentDashboard({ user }: { user: StudentUser }) {
    const grades = user.grades || [];
    const averageScore = user.averageScore || 0;
    const isTopPerformer = averageScore > 90;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Student Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center space-x-4 mb-2">
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                            Hello, <span className="text-purple-600 dark:text-purple-400">{user.userName.split(' ')[0]}</span>
                        </h1>
                        {isTopPerformer && (
                            <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-amber-200 dark:border-amber-700/50 flex items-center">
                                <Star className="w-3 h-3 mr-1 fill-amber-700 dark:fill-amber-400" /> Top Performer
                            </span>
                        )}
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg italic tracking-tight">Your academic progress is being tracked.</p>
                </div>
                <div className="flex items-center space-x-3  dark:bg-slate-900/50 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400">
                        <Calendar className="w-5 h-5" />
                    </div>
                    <div className="pr-4">
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Status</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Enrolled Student</p>
                    </div>
                </div>
            </div>

            {/* Student Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Class Info Card */}
                <div className="glass p-8 rounded-[40px] border-slate-100 dark:border-slate-800 flex flex-col justify-between group hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-500 shadow-xl shadow-slate-100/50 dark:shadow-none">
                    <div className="flex items-center justify-between mb-8">
                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Enrollment</span>
                    </div>
                    <div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter mb-1">{user.class?.name || 'No Class Assigned'}</div>
                        <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">{user.class?.subjects?.length || 0} Subjects Enrolled</p>
                    </div>
                </div>

                {/* Success Rate Card */}
                <div className="glass p-8 rounded-[40px] border-slate-100 dark:border-slate-800 flex flex-col justify-between group hover:border-green-200 dark:hover:border-green-800 transition-all duration-500 shadow-xl shadow-slate-100/50 dark:shadow-none">
                    <div className="flex items-center justify-between mb-8">
                        <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Success Rate</span>
                    </div>
                    <div>
                        <div className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-1 tabular-nums">{user.successRate ? Number(user.successRate.toFixed(1)) : 'N/A'}%</div>
                        <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">Overall Performance</p>
                    </div>
                </div>

                {/* Average Score Card */}
                <div className="bg-slate-900 dark:bg-slate-950 p-8 rounded-[40px] border border-white/5 flex flex-col justify-between group overflow-hidden relative shadow-2xl">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-150 transition-transform duration-1000">
                        <Award className="w-24 h-24 text-white" />
                    </div>
                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                            <Star className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Average Score</span>
                    </div>
                    <div className="relative z-10">
                        <div className="text-5xl font-black text-white tracking-tighter mb-1 tabular-nums">{averageScore ? Number(averageScore.toFixed(1)) : 'N/A'}</div>
                        <p className="text-slate-400 font-bold text-sm tracking-tight uppercase">Current Standing</p>
                    </div>
                </div>
            </div>

            {/* Today's Schedule and Academic modules summary */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3">
                    <TodaysScheduleWidget schedules={user.schedules || []} role="student" />
                </div>

                <div className="hidden lg:flex flex-col gap-6">
                    <div className="glass p-6 rounded-[32px] border-slate-100 dark:border-slate-800 bg-linear-to-br from-purple-500 to-indigo-600 text-white shadow-xl shadow-purple-500/20">
                        <h4 className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-4">Daily Reminder</h4>
                        <p className="text-sm font-bold leading-relaxed">Dont forget to check your full grid for any last-minute lecture changes.</p>
                        <Link href="/dashboard/my-schedule" className="mt-6 flex items-center text-[10px] font-black uppercase tracking-[0.2em] bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-colors w-fit">
                            Open Grid <ChevronRight className="w-3 h-3 ml-1" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Recent Grades / Enrolled Subjects List */}
            <div className="glass p-8 rounded-[48px] border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/50 dark:shadow-none">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center">
                        <Award className="w-6 h-6 mr-3 text-amber-500" />
                        Academic Modules
                    </h2>
                    <Link href="/profile" className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest hover:underline flex items-center group">
                        View Full Report <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {user.class?.subjects?.slice(0, 3).map((subject) => {
                        const grade = grades.find((g) => g.subject.id === subject.id);

                        return (
                            <div key={subject.id} className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 hover: dark:hover:bg-slate-800 hover:border-purple-200 dark:hover:border-purple-900/30 hover:shadow-xl transition-all group/card">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-10 h-10  dark:bg-slate-800 rounded-xl flex items-center justify-center font-black text-purple-600 dark:text-purple-400 shadow-sm group-hover/card:rotate-12 transition-transform">
                                        {subject.name.charAt(0)}
                                    </div>
                                    {grade && (
                                        <span className={`text-xs font-black px-2 py-1 rounded-lg ${grade.score >= 50 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400'}`}>
                                            {grade.score}
                                        </span>

                                    )}
                                </div>
                                <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover/card:text-purple-600 dark:group-hover/card:text-purple-400 transition-colors">{subject.name}</h4>
                                <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                        {grade ? 'Graded' : 'Pending Evaluation'}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                    {(!user.class?.subjects || user.class.subjects.length === 0) && (
                        <div className="col-span-full py-12 text-center text-slate-400 font-bold italic">
                            No modules assigned yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function TeacherDashboardView({ currentTeacher }: { currentTeacher: Teacher }) {
    if (!currentTeacher) return null;

    const subjects = currentTeacher.subjectsTaught || [];
    const totalSubjects = subjects.length;

    const uniqueStudentIds = new Set<string>();
    subjects.forEach(sub => {
        sub.grades.forEach(g => uniqueStudentIds.add(g.student.id));
    });
    const totalStudents = uniqueStudentIds.size;

    let totalScoreSum = 0;
    subjects.forEach(sub => {
        sub.grades.forEach(g => {
            totalScoreSum += g.score;
        });
    });

    const teacherSuccessRate = totalSubjects > 0 ? Number((totalScoreSum / totalSubjects).toFixed(1)) : 0;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                        Welcome back, <span className="text-purple-600 dark:text-purple-400">{currentTeacher.userName.split(' ')[0]}</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium text-lg italic tracking-tight">System online. Your educational impact is currently being monitored.</p>
                </div>
                <div className="flex items-center space-x-3  dark:bg-slate-900/50 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400">
                        <Calendar className="w-5 h-5" />
                    </div>
                    <div className="pr-4">
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Term Status</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Active Semester</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-8 rounded-[40px] border-slate-100 dark:border-slate-800 flex flex-col justify-between group hover:border-purple-200 dark:hover:border-purple-900/30 transition-all duration-500 shadow-xl shadow-slate-100/50 dark:shadow-none">
                    <div className="flex items-center justify-between mb-8">
                        <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Modules</span>
                    </div>
                    <div>
                        <div className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-1 tabular-nums">{totalSubjects}</div>
                        <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">Subjects Taught</p>
                    </div>
                </div>

                <div className="glass p-8 rounded-[40px] border-slate-100 dark:border-slate-800 flex flex-col justify-between group hover:border-blue-200 dark:hover:border-blue-900/30 transition-all duration-500 shadow-xl shadow-slate-100/50 dark:shadow-none">
                    <div className="flex items-center justify-between mb-8">
                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                            <Users className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Cohort</span>
                    </div>
                    <div>
                        <div className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-1 tabular-nums">{totalStudents}</div>
                        <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">Total Students</p>
                    </div>
                </div>

                <div className="bg-slate-900 dark:bg-slate-950 p-8 rounded-[40px] border border-white/5 flex flex-col justify-between group overflow-hidden relative shadow-2xl">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-150 transition-transform duration-1000">
                        <TrendingUp className="w-24 h-24 text-white" />
                    </div>
                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform">
                            <Star className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aggregate</span>
                    </div>
                    <div className="relative z-10">
                        <div className="text-5xl font-black text-white tracking-tighter mb-1 tabular-nums">{teacherSuccessRate}</div>
                        <p className="text-slate-400 font-bold text-sm tracking-tight uppercase">Success Rate Index</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <TodaysScheduleWidget schedules={currentTeacher.schedules || []} role="teacher" />
                </div>
                <div className="glass p-8 rounded-[40px] border-slate-100 dark:border-slate-800 bg-slate-900 dark:bg-slate-950 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-150 transition-transform duration-1000">
                        <Clock className="w-24 h-24" />
                    </div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-8 relative z-10">System Integrity</h4>
                    <div className="space-y-6 relative z-10">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400 text-sm font-bold">Sync Status</span>
                            <span className="text-green-400 font-black text-xs uppercase tracking-widest">Online</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400 text-sm font-bold">Auto-Sync</span>
                            <span className="text-slate-200 font-black text-xs uppercase tracking-widest">Every 60s</span>
                        </div>
                        <div className="pt-6 border-t border-white/5">
                            <Link href="/dashboard/my-schedule" className="block text-center py-4 bg-purple-600 hover:bg-purple-700 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-colors">
                                Review Full Timetable
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3 glass p-8 rounded-[48px] border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/50 dark:shadow-none">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center">
                            <Award className="w-6 h-6 mr-3 text-amber-500" />
                            Academic Modules
                        </h2>
                        <Link href="/subjects" className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest hover:underline flex items-center group">
                            Full Syllabus <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {subjects.slice(0, 3).map(subject => {
                            const enrollment = subject.grades.length;
                            return (
                                <Link key={subject.id} href={`/subjects/${subject.id}`} className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 hover: dark:hover:bg-slate-800 hover:border-purple-200 dark:hover:border-purple-900/30 hover:shadow-xl transition-all group/card">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-10 h-10  dark:bg-slate-800 rounded-xl flex items-center justify-center font-black text-purple-600 dark:text-purple-400 shadow-sm group-hover/card:rotate-12 transition-transform">
                                            {subject.name.charAt(0)}
                                        </div>
                                    </div>
                                    <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover/card:text-purple-600 dark:group-hover/card:text-purple-400 transition-colors">{subject.name}</h4>
                                    <p className="text-slate-400 dark:text-slate-500 font-bold text-xs mt-1 italic">{subject.class?.name || 'Unassigned Cohort'}</p>
                                    <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Enrollment</span>
                                        <span className="text-xs font-black text-slate-700 dark:text-slate-300">{enrollment}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
