'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchClassById } from '@/lib/redux/slices/adminSlice';
import { calculateSuccessRate } from '@/lib/data';
import {
    ArrowLeft,
    BookOpen,
    Users,
    TrendingUp,
    Loader2,
    AlertCircle,
    Calendar,
    Clock,
    User
} from 'lucide-react';
import { notFound, useParams } from 'next/navigation';

export const runtime = 'edge';

export default function ClassDetailPage() {
    const { id } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const { currentClass, loading, error } = useSelector((state: RootState) => state.admin);

    useEffect(() => {
        if (id) {
            dispatch(fetchClassById(Number(id)));
        }
    }, [dispatch, id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <p className="text-slate-500 font-medium italic">Loading class intelligence...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <AlertCircle className="w-12 h-12 text-red-500" />
                <p className="text-slate-500 font-medium">{error}</p>
                <Link href="/admin/classes" className="text-blue-600 hover:underline">Return to Classes</Link>
            </div>
        );
    }

    if (!currentClass) {
        return null; // Or some skeleton
    }

    const classStudents = currentClass.students || [];
    const classSubjects = currentClass.subjects || [];
    const classSchedules = currentClass.schedules || [];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Link
                href="/admin/classes"
                className="inline-flex items-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-medium transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Classes
            </Link>

            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                        <BookOpen className="text-white w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{currentClass.name}</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Class Management & Performance Overview</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-10">

                    {/* Timetable Section */}
                    <div className="rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden p-8 bg-white dark:bg-slate-950">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center">
                                <Calendar className="w-6 h-6 mr-3 text-orange-500" />
                                Weekly Timetable
                            </h2>
                        </div>
                        <Timetable schedules={classSchedules} />
                    </div>

                    {/* Subjects Section */}
                    <div className="rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden p-8 bg-white dark:bg-slate-950">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center">
                                <BookOpen className="w-6 h-6 mr-3 text-blue-500" />
                                Curriculum Modules
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {classSubjects.map((subject) => {
                                // Calculate success rate for this subject across all students
                                const subjectGrades = subject.grades?.map((g: any) => g.score) || [];
                                const rate = calculateSuccessRate(subjectGrades);

                                return (
                                    <div key={subject.id} className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100/50 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-xl transition-all group">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-blue-600 bg-white dark:bg-slate-800 shadow-sm uppercase">
                                                {subject.name.charAt(0)}
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Success Rate</div>
                                                <div className="text-lg font-black text-slate-900 dark:text-white mt-1 tabular-nums">{rate}</div>
                                            </div>
                                        </div>
                                        <h4 className="font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors uppercase tracking-tight">{subject.name}</h4>
                                        <p className="text-xs text-slate-400 font-bold mt-1 italic flex items-center">
                                            <User className="w-3 h-3 mr-1" />
                                            {subject.teacher?.userName || 'Awaiting Assignment'}
                                        </p>
                                    </div>
                                );
                            })}
                            {classSubjects.length === 0 && (
                                <div className="col-span-2 text-center py-10 text-slate-400 italic">No subjects assigned yet.</div>
                            )}
                        </div>
                    </div>

                    {/* Collapsible Enrolled Students Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center">
                                <Users className="w-6 h-6 mr-3 text-purple-500" />
                                Student Roster
                            </h2>
                            <span className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">{classStudents.length} Verified Entries</span>
                        </div>

                        <div className="space-y-4">
                            {classStudents.map((student) => <StudentRow key={student.id} student={student} subjects={classSubjects} />)}

                            {classStudents.length === 0 && (
                                <div className="text-center py-10 text-slate-400 italic bg-white dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800">
                                    No students enrolled in this class.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar info */}
                <div className="space-y-8">
                    <div className="bg-slate-900 dark:bg-slate-950 p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-150 transition-transform duration-1000">
                            <BookOpen className="w-24 h-24" />
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Class Terminal Overview</h3>
                        <div className="space-y-8 relative z-10">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500 font-bold">Cohorts Count</span>
                                <span className="text-2xl font-black tabular-nums">{classStudents.length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500 font-bold">Active Modules</span>
                                <span className="text-2xl font-black tabular-nums">{classSubjects.length}</span>
                            </div>
                            <div className="pt-8 border-t border-white/5">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-4">Aggregate Success Rate</span>
                                <div className="text-6xl font-black tracking-tighter tabular-nums text-white">
                                    {calculateSuccessRate(classStudents.flatMap((s: any) => s.grades?.map((g: any) => g.score) || []))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper Components

function Timetable({ schedules }: { schedules: any[] }) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const timeSlots = Array.from(new Set(schedules.map(s => s.startTime))).sort();

    // Group schedules by day
    const schedulesByDay: { [key: string]: any[] } = {};
    days.forEach(day => {
        schedulesByDay[day] = schedules.filter(s => s.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
    });

    if (schedules.length === 0) {
        return <div className="text-center py-10 text-slate-400 italic">No schedule created for this class yet.</div>;
    }

    return (
        <div className="overflow-x-auto">
            <div className="min-w-[600px] space-y-4">
                {/* Header Row */}
                <div className="grid grid-cols-8 gap-2 mb-2">
                    <div className="font-black text-slate-400 text-xs uppercase tracking-widest">Time</div>
                    {days.slice(0, 5).map(day => ( // Showing only Mon-Fri for compactness
                        <div key={day} className="font-black text-slate-600 dark:text-slate-300 text-xs uppercase tracking-widest text-center">{day.slice(0, 3)}</div>
                    ))}
                    {/* Weekend if needed, omitted for cleaner layout unless data exists */}
                </div>

                {/* Rows logic is tricky if times vary. Simplified approach: List per day */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {days.slice(0, 5).map(day => (
                        <div key={day} className="space-y-3">
                            <h4 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 md:hidden">{day}</h4>
                            {schedulesByDay[day]?.length > 0 ? (
                                schedulesByDay[day].map(schedule => (
                                    <div key={schedule.id} className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-xl border border-blue-100 dark:border-blue-900/30">
                                        <div className="text-xs font-black text-blue-600 dark:text-blue-400 mb-1 flex items-center">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {schedule.startTime} - {schedule.endTime}
                                        </div>
                                        <div className="font-bold text-slate-900 dark:text-white text-sm">{schedule.subject?.name}</div>
                                    </div>
                                ))
                            ) : (
                                <div className="h-full bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-center min-h-[80px]">
                                    <span className="text-slate-300 text-xs font-bold uppercase">-</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
function StudentRow({ student, subjects }: { student: any, subjects: any[] }) {
    const [isOpen, setIsOpen] = React.useState(false);
    // Student average score is now coming directly from the API
    const studentRate = student.averageScore || 0;

    // We need to map student grades to subjects correctly. API structure:
    // classRoom -> subjects -> grades -> student { id }
    // OR classRoom -> students -> grades -> subject { id } ?
    // The query requests:
    /*
     students {
            id
            userName
            averageScore
          }
    */
    // Wait, the previous logic calculated grades from student.grades (which had subject inside).
    // The NEW query requests student.grades isn't explicitly requested in the plan's query for Student, 
    // BUT `student.grades` IS in the `getClassById` I implemented.
    // Let's ensure I requested `grades` inside `students` in `class-service.ts`.
    // Checking my previous edit... No, I removed `grades` from `students` in the service edit!
    // I requested `averageScore` but forgot to request `grades` inside `students` if I want to show the detailed breakdown.
    // HOWEVER, the `subjects` array has `grades` with `student { id }`. I can use that to reconstruct the student's grades.

    return (
        <div className="bg-white dark:bg-slate-950 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors ${isOpen ? 'bg-slate-50/50 dark:bg-slate-900/50' : ''}`}
            >
                <div className="flex items-center space-x-5">
                    <div className="w-12 h-12 bg-linear-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 font-black text-sm border border-slate-100 dark:border-slate-800 shadow-sm">
                        {student.userName.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                    </div>
                    <div>
                        <h4 className="font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none mb-1.5">{student.userName}</h4>
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-md font-black uppercase tracking-widest">ID: {student.id}</span>
                    </div>
                </div>
                <div className="flex items-center space-x-12">
                    <div className="text-right">
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 leading-none">Success Index</div>
                        <div className={`text-xl font-black tabular-nums ${String(studentRate.toFixed(1)) >= "50" ? 'text-green-600' : 'text-blue-600 dark:text-blue-400'}`}>{studentRate ? studentRate.toFixed(1) : 0}</div>
                    </div>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isOpen ? 'bg-purple-600 text-white rotate-180' : 'bg-slate-50 dark:bg-slate-800 text-slate-300'}`}>
                        <TrendingUp className="w-4 h-4" />
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="p-8 border-t border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-4 duration-300">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Course Metrics</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {subjects.map((subject: any) => {
                            // Find the grade for this student in this subject
                            // The subject object has a `grades` array.
                            const gradeObj = subject.grades?.find((g: any) => g.student.id.toString() === student.id.toString());
                            const grade = gradeObj ? gradeObj.score : 0;

                            return (
                                <div key={subject.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100/50 dark:border-slate-800">
                                    <span className="font-bold text-slate-600 dark:text-slate-400 text-sm uppercase tracking-tight">{subject.name}</span>
                                    <div className="flex items-center space-x-4">
                                        <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden border border-slate-100 dark:border-slate-600">
                                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${grade}%` }} />
                                        </div>
                                        <span className="text-sm font-black tabular-nums text-slate-900 dark:text-white">{grade}%</span>
                                    </div>
                                </div>
                            );
                        })}
                        {subjects.length === 0 && <p className="text-slate-400 italic text-sm">No subjects assigned.</p>}
                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                        <Link href={`/students/${student.id}`} className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest hover:underline flex items-center">
                            Full Analytic Profile <ArrowLeft className="w-3 h-3 ml-2 rotate-180" />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

