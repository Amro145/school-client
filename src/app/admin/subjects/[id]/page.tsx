import Link from 'next/link';
import { Metadata } from 'next';
import { getData, calculateSuccessRate } from '@/lib/data';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const data = getData();
    const subject = data.subjects.find(s => s.id === params.id);
    return {
        title: `${subject?.name || 'Subject'} Performance | EduDash`,
        description: `Detailed performance tracking for ${subject?.name}.`,
    };
}
import { notFound } from 'next/navigation';
import {
    ArrowLeft,
    BarChart3,
    Users,
    BookOpen,
    GraduationCap
} from 'lucide-react';

export default function SubjectDetailPage({ params }: { params: { id: string } }) {
    const data = getData();
    const subject = data.subjects.find(s => s.id === params.id);

    if (!subject) notFound();

    const teacher = data.teachers.find(t => t.id === subject.teacherId);
    const cls = data.classes.find(c => c.id === subject.classId);
    const studentsInSubject = data.students
        .filter(s => s.classId === subject.classId)
        .map(s => ({
            ...s,
            grade: s.grades[subject.id]
        }))
        .filter(s => s.grade !== undefined);

    const overallRate = calculateSuccessRate(studentsInSubject.map(s => s.grade as number));

    return (
        <div className="space-y-8">
            <Link
                href="/admin/subjects"
                className="inline-flex items-center text-slate-500 hover:text-slate-900 font-medium transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Subjects
            </Link>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200">
                        <BarChart3 className="text-white w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{subject.name}</h1>
                        <div className="flex items-center mt-2 space-x-4 text-slate-500 font-medium">
                            <span className="flex items-center"><Users className="w-4 h-4 mr-1" /> {teacher?.name}</span>
                            <span className="flex items-center"><BookOpen className="w-4 h-4 mr-1" /> {cls?.name}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-purple-50 px-8 py-4 rounded-2xl border border-purple-100 text-center">
                    <div className="text-sm font-bold text-purple-600 uppercase tracking-wider mb-1">Subject Success Rate</div>
                    <div className="text-4xl font-black text-purple-900">{overallRate}%</div>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center">
                        <GraduationCap className="w-6 h-6 mr-2 text-blue-500" />
                        Student Performance Tracker
                    </h2>
                    <span className="bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-sm font-bold">
                        {studentsInSubject.length} Students Enrolled
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                                <th className="px-8 py-4">Student</th>
                                <th className="px-8 py-4">Current Grade</th>
                                <th className="px-8 py-4">Status</th>
                                <th className="px-8 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {studentsInSubject.map((student) => (
                                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div>
                                            <div className="font-bold text-slate-900">{student.name}</div>
                                            <div className="text-sm text-slate-400 font-medium">{student.email}</div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-grow w-32 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${student.grade! >= 85 ? 'bg-green-500' : student.grade! >= 70 ? 'bg-blue-500' : 'bg-orange-500'}`}
                                                    style={{ width: `${student.grade}%` }}
                                                />
                                            </div>
                                            <span className="text-lg font-black text-slate-700">{student.grade}%</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        {student.grade! >= 70 ? (
                                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">PASSING</span>
                                        ) : (
                                            <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">ATTENTION</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="text-blue-600 font-bold hover:text-blue-800 transition-colors">Edit Grade</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
