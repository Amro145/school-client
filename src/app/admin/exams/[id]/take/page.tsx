"use client";

import { useEffect, useState, use, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/redux/store";
import { fetchExamForTaking, submitExam } from "@/lib/redux/slices/examSlice";
import { useRouter } from "next/navigation";
import {
    Clock,
    ChevronRight,
    ChevronLeft,
    CheckCircle2,
    Send,
    AlertCircle,
    HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TakeExamPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { currentExam, loading, error } = useSelector((state: RootState) => state.exam);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<{ questionId: number, selectedIndex: number }[]>([]);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        dispatch(fetchExamForTaking(Number(id)));
    }, [dispatch, id]);

    useEffect(() => {
        if (currentExam) {
            setTimeLeft(currentExam.durationInMinutes * 60);
        }
    }, [currentExam]);

    const handleAutoSubmit = useCallback(async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            await dispatch(submitExam({ examId: Number(id), answers })).unwrap();
            router.push(`/admin/exams/${id}/result`);
        } catch (err) {
            console.error("Auto-submit failed", err);
            setIsSubmitting(false);
        }
    }, [dispatch, id, answers, router, isSubmitting]);

    useEffect(() => {
        if (timeLeft <= 0) {
            if (currentExam) handleAutoSubmit();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, currentExam, handleAutoSubmit]);

    const handleSelectOption = (questionId: number, selectedIndex: number) => {
        setAnswers(prev => {
            const existing = prev.filter(a => a.questionId !== questionId);
            return [...existing, { questionId, selectedIndex }];
        });
    };

    const handleSubmit = async () => {
        if (!confirm("Are you sure you want to submit your exam?")) return;
        setIsSubmitting(true);
        try {
            await dispatch(submitExam({ examId: Number(id), answers })).unwrap();
            router.push(`/admin/exams/${id}/result`);
        } catch (err) {
            alert("Submission failed. Please try again.");
            setIsSubmitting(false);
        }
    };

    if (loading || !currentExam) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const currentQuestion = currentExam.questions?.[currentIndex];
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const isLastQuestion = currentIndex === (currentExam.questions?.length || 0) - 1;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
            {/* Exam Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-6 py-4 md:px-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="hidden md:block">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{currentExam.title}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Active Session</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border font-black text-lg transition-all ${timeLeft < 60
                            ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900 text-red-600 animate-pulse"
                            : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                        }`}>
                        <Clock className={`w-5 h-5 ${timeLeft < 60 ? "text-red-500" : "text-blue-500"}`} />
                        {formatTime(timeLeft)}
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="hidden md:flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/25 active:scale-95 disabled:opacity-50"
                    >
                        {isSubmitting ? "Submitting..." : (
                            <>
                                <Send className="w-4 h-4" />
                                Submit Exam
                            </>
                        )}
                    </button>
                </div>
            </header>

            <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 md:py-20 flex flex-col items-center">
                {/* Progress Bar */}
                <div className="w-full mb-12 space-y-3">
                    <div className="flex justify-between items-end px-1">
                        <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                            Question {currentIndex + 1} <span className="text-slate-400 font-bold ml-1">of {currentExam.questions?.length}</span>
                        </span>
                        <span className="text-sm font-black text-blue-600 dark:text-blue-400">
                            {Math.round(((currentIndex + 1) / (currentExam.questions?.length || 1)) * 100)}% Complete
                        </span>
                    </div>
                    <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-1 shadow-inner">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentIndex + 1) / (currentExam.questions?.length || 1)) * 100}%` }}
                            className="h-full bg-linear-to-r from-blue-600 to-indigo-500 rounded-full shadow-[0_0_12px_rgba(37,99,235,0.4)]"
                        />
                    </div>
                </div>

                {/* Question Area */}
                <div className="w-full relative min-h-[400px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="bg-white dark:bg-slate-900 rounded-[40px] p-8 md:p-12 border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden group"
                        >
                            <div className="flex items-start gap-6 mb-10">
                                <div className="w-16 h-16 bg-blue-600 rounded-[22px] flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-500/30 shrink-0">
                                    {currentIndex + 1}
                                </div>
                                <div className="space-y-4 pt-1">
                                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                                        {currentQuestion?.questionText}
                                    </h3>
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg text-xs font-black uppercase tracking-widest border border-purple-100 dark:border-purple-900/40">
                                            <HelpCircle className="w-3.5 h-3.5" />
                                            Multiple Choice
                                        </span>
                                        <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg text-xs font-black uppercase tracking-widest border border-green-100 dark:border-green-900/40">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            {currentQuestion?.points} Points
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {currentQuestion?.options.map((option, oIndex) => {
                                    const isSelected = answers.find(a => a.questionId === Number(currentQuestion.id))?.selectedIndex === oIndex;
                                    return (
                                        <button
                                            key={oIndex}
                                            onClick={() => handleSelectOption(Number(currentQuestion.id), oIndex)}
                                            className={`flex items-center gap-5 p-6 rounded-[24px] border-2 text-left transition-all group/option relative overflow-hidden ${isSelected
                                                    ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/40"
                                                    : "bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-500/50 hover:bg-white dark:hover:bg-slate-800 shadow-sm"
                                                }`}
                                        >
                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shrink-0 transition-all ${isSelected
                                                    ? "bg-white text-blue-600"
                                                    : "bg-white dark:bg-slate-700 text-slate-400 group-hover/option:text-blue-500"
                                                }`}>
                                                {String.fromCharCode(65 + oIndex)}
                                            </div>
                                            <span className="font-bold text-lg tracking-tight leading-snug">{option}</span>
                                            {isSelected && (
                                                <motion.div
                                                    layoutId="check"
                                                    className="absolute right-6 top-1/2 -translate-y-1/2"
                                                >
                                                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                                                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer Navigation */}
                <div className="w-full mt-10 flex items-center justify-between px-2">
                    <button
                        onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentIndex === 0}
                        className="flex items-center gap-2 px-8 py-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[24px] font-black text-slate-500 dark:text-slate-400 transition-all hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed group shadow-sm active:scale-95"
                    >
                        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                        PREVIOUS
                    </button>

                    <div className="hidden sm:flex gap-2">
                        {currentExam.questions?.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentIndex(i)}
                                className={`w-3 h-3 rounded-full transition-all ${i === currentIndex ? "w-8 bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
                                    }`}
                            />
                        ))}
                    </div>

                    <div className="flex gap-4">
                        {isLastQuestion ? (
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex items-center gap-3 px-10 py-5 bg-green-600 hover:bg-green-700 text-white rounded-[24px] font-black shadow-xl shadow-green-500/25 transition-all animate-in zoom-in-95 active:scale-95"
                            >
                                <Send className="w-5 h-5" />
                                SUBMIT FINISH
                            </button>
                        ) : (
                            <button
                                onClick={() => setCurrentIndex(prev => prev + 1)}
                                className="flex items-center gap-2 px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[24px] font-black transition-all hover:scale-105 active:scale-95 group shadow-xl shadow-slate-900/20"
                            >
                                NEXT QUESTION
                                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Warning Sticky Footer (Mobile Only) */}
            <div className={`md:hidden fixed bottom-0 left-0 w-full p-4 bg-red-600 text-white flex items-center justify-center gap-3 transition-transform duration-500 ${timeLeft < 120 ? "translate-y-0" : "translate-y-full"}`}>
                <AlertCircle className="w-5 h-5 animate-bounce" />
                <span className="text-xs font-black uppercase tracking-wider">Time is running out! Finsh quickly.</span>
            </div>
        </div>
    );
}
