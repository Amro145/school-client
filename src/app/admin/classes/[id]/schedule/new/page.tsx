'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchClassById, createNewSchedule } from '@/lib/redux/slices/adminSlice';
import {
    ArrowLeft,
    Clock,
    Calendar,
    Save,
    AlertCircle,
    Loader2,
    CheckCircle2
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export const runtime = 'edge';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function CreateSchedulePage() {
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { currentClass, loading, error } = useSelector((state: RootState) => state.admin);

    const [formData, setFormData] = useState({
        subjectId: '',
        day: 'Monday',
        startTime: '',
        endTime: ''
    });

    const [validationError, setValidationError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            dispatch(fetchClassById(Number(id)));
        }
    }, [dispatch, id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear validation error when user changes input
        if (validationError) setValidationError(null);
    };

    const isOverlapping = (start1: string, end1: string, start2: string, end2: string) => {
        return start1 < end2 && end1 > start2;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError(null);

        if (!currentClass) return;

        // Client-side Validation: Conflict Detection
        const existingSchedules = currentClass.schedules?.filter(s => s.day === formData.day) || [];
        const conflict = existingSchedules.find(s => isOverlapping(formData.startTime, formData.endTime, s.startTime, s.endTime));

        if (conflict) {
            setValidationError(`This time slot is already occupied for this class (${conflict.startTime} - ${conflict.endTime}).`);
            return;
        }

        const result = await dispatch(createNewSchedule({
            classId: Number(id),
            subjectId: Number(formData.subjectId),
            day: formData.day,
            startTime: formData.startTime,
            endTime: formData.endTime
        }));

        if (createNewSchedule.fulfilled.match(result)) {
            router.push(`/admin/classes/${id}`);
        }
    };

    if (loading && !currentClass) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <p className="text-slate-500 font-medium italic">Loading...</p>
            </div>
        );
    }

    if (!currentClass) return null;

    const currentDaySchedules = currentClass.schedules?.filter(s => s.day === formData.day).sort((a, b) => a.startTime.localeCompare(b.startTime)) || [];

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Link
                href={`/admin/classes/${id}`}
                className="inline-flex items-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-medium transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Class
            </Link>

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Add Schedule</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Assign a subject to a time slot for {currentClass.name}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form Section */}
                <div className="bg-white dark:bg-slate-950 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-start space-x-3 text-red-600 dark:text-red-400">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <span className="text-sm font-medium">{error}</span>
                            </div>
                        )}

                        {validationError && (
                            <div className="p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 rounded-2xl flex items-start space-x-3 text-orange-600 dark:text-orange-400">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <span className="text-sm font-medium">{validationError}</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Subject</label>
                            <select
                                name="subjectId"
                                value={formData.subjectId}
                                onChange={handleChange}
                                required
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-900 border-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white font-medium transition-all"
                            >
                                <option value="">Select a Subject</option>
                                {currentClass.subjects?.map(subject => (
                                    <option key={subject.id} value={subject.id}>{subject.name} (Teacher: {subject.teacher?.userName || 'Unassigned'})</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Day</label>
                            <select
                                name="day"
                                value={formData.day}
                                onChange={handleChange}
                                required
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-900 border-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white font-medium transition-all"
                            >
                                {DAYS.map(day => (
                                    <option key={day} value={day}>{day}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Start Time</label>
                                <input
                                    type="time"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    required
                                    className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-900 border-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white font-medium transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">End Time</label>
                                <input
                                    type="time"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleChange}
                                    required
                                    className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-900 border-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white font-medium transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 dark:shadow-none transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            <span>Save Schedule</span>
                        </button>
                    </form>
                </div>

                {/* Live Preview Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-slate-400" />
                        {formData.day}&apos;s Schedule Preview
                    </h3>

                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-[32px] p-6 space-y-4 border border-slate-100 dark:border-slate-800">
                        {currentDaySchedules.length > 0 ? (
                            currentDaySchedules.map((schedule) => (
                                <div key={schedule.id} className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-sm">
                                    <div>
                                        <div className="text-xs font-black text-blue-600 dark:text-blue-400 mb-1 flex items-center">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {schedule.startTime} - {schedule.endTime}
                                        </div>
                                        <div className="font-bold text-slate-900 dark:text-white text-sm">{schedule.subject?.name}</div>
                                    </div>
                                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-400">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-slate-400 italic">No classes scheduled for {formData.day} yet.</div>
                        )}

                        {/* Visual Gap Indicator for simple feedback */}
                        {formData.startTime && formData.endTime && !validationError && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border-2 border-dashed border-blue-200 dark:border-blue-800 flex items-center justify-between">
                                <div>
                                    <div className="text-xs font-black text-blue-600 dark:text-blue-400 mb-1 flex items-center">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {formData.startTime} - {formData.endTime}
                                    </div>
                                    <div className="font-bold text-slate-900 dark:text-white text-sm">New: {currentClass.subjects?.find(s => s.id.toString() === formData.subjectId)?.name || 'Selected Subject'}</div>
                                </div>
                                <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-[10px] font-black uppercase tracking-widest rounded-full">
                                    Planning
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
