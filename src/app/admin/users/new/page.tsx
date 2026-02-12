'use client';

import { RootState } from '@/lib/redux/store';
import { useFetchData, useMutateData } from '@/hooks/useFetchData';
import { ClassRoom } from '@shared/types/models';
import React, { useEffect } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    UserPlus,
    Mail,
    Lock,
    Shield,
    Layers,
    ArrowLeft,
    Loader2,
    User,
    AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserSchema, CreateUserFormValues } from '@/lib/validations/admin';
import FormInput from '@/components/FormInput';

export const runtime = 'edge';

export default function CreateUserPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialRole = (searchParams.get('role') as 'student' | 'teacher' | 'admin') || 'student';

    const { data: adminData, isLoading: adminLoading } = useFetchData<{ classRooms: ClassRoom[] }>(
        ['admin', 'classrooms'],
        `
        query GetAdminClassrooms {
          classRooms {
            id
            name
          }
        }
        `
    );
    const classRooms = adminData?.classRooms || [];

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isValid, isSubmitting },
    } = useForm<CreateUserFormValues>({
        resolver: zodResolver(createUserSchema),
        mode: 'onChange',
        defaultValues: {
            userName: '',
            email: '',
            password: '',
            role: initialRole,
            classId: ''
        }
    });

    const selectedRole = watch('role');

    useEffect(() => {
        if (initialRole) {
            setValue('role', initialRole);
        }
    }, [initialRole, setValue]);

    const { mutateAsync: createUser } = useMutateData(
        async (payload: any) => {
            const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://schoolapi.amroaltayeb14.workers.dev/graphql';
            const response = await axios.post(apiBase, {
                query: `
                    mutation CreateUser($userName: String!, $email: String!, $role: String!, $password: String!, $classId: String) {
                        createUser(userName: $userName, email: $email, role: $role, password: $password, classId: $classId) {
                            id
                            userName
                        }
                    }
                `,
                variables: payload
            }, {
                headers: { 'Authorization': `Bearer ${Cookies.get('auth_token')}` }
            });
            if (response.data.errors) {
                throw new Error(response.data.errors[0].message);
            }
            return response.data.data.createUser;
        },
        [['admin', 'teachers'], ['admin', 'students'], ['admin', 'dashboard']]
    );

    const onSubmit = async (data: CreateUserFormValues) => {
        const payload = {
            ...data,
            classId: data.classId ? String(data.classId) : undefined
        };

        // Dynamic import for SweetAlert
        const Swal = (await import('sweetalert2')).default;
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
        });

        try {
            await createUser(payload);
            Toast.fire({
                icon: "success",
                title: "User created successfully"
            });
            setTimeout(() => {
                router.push(data.role === 'teacher' ? '/admin/teachers' : '/students');
            }, 1000);
        } catch (err: any) {
            Toast.fire({
                icon: "error",
                title: err.message || "Failed to create user"
            });
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <Link
                href="/admin"
                className="inline-flex items-center space-x-3 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-black text-xs uppercase tracking-widest transition-all shadow-sm active:scale-95 group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Return to Intelligence Hub</span>
            </Link>

            <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] overflow-hidden rounded-[40px]">
                <div className="relative h-40 bg-slate-900 flex items-center px-12 overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] -ml-20 -mb-20" />

                    <div className="relative z-10 flex items-center space-x-6">
                        <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl">
                            <UserPlus className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-white tracking-tight leading-none uppercase">Architect Identity</h1>
                            <p className="text-blue-200 mt-2 font-medium tracking-wide">Registering new institutional nodes into the ecosystem</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-12 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Name Field */}
                        <FormInput
                            label="Public Identifier (Username)"
                            icon={User}
                            placeholder="Enter full legal name..."
                            register={register('userName')}
                            error={errors.userName}
                            disabled={isSubmitting}
                        />

                        {/* Email Field */}
                        <FormInput
                            label="Institutional Email"
                            icon={Mail}
                            type="email"
                            placeholder="node@institutional-domain.com"
                            register={register('email')}
                            error={errors.email}
                            disabled={isSubmitting}
                        />

                        {/* Password Field */}
                        <FormInput
                            label="Access Credentials (Password)"
                            icon={Lock}
                            type="password"
                            placeholder="••••••••••••"
                            register={register('password')}
                            error={errors.password}
                            disabled={isSubmitting}
                        />

                        {/* Role Dropdown */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">Functional Role</label>
                            <div className="relative group">
                                <div className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors ${errors.role ? 'text-red-500' : 'text-slate-300 dark:text-slate-600 group-focus-within:text-blue-500'}`}>
                                    <Shield className="w-5 h-5" />
                                </div>
                                <select
                                    {...register('role')}
                                    className={`w-full pl-16 pr-8 py-5 bg-slate-50 dark:bg-slate-900 border rounded-[28px] focus: ring-4 transition-all appearance-none cursor-pointer font-bold text-slate-900 dark:text-white outline-none ${errors.role
                                        ? 'border-red-500 focus:ring-red-50 dark:focus:ring-red-900/20'
                                        : 'border-slate-100 dark:border-slate-800 focus:border-blue-500 focus:ring-blue-50 dark:focus:ring-blue-900/20 dark:focus:bg-slate-800'
                                        }`}
                                >
                                    <option value="student">STUDENT NODE</option>
                                    <option value="teacher">INSTRUCTOR NODE</option>
                                </select>
                            </div>
                            {errors.role && (
                                <div className="flex items-center space-x-2 ml-2 mt-1">
                                    <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                                    <p className="text-[10px] font-black text-red-500 uppercase tracking-wider">{errors.role.message}</p>
                                </div>
                            )}
                        </div>

                        {/* Class Selection */}
                        {selectedRole === 'student' && (
                            <div className="space-y-4 md:col-span-2 animate-in slide-in-from-top-2 duration-300">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">
                                    Curricular Assignment (Classroom) <span className="text-red-500">*</span>
                                </label>
                                <div className="relative group">
                                    <div className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors ${errors.classId ? 'text-red-500' : 'text-slate-300 dark:text-slate-600 group-focus-within:text-blue-500'}`}>
                                        <Layers className="w-5 h-5" />
                                    </div>
                                    <select
                                        {...register('classId')}
                                        className={`w-full pl-16 pr-8 py-5 bg-slate-50 dark:bg-slate-900 border rounded-[28px] focus: ring-4 transition-all appearance-none cursor-pointer font-bold text-slate-900 dark:text-white outline-none ${errors.classId
                                            ? 'border-red-500 focus:ring-red-50 dark:focus:ring-red-900/20'
                                            : 'border-slate-100 dark:border-slate-800 focus:border-blue-500 focus:ring-blue-50 dark:focus:ring-blue-900/20 dark:focus:bg-slate-800'
                                            }`}
                                        disabled={(adminLoading && classRooms.length === 0) || isSubmitting}
                                    >
                                        <option value="">SELECT A CLASS (REQUIRED)</option>
                                        {classRooms.map((cls) => (
                                            <option key={cls.id} value={cls.id}>
                                                {cls.name.toUpperCase()}
                                            </option>
                                        ))}
                                    </select>
                                    {adminLoading && classRooms.length === 0 && (
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2">
                                            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                                        </div>
                                    )}
                                </div>
                                {errors.classId && (
                                    <div className="flex items-center space-x-2 ml-2 mt-1">
                                        <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                                        <p className="text-[10px] font-black text-red-500 uppercase tracking-wider">{errors.classId.message}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="pt-10 flex items-center justify-between border-t border-slate-50 dark:border-slate-800/50">
                        <div className="hidden md:block">
                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-tight">Architecture Policy</p>
                            <p className="text-slate-400 dark:text-slate-500 text-xs italic">Credentials are encrypted at resting state.</p>
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting || !isValid}
                            className={`px-16 py-6 bg-slate-900 dark:bg-blue-600 text-white rounded-[32px] font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center shadow-2xl active:scale-95 ${!isValid || isSubmitting ? 'opacity-70 cursor-not-allowed grayscale-[0.5]' : 'hover:bg-blue-600 dark:hover:bg-blue-500 hover:shadow-blue-500/25'
                                }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                    Synchronizing...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5 mr-3" />
                                    Finalize Identity
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
