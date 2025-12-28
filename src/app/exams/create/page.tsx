"use client";

export const runtime = "edge";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/redux/store";
import { fetchSubjects, fetchClassRooms } from "@/lib/redux/slices/adminSlice";
import { createExamTransition } from "@/lib/redux/slices/examSlice";
import { useRouter } from "next/navigation";
import {
    Plus,
    Trash2,
    Save,
    ChevronLeft,
    HelpCircle,
    CheckCircle2,
    Clock,
    FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CreateExamPage() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { subjects, classRooms } = useSelector((state: RootState) => state.admin);
    const { loading } = useSelector((state: RootState) => state.exam);
    const { user } = useSelector((state: RootState) => state.auth);

    const [examData, setExamData] = useState({
        title: "",
        description: "",
        durationInMinutes: 60,
        subjectId: "",
        classId: "",
        questions: [
            { questionText: "", options: ["", ""], correctAnswerIndex: 0, points: 5 }
        ]
    });

    useEffect(() => {
        dispatch(fetchSubjects());
        dispatch(fetchClassRooms());
    }, [dispatch]);

    const handleAddQuestion = () => {
        setExamData({
            ...examData,
            questions: [...examData.questions, { questionText: "", options: ["", ""], correctAnswerIndex: 0, points: 5 }]
        });
    };

    const handleRemoveQuestion = (index: number) => {
        const newQuestions = examData.questions.filter((_, i) => i !== index);
        setExamData({ ...examData, questions: newQuestions });
    };

    const handleQuestionChange = <K extends keyof (typeof examData.questions)[0]>(
        index: number,
        field: K,
        value: (typeof examData.questions)[0][K]
    ) => {
        const newQuestions = [...examData.questions];
        newQuestions[index] = { ...newQuestions[index], [field]: value };
        setExamData({ ...examData, questions: newQuestions });
    };

    const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
        const newQuestions = [...examData.questions];
        newQuestions[qIndex].options[oIndex] = value;
        setExamData({ ...examData, questions: newQuestions });
    };

    const handleAddOption = (qIndex: number) => {
        const newQuestions = [...examData.questions];
        newQuestions[qIndex].options.push("");
        setExamData({ ...examData, questions: newQuestions });
    };

    const handleRemoveOption = (qIndex: number, oIndex: number) => {
        const newQuestions = [...examData.questions];
        if (newQuestions[qIndex].options.length > 2) {
            newQuestions[qIndex].options = newQuestions[qIndex].options.filter((_, i) => i !== oIndex);
            if (newQuestions[qIndex].correctAnswerIndex >= newQuestions[qIndex].options.length) {
                newQuestions[qIndex].correctAnswerIndex = 0;
            }
            setExamData({ ...examData, questions: newQuestions });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(createExamTransition({
                ...examData,
                subjectId: Number(examData.subjectId),
                classId: Number(examData.classId),
            })).unwrap();
            router.push("/admin/exams");
        } catch (err) {
            console.error("Failed to create exam", err);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-slate-500"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Create Examination</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Design your custom evaluation with multiple questions</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* General Settings */}
                <section className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200/60 dark:border-slate-800 shadow-sm transition-all duration-300">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">General Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Exam Title</label>
                            <input
                                type="text"
                                required
                                value={examData.title}
                                onChange={(e) => setExamData({ ...examData, title: e.target.value })}
                                placeholder="e.g., Mathematics Midterm 2024"
                                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 focus:border-blue-500 rounded-[20px] outline-hidden transition-all text-slate-900 dark:text-white font-medium"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Description (Optional)</label>
                            <textarea
                                value={examData.description}
                                onChange={(e) => setExamData({ ...examData, description: e.target.value })}
                                placeholder="Explain rules, topics covered, or any other notes..."
                                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 focus:border-blue-500 rounded-[20px] outline-hidden transition-all text-slate-900 dark:text-white font-medium min-h-[100px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Class Room</label>
                            <select
                                required
                                value={examData.classId}
                                onChange={(e) => setExamData({ ...examData, classId: e.target.value, subjectId: "" })}
                                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 focus:border-blue-500 rounded-[20px] outline-hidden transition-all text-slate-900 dark:text-white font-bold appearance-none"
                            >
                                <option value="">Select Class</option>
                                {classRooms.map(cls => (
                                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Subject</label>
                            <select
                                required
                                value={examData.subjectId}
                                disabled={!examData.classId}
                                onChange={(e) => setExamData({ ...examData, subjectId: e.target.value })}
                                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 focus:border-blue-500 rounded-[20px] outline-hidden transition-all text-slate-900 dark:text-white font-bold appearance-none disabled:opacity-50"
                            >
                                <option value="">Select Subject</option>
                                {subjects.filter(s => String(s.class?.id) === examData.classId).map(sub => (
                                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                                ))}
                            </select>
                            {examData.classId && subjects.filter(s => String(s.class?.id) === examData.classId).length === 0 && (
                                <p className="text-xs text-red-500 font-bold mt-2 ml-1">
                                    {user?.role === 'teacher'
                                        ? "No subjects assigned to you for this class."
                                        : "No subjects found for this class in your school."}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Duration (Minutes)</label>
                            <div className="relative">
                                <Clock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={examData.durationInMinutes}
                                    onChange={(e) => setExamData({ ...examData, durationInMinutes: Number(e.target.value) })}
                                    className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 focus:border-blue-500 rounded-[20px] outline-hidden transition-all text-slate-900 dark:text-white font-bold"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Questions Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                                <HelpCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Question Bank</h2>
                        </div>
                        <button
                            type="button"
                            onClick={handleAddQuestion}
                            className="flex items-center gap-2 px-5 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-slate-900/10"
                        >
                            <Plus className="w-4 h-4" />
                            Add Question
                        </button>
                    </div>

                    <AnimatePresence>
                        {examData.questions.map((q, qIndex) => (
                            <motion.div
                                key={qIndex}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="group bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200/60 dark:border-slate-800 shadow-sm relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-2 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-900 dark:bg-slate-800 text-white rounded-[18px] flex items-center justify-center font-black text-lg shadow-lg">
                                            {qIndex + 1}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                value={q.points}
                                                onChange={(e) => handleQuestionChange(qIndex, "points", Number(e.target.value))}
                                                className="w-16 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg text-sm font-bold text-center"
                                            />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Points</span>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveQuestion(qIndex)}
                                        className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Question Prompt</label>
                                        <textarea
                                            required
                                            value={q.questionText}
                                            onChange={(e) => handleQuestionChange(qIndex, "questionText", e.target.value)}
                                            placeholder="Enter your question here..."
                                            className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 focus:border-blue-500 rounded-[20px] outline-hidden transition-all text-slate-900 dark:text-white font-medium"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between px-1">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Answer Options</label>
                                            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.15em]">Select one correct answer</span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {q.options.map((option, oIndex) => (
                                                <div key={oIndex} className="relative group/option">
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleQuestionChange(qIndex, "correctAnswerIndex", oIndex)}
                                                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${q.correctAnswerIndex === oIndex
                                                                ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                                                                : "bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200"
                                                                }`}
                                                        >
                                                            {q.correctAnswerIndex === oIndex ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-2 h-2 rounded-full bg-slate-300" />}
                                                        </button>
                                                        <input
                                                            type="text"
                                                            required
                                                            value={option}
                                                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                                            placeholder={`Option ${oIndex + 1}`}
                                                            className={`flex-1 px-5 py-3 rounded-xl border outline-hidden transition-all font-medium text-sm ${q.correctAnswerIndex === oIndex
                                                                ? "border-green-500 bg-green-50/10 dark:bg-green-500/5 text-slate-900 dark:text-white"
                                                                : "border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 text-slate-600 dark:text-slate-400"
                                                                }`}
                                                        />
                                                        {q.options.length > 2 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveOption(qIndex, oIndex)}
                                                                className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => handleAddOption(qIndex)}
                                                className="flex items-center justify-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:text-blue-500 transition-all font-bold text-xs"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                                Add Option
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <div className="flex items-center justify-end gap-4 pt-8">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold transition-all hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center gap-2 px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-blue-500/25 active:scale-95 disabled:opacity-50"
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Save & Publish Exam
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
