'use client';

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { useFetchData } from '@/hooks/useFetchData';
import { Student } from '@shared/types/models';
import {
    Mail,
    BookOpen,
    Award,
    ShieldCheck,
    GraduationCap,
    TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudentProfilePage() {
    const { user } = useSelector((state: RootState) => state.auth);

    const { data: studentData, isLoading: loading } = useFetchData<{ student: Student }>(
        ['student', user?.id || ''],
        `
        query GetStudentProfile($id: String!) {
          student(id: $id) {
            id
            userName
            email
            class {
                id
                name
            }
            grades {
                id
                score
                subject {
                    id
                    name
                }
            }
            averageScore
          }
        }
        `,
        { id: String(user?.id || '') },
        { enabled: !!user?.id }
    );

    const currentStudent = studentData?.student;

    if (loading || !currentStudent) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <div className="w-20 h-20 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-slate-500 font-black italic">Retrieving Intel Profile...</p>
            </div>
        );
    }

    const totalMarks = currentStudent.grades?.reduce((acc, g) => acc + g.score, 0) || 0;
    const numSubjects = currentStudent.grades?.length || 0;
    const successRate = totalMarks > 0 ? (numSubjects / totalMarks).toFixed(4) : "0.0000";
    const avgScore = numSubjects > 0 ? Math.round(totalMarks / numSubjects) : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 pb-20"
        >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Intelligence Profile</h1>
                    <p className="text-slate-500 mt-4 font-medium text-lg italic">Read-only institutional identity and performance index...</p>
                </div>
                <div className="px-6 py-3 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center">
                    <ShieldCheck className="w-4 h-4 mr-2" /> Verified Identification
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-1 space-y-8">
                    <div className=" p-10 rounded-[56px] border border-slate-100 shadow-sm text-center relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-br from-blue-600 to-indigo-700"></div>
                        <div className="relative z-10 pt-16">
                            <div className="w-32 h-32 rounded-[40px]  border-8 border-slate-50 flex items-center justify-center text-5xl font-black text-blue-600 mx-auto shadow-2xl group-hover:rotate-6 transition-transform">
                                {currentStudent.userName.charAt(0)}
                            </div>
                            <h2 className="mt-8 text-3xl font-black text-slate-900 leading-tight capitalize">{currentStudent.userName}</h2>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2 italic">Institutional Node: Student</p>

                            <div className="mt-10 space-y-4 text-left">
                                <div className="flex items-center p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
                                    <Mail className="w-5 h-5 text-slate-400 mr-4" />
                                    <div className="overflow-hidden">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Secure Email</p>
                                        <p className="text-slate-900 font-black truncate">{currentStudent.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
                                    <BookOpen className="w-5 h-5 text-slate-400 mr-4" />
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Assigned Cohort</p>
                                        <p className="text-slate-900 font-black">{currentStudent.class?.name || 'Unassigned'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-950 p-10 rounded-[56px] text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-blue-600/20 rounded-full blur-[80px]"></div>
                        <div className="relative z-10 text-center">
                            <TrendingUp className="w-12 h-12 text-blue-500 mx-auto mb-6" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Success Rate Metric</h3>
                            <div className="text-6xl font-black tracking-tighter tabular-nums mb-4">{successRate}</div>
                            <div className="w-full h-2 /5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${avgScore}%` }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="h-full bg-blue-600"
                                />
                            </div>
                            <p className="text-slate-500 text-[10px] font-bold mt-6 italic">Calculation based on institutional success algorithms.</p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2  p-12 rounded-[56px] border border-slate-100 shadow-sm glass">
                    <div className="flex items-center justify-between mb-12">
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight flex items-center">
                            <Award className="w-8 h-8 mr-4 text-amber-500" />
                            Academic Catalog
                        </h3>
                        <div className="px-5 py-2.5 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">Read Only Access</div>
                    </div>

                    <div className="space-y-6">
                        {currentStudent.grades?.map((grade, idx) => (
                            <motion.div
                                key={grade.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-center justify-between p-8 bg-slate-50/50 rounded-[32px] border border-transparent hover:border-slate-100 hover: hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group"
                            >
                                <div className="flex items-center space-x-8">
                                    <div className="w-16 h-16  border border-slate-100 rounded-[24px] flex items-center justify-center text-blue-600 shadow-sm group-hover:rotate-6 transition-transform">
                                        <BookOpen className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-black text-slate-900 leading-none mb-2">{grade.subject?.name}</h4>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Verified Performance Data</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Efficiency Score</div>
                                    <div className={`text-4xl font-black tabular-nums transition-colors ${grade.score >= 80 ? 'text-emerald-500' : grade.score >= 60 ? 'text-amber-500' : 'text-rose-500'}`}>
                                        {grade.score}%
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        {(!currentStudent.grades || currentStudent.grades.length === 0) && (
                            <div className="py-24 text-center bg-slate-50/50 rounded-[48px] border-2 border-dashed border-slate-200">
                                <GraduationCap className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                                <p className="text-slate-400 font-bold italic">No cataloged performance data streams detected.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
