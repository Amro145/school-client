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
    Calendar
} from 'lucide-react';
import Link from 'next/link';

export default function TeacherDashboard() {
    const dispatch = useDispatch<AppDispatch>();
    const { currentTeacher, loading } = useSelector((state: RootState) => state.teacher);

    useEffect(() => {
        dispatch(fetchTeacher());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
                <p className="text-slate-500 font-medium italic">Assembling your academic dashboard...</p>
            </div>
        );
    }

    if (!currentTeacher) return null;

    const subjects = currentTeacher.subjectsTaught || [];

    // Metric 1: Total Number of Subjects Taught
    const totalSubjects = subjects.length;

    // Metric 2: Total Number of Students across all subjects (Unique students)
    const uniqueStudentIds = new Set<string>();
    subjects.forEach(sub => {
        sub.grades.forEach(g => uniqueStudentIds.add(g.student.id));
    });
    const totalStudents = uniqueStudentIds.size;

    // Metric 3: Teacher's Overall Success Rate
    // Formula: (Total Sum of all 'score' values / Count of 'subjectsTaught')
    let totalScoreSum = 0;
    subjects.forEach(sub => {
        sub.grades.forEach(g => {
            totalScoreSum += g.score;
        });
    });

    // Handle division by zero if no subjects
    const teacherSuccessRate = totalSubjects > 0 ? (totalScoreSum / totalSubjects).toFixed(1) : '0.0';

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
                        Welcome back, <span className="text-purple-600">{currentTeacher.userName.split(' ')[0]}</span>
                    </h1>
                    <p className="text-slate-500 mt-3 font-medium text-lg italic tracking-tight">System online. Your educational impact is currently being monitored.</p>
                </div>
                <div className="flex items-center space-x-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                        <Calendar className="w-5 h-5" />
                    </div>
                    <div className="pr-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Term Status</p>
                        <p className="text-sm font-bold text-slate-900">Active Semester</p>
                    </div>
                </div>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stats Cards */}
                <div className="glass p-8 rounded-[40px] border-slate-100 flex flex-col justify-between group hover:border-purple-200 transition-all duration-500 shadow-xl shadow-slate-100/50">
                    <div className="flex items-center justify-between mb-8">
                        <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Modules</span>
                    </div>
                    <div>
                        <div className="text-5xl font-black text-slate-900 tracking-tighter mb-1 tabular-nums">{totalSubjects}</div>
                        <p className="text-slate-500 font-bold text-sm">Subjects Taught</p>
                    </div>
                </div>

                <div className="glass p-8 rounded-[40px] border-slate-100 flex flex-col justify-between group hover:border-blue-200 transition-all duration-500 shadow-xl shadow-slate-100/50">
                    <div className="flex items-center justify-between mb-8">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                            <Users className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cohort</span>
                    </div>
                    <div>
                        <div className="text-5xl font-black text-slate-900 tracking-tighter mb-1 tabular-nums">{totalStudents}</div>
                        <p className="text-slate-500 font-bold text-sm">Total Students</p>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[40px] border border-white/5 flex flex-col justify-between group overflow-hidden relative shadow-2xl">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-150 transition-transform duration-1000">
                        <TrendingUp className="w-24 h-24 text-white" />
                    </div>
                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform">
                            <Star className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aggregate</span>
                    </div>
                    <div className="relative z-10">
                        <div className="text-5xl font-black text-white tracking-tighter mb-1 tabular-nums">{teacherSuccessRate}</div>
                        <p className="text-slate-400 font-bold text-sm tracking-tight uppercase">Success Rate Index</p>
                    </div>
                </div>

                {/* My Subjects Summary */}
                <div className="md:col-span-3 glass p-8 rounded-[48px] border-slate-100 shadow-xl shadow-slate-100/50">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
                            <Award className="w-6 h-6 mr-3 text-amber-500" />
                            Academic Modules
                        </h2>
                        <Link href="/subjects" className="text-xs font-black text-purple-600 uppercase tracking-widest hover:underline flex items-center group">
                            Full Syllabus <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {subjects.slice(0, 3).map(subject => {
                            // Calc Subject success rate for display? The requirement says "Subject Detail Page" has a specific formula.
                            // Here I'll just show basics or maybe the Enrollment count.
                            const enrollment = subject.grades.length;

                            return (
                                <Link key={subject.id} href={`/subjects/${subject.id}`} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:border-purple-200 hover:shadow-xl transition-all group/card">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-purple-600 shadow-sm group-hover/card:rotate-12 transition-transform">
                                            {subject.name.charAt(0)}
                                        </div>
                                    </div>
                                    <h4 className="font-black text-slate-900 uppercase tracking-tight group-hover/card:text-purple-600 transition-colors">{subject.name}</h4>
                                    <p className="text-slate-400 font-bold text-xs mt-1 italic">{subject.class?.name || 'Unassigned Cohort'}</p>
                                    <div className="mt-4 pt-4 border-t border-slate-200/50 flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Enrollment</span>
                                        <span className="text-xs font-black text-slate-700">{enrollment}</span>
                                    </div>
                                </Link>
                            );
                        })}
                        {subjects.length === 0 && (
                            <div className="col-span-full py-12 text-center text-slate-400 font-bold italic">
                                No subjects assigned yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
