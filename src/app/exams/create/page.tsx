"use client";

export const runtime = "edge";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { useRouter } from "next/navigation";
import { useFetchData, useMutateData, fetchData } from "@/hooks/useFetchData";
import { Subject, ClassRoom } from "@shared/types/models";
import { ArrowLeft, Save, Plus, Trash2, HelpCircle, CheckCircle2, FileText, Clock, Layers, BookOpen, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { examSchema, ExamFormValues } from '@/lib/validations/exams';
import FormInput from '@/components/FormInput';
import FormSelect from '@/components/FormSelect';

export default function CreateExamPage() {
    const router = useRouter();
    const { user } = useSelector((state: RootState) => state.auth);

    const { data: adminData, isLoading: adminLoading } = useFetchData<{ subjects: Subject[], classRooms: ClassRoom[] }>(
        ['admin', 'subjects-and-classes'],
        `
        query GetAdminSubjectsAndClasses {
          subjects {
            id
            name
            class {
                id
            }
          }
          classRooms {
            id
            name
          }
        }
        `
    );

    const subjects = adminData?.subjects || [];
    const classRooms = adminData?.classRooms || [];

    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isValid, isSubmitting },
    } = useForm<ExamFormValues>({
        resolver: zodResolver(examSchema),
        mode: 'onChange',
        defaultValues: {
            title: "",
            type: "Midterm",
            description: "",
            durationInMinutes: 30,
            classId: "",
            subjectId: "",
            questions: [
                { questionText: "", options: ["", "", "", ""], correctAnswerIndex: 0, points: 10 }
            ]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "questions"
    });

    const watchClassId = watch('classId');
    const watchQuestions = watch('questions');

    const { mutateAsync: createExam, isPending: examLoading } = useMutateData(
        async (payload: any) => {
            const data = await fetchData<{ createExamWithQuestions: { id: string, title: string } }>(
                `
                    mutation CreateExam($title: String!, $description: String!, $type: String!, $durationInMinutes: Int!, $classId: String!, $subjectId: String!, $questions: [QuestionInput!]!) {
                        createExamWithQuestions(title: $title, description: $description, type: $type, durationInMinutes: $durationInMinutes, classId: $classId, subjectId: $subjectId, questions: $questions) {
                            id
                            title
                        }
                    }
                `,
                payload
            );
            return data.createExamWithQuestions;
        },
        [['exams'], ['dashboard']]
    );

    const availableSubjects = subjects.filter(subject =>
        watchClassId && String(subject.class?.id) === String(watchClassId)
    );

    const onSubmit = async (data: ExamFormValues) => {
        // Dynamic import
        const Swal = (await import('sweetalert2')).default;

        try {
            await createExam({
                ...data,
                classId: String(data.classId),
                subjectId: String(data.subjectId),
            });

            Swal.fire({
                icon: 'success',
                title: 'Exam Published',
                text: 'The assessment module has been synchronized with the school hub.',
                timer: 2000,
                showConfirmButton: false
            });

            router.push("/exams");
        } catch (error) {
            // console.error("Failed to create exam:", error);
            Swal.fire({
                icon: 'error',
                title: 'Deployment Failed',
                text: typeof error === 'string' ? error : 'An unexpected error occurred during exam creation.'
            });
        }
    };

    if (user?.role === "student") {
        return <div className="min-h-screen flex items-center justify-center font-black text-red-500 uppercase tracking-[0.5em] animate-pulse">Unauthorized Peripheral Access</div>;
    }

    const totalPoints = watchQuestions.reduce((sum, q) => sum + (Number(q.points) || 0), 0);
    const loading = adminLoading || examLoading || isSubmitting;

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-32 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <div className="flex items-center justify-between">
                <Link
                    href="/exams"
                    className="inline-flex items-center space-x-3 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-black text-xs uppercase tracking-widest transition-all shadow-sm active:scale-95 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Assessment Lab</span>
                </Link>

                <div className="hidden md:flex items-center space-x-4">
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Status</p>
                        <p className={`text-xs font-black uppercase tracking-wider ${isValid ? 'text-green-500' : 'text-red-500'}`}>
                            {isValid ? 'Configuration Valid' : 'Invalid Parameters'}
                        </p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${isValid ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.4)]' : 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.4)]'}`} />
                </div>
            </div>

            <div className="bg-slate-900 rounded-[48px] p-12 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] -ml-20 -mb-20" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex items-center space-x-8">
                        <div className="w-24 h-24 bg-white/10 backdrop-blur-2xl rounded-[32px] flex items-center justify-center border border-white/20 shadow-inner">
                            <FileText className="w-12 h-12 text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-5xl font-black tracking-tight leading-none uppercase">Architect Exam</h1>
                            <p className="text-blue-200 mt-3 font-medium tracking-wide text-lg">Designing high-fidelity evaluation protocols</p>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
                {/* Configuration Matrix */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white dark:bg-slate-950 p-10 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-10 flex items-center">
                                <HelpCircle className="w-4 h-4 mr-3 text-blue-500" /> Assessment Metadata
                            </h3>

                            <div className="space-y-8">
                                <FormInput
                                    label="Evaluation Designation (Title)"
                                    icon={FileText}
                                    placeholder="e.g. Advanced Calculus Tier-I"
                                    register={register('title')}
                                    error={errors.title}
                                    disabled={loading}
                                />

                                <div className="space-y-4">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Contextual Intelligence (Description)</label>
                                    <textarea
                                        {...register('description')}
                                        className={`block w-full px-8 py-6 bg-slate-50/50 dark:bg-slate-900 border rounded-[32px] text-slate-900 dark:text-white font-bold placeholder:text-slate-300 focus:ring-4 transition-all outline-none min-h-[160px] resize-none ${errors.description
                                            ? 'border-red-500 focus:ring-red-50 dark:focus:ring-red-900/20'
                                            : 'border-slate-100 dark:border-slate-800 focus:border-blue-500 focus:ring-blue-50 dark:focus:ring-blue-900/20 dark:focus:bg-slate-800'
                                            }`}
                                        placeholder="Outline directives and coverage goals..."
                                        disabled={loading}
                                    />
                                    {errors.description && (
                                        <p className="text-[10px] font-black text-red-500 uppercase ml-4">{errors.description.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white dark:bg-slate-950 p-10 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-10 flex items-center">
                                <Clock className="w-4 h-4 mr-3 text-blue-500" /> Matrix Params
                            </h3>

                            <div className="space-y-8">
                                <FormSelect
                                    label="Evaluation Tier"
                                    icon={Layers}
                                    register={register('type')}
                                    error={errors.type}
                                    disabled={loading}
                                    options={[
                                        { value: 'Midterm', label: 'MIDTERM PROTOCOL' },
                                        { value: 'Final', label: 'FINAL CLEARANCE' },
                                        { value: 'Quiz', label: 'RAPID ASSESSMENT' },
                                    ]}
                                />

                                <FormInput
                                    label="Temporal Limit (Mins)"
                                    icon={Clock}
                                    type="number"
                                    register={register('durationInMinutes', { valueAsNumber: true })}
                                    error={errors.durationInMinutes}
                                    disabled={loading}
                                />

                                <FormSelect
                                    label="Target Node Group"
                                    icon={Layers}
                                    register={register('classId')}
                                    error={errors.classId}
                                    disabled={loading}
                                    placeholder="SELECT CLASS"
                                    options={classRooms.map(c => ({ value: c.id, label: c.name.toUpperCase() }))}
                                />

                                <FormSelect
                                    label="Academic Subject"
                                    icon={BookOpen}
                                    register={register('subjectId')}
                                    error={errors.subjectId}
                                    disabled={loading || !watchClassId}
                                    placeholder={!watchClassId ? 'AWAITING CLASS SELECT...' : 'SELECT SUBJECT'}
                                    options={availableSubjects.map(s => ({ value: s.id, label: s.name.toUpperCase() }))}
                                />
                                {!watchClassId && (
                                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center italic">Class selection required for subject mapping</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Question Architecture */}
                <div className="space-y-10">
                    <div className="flex items-center justify-between px-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                                <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Question Registry</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium italic">Constructing individual assessment vectors</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aggregate scoring</p>
                            <p className="text-3xl font-black text-blue-600 dark:text-blue-400">{totalPoints} <span className="text-sm">PTS</span></p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <AnimatePresence>
                            {fields.map((field, index) => (
                                <motion.div
                                    key={field.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    className="bg-white dark:bg-slate-950 p-10 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/30 dark:shadow-none relative group"
                                >
                                    <div className="absolute top-10 right-10 flex space-x-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="p-4 bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-600 hover:text-white rounded-2xl transition-all shadow-lg active:scale-95"
                                            disabled={fields.length === 1}
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="space-y-10">
                                        <div className="flex items-start space-x-6">
                                            <div className="w-12 h-12 bg-slate-900 dark:bg-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg font-black text-white text-lg">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 space-y-4">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Question Logic</label>
                                                <input
                                                    {...register(`questions.${index}.questionText`)}
                                                    className={`w-full px-8 py-5 bg-slate-50 dark:bg-slate-900 border rounded-[28px] focus: ring-4 transition-all outline-none font-bold text-slate-900 dark:text-white ${errors.questions?.[index]?.questionText
                                                        ? 'border-red-500 focus:ring-red-50'
                                                        : 'border-slate-100 dark:border-slate-800 focus:border-blue-500 focus:ring-blue-50'
                                                        }`}
                                                    placeholder="Synthesize specific inquiry text..."
                                                />
                                                {errors.questions?.[index]?.questionText && (
                                                    <p className="text-[10px] font-black text-red-500 uppercase ml-4">{errors.questions[index].questionText?.message}</p>
                                                )}
                                            </div>
                                            <div className="w-32 space-y-4">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center block">Points</label>
                                                <input
                                                    type="number"
                                                    {...register(`questions.${index}.points`, { valueAsNumber: true })}
                                                    className="w-full px-4 py-5 bg-slate-900 text-white border-none rounded-[24px] text-center font-black focus:ring-4 focus:ring-blue-500/20 transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-18">
                                            {[0, 1, 2, 3].map((optIdx) => (
                                                <div key={optIdx} className="space-y-2">
                                                    <div className="flex items-center space-x-4">
                                                        <div
                                                            onClick={() => setValue(`questions.${index}.correctAnswerIndex`, optIdx)}
                                                            className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs cursor-pointer transition-all ${watch(`questions.${index}.correctAnswerIndex`) === optIdx
                                                                ? 'bg-green-500 text-white shadow-xl shadow-green-500/40 ring-4 ring-green-100 dark:ring-green-900/20'
                                                                : 'bg-slate-100 dark:bg-slate-900 text-slate-400 hover:bg-slate-200'
                                                                }`}
                                                        >
                                                            {['A', 'B', 'C', 'D'][optIdx]}
                                                        </div>
                                                        <input
                                                            {...register(`questions.${index}.options.${optIdx}`)}
                                                            className={`flex-1 px-6 py-4 bg-slate-50 dark:bg-slate-900 border rounded-[20px] focus: outline-none font-medium text-sm transition-all ${watch(`questions.${index}.correctAnswerIndex`) === optIdx
                                                                ? 'border-green-500/50 bg-green-50/20 ring-4 ring-green-50/50'
                                                                : 'border-slate-100 dark:border-slate-800 focus:border-blue-500'
                                                                }`}
                                                            placeholder={`Option ${optIdx + 1}...`}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        <button
                            type="button"
                            onClick={() => append({ questionText: "", options: ["", "", "", ""], correctAnswerIndex: 0, points: 10 })}
                            className="w-full py-8 border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[48px] text-slate-400 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group flex flex-col items-center justify-center space-y-3"
                        >
                            <div className="w-14 h-14 bg-slate-50 dark:bg-slate-900 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 transition-all group-hover:rotate-12">
                                <Plus className="w-8 h-8 group-hover:text-white" />
                            </div>
                            <span className="font-black text-xs uppercase tracking-[0.3em]">Integrate New Vector (Add Question)</span>
                        </button>
                    </div>
                </div>

                <div className="fixed bottom-12 left-0 right-0 z-50 px-6 flex justify-center pointer-events-none">
                    <div className="max-w-5xl w-full flex justify-end pointer-events-auto">
                        <button
                            type="submit"
                            disabled={loading || !isValid}
                            className={`px-12 py-6 bg-slate-900 dark:bg-blue-600 text-white rounded-[32px] font-black text-sm uppercase tracking-[0.3em] transition-all flex items-center shadow-[0_20px_40px_rgba(0,0,0,0.3)] active:scale-95 ${!isValid || loading
                                ? 'opacity-70 grayscale-[0.8] cursor-not-allowed'
                                : 'hover:bg-blue-700 dark:hover:bg-blue-500 hover:shadow-blue-500/40 hover:-translate-y-1'
                                }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-6 h-6 mr-4 animate-spin text-blue-400" />
                                    Synchronizing...
                                </>
                            ) : (
                                <>
                                    <Save className="w-6 h-6 mr-4" />
                                    Finalize Assessment Matrix
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
