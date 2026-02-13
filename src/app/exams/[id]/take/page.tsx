"use client";

export const runtime = "edge";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFetchData, useMutateData, fetchData } from "@/hooks/useFetchData";
import { Exam } from "@shared/types/models";
import { Clock, ChevronRight, ChevronLeft, CheckCircle2, AlertTriangle, Save } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import toast from 'react-hot-toast';

export default function TakeExamPage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();

    const { data: examData, isLoading: loading, error: fetchError } = useFetchData<{ getExamForTaking: Exam }>(
        ['exam', id, 'taking'],
        `
        query GetExamForTaking($id: String!) {
          getExamForTaking(id: $id) {
            id
            title
            description
            durationInMinutes
            questions {
              id
              questionText
              options
              points
            }
          }
        }
        `,
        { id: String(id) }
    );

    const currentExam = examData?.getExamForTaking;
    const error = fetchError ? (fetchError as any).message : null;

    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (currentExam && timeLeft === null) {
            setTimeLeft(currentExam.durationInMinutes * 60);
        }
    }, [currentExam, timeLeft]);

    const handleOptionSelect = (questionId: string | number, optionIndex: number) => {
        setAnswers(prev => ({ ...prev, [String(questionId)]: optionIndex }));
    };

    const { mutateAsync: submitExamMutation } = useMutateData(
        async (payload: any) => {
            const data = await fetchData<{ submitExamResponse: { id: string, totalScore: number } }>(
                `
                mutation SubmitExamResponse($examId: String!, $answers: [StudentAnswerInput!]!) {
                    submitExamResponse(examId: $examId, answers: $answers) {
                        id
                        totalScore
                    }
                }
                `,
                payload
            );
            return data.submitExamResponse;
        },
        [['student-exams'], ['exam-attempts']]
    );

    const handleSubmit = useCallback(async () => {
        if (!currentExam || isSubmitting) return;

        setIsSubmitting(true);
        const formattedAnswers = Object.entries(answers).map(([qId, index]) => ({
            questionId: Number(qId),
            selectedIndex: index
        }));

        try {
            const result = await submitExamMutation({
                examId: Number(id),
                answers: formattedAnswers
            });
            // Store result in local storage or session storage to be picked up by the result page
            // Since we're moving away from Redux state for this.
            if (!result) {
                throw new Error("Failed to receive a valid response from the server.");
            }
            sessionStorage.setItem(`last_submission_${id}`, JSON.stringify(result));
            router.push(`/exams/${id}/result`);
        } catch (err: any) {
            setIsSubmitting(false);
            toast.error(err.message || "Failed to submit exam. Please try again.");
        }
    }, [currentExam, isSubmitting, answers, id, router, submitExamMutation]);

    useEffect(() => {
        if (timeLeft === null) return;
        if (timeLeft <= 0) {
            handleSubmit();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => (prev !== null ? prev - 1 : null));
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, handleSubmit]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!isMounted) return null;

    if (loading || !currentExam || !currentExam.questions) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                    <p className="text-slate-500 font-bold">Loading Exam...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Error Loading Exam</h1>
                    <p className="text-slate-500">{error}</p>
                    <button onClick={() => router.back()} className="text-blue-600 font-bold hover:underline">Go Back</button>
                </div>
            </div>
        );
    }

    const questions = currentExam.questions || [];
    if (!questions.length) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                        <AlertTriangle className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">No Questions Found</h1>
                    <p className="text-slate-500">This exam has no questions configured. Please contact your administrator.</p>
                    <button onClick={() => router.back()} className="text-blue-600 font-bold hover:underline">Go Back</button>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[activeQuestionIndex];
    if (!currentQuestion) return null; // Should not happen with above check, but safe

    const progress = ((activeQuestionIndex + 1) / questions.length) * 100;
    const isLastQuestion = activeQuestionIndex === questions.length - 1;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-30 px-6 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                        {activeQuestionIndex + 1}/{questions.length}
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-tight truncate max-w-[200px] md:max-w-md">
                            {currentExam.title}
                        </h2>
                        <div className="w-32 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
                            <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                </div>

                <div className={`px-4 py-2 rounded-xl font-mono font-bold text-lg flex items-center gap-2 ${(timeLeft || 0) < 60 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}>
                    <Clock className="w-5 h-5" />
                    {timeLeft !== null ? formatTime(timeLeft) : "--:--"}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-3xl mx-auto pt-32 px-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestion.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-8"
                    >
                        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200/60 dark:border-slate-800 shadow-sm">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 block">Question {activeQuestionIndex + 1}</span>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-relaxed">
                                {currentQuestion.questionText}
                            </h3>
                        </div>

                        <div className="grid gap-4">
                            {currentQuestion.options.map((option, index) => {
                                const isSelected = answers[currentQuestion.id] === index;
                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleOptionSelect(currentQuestion.id, index)}
                                        className={`w-full p-6 rounded-2xl text-left transition-all border-2 relative group flex items-center ${isSelected
                                            ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/30"
                                            : "bg-white dark:bg-slate-900 border-transparent hover:border-blue-200 dark:hover:border-blue-800 text-slate-700 dark:text-slate-300"
                                            }`}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 transition-colors ${isSelected ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                                            }`}>
                                            {["A", "B", "C", "D"][index]}
                                        </div>
                                        <span className="font-semibold text-lg flex-1">{option}</span>
                                        {isSelected && <CheckCircle2 className="w-6 h-6 text-white" />}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Footer */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-30">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <button
                        onClick={() => setActiveQuestionIndex(prev => Math.max(0, prev - 1))}
                        disabled={activeQuestionIndex === 0}
                        className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Previous
                    </button>

                    {isLastQuestion ? (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-500/30 transition-all active:scale-95 flex items-center gap-2"
                        >
                            {isSubmitting ? "Submitting..." : "Submit Exam"}
                            <Save className="w-5 h-5" />
                        </button>
                    ) : (
                        <button
                            onClick={() => setActiveQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center gap-2"
                        >
                            Next
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
