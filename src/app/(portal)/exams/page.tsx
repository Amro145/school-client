"use client";

export const runtime = "edge";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/redux/store";
import { fetchAvailableExams } from "@/lib/redux/slices/examSlice";
import { fetchSubjects } from "@/lib/redux/slices/adminSlice";
import Link from "next/link";
import {
    Plus,
    FileText,
    Clock,
    ChevronRight,
    BookOpen
} from "lucide-react";
import { motion } from "framer-motion";

export default function ExamsPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { availableExams, loading } = useSelector((state: RootState) => state.exam);

    useEffect(() => {
        dispatch(fetchAvailableExams());
        dispatch(fetchSubjects());
    }, [dispatch]);

    const isTeacher = user?.role === "teacher" || user?.role === "admin";

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        Examination System
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        {isTeacher ? "Manage and monitor student evaluations" : "View and participate in scheduled exams"}
                    </p>
                </div>
                {isTeacher && (
                    <Link
                        href="/exams/create"
                        className="flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/25 active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                        Create New Exam
                    </Link>
                )}
            </div>

            {/* All Exams Section */}
            <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <span className="w-2 h-8 bg-blue-600 rounded-full inline-block"></span>
                    Available Exams
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {availableExams.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200/60 dark:border-slate-800 animate-in fade-in duration-700">
                            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-6">
                                <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">No exams available</h3>
                            <p className="text-slate-500 dark:text-slate-400">There are no exams assigned to you at this time.</p>
                        </div>
                    ) : (
                        availableExams.map((exam, index) => (
                            <motion.div
                                key={exam.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-slate-200/60 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 relative overflow-hidden"
                            >
                                {exam.hasSubmitted && (
                                    <div className="absolute top-0 right-0 px-4 py-1.5 bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-black uppercase tracking-widest rounded-bl-2xl border-l border-b border-green-500/20">
                                        Previously Completed
                                    </div>
                                )}
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                                        <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="flex items-center text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-700">
                                        <Clock className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                                        {exam.durationInMinutes} mins
                                    </div>
                                </div>

                                <Link href={isTeacher ? `/exams/${exam.id}/reports` : `/exams/${exam.id}`}>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                                        {exam.title}
                                    </h3>
                                </Link>

                                <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-6 font-medium">
                                    {exam.description || "No description provided for this examination."}
                                </p>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-3 border border-slate-100 dark:border-slate-800">
                                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">Subject</span>
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate block">{exam.subject?.name}</span>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-3 border border-slate-100 dark:border-slate-800">
                                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">Class</span>
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate block">{exam.class?.name}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold mr-2 text-slate-600 dark:text-slate-400">
                                            {exam.teacher?.userName?.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="text-[11px]">
                                            <p className="font-bold text-slate-900 dark:text-white leading-none">{exam.teacher?.userName}</p>
                                            <p className="text-slate-400 font-medium leading-none mt-1">Examiner</p>
                                        </div>
                                    </div>
                                    {!exam.hasSubmitted && (
                                        <Link
                                            href={isTeacher ? `/exams/${exam.id}/reports` : `/exams/${exam.id}`}
                                            className={`p-2 rounded-xl transition-all ${exam.hasSubmitted ? 'bg-green-50 dark:bg-green-900/20 text-green-600 hover:bg-green-600 hover:text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-blue-600 hover:text-white'}`}
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </Link>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

        </div>
    );
}
