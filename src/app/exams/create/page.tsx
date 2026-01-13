"use client";

export const runtime = "edge";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/lib/redux/store";
import { createExamTransition } from "@/lib/redux/slices/examSlice";
import { fetchSubjects, fetchClassRooms } from "@/lib/redux/slices/adminSlice";
import { ArrowLeft, Save, Plus, Trash2, HelpCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface QuestionInput {
    questionText: string;
    options: string[];
    correctAnswerIndex: number;
    points: number;
}

export default function CreateExamPage() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { user } = useSelector((state: RootState) => state.auth);
    const { subjects, classRooms } = useSelector((state: RootState) => state.admin);
    const { loading } = useSelector((state: RootState) => state.exam);

    const [examData, setExamData] = useState({
        title: "",
        type: "Midterm",
        description: "",
        durationInMinutes: 30,
        classId: "",
        subjectId: "",
    });

    const [questions, setQuestions] = useState<QuestionInput[]>([
        { questionText: "", options: ["", "", "", ""], correctAnswerIndex: 0, points: 10 }
    ]);

    useEffect(() => {
        dispatch(fetchClassRooms());
        dispatch(fetchSubjects());
    }, [dispatch]);

    // Filter subjects based on selected class and teacher role
    const availableSubjects = subjects.filter(subject => {
        // If no class selected, show nothing (or all if you prefer, but strictly: filter by class first)
        if (!examData.classId) return false;

        // Match class
        // Note: subject.classId might be number, examData.classId is string
        const classMatch = String(subject.class?.id) === String(examData.classId);

        // If teacher, match teacher ID 
        // (Backend already filters fetchSubjects for teachers? 
        // The summary suggests backend returns subjects belonging to teacher, but let's be safe).
        // Actually the summary said: "teacher sees only their subjects".
        // So we just need to match the class.
        return classMatch;
    });

    const handleExamChange = (field: string, value: string | number) => {
        setExamData(prev => ({ ...prev, [field]: value }));
    };

    const handleQuestionChange = (index: number, field: keyof QuestionInput, value: any) => {
        const newQuestions = [...questions];
        newQuestions[index] = { ...newQuestions[index], [field]: value };
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
        const newQuestions = [...questions];
        const newOptions = [...newQuestions[qIndex].options];
        newOptions[oIndex] = value;
        newQuestions[qIndex].options = newOptions;
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([...questions, { questionText: "", options: ["", "", "", ""], correctAnswerIndex: 0, points: 10 }]);
    };

    const removeQuestion = (index: number) => {
        if (questions.length > 1) {
            setQuestions(questions.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(createExamTransition({
                ...examData,
                classId: Number(examData.classId),
                subjectId: Number(examData.subjectId),
                questions
            })).unwrap();
            router.push("/exams");
        } catch (error) {
            console.error("Failed to create exam:", error);
            // Error handling usually visualized via toast or alert
        }
    };

    if (user?.role === "student") {
        return <div className="p-8 text-center text-red-500">Access Denied</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/exams" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                    <ArrowLeft className="w-6 h-6 text-slate-500" />
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Create Exam</h1>
                    <p className="text-slate-500 dark:text-slate-400">Configure exam details and questions</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Details Card */}
                <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200/60 dark:border-slate-800 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-blue-500" />
                        Exam Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Exam Title</label>
                            <input
                                type="text"
                                required
                                value={examData.title}
                                onChange={(e) => handleExamChange("title", e.target.value)}
                                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 ring-0 transition-all font-semibold"
                                placeholder="e.g. Mathematics Assessment"
                            />
                        </div>

                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Exam Type</label>
                            <select
                                required
                                value={examData.type}
                                onChange={(e) => handleExamChange("type", e.target.value)}
                                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 ring-0 transition-all font-semibold"
                            >
                                <option value="Midterm">Midterm</option>
                                <option value="Final">Final</option>
                                <option value="Quiz">Quiz</option>
                            </select>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Description</label>
                            <textarea
                                value={examData.description}
                                onChange={(e) => handleExamChange("description", e.target.value)}
                                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 ring-0 transition-all font-medium min-h-[100px]"
                                placeholder="Instructions or topic coverage..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Duration (Minutes)</label>
                            <input
                                type="number"
                                required
                                min="1"
                                value={examData.durationInMinutes}
                                onChange={(e) => handleExamChange("durationInMinutes", parseInt(e.target.value))}
                                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 ring-0 transition-all font-semibold"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Class</label>
                            <select
                                required
                                value={examData.classId}
                                onChange={(e) => handleExamChange("classId", e.target.value)}
                                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 ring-0 transition-all font-semibold"
                            >
                                <option value="">Select Class</option>
                                {classRooms.map(cls => (
                                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Subject</label>
                            <select
                                required
                                value={examData.subjectId}
                                onChange={(e) => handleExamChange("subjectId", e.target.value)}
                                disabled={!examData.classId}
                                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 ring-0 transition-all font-semibold disabled:opacity-50"
                            >
                                <option value="">Select Subject</option>
                                {availableSubjects.map(sub => (
                                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                                ))}
                            </select>
                            {examData.classId && availableSubjects.length === 0 && (
                                <p className="text-red-400 text-xs mt-2 font-bold">No subjects found for this class.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Questions Section */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        Questions ({questions.length})
                        <span className="ml-auto text-sm font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                            Total: {questions.reduce((sum, q) => sum + (q.points || 0), 0)} Points
                        </span>
                    </h3>

                    <AnimatePresence>
                        {questions.map((question, qIndex) => (
                            <motion.div
                                key={qIndex}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-white dark:bg-slate-900 rounded-[24px] p-6 border border-slate-200/60 dark:border-slate-800/60 shadow-xs relative group"
                            >
                                <div className="absolute top-6 right-6 flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => removeQuestion(qIndex)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                        disabled={questions.length === 1}
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="pr-12">
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Question {qIndex + 1}</label>
                                        <input
                                            type="text"
                                            required
                                            value={question.questionText}
                                            onChange={(e) => handleQuestionChange(qIndex, "questionText", e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-transparent focus:border-blue-500 ring-0 transition-all font-medium"
                                            placeholder="Enter question text here..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {question.options.map((option, oIndex) => (
                                            <div key={oIndex} className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${question.correctAnswerIndex === oIndex
                                                    ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                                                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700"
                                                    }`} onClick={() => handleQuestionChange(qIndex, "correctAnswerIndex", oIndex)}>
                                                    {["A", "B", "C", "D"][oIndex]}
                                                </div>
                                                <input
                                                    type="text"
                                                    required
                                                    value={option}
                                                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                                    className={`flex-1 px-4 py-2 rounded-xl border-transparent focus:border-blue-500 ring-0 transition-all font-medium text-sm ${question.correctAnswerIndex === oIndex
                                                        ? "bg-green-50 dark:bg-green-900/10 border-green-500/50"
                                                        : "bg-slate-50 dark:bg-slate-800/50"
                                                        }`}
                                                    placeholder={`Option ${oIndex + 1}`}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-end">
                                        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-2">
                                            <span className="text-xs font-bold text-slate-500 uppercase">Points</span>
                                            <input
                                                type="number"
                                                required
                                                min="1"
                                                value={question.points}
                                                onChange={(e) => handleQuestionChange(qIndex, "points", parseInt(e.target.value) || 0)}
                                                className="w-16 bg-transparent text-right font-bold text-slate-900 dark:text-white border-none focus:ring-0 p-0"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    <button
                        type="button"
                        onClick={addQuestion}
                        className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-[24px] text-slate-500 dark:text-slate-400 font-bold hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all flex items-center justify-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Add Question
                    </button>
                </div>

                <div className="sticky bottom-6 z-20">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Publish Exam
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
