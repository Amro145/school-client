"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { createNewClassRoom } from '@/lib/redux/slices/adminSlice';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, BookOpen } from 'lucide-react';
import Swal from 'sweetalert2';

export const runtime = 'edge';

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});

export default function CreateClassPage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { loading } = useSelector((state: RootState) => state.admin);
    const [name, setName] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const resultAction = await dispatch(createNewClassRoom(name));
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

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <Link
                href="/admin/classes"
                className="inline-flex items-center text-slate-500 hover:text-slate-900 font-medium transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Classes
            </Link>

            <div className=" rounded-3xl border border-slate-100 shadow-xl p-8 md:p-12">
                <div className="flex items-center space-x-4 mb-10">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                        <BookOpen className="text-blue-600 w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 text-left">Create New Class</h1>
                        <p className="text-slate-500 text-left">Set up a new classroom group for your school.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Class Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Grade 12-C, Science Lab A"
                            className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-lg"
                            required
                        />
                    </div>

                    <div className="pt-4 flex space-x-4">
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
                            className="flex-2 bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-shadow hover:shadow-lg shadow-blue-200 flex items-center justify-center disabled:opacity-70"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-5 w-5" /> Save Class
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
