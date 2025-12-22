import Link from 'next/link';
import { Metadata } from 'next';
import { getData, calculateSuccessRate } from '@/lib/data';

export const runtime = 'edge';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const data = getData();
    const teacher = data.teachers.find(t => t.id === id);
    return {
        title: `Instructor: ${teacher?.name || 'Teacher'} | EduDash`,
        description: `Faculty profile and subject performance tracking for ${teacher?.name}.`,
    };
}
import { notFound } from 'next/navigation';
import {
    ArrowLeft,
    Mail,
    BookOpen,
    ArrowRight
} from 'lucide-react';

export default async function TeacherDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const data = getData();
    const teacher = data.teachers.find(t => t.id === id);

    if (!teacher) notFound();

    const teacherSubjects = data.subjects.filter(sub => sub.teacherId === teacher.id);

    return (
        <div className="space-y-8">
            <Link
                href="/admin/teachers"
                className="inline-flex items-center text-slate-500 hover:text-slate-900 font-medium transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Teachers
            </Link>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center space-x-6">
                        <div className="w-20 h-20 bg-purple-600 rounded-3xl flex items-center justify-center shadow-lg shadow-purple-100 text-white text-3xl font-black italic">
                            {teacher.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{teacher.name}</h1>
                            <div className="flex items-center mt-2 text-slate-500 font-medium">
                                <Mail className="w-4 h-4 mr-2" /> {teacher.email}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 text-center">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Subjects</div>
                            <div className="text-2xl font-black text-slate-900">{teacherSubjects.length}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                    <BookOpen className="w-6 h-6 mr-2 text-purple-500" />
                    Assigned Subjects & Performance
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {teacherSubjects.map((subject) => {
                        const cls = data.classes.find(c => c.id === subject.classId);
                        const studentGrades = data.students
                            .filter(s => s.classId === subject.classId)
                            .map(s => s.grades[subject.id])
                            .filter(g => g !== undefined);

                        const rate = calculateSuccessRate(studentGrades);

                        return (
                            <Link
                                key={subject.id}
                                href={`/admin/subjects/${subject.id}`}
                                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all group"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                                        <BookOpen className="text-purple-600 w-6 h-6 group-hover:text-white" />
                                    </div>
                                    <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tighter ${rate >= 80 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                        Performance: {rate}%
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-1">{subject.name}</h3>
                                    <p className="text-slate-500 font-medium flex items-center">
                                        Class: <span className="text-slate-900 ml-1">{cls?.name}</span>
                                    </p>
                                </div>
                                <div className="mt-8 flex items-center justify-between text-blue-600 font-bold text-sm">
                                    <span>View Student Grades</span>
                                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
