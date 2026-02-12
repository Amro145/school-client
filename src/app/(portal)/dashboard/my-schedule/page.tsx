'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import {
    Calendar,
    Clock,
    User,
    Home,
    ChevronLeft,
    ChevronRight,
    Search
} from 'lucide-react';
import Link from 'next/link';

export const runtime = 'edge';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
const PERIODS = [
    { label: '08:00', value: '08:00' },
    { label: '09:00', value: '09:00' },
    { label: '10:00', value: '10:00' },
    { label: '11:00', value: '11:00' },
    { label: '12:00', value: '12:00' },
    { label: '13:00', value: '13:00' },
    { label: '14:00', value: '14:00' },
    { label: '15:00', value: '15:00' },
];

export default function MySchedulePage() {
    const { user } = useSelector((state: RootState) => state.auth);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

    const getCurrentDay = () => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[currentTime.getDay()];
    };

    const getCurrentPeriod = () => {
        const hour = currentTime.getHours();
        const hourStr = hour < 10 ? `0${hour}:00` : `${hour}:00`;
        return hourStr;
    };

    const currentDay = getCurrentDay();
    const currentPeriod = getCurrentPeriod();

    const schedules = user?.schedules || [];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header section with Stats */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <Calendar className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">My Schedule</h1>
                            <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Academic Time-Grid</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-4 bg-white dark:bg-slate-900 p-2 rounded-[24px] border border-slate-200/60 dark:border-slate-800 shadow-sm">
                    <div className="px-6 py-3 text-center border-r border-slate-100 dark:border-slate-800">
                        <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Day</span>
                        <span className="block text-sm font-black text-purple-600 dark:text-purple-400">{currentDay}</span>
                    </div>
                    <div className="px-6 py-3 text-center">
                        <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Period</span>
                        <span className="block text-sm font-black text-slate-900 dark:text-white">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>
            </div>

            {/* Timetable Grid */}
            <div className="bg-white dark:bg-slate-950 rounded-[40px] border border-slate-200/60 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none overflow-hidden transition-colors duration-300">
                <div className="overflow-x-auto">
                    <div className="min-w-[1000px] grid grid-cols-[100px_repeat(5,1fr)] bg-slate-200/30 dark:bg-slate-800/50 border-collapse gap-px">
                        {/* Top-Left Corner: Time Label */}
                        <div className="bg-slate-50 dark:bg-slate-900 p-6 flex items-center justify-center border-b border-r border-slate-200/60 dark:border-slate-800 sticky left-0 z-30">
                            <Clock className="w-5 h-5 text-slate-400" />
                        </div>

                        {/* Day Headers (Columns) */}
                        {DAYS.map((day) => {
                            const isToday = day === currentDay;
                            return (
                                <div
                                    key={day}
                                    className={`p-6 border-b border-slate-200/60 dark:border-slate-800 flex flex-col items-center justify-center transition-all duration-300
                                        ${isToday ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.2)]' : 'bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100'}
                                    `}
                                >
                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${isToday ? 'text-purple-100' : 'text-slate-400 dark:text-slate-500'}`}>
                                        Schedule
                                    </span>
                                    <span className="text-base font-black tracking-tight uppercase">{day}</span>
                                </div>
                            );
                        })}

                        {/* Period Rows */}
                        {PERIODS.map((period) => (
                            <React.Fragment key={period.value}>
                                {/* Period Sidebar Label (Row Header) */}
                                <div className={`p-4 border-r border-slate-200/60 dark:border-slate-800 flex flex-col items-center justify-center sticky left-0 z-20 transition-all duration-300
                                    ${period.value === currentPeriod ? 'bg-purple-600 text-white' : 'bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400'}
                                `}>
                                    <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Slot</span>
                                    <span className="text-sm font-black tracking-tighter">
                                        {period.label}
                                    </span>
                                </div>

                                {/* Subject Cells for each day in this period */}
                                {DAYS.map((day) => {
                                    const schedule = schedules.find(s => s.day === day && s.startTime === period.value);
                                    const isCurrentCell = day === currentDay && period.value === currentPeriod;

                                    return (
                                        <div
                                            key={`${day}-${period.value}`}
                                            className={`relative min-h-[140px] p-3 border-b border-r border-slate-200/60 dark:border-slate-800 last:border-r-0 transition-all duration-500 group
                                                ${isCurrentCell ? 'bg-purple-50/50 dark:bg-purple-500/10 ring-2 ring-purple-600 ring-inset z-10' : 'bg-white dark:bg-slate-950'}
                                                ${!schedule && 'hover:bg-slate-50 dark:hover:bg-slate-900/40'}
                                            `}
                                        >
                                            {schedule ? (
                                                <div className="w-full h-full p-4 rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800/50 flex flex-col justify-between group-hover:scale-[1.03] group-hover:shadow-xl group-hover:border-purple-200 dark:group-hover:border-purple-900/50 transition-all duration-300">
                                                    <div>
                                                        <div className="flex items-center justify-between mb-3">
                                                            <div className={`w-2 h-2 rounded-full ${isCurrentCell ? 'bg-purple-500 animate-pulse' : 'bg-slate-300'}`} />
                                                            <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-white dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-100 dark:border-slate-700">
                                                                {schedule.startTime} - {schedule.endTime}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase leading-tight line-clamp-2 tracking-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                                            {schedule.subject?.name}
                                                        </h3>
                                                    </div>

                                                    <div className="flex items-center mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                                                        {user?.role === 'student' ? (
                                                            <>
                                                                <User className="w-3.5 h-3.5 mr-2 text-purple-500" />
                                                                <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 truncate uppercase tracking-tight">
                                                                    {schedule.subject?.teacher?.userName || 'TBA'}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Home className="w-3.5 h-3.5 mr-2 text-purple-500" />
                                                                <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 truncate uppercase tracking-tight">
                                                                    Room: {schedule.classRoom?.name || 'HUB - 1'}
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.3em]">Operational Gap</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer Legend */}
            <div className="flex flex-wrap items-center gap-6 px-4 py-2">
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-purple-600 ring-4 ring-purple-100 dark:ring-purple-900/20" />
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Ongoing Period</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest">Scheduled Lecture</span>
                </div>
                <div className="ml-auto">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                        Auto-sync enabled • {user?.role === 'student' ? user?.class?.name : 'Faculty View'}
                    </p>
                </div>
            </div>
        </div>
    );
}
