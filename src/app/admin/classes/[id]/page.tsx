import Link from 'next/link';
import { Metadata } from 'next';
import { getData, calculateSuccessRate } from '@/lib/data';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const data = getData();
    const cls = data.classes.find(c => c.id === params.id);
    return {
        title: `${cls?.name || 'Class'} Details | EduDash`,
        description: `Performance and curriculum overview for ${cls?.name}.`,
    };
}
import { notFound } from 'next/navigation';
import {
    ArrowLeft,
    Trash2,
    Plus,
    BookOpen,
    Users,
    GraduationCap
} from 'lucide-react';

export default function ClassDetailPage({ params }: { params: { id: string } }) {
    const data = getData();
    const cls = data.classes.find(c => c.id === params.id);

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
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center">
                                <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
                                Curriculum Subjects
                            </h2>
                            <button className="text-blue-600 bg-blue-50 px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors flex items-center">
                                <Plus className="w-4 h-4 mr-1" /> Add Subject
                            </button>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {classSubjects.map((subject) => {
                                const teacher = data.teachers.find(t => t.id === subject.teacherId);
                                const subjectGrades = classStudents.map(s => s.grades[subject.id]).filter(g => g !== undefined);
                                const rate = calculateSuccessRate(subjectGrades);

                                return (
                                    <div key={subject.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-400">
                                                {subject.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900">{subject.name}</h4>
                                                <p className="text-sm text-slate-500">Teacher: {teacher?.name || 'Unassigned'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-6">
                                            <div className="text-right">
                                                <div className="text-sm font-bold text-slate-900">{rate}%</div>
                                                <div className="text-xs text-slate-400 font-medium">Success Rate</div>
                                            </div>
                                            <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Students list */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center">
                                <Users className="w-5 h-5 mr-2 text-purple-500" />
                                Enrolled Students
                            </h2>
                            <span className="text-slate-400 font-medium text-sm">{classStudents.length} Students</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Student Name</th>
                                        <th className="px-6 py-4">Performance</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {classStudents.map((student) => {
                                        const studentRate = calculateSuccessRate(Object.values(student.grades));
                                        return (
                                            <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 animate-pulse bg-gradient-to-br from-blue-100 to-purple-100 rounded-full overflow-hidden flex items-center justify-center text-xs font-bold text-blue-600">
                                                            {student.name.split(' ').map(n => n[0]).join('')}
                                                        </div>
                                                        <span className="font-bold text-slate-800">{student.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="flex-grow w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full ${studentRate >= 80 ? 'bg-green-500' : 'bg-blue-500'}`}
                                                                style={{ width: `${studentRate}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-sm font-bold text-slate-600">{studentRate}%</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right text-sm font-medium">
                                                    <button className="text-slate-400 hover:text-blue-600 transition-colors">View Profile</button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar info */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-3xl text-white shadow-xl shadow-blue-200">
                        <h3 className="text-xl font-bold mb-4 opacity-90">Class Overview</h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="opacity-70">Total Students</span>
                                <span className="text-2xl font-bold">{classStudents.length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="opacity-70">Subjects Taught</span>
                                <span className="text-2xl font-bold">{classSubjects.length}</span>
                            </div>
                            <div className="pt-6 border-t border-white/10">
                                <span className="opacity-70 block mb-2">Overall Success Rate</span>
                                <div className="text-4xl font-extrabold">
                                    {calculateSuccessRate(classStudents.flatMap(s => Object.values(s.grades)))}%
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4">Quick Stats</h3>
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Gender Distribution</span>
                                <span className="font-bold text-slate-900">Equal</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Avg. Attendance</span>
                                <span className="font-bold text-slate-900">94%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
