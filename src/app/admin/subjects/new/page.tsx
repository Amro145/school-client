"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, BarChart3 } from 'lucide-react';

// In a real app, these would be passed as props or fetched in a server component
// For this demo, we'll hardcode some options or assume they are available
const mockClasses = [{ id: 'c1', name: 'Grade 10-A' }, { id: 'c2', name: 'Grade 11-B' }];
const mockTeachers = [{ id: 't1', name: 'John Doe' }, { id: 't2', name: 'Jane Wilson' }];

export default function CreateSubjectPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        classId: '',
        teacherId: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.push('/admin/subjects');
        }, 1000);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <Link
                href="/admin/subjects"
                className="inline-flex items-center text-slate-500 hover:text-slate-900 font-medium transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Subjects
            </Link>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8 md:p-12">
                <div className="flex items-center space-x-4 mb-10 text-left">
                    <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                        <BarChart3 className="text-purple-600 w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Add New Subject</h1>
                        <p className="text-slate-500">Define a new subject and assign it to a teacher and class.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 text-left">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Subject Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Advanced Mathematics"
                            className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all text-lg"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Assign to Class</label>
                            <select
                                value={formData.classId}
                                onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                                className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all bg-white"
                                required
                            >
                                <option value="">Select Class</option>
                                {mockClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Assign Teacher</label>
                            <select
                                value={formData.teacherId}
                                onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                                className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all bg-white"
                                required
                            >
                                <option value="">Select Teacher</option>
                                {mockTeachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        </div>
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
                            className="flex-[2] bg-purple-600 text-white font-bold py-4 rounded-2xl hover:bg-purple-700 transition-shadow hover:shadow-lg shadow-purple-200 flex items-center justify-center disabled:opacity-70"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-5 w-5" /> Create Subject
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
