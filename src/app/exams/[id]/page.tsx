"use client";

export const runtime = "edge";

import { useEffect } from "react";
import { useFetchData } from "@/hooks/useFetchData";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { RootState } from "@/lib/redux/store";
import { Exam } from "@shared/types/models";
import { ArrowLeft, Clock, AlertCircle, PlayCircle, BookOpen, User, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ExamLobbyPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const { user } = useSelector((state: RootState) => state.auth);

    const { data: examData, isLoading: loading, error: fetchError } = useFetchData<{ exam: Exam }>(
        ['exam', id, 'lobby'],
        `
        query GetExamDetails($id: ID!) {
          exam(id: $id) {
            id
            title
            description
            durationInMinutes
            subject {
                id
                name
            }
            teacher {
                id
                userName
            }
          }
        }
        `,
        { id }
    );

    const currentExam = examData?.exam;
    const error = fetchError ? (fetchError as any).message : null;

    // No explicit initialization needed as useFetchData handles it

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {


        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Unable to load exam</h3>
                <p className="text-slate-500 max-w-md text-center">{error}</p>
                <Link href="/exams" className="px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    Return to Exams
                </Link>
            </div>
        );
    }

    if (!currentExam) return null;

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <Link href="/exams" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-medium">
                <ArrowLeft className="w-4 h-4" />
                Back to Exams
            </Link>

            <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 md:p-12 border border-slate-200/60 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden relative">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -ml-32 -mb-32"></div>

                <div className="relative z-10">
                    <div className="mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full border border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold text-xs uppercase tracking-wider mb-6">
                            <BookOpen className="w-3.5 h-3.5" />
                            {currentExam.subject?.name} Assessment
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight leading-tight">
                            {currentExam.title}
                        </h1>
                        <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-2xl">
                            {currentExam.description || "No description provided for this examination."}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-10">
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-6 border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-xl text-orange-600 dark:text-orange-400">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Duration</span>
                            </div>
                            <span className="text-2xl font-black text-slate-900 dark:text-white block">
                                {currentExam.durationInMinutes} <span className="text-base font-bold text-slate-400">min</span>
                            </span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-6 border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-xl text-purple-600 dark:text-purple-400">
                                    <User className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Examiner</span>
                            </div>
                            <span className="text-xl font-bold text-slate-900 dark:text-white block truncate">
                                {currentExam.teacher?.userName}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4 mb-10">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Instructions</h4>
                        <ul className="space-y-3">
                            {[
                                "Ensure you have a stable internet connection.",
                                "Do not refresh the page during the exam.",
                                "Answer all questions within the time limit.",
                                "Once submitted, you cannot change your answers."
                            ].map((rule, i) => (
                                <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-400 font-medium text-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                                    {rule}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-col gap-4">
                        <Link
                            href={`/exams/${currentExam.id}/take`}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-500/25 transition-all active:scale-95 flex items-center justify-center gap-3 group"
                        >
                            Start Examination
                            <PlayCircle className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-wide">
                            By clicking start, the timer will begin immediately.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
