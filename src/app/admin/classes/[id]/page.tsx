import Link from 'next/link';
import { Metadata } from 'next';
import { getData, calculateSuccessRate } from '@/lib/data';
import React from 'react';

export const runtime = 'edge';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const data = getData();
    const cls = data.classes.find(c => c.id === id);
    return {
        title: `${cls?.name || 'Class'} Details | EduDash`,
        description: `Performance and curriculum overview for ${cls?.name}.`,
    };
}
import { notFound } from 'next/navigation';
import {
    ArrowLeft,
    BookOpen,
    Users,
    TrendingUp,
} from 'lucide-react';

export default async function ClassDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const data = getData();
    const cls = data.classes.find(c => c.id === id);

    if (!cls) notFound();

    const classStudents = data.students.filter(s => s.classId === cls.id);
    const classSubjects = data.subjects.filter(sub => sub.classId === cls.id);

    return (
        <div className="space-y-8">
            <Link
                href="/admin/classes"
                className="inline-flex items-center text-slate-500 hover:text-slate-900 font-medium transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Classes
            </Link>

            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                        <BookOpen className="text-white w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{cls.name}</h1>
                        <p className="text-slate-500 mt-1">Class Management & Performance Overview</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Subjects Section */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-slate-900 flex items-center">
                                <BookOpen className="w-6 h-6 mr-3 text-blue-500" />
                                Curriculum Modules
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {classSubjects.map((subject) => {
                                const teacher = data.teachers.find(t => t.id === subject.teacherId);
                                const subjectGrades = classStudents.map(s => s.grades[subject.id]).filter(g => g !== undefined);
                                const rate = calculateSuccessRate(subjectGrades);

                                return (
                                    <div key={subject.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100/50 hover:bg-white hover:border-blue-200 hover:shadow-xl transition-all group">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-blue-600 shadow-sm">
                                                {subject.name.charAt(0)}
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Success Rate</div>
                                                <div className="text-lg font-black text-slate-900 mt-1 tabular-nums">{rate}</div>
                                            </div>
                                        </div>
                                        <h4 className="font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{subject.name}</h4>
                                        <p className="text-xs text-slate-400 font-bold mt-1 italic">Faculty: {teacher?.name || 'Awaiting Assignment'}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Collapsible Enrolled Students Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-2xl font-black text-slate-900 flex items-center">
                                <Users className="w-6 h-6 mr-3 text-purple-500" />
                                Student Roster
                            </h2>
                            <span className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">{classStudents.length} Verified Entries</span>
                        </div>

                        <div className="space-y-4">
                            {classStudents.map((student) => <StudentRow key={student.id} student={student} subjects={classSubjects} />)}
                        </div>
                    </div>
                </div>

                {/* Sidebar info */}
                <div className="space-y-8">
                    <div className="bg-slate-900 p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden group">
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
                                    {calculateSuccessRate(classStudents.flatMap(s => Object.values(s.grades)))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


interface StudentData {
    id: string;
    name: string;
    grades: Record<string, number>;
}

interface SubjectData {
    id: string;
    name: string;
    classId: string;
    teacherId: string;
}

function StudentRow({ student, subjects }: { student: StudentData, subjects: SubjectData[] }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const studentRate = calculateSuccessRate(Object.values(student.grades));

    return (
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden transition-all duration-300">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors ${isOpen ? 'bg-slate-50/50' : ''}`}
            >
                <div className="flex items-center space-x-5">
                    <div className="w-12 h-12 bg-linear-to-br from-purple-50 to-indigo-50 rounded-2xl flex items-center justify-center text-purple-600 font-black text-sm border border-slate-100 shadow-sm">
                        {student.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                    </div>
                    <div>
                        <h4 className="font-black text-slate-900 tracking-tight uppercase leading-none mb-1.5">{student.name}</h4>
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-black uppercase tracking-widest">ID: {student.id}</span>
                    </div>
                </div>
                <div className="flex items-center space-x-12">
                    <div className="text-right">
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 leading-none">Success Index</div>
                        <div className={`text-xl font-black tabular-nums ${studentRate > 0.1 ? 'text-green-600' : 'text-blue-600'}`}>{studentRate}</div>
                    </div>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isOpen ? 'bg-purple-600 text-white rotate-180' : 'bg-slate-50 text-slate-300'}`}>
                        <TrendingUp className="w-4 h-4" />
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="p-8 border-t border-slate-100 bg-white animate-in slide-in-from-top-4 duration-300">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Course Metrics</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {subjects.map(subject => {
                            const grade = student.grades[subject.id] || 0;
                            return (
                                <div key={subject.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                                    <span className="font-bold text-slate-600 text-sm uppercase tracking-tight">{subject.name}</span>
                                    <div className="flex items-center space-x-4">
                                        <div className="w-24 h-1.5 bg-white rounded-full overflow-hidden border border-slate-100">
                                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${grade}%` }} />
                                        </div>
                                        <span className="text-sm font-black tabular-nums text-slate-900">{grade}%</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                        <Link href={`/admin/students/${student.id}`} className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center">
                            Full Analytic Profile <ArrowLeft className="w-3 h-3 ml-2 rotate-180" />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
