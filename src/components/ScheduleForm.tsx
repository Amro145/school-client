'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { createNewSchedule, updateScheduleThunk, fetchSubjects, fetchClassRooms } from '@/lib/redux/slices/adminSlice';
import { Loader2, Calendar, Clock, BookOpen, Users, AlertCircle, X } from 'lucide-react';
import { Schedule } from '@/types/admin';

interface ScheduleFormProps {
    initialData?: Schedule | null;
    preselectedClassId?: number;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function ScheduleForm({ initialData, preselectedClassId, onClose, onSuccess }: ScheduleFormProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { subjects, classRooms, loading, error } = useSelector((state: RootState) => state.admin);

    // Form State
    const [classId, setClassId] = useState<number | string>(preselectedClassId || initialData?.classRoom?.id || '');
    const [subjectId, setSubjectId] = useState<number | string>(initialData?.subject?.id || '');
    const [day, setDay] = useState<string>(initialData?.day || 'Monday');
    const [startTime, setStartTime] = useState<string>(initialData?.startTime || '');
    const [endTime, setEndTime] = useState<string>(initialData?.endTime || '');
    const [formError, setFormError] = useState<string | null>(null);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    useEffect(() => {
        if (subjects.length === 0) dispatch(fetchSubjects());
        if (classRooms.length === 0) dispatch(fetchClassRooms());
    }, [dispatch, subjects.length, classRooms.length]);

    // Update state when initialData changes (if reusing component)
    useEffect(() => {
        if (initialData) {
            setClassId(initialData.classRoom?.id || classId);
            setSubjectId(initialData.subject?.id || '');
            setDay(initialData.day);
            setStartTime(initialData.startTime);
            setEndTime(initialData.endTime);
        } else if (preselectedClassId) {
            setClassId(preselectedClassId);
            // Reset others if switching to 'add' mode
            setSubjectId('');
            setStartTime('');
            setEndTime('');
        }
    }, [initialData, preselectedClassId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (!classId || !subjectId || !day || !startTime || !endTime) {
            setFormError("All fields are required.");
            return;
        }

        if (startTime >= endTime) {
            setFormError("Start time must be before end time.");
            return;
        }

        const payload = {
            classId: Number(classId),
            subjectId: Number(subjectId),
            day,
            startTime,
            endTime
        };

        try {
            if (initialData) {
                await dispatch(updateScheduleThunk({ id: initialData.id, data: payload })).unwrap();
            } else {
                await dispatch(createNewSchedule(payload)).unwrap();
            }
            if (onSuccess) onSuccess();
            onClose();
        } catch (err: any) {
            setFormError(err || "Failed to save schedule.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                    <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center">
                        <Calendar className="w-6 h-6 mr-3 text-blue-600" />
                        {initialData ? 'Edit Schedule Slot' : 'Add New Schedule Slot'}
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Error Display */}
                    {(error || formError) && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-start space-x-3 text-red-600 dark:text-red-400 text-sm font-bold">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p>{formError || error}</p>
                        </div>
                    )}

                    {/* Class Selection (Only if not preselected or if admin wants to change) */}
                    {!preselectedClassId && (
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Classroom</label>
                            <div className="relative">
                                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <select
                                    value={classId}
                                    onChange={(e) => setClassId(Number(e.target.value))}
                                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                                >
                                    <option value="">Select Class</option>
                                    {classRooms.map(cls => (
                                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Subject Selection */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Subject</label>
                        <div className="relative">
                            <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <select
                                value={subjectId}
                                onChange={(e) => setSubjectId(Number(e.target.value))}
                                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                            >
                                <option value="">Select Subject</option>
                                {subjects.map(subject => (
                                    <option key={subject.id} value={subject.id}>{subject.name} - {subject.teacher?.userName}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Day Selection */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Day of Week</label>
                        <select
                            value={day}
                            onChange={(e) => setDay(e.target.value)}
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                        >
                            {days.map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>

                    {/* Time Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Start Time</label>
                            <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400">End Time</label>
                            <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 rounded-2xl font-black text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors uppercase tracking-widest text-xs"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-lg shadow-blue-200 dark:shadow-blue-900/20 active:scale-95 transition-all uppercase tracking-widest text-xs flex items-center justify-center"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (initialData ? 'Update Schedule' : 'Create Schedule')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
