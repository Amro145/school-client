"use client";

export const runtime = "edge";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { RootState } from "@/lib/redux/store";
import { useFetchData } from "@/hooks/useFetchData";
import { ExamSubmission } from "@shared/types/models";
import { ArrowLeft, Search } from "lucide-react";
import Link from "next/link";

export default function ExamReportsPage() {
    const params = useParams();
    const id = params.id as string;
    const { user } = useSelector((state: RootState) => state.auth);

    const { data: reportData, isLoading: loading, error: fetchError } = useFetchData<{ getTeacherExamReports: ExamSubmission[] }>(
        ['exam', id, 'reports'],
        `
        query GetTeacherExamReports($examId: Int!) {
          getTeacherExamReports(examId: $examId) {
            id
            student {
              userName
              email
            }
            totalScore
            submittedAt
          }
        }
        `,
        { examId: Number(id) }
    );

    const reports = reportData?.getTeacherExamReports || [];
    const error = fetchError ? (fetchError as any).message : null;

    const [searchTerm, setSearchTerm] = useState("");

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return <div className="p-8 text-center text-red-500 font-bold">Error loading reports: {error}</div>;
    }

    if (user?.role === "student") {
        return <div className="p-8 text-center text-red-500">Access Denied</div>;
    }

    const filteredReports = reports.filter(r =>
        r.student?.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.student?.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const averageScore = reports.length > 0
        ? Math.round(reports.reduce((acc, curr) => acc + curr.totalScore, 0) / reports.length)
        : 0;

    const maxScore = reports.length > 0
        ? Math.max(...reports.map(r => r.totalScore))
        : 0;

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/exams" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                    <ArrowLeft className="w-6 h-6 text-slate-500" />
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Exam Report</h1>
                    <p className="text-slate-500 dark:text-slate-400">Student performance analytics</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-slate-200/60 dark:border-slate-800 shadow-sm">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Submissions</span>
                    <span className="text-3xl font-black text-slate-900 dark:text-white">{reports.length}</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-slate-200/60 dark:border-slate-800 shadow-sm">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Average Score</span>
                    <span className="text-3xl font-black text-blue-600 dark:text-blue-400">{averageScore}</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-slate-200/60 dark:border-slate-800 shadow-sm">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Highest Score</span>
                    <span className="text-3xl font-black text-green-600 dark:text-green-400">{maxScore}</span>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200/60 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search student..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none ring-0 focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Student</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:table-cell">Email</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider hidden md:table-cell">Submitted At</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredReports.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500 font-medium">
                                        No submissions found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredReports.map((report) => (
                                    <tr key={report.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400">
                                                    {report.student?.userName.substring(0, 2).toUpperCase()}
                                                </div>
                                                <span className="font-bold text-slate-900 dark:text-white">{report.student?.userName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-400 text-sm hidden sm:table-cell">
                                            {report.student?.email}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-500 text-sm hidden md:table-cell">
                                            {new Date(report.submittedAt).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                                {report.totalScore}
                                            </span>
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
