"use client";

export const runtime = "edge";

import { useEffect, use } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/redux/store";
import { fetchExamForTaking, clearExamState } from "@/lib/redux/slices/examSlice";
import { useRouter } from "next/navigation";
import {
    Clock,
    AlertTriangle,
    Play,
    ChevronLeft,
    CheckCircle2,
    Target,
    HelpCircle
} from "lucide-react";

export default function ExamLobbyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { currentExam, loading, error } = useSelector((state: RootState) => state.exam);

    useEffect(() => {
        dispatch(fetchExamForTaking(Number(id)));
        return () => {
            dispatch(clearExamState());
        };
    }, [dispatch, id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !currentExam) {
        return (
            <div className="max-w-2xl mx-auto p-12 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200/60 dark:border-slate-800 text-center">
                <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Access Restricted</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">
                    {error || "This examination is not available for you at this time."}
                </p>
                <button
                    onClick={() => router.push("/admin/exams")}
                    className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold transition-all"
                >
                    Back to Exams
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.push("/admin/exams")}
                    className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-slate-500"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Exam Lobby</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Please review the instructions before beginning</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Header Card */}
                    <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-[40px] p-10 text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest border border-white/20">
                                    Official Examination
                                </span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">{currentExam.title}</h2>
                            <p className="text-blue-100 font-medium text-lg max-w-lg leading-relaxed">
                                {currentExam.description || "No specific instructions provided. Do your best and focus on each question individually."}
                            </p>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200/60 dark:border-slate-800">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                            Rules & Regulations
                        </h3>
                        <div className="space-y-4">
                            {[
                                "Ensure you have a stable internet connection before starting.",
                                "The countdown timer will start immediately once you press 'Start'.",
                                "Once submitted, you cannot edit your responses.",
                                "Refreshing the page might reset your current progress in some cases.",
                                "All questions are multiple-choice. Select only one option per question."
                            ].map((rule, i) => (
                                <div key={i} className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                                    <div className="shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center text-xs font-black">
                                        {i + 1}
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-300 font-bold text-sm tracking-tight">{rule}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Stats Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200/60 dark:border-slate-800 shadow-sm">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 uppercase tracking-widest text-[10px]">Exam Breakdown</h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                        <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">Time Limit</span>
                                </div>
                                <span className="text-lg font-black text-slate-900 dark:text-white tracking-tighter">{currentExam.durationInMinutes}m</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                                        <HelpCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">Questions</span>
                                </div>
                                <span className="text-lg font-black text-slate-900 dark:text-white tracking-tighter">{currentExam.questions?.length || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-green-50 dark:bg-green-900/20 rounded-xl">
                                        <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">Total Points</span>
                                </div>
                                <span className="text-lg font-black text-slate-900 dark:text-white tracking-tighter">
                                    {currentExam.questions?.reduce((acc, q) => acc + q.points, 0) || 0}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => router.push(`/admin/exams/${id}/take`)}
                            className="w-full mt-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[24px] font-black text-lg transition-all shadow-xl shadow-blue-500/30 flex items-center justify-center gap-3 group active:scale-95"
                        >
                            <Play className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" />
                            START EXAM
                        </button>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-900/10 rounded-3xl p-6 border border-amber-100 dark:border-amber-900/40">
                        <div className="flex gap-4">
                            <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
                            <div>
                                <h4 className="text-amber-800 dark:text-amber-400 font-bold text-sm mb-1 uppercase tracking-wider text-[10px]">Warning</h4>
                                <p className="text-amber-700/80 dark:text-amber-400/70 text-xs font-medium leading-relaxed">
                                    Do not close this tab or navigate away once the exam has started.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
