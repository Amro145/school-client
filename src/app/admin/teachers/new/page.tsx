"use client";

export const runtime = "edge";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, UserPlus, AlertCircle, CheckCircle2, ShieldCheck, Mail, User } from 'lucide-react';
import { AppDispatch } from '@/lib/redux/store';
import { createNewTeacher } from '@/lib/redux/slices/adminSlice';

export default function CreateTeacherPage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        password: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(false);

        try {
            const resultAction = await dispatch(createNewTeacher(formData));

            if (createNewTeacher.fulfilled.match(resultAction)) {
                setSuccess(true);
                setTimeout(() => {
                    router.push('/admin/teachers');
                }, 1500);
            } else {
                setError(resultAction.payload as string || 'Failed to create teacher account');
            }
        } catch {
            setError('An unexpected system error occurred');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
            <Link
                href="/admin/teachers"
                className="inline-flex items-center text-slate-500 hover:text-slate-900 font-medium transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Teachers
            </Link>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
                {/* Header Section */}
                <div className="bg-linear-to-r from-emerald-600 to-teal-600 px-8 py-10 md:px-12 text-white">
                    <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-inner">
                            <UserPlus className="text-white w-7 h-7" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Add Teacher</h1>
                            <p className="text-emerald-100 mt-1">Onboard a new educator to your school faculty.</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 md:p-12">
                    {/* Status Messages */}
                    {error && (
                        <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center space-x-3 text-sm font-medium animate-in slide-in-from-top-2">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="mb-8 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl flex items-center space-x-3 text-sm font-medium animate-in slide-in-from-top-2">
                            <CheckCircle2 className="w-5 h-5 shrink-0" />
                            <span>Teacher account created successfully! Redirecting...</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1 flex items-center">
                                <User className="w-4 h-4 mr-2 text-slate-400" />
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={formData.userName}
                                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                                placeholder="e.g. Dr. Sarah Jenkins"
                                className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all text-lg placeholder:text-slate-400 font-medium"
                                required
                                disabled={submitting}
                            />
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1 flex items-center">
                                <Mail className="w-4 h-4 mr-2 text-slate-400" />
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="teacher@school.edu"
                                className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all text-lg placeholder:text-slate-400 font-medium"
                                required
                                disabled={submitting}
                            />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1 flex items-center">
                                <ShieldCheck className="w-4 h-4 mr-2 text-slate-400" />
                                Setup Password
                            </label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••••••"
                                className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all text-lg placeholder:text-slate-400 font-medium"
                                required
                                minLength={6}
                                disabled={submitting}
                            />
                            <p className="text-xs text-slate-400 ml-1 italic">Minimum 6 characters recommended.</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="flex-1 px-6 py-4 rounded-2xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-2 bg-emerald-600 text-white font-bold py-4 rounded-2xl hover:bg-emerald-700 transition-all hover:shadow-xl hover:shadow-emerald-200 active:scale-[0.98] flex items-center justify-center disabled:opacity-70 disabled:hover:shadow-none"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-3 h-5 w-5" /> Register Teacher
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
