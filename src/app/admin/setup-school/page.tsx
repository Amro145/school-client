"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { useMutateData, fetchData } from '@/hooks/useFetchData';
import { setSchoolId } from '@/lib/redux/slices/authSlice';
import { ShieldCheck, GraduationCap, Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schoolSetupSchema, SchoolSetupFormValues } from '@/lib/validations/auth';
import FormInput from '@/components/FormInput';

export const runtime = 'edge';

export default function SetupSchoolPage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid, isSubmitting },
    } = useForm<SchoolSetupFormValues>({
        resolver: zodResolver(schoolSetupSchema),
        mode: 'onChange',
        defaultValues: {
            name: '',
        }
    });

    const [serverError, setServerError] = React.useState<string | null>(null);

    const { mutateAsync: createSchool } = useMutateData(
        async (name: string) => {
            const data = await fetchData<{ createSchool: { id: number, name: string } }>(
                `
                    mutation CreateSchool($name: String!) {
                        createSchool(name: $name) {
                            id
                            name
                        }
                    }
                `,
                { name }
            );
            return data.createSchool;
        },
        []
    );

    const onSubmit = async (data: SchoolSetupFormValues) => {
        setServerError(null);
        try {
            const school = await createSchool(data.name);
            dispatch(setSchoolId(school.id));
            router.push('/admin');
        } catch (err: any) {
            setServerError(err.message || 'Failed to create school');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 sm:p-12 animate-in fade-in duration-700">
            <div className="max-w-md w-full space-y-8">
                {/* Branding */}
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-20 h-20 bg-blue-600 rounded-[28px] flex items-center justify-center shadow-2xl shadow-blue-500/40 animate-bounce-slow">
                        <ShieldCheck className="text-white w-10 h-10" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Setup Your School</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Welcome, {user?.userName}. Let&apos;s get started.</p>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-xl shadow-slate-200/60 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
                    <div className="p-8 sm:p-10">
                        {(serverError || Object.keys(errors).length > 0) && (
                            <div className="mb-6 p-4 bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl flex items-center space-x-3 text-red-600 dark:text-red-400 text-sm font-bold animate-in slide-in-from-top-2">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <span>{serverError || "Please correct the errors below to continue."}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <FormInput
                                label="Official School Name"
                                icon={GraduationCap}
                                placeholder="e.g. Prestige International Academy"
                                register={register('name')}
                                error={errors.name}
                                disabled={isSubmitting}
                            />

                            <p className="text-[10px] text-slate-400 dark:text-slate-500 ml-1 italic font-medium">This name will be visible on reports and certificates.</p>

                            <button
                                type="submit"
                                disabled={isSubmitting || !isValid}
                                className="w-full bg-slate-900 dark:bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-black dark:hover:bg-blue-700 transition-all shadow-xl shadow-slate-900/20 dark:shadow-blue-900/20 active:scale-[0.98] flex items-center justify-center space-x-3 disabled:opacity-50 disabled:active:scale-100 group"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Designing School...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Initialize Management</span>
                                        <ArrowRight className={`w-5 h-5 transition-transform ${isValid ? 'group-hover:translate-x-1' : ''}`} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="px-8 py-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-center">
                        <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                            STEP 1: IDENTITY ESTABLISHMENT
                        </p>
                    </div>
                </div>

                {/* Footer Quote */}
                <p className="text-center text-slate-400 dark:text-slate-500 text-sm font-medium italic">
                    Education is the most powerful weapon which you can use to change the world
                </p>
            </div>

            {/* Background Decorative Elements */}
            <div className="fixed -bottom-24 -left-24 w-96 h-96 bg-blue-100/50 dark:bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="fixed -top-24 -right-24 w-96 h-96 bg-indigo-100/50 dark:bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none" />
        </div>
    );
}
