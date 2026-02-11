"use client";

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/lib/redux/store';
import { useFetchData, useMutateData } from '@/hooks/useFetchData';
import { Teacher, ClassRoom } from '@shared/types/models';
import axios from 'axios';
import { Plus, Save, Loader2, ArrowLeft, BarChart3, Layers, User } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSubjectSchema, CreateSubjectFormValues } from '@/lib/validations/admin';
import FormInput from '@/components/FormInput';
import FormSelect from '@/components/FormSelect';

export const runtime = 'edge';

export default function CreateSubjectPage() {
    const router = useRouter();
    const { user } = useSelector((state: RootState) => state.auth);

    const { data: adminData, isLoading: globalLoading } = useFetchData<{ teachers: Teacher[], classRooms: ClassRoom[] }>(
        ['admin', 'teachers-and-classes'],
        `
        query GetAdminTeachersAndClasses {
          teachers {
            id
            userName
          }
          classRooms {
            id
            name
          }
        }
        `
    );

    const teachers = adminData?.teachers || [];
    const classRooms = adminData?.classRooms || [];

    const {
        register,
        handleSubmit,
        formState: { errors, isValid, isSubmitting },
    } = useForm<CreateSubjectFormValues>({
        resolver: zodResolver(createSubjectSchema),
        mode: 'onChange',
        defaultValues: {
            name: '',
            classId: '',
            teacherId: ''
        }
    });

    useEffect(() => {
        if (user && user.role !== 'admin') {
            router.push('/subjects');
            return;
        }
    }, [user, router]);

    const { mutateAsync: createSubject } = useMutateData(
        async (payload: any) => {
            const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/graphql';
            const response = await axios.post(apiBase, {
                query: `
                    mutation CreateSubject($name: String!, $classId: Int!, $teacherId: Int!) {
                        createSubject(name: $name, classId: $classId, teacherId: $teacherId) {
                            id
                            name
                        }
                    }
                `,
                variables: payload
            }, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (response.data.errors) {
                throw new Error(response.data.errors[0].message);
            }
            return response.data;
        },
        [['admin', 'classes-and-subjects'], ['subjects'], ['dashboard']]
    );

    const onSubmit = async (data: CreateSubjectFormValues) => {
        // Dynamic import
        const Swal = (await import('sweetalert2')).default;
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
        });

        try {
            await createSubject({
                name: data.name,
                classId: Number(data.classId),
                teacherId: Number(data.teacherId)
            });

            Toast.fire({
                icon: "success",
                title: "Subject created successfully"
            });
            setTimeout(() => {
                router.push('/subjects');
            }, 1500);
        } catch (err: any) {
            Toast.fire({
                icon: "error",
                title: err.message || "Failed to create subject"
            });
        }
    };

    const isLoadingData = globalLoading && teachers.length === 0 && classRooms.length === 0;
    const loading = isLoadingData || isSubmitting;

    if (user?.role !== 'admin') {
        return <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-bold tracking-widest animate-pulse uppercase">Authenticating Authority...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <Link
                href="/subjects"
                className="inline-flex items-center space-x-3 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-black text-xs uppercase tracking-widest transition-all shadow-sm active:scale-95 group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Curricular Hub</span>
            </Link>

            <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] overflow-hidden rounded-[40px]">
                <div className="relative h-48 bg-slate-900 flex items-center px-12 overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] -ml-20 -mb-20" />

                    <div className="relative z-10 flex items-center space-x-6">
                        <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl">
                            <BarChart3 className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-white tracking-tight leading-none uppercase">Architect Subject</h1>
                            <p className="text-purple-200 mt-2 font-medium tracking-wide">Mapping educational modules to institutional targets</p>
                        </div>
                    </div>
                </div>

                <div className="p-12">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
                        <FormInput
                            label="Subject Module Name"
                            icon={BarChart3}
                            placeholder="e.g. Quantum Mechanics, Digital Arts IV"
                            register={register('name')}
                            error={errors.name}
                            disabled={loading}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <FormSelect
                                label="Target Curricular Group"
                                icon={Layers}
                                register={register('classId')}
                                error={errors.classId}
                                disabled={loading}
                                placeholder={isLoadingData ? 'SYNCHRONIZING GROUPS...' : 'SELECT CLASS TARGET'}
                                options={classRooms.map(c => ({ value: c.id, label: c.name.toUpperCase() }))}
                            />

                            <FormSelect
                                label="Instructional Personnel"
                                icon={User}
                                register={register('teacherId')}
                                error={errors.teacherId}
                                disabled={loading}
                                placeholder={isLoadingData ? 'SYNCHRONIZING PERSONNEL...' : 'ASSIGN INSTRUCTOR'}
                                options={teachers.map(t => ({ value: t.id, label: t.userName.toUpperCase() }))}
                            />
                        </div>

                        <div className="pt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 border-t border-slate-50 dark:border-slate-800/50">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="flex-1 px-8 py-6 rounded-[32px] border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 transition-all active:scale-[0.98]"
                                disabled={loading}
                            >
                                Abort Operation
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !isValid}
                                className={`flex-2 bg-slate-900 dark:bg-blue-600 text-white font-black py-6 rounded-[32px] shadow-2xl transition-all flex items-center justify-center text-xs uppercase tracking-[0.2em] active:scale-[0.98] ${!isValid || loading ? 'opacity-70 grayscale-[0.5] cursor-not-allowed' : 'hover:bg-purple-700 dark:hover:bg-blue-700 hover:shadow-purple-500/25 dark:hover:shadow-blue-500/25'
                                    }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                                        Integrating Module...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-3 h-5 w-5" /> Deploy Subject
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
