"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { createNewSchool } from '@/lib/redux/slices/adminSlice';
import { setSchoolId } from '@/lib/redux/slices/authSlice';
import { ShieldCheck, GraduationCap, Loader2, ArrowRight, AlertCircle } from 'lucide-react';

export default function SetupSchoolPage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);

    const [schoolName, setSchoolName] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!schoolName.trim()) return;

        setSubmitting(true);
        setError(null);

        try {
            const resultAction = await dispatch(createNewSchool(schoolName));

            if (createNewSchool.fulfilled.match(resultAction)) {
                // Update schoolId in auth state
                dispatch(setSchoolId(resultAction.payload.id));
                // Redirect to dashboard
                router.push('/admin');
            } else {
                setError(resultAction.payload as string || 'Failed to create school');
            }
        } catch {
            setError('An unexpected error occurred');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 sm:p-12 animate-in fade-in duration-700">
            <div className="max-w-md w-full space-y-8">
                {/* Branding */}
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-20 h-20 bg-blue-600 rounded-[28px] flex items-center justify-center shadow-2xl shadow-blue-500/40 animate-bounce-slow">
                        <ShieldCheck className="text-white w-10 h-10" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Setup Your School</h1>
                        <p className="text-slate-500 mt-2 font-medium">Welcome, {user?.userName}. Let&apos;s get started.</p>
                    </div>
                </div>

                {/* Form Card */}
                <div className=" rounded-[32px] shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
                    <div className="p-8 sm:p-10">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center space-x-3 text-red-600 text-sm font-bold animate-in slide-in-from-top-2">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                                    Official School Name
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                        <GraduationCap className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        value={schoolName}
                                        onChange={(e) => setSchoolName(e.target.value)}
                                        placeholder="e.g. Prestige International Academy"
                                        className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus: focus:border-blue-500 transition-all font-bold text-slate-900 placeholder:text-slate-300 placeholder:font-medium"
                                        required
                                        disabled={submitting}
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400 ml-1 italic font-medium">This name will be visible on reports and certificates.</p>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting || !schoolName.trim()}
                                className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-black transition-all shadow-xl shadow-slate-900/20 active:scale-[0.98] flex items-center justify-center space-x-3 disabled:opacity-50 disabled:active:scale-100 group"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Designing School...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Initialize Management</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 text-center">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                            STEP 1: IDENTITY ESTABLISHMENT
                        </p>
                    </div>
                </div>

                {/* Footer Quote */}
                <p className="text-center text-slate-400 text-sm font-medium italic">
                    Education is the most powerful weapon which you can use to change the world
                </p>
            </div>

            {/* Background Decorative Elements */}
            <div className="fixed -bottom-24 -left-24 w-96 h-96 bg-blue-100/50 rounded-full blur-[100px] pointer-events-none" />
            <div className="fixed -top-24 -right-24 w-96 h-96 bg-indigo-100/50 rounded-full blur-[100px] pointer-events-none" />
        </div>
    );
}
