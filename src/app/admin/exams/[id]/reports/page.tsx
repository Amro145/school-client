"use client";

import { useEffect, use } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/redux/store";
import { fetchTeacherExamReports, fetchAvailableExams } from "@/lib/redux/slices/examSlice";
import { useRouter } from "next/navigation";
import {
    ChevronLeft,
    Users,
    Download,
    Search,
    Filter,
    ArrowUpRight,
    TrendingUp,
    Clock,
    CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";

export default function ExamReportsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { reports, availableExams, loading } = useSelector((state: RootState) => state.exam);

    useEffect(() => {
        dispatch(fetchTeacherExamReports(Number(id)));
        if (availableExams.length === 0) {
            dispatch(fetchAvailableExams());
        }
    }, [dispatch, id, availableExams.length]);

    const exam = availableExams.find(e => e.id === id);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const averageScore = reports.length > 0
        ? (reports.reduce((acc, r) => acc + r.totalScore, 0) / reports.length).toFixed(1)
        : 0;

    return (
        <div className="space-y-8 pb-20">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-slate-500"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Performance Reports</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Detailed breakdown of student evaluations for &quot;{exam?.title || 'Exam'}&quot;</p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Submissions", value: reports.length, icon: Users },
                    { label: "Average Score", value: averageScore, icon: TrendingUp },
                    { label: "Completion", value: "94%", icon: CheckCircle2 },
                    { label: "Status", value: "Live", icon: Clock }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200/60 dark:border-slate-800 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                                <ArrowUpRight className="w-5 h-5" />
                            </button>
                        </div>
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none mb-2">{stat.label}</h4>
                        <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</span>
                    </motion.div>
                ))}
            </div>

            {/* Main Content */}
            <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200/60 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search students or emails..."
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl outline-hidden focus:border-blue-500 transition-all font-medium"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-bold text-slate-600 dark:text-slate-300">
                            <Filter className="w-5 h-5" />
                            Filter
                        </button>
                        <button className="flex items-center gap-2 px-6 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold shadow-xl shadow-slate-900/10">
                            <Download className="w-5 h-5" />
                            Export CSV
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/20">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800">Student Name</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800">Email Address</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800">Submission Date</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800 text-center">Final Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-medium">
                                        No submissions recorded yet for this exam.
                                    </td>
                                </tr>
                            ) : (
                                reports.map((report) => (
                                    <tr key={report.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-8 py-6 border-b border-slate-50 dark:border-slate-800">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 font-black text-xs uppercase shadow-sm">
                                                    {report.student?.userName.substring(0, 2)}
                                                </div>
                                                <span className="font-bold text-slate-900 dark:text-white tracking-tight">{report.student?.userName}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 border-b border-slate-50 dark:border-slate-800">
                                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{report.student?.email}</span>
                                        </td>
                                        <td className="px-8 py-6 border-b border-slate-50 dark:border-slate-800">
                                            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                                                {new Date(report.submittedAt).toLocaleDateString()}
                                            </span>
                                            <span className="block text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">
                                                {new Date(report.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 text-center">
                                            <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl font-black text-lg min-w-[80px] shadow-sm">
                                                {report.totalScore}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
