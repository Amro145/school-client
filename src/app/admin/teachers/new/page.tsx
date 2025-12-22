"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Users } from 'lucide-react';

export default function CreateTeacherPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.push('/admin/teachers');
        }, 1000);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <Link
                href="/admin/teachers"
                className="inline-flex items-center text-slate-500 hover:text-slate-900 font-medium transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Teachers
            </Link>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8 md:p-12">
                <div className="flex items-center space-x-4 mb-10 text-left">
                    <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                        <Users className="text-purple-600 w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Add New Faculty Member</h1>
                        <p className="text-slate-500">Register a new teacher to the system.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 text-left">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Full Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Prof. Robert Miller"
                            className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all text-lg"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Email Address</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="e.g. r.miller@school.com"
                            className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all text-lg"
                            required
                        />
                    </div>

                    <div className="pt-6 flex space-x-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 px-6 py-4 rounded-2xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] bg-purple-800 text-white font-bold py-4 rounded-2xl hover:bg-purple-900 transition-all shadow-xl shadow-purple-200 flex items-center justify-center disabled:opacity-70"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-5 w-5" /> Save Teacher
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
