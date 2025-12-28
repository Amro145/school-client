"use client";

export const runtime = "edge";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { useRouter } from "next/navigation";
import {
    Trophy,
    XCircle,
    Download,
    Home,
    Calendar,
    Star,
    Target
} from "lucide-react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

export default function ExamResultPage() {
    const router = useRouter();
    const { lastSubmission, currentExam } = useSelector((state: RootState) => state.exam);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }, []);

    if (!lastSubmission) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center animate-bounce">
                    <Trophy className="w-10 h-10 text-slate-300" />
                </div>
                <h2 className="text-xl font-bold dark:text-white">No result found</h2>
                <button onClick={() => router.push("/admin/exams")} className="text-blue-600 font-bold">Back to Exams</button>
            </div>
        );
    }

    const totalPoints = currentExam?.questions?.reduce((acc, q) => acc + q.points, 0) || 100;
    const scorePercentage = (lastSubmission.totalScore / totalPoints) * 100;
    const isPassed = scorePercentage >= 50;

    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            {isPassed && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={500} gravity={0.15} colors={['#3B82F6', '#2DD4BF', '#FBBF24', '#EF4444']} />}

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 rounded-[48px] p-8 md:p-16 border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden"
            >
                <div className={`absolute top-0 left-0 w-full h-2 ${isPassed ? "bg-green-500" : "bg-red-500"}`} />

                <div className="flex flex-col items-center text-center space-y-12">
                    {/* Hero Section */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", damping: 12, delay: 0.2 }}
                            className={`w-36 h-36 rounded-full flex items-center justify-center mx-auto shadow-2xl ${isPassed
                                ? "bg-linear-to-br from-green-400 to-green-600 shadow-green-500/40"
                                : "bg-linear-to-br from-red-400 to-red-600 shadow-red-500/40"
                                }`}
                        >
                            {isPassed ? <Trophy className="w-20 h-20 text-white" /> : <XCircle className="w-20 h-20 text-white" />}
                        </motion.div>

                        <div className="space-y-2">
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                                {isPassed ? "Congratulations!" : "Hard Luck!"}
                            </h1>
                            <p className="text-xl font-bold text-slate-500 dark:text-slate-400">
                                {isPassed ? "You have successfully passed the exam." : "You didn't reach the passing score this time."}
                            </p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 transition-all hover:scale-105">
                            <div className="flex flex-col items-center gap-3">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/40 rounded-2xl">
                                    <Star className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <span className="text-sm font-black text-slate-400 uppercase tracking-widest leading-none">Your Score</span>
                                <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                                    {lastSubmission.totalScore}
                                    <span className="text-lg text-slate-400 font-bold ml-1">/ {totalPoints}</span>
                                </span>
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 transition-all hover:scale-105">
                            <div className="flex flex-col items-center gap-3">
                                <div className="p-3 bg-purple-50 dark:bg-purple-900/40 rounded-2xl">
                                    <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <span className="text-sm font-black text-slate-400 uppercase tracking-widest leading-none">Accuracy</span>
                                <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                                    {Math.round(scorePercentage)}%
                                </span>
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 transition-all hover:scale-105">
                            <div className="flex flex-col items-center gap-3">
                                <div className="p-3 bg-amber-50 dark:bg-amber-900/40 rounded-2xl">
                                    <Calendar className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                </div>
                                <span className="text-sm font-black text-slate-400 uppercase tracking-widest leading-none">Status</span>
                                <span className={`text-2xl font-black tracking-widest uppercase mt-1 ${isPassed ? "text-green-500" : "text-red-500"}`}>
                                    {isPassed ? "Passed" : "Failed"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Area */}
                    <div className="w-full flex flex-col md:flex-row items-center justify-center gap-4 pt-10 border-t border-slate-100 dark:border-slate-800">
                        <button
                            onClick={() => router.push("/admin/exams")}
                            className="w-full md:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[28px] font-black text-lg shadow-2xl transition-all hover:scale-105 active:scale-95"
                        >
                            <Home className="w-6 h-6" />
                            Return to Portal
                        </button>
                        <button
                            className="w-full md:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-[28px] font-black text-lg border-2 border-slate-100 dark:border-slate-700 transition-all hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95"
                        >
                            <Download className="w-6 h-6" />
                            Save Results
                        </button>
                    </div>
                </div>
            </motion.div>

            <div className="mt-8 text-center">
                <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">
                    Your detailed answers have been saved and sent to your teacher for review.
                </p>
            </div>
        </div>
    );
}
