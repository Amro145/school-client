'use client';

export const runtime = 'edge';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { loginUser } from '@/lib/redux/slices/authSlice';
import { Loader2, Mail, Lock, LogIn, AlertCircle, GraduationCap } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormValues } from '@/lib/validations/auth';
import FormInput from '@/components/FormInput';
import Link from 'next/link';

export default function LoginPage() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        mode: 'onChange',
        defaultValues: {
            email: '',
            password: '',
        }
    });

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/admin');
        }
    }, [isAuthenticated, router]);

    const onSubmit = async (data: LoginFormValues) => {
        try {
            await dispatch(loginUser({ email: data.email, password: data.password })).unwrap();
            window.location.href = '/admin';
        } catch (err) {
            console.error('Authorization Failed:', err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 relative overflow-hidden p-6 transition-colors duration-300">
            {/* Animated Background Orbs */}
            <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-[100px] animate-float opacity-70" />
            <div className="absolute bottom-0 -right-20 w-[500px] h-[500px] bg-purple-100/30 dark:bg-purple-900/20 rounded-full blur-[120px] opacity-60" />

            <div className="w-full max-w-[480px] relative z-10 transition-all duration-700 animate-in fade-in slide-in-from-bottom-12">
                {/* Brand Logo */}
                <div className="flex items-center justify-center mb-10 group cursor-pointer">
                    <Link href="/" className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/40 group-hover:rotate-12 transition-transform duration-500">
                            <GraduationCap className="text-white w-7 h-7" />
                        </div>
                        <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">EDUDASH</span>
                    </Link>
                </div>

                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[48px] border border-white dark:border-slate-800 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden">
                    <div className="px-10 py-12">
                        <div className="mb-10 text-center">
                            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">Portal Secure Login</h1>
                            <p className="text-slate-500 dark:text-slate-400 font-bold italic">Identity Verification Required</p>
                        </div>

                        {(error || Object.keys(errors).length > 0) && (
                            <div className="mb-8 p-5 bg-red-50/50 backdrop-blur-md border border-red-100 rounded-3xl flex items-center space-x-4 animate-in zoom-in-95 duration-500">
                                <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center shrink-0">
                                    <AlertCircle className="w-6 h-6 text-red-600" />
                                </div>
                                <p className="text-sm font-black text-red-700">
                                    {error || "Form validation failed. Please correct the errors below."}
                                </p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <FormInput
                                label="Administrative Email"
                                icon={Mail}
                                type="email"
                                placeholder="admin@edudash.edu"
                                register={register('email')}
                                error={errors.email}
                            />

                            <FormInput
                                label="Secret Key"
                                icon={Lock}
                                type="password"
                                placeholder="••••••••••••"
                                register={register('password')}
                                error={errors.password}
                            />

                            <button
                                type="submit"
                                disabled={loading || !isValid}
                                className="w-full relative group"
                            >
                                <div className={`absolute -inset-1 bg-linear-to-r from-blue-600 to-purple-600 rounded-[28px] blur opacity-25 transition duration-1000 ${!loading && isValid ? 'group-hover:opacity-50 group-hover:duration-200' : 'opacity-0'
                                    }`}></div>
                                <div className={`relative flex items-center justify-center py-5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-[24px] font-black text-lg transition-all active:scale-[0.98] ${!isValid ? 'cursor-not-allowed grayscale-[0.5]' : ''
                                    }`}>
                                    {loading ? (
                                        <Loader2 className="w-7 h-7 animate-spin" />
                                    ) : (
                                        <>
                                            AUTHORIZE PORTAL <LogIn className={`ml-3 w-6 h-6 transition-transform ${isValid ? 'group-hover:translate-x-1' : ''}`} />
                                        </>
                                    )}
                                </div>
                            </button>
                        </form>

                        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 text-center space-y-4">
                            
                            <p className="text-slate-400 dark:text-slate-500 font-bold text-xs tracking-tight">
                                Unauthorized access is strictly monitored.
                                <Link href="/" className="text-blue-600 ml-2 hover:underline font-black">Return to Terminal</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
