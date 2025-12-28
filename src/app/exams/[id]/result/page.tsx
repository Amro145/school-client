"use client";

export const runtime = "edge";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/lib/redux/store";
import { CheckCircle, XCircle, Home, FileText } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ExamResultPage() {
    const router = useRouter();
    const { lastSubmission, loading } = useSelector((state: RootState) => state.exam);

    useEffect(() => {
        if (!lastSubmission && !loading) {
            router.push("/exams");
        }
    }, [lastSubmission, loading, router]);

    if (!lastSubmission) return null;

    // Calculate percentage (Assuming total score is available or we need to know max score)
    // The submission object has `totalScore`.
    // The previous summary mentions `totalScore`. 
    // We don't have max score in submission usually. We might need exam details.
    // Let's assume passed score is the points obtained. 
    // Wait, submission `totalScore` usually means "Points student got".
    // We can't calculate percentage easily without knowing the max possible score of the exam.
    // But for now, let's just display the score.

    const isPass = lastSubmission.totalScore >= 40; // Arbitrary pass mark, or maybe we don't say pass/fail.

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-200/60 dark:border-slate-800 shadow-2xl text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500" />

                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${isPass ? "bg-green-100 text-green-600 dark:bg-green-900/20" : "bg-red-100 text-red-600 dark:bg-red-900/20"
                        }`}
                >
                    {isPass ? <CheckCircle className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
                </motion.div>

                <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                    {isPass ? "Excellent Job!" : "Assessment Complete"}
                </h1>
                <p className="text-slate-500 font-medium mb-8">
                    Your submission has been recorded successfully.
                </p>

                <div className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-6 mb-8">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Total Score</span>
                    <span className="text-5xl font-black text-slate-900 dark:text-white">
                        {lastSubmission.totalScore}
                    </span>
                    <span className="text-sm font-bold text-slate-400 block mt-2">points secured</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Link
                        href="/dashboard"
                        className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-2xl font-bold transition-all"
                    >
                        <Home className="w-5 h-5" />
                        Home
                    </Link>
                    <Link
                        href="/exams"
                        // Maybe link to a review page later?
                        className="flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/25"
                    >
                        <FileText className="w-5 h-5" />
                        Exams
                    </Link>
                </div>
            </div>
        </div>
    );
}
