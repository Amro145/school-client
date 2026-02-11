"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { createNewClassRoom } from '@/lib/redux/slices/adminSlice';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, BookOpen, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createClassSchema, CreateClassFormValues } from '@/lib/validations/admin';
import FormInput from '@/components/FormInput';

export const runtime = 'edge';

export default function CreateClassPage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { loading: adminLoading } = useSelector((state: RootState) => state.admin);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid, isSubmitting },
    } = useForm<CreateClassFormValues>({
        resolver: zodResolver(createClassSchema),
        mode: 'onChange',
        defaultValues: {
            name: '',
        }
    });

    const onSubmit = async (data: CreateClassFormValues) => {
        // Dynamic import
        const Swal = (await import('sweetalert2')).default;
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
        });

        const resultAction = await dispatch(createNewClassRoom(data.name));
        if (createNewClassRoom.fulfilled.match(resultAction)) {
            Toast.fire({
                icon: "success",
                title: "Classroom created successfully"
            });
            router.push('/admin/classes');
        } else {
            Toast.fire({
                icon: "error",
                title: resultAction.payload as string || "Failed to create class"
            });
        }
    };

    const loading = adminLoading || isSubmitting;

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <Link
                href="/admin/classes"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-500 hover:text-blue-600 font-bold text-xs uppercase tracking-widest transition-all"
            >
                <ArrowLeft className="w-4 h-4" /> <span>Back to Classes</span>
            </Link>

            <div className="bg-white dark:bg-slate-950 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                <div className="bg-slate-900 p-10 md:p-12 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] -mr-20 -mt-20" />
                    <div className="relative z-10 flex items-center space-x-6">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                            <BookOpen className="text-white w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight leading-none uppercase">Architect Class</h1>
                            <p className="text-slate-400 mt-2 font-medium tracking-wide">Defining new group nodes for the ecosystem</p>
                        </div>
                    </div>
                </div>

                <div className="p-10 md:p-12">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                        <FormInput
                            label="Class Name"
                            icon={BookOpen}
                            placeholder="e.g. Grade 12-C, Science Lab A"
                            register={register('name')}
                            error={errors.name}
                            disabled={loading}
                        />

                        <div className="pt-4 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="flex-1 px-8 py-5 rounded-[24px] border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-black text-sm uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 transition-all active:scale-[0.98]"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !isValid}
                                className={`flex-2 bg-slate-900 dark:bg-blue-600 text-white font-black py-5 rounded-2xl shadow-2xl transition-all flex items-center justify-center text-sm uppercase tracking-widest active:scale-[0.98] ${!isValid || loading ? 'opacity-70 grayscale-[0.5] cursor-not-allowed' : 'hover:bg-black dark:hover:bg-blue-700 hover:shadow-blue-500/25'
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                                        Synchronizing Hub...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-3 h-5 w-5" /> Finalize Classroom
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
