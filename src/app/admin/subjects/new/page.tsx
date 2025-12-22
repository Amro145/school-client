"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, BarChart3, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchMyTeachers, fetchClassRooms, createNewSubject } from '@/lib/redux/slices/adminSlice';

export default function CreateSubjectPage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const { teachers, classRooms, loading: globalLoading, error: globalError } = useSelector((state: RootState) => state.admin);

    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        classId: '',
        teacherId: ''
    });

    useEffect(() => {
        dispatch(fetchMyTeachers());
        dispatch(fetchClassRooms());
    }, [dispatch]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const resultAction = await dispatch(createNewSubject({
                name: formData.name,
                classId: Number(formData.classId),
                teacherId: Number(formData.teacherId)
            }));

            if (createNewSubject.fulfilled.match(resultAction)) {
                setSuccess(true);
                setTimeout(() => {
                    router.push('/admin/subjects');
                }, 1500);
            } else {
                setError(resultAction.payload as string || 'Failed to create subject');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setSubmitting(false);
        }
    };

    const isLoadingData = globalLoading && teachers.length === 0 && classRooms.length === 0;

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
            <Link
                href="/admin/subjects"
                className="inline-flex items-center text-slate-500 hover:text-slate-900 font-medium transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Subjects
            </Link>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-10 md:px-12 text-white">
                    <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-inner">
                            <BarChart3 className="text-white w-7 h-7" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Create Subject</h1>
                            <p className="text-purple-100 mt-1">Populate the academic curriculum for your school.</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 md:p-12">
                    {error && (
                        <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center space-x-3 text-sm font-medium animate-in slide-in-from-top-2">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="mb-8 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl flex items-center space-x-3 text-sm font-medium animate-in slide-in-from-top-2">
                            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                            <span>Subject created successfully! Redirecting...</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Subject Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Advanced Physics"
                                className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all text-lg placeholder:text-slate-400"
                                required
                                disabled={submitting}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Target Class</label>
                                <div className="relative">
                                    <select
                                        value={formData.classId}
                                        onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                                        className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all bg-white appearance-none cursor-pointer disabled:bg-slate-50 disabled:cursor-not-allowed"
                                        required
                                        disabled={submitting || isLoadingData}
                                    >
                                        <option value="">{isLoadingData ? 'Loading classes...' : 'Select Class'}</option>
                                        {classRooms.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Assigned Teacher</label>
                                <div className="relative">
                                    <select
                                        value={formData.teacherId}
                                        onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                                        className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all bg-white appearance-none cursor-pointer disabled:bg-slate-50 disabled:cursor-not-allowed"
                                        required
                                        disabled={submitting || isLoadingData}
                                    >
                                        <option value="">{isLoadingData ? 'Loading teachers...' : 'Select Teacher'}</option>
                                        {teachers.map(t => (
                                            <option key={t.id} value={t.id}>{t.userName}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

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
                                disabled={submitting || isLoadingData}
                                className="flex-[2] bg-purple-600 text-white font-bold py-4 rounded-2xl hover:bg-purple-700 transition-all hover:shadow-xl hover:shadow-purple-200 active:scale-[0.98] flex items-center justify-center disabled:opacity-70 disabled:hover:shadow-none"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                                        Creating Subject...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-3 h-5 w-5" /> Save Subject
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
