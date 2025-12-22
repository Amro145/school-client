import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Teachers Management | EduDash",
    description: "Manage faculty members and their subject assignments.",
};
import { getData } from '@/lib/data';
import { Plus, ChevronRight, Mail, BookOpen } from 'lucide-react';

export default function TeachersListPage() {
    const data = getData();

    const teachersWithStats = data.teachers.map(teacher => {
        const teacherSubjects = data.subjects.filter(sub => sub.teacherId === teacher.id);
        return {
            ...teacher,
            subjectCount: teacherSubjects.length
        };
    });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Teachers Management</h1>
                    <p className="text-slate-500 mt-2">Manage faculty members and their subject assignments.</p>
                </div>
                <Link
                    href="/admin/teachers/new"
                    className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors flex items-center shadow-lg shadow-purple-100"
                >
                    <Plus className="w-5 h-5 mr-2" /> Add New Teacher
                </Link>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 text-slate-500 text-sm font-semibold uppercase tracking-wider">
                            <th className="px-8 py-4">Teacher Name</th>
                            <th className="px-8 py-4">Email</th>
                            <th className="px-8 py-4">Subjects Taught</th>
                            <th className="px-8 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {teachersWithStats.map((teacher) => (
                            <tr key={teacher.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-bold text-sm">
                                            {teacher.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <span className="font-bold text-slate-900">{teacher.name}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center text-slate-600 font-medium">
                                        <Mail className="w-4 h-4 mr-2 text-slate-300" />
                                        {teacher.email}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center text-slate-600 font-medium bg-slate-50 w-fit px-3 py-1 rounded-full text-sm">
                                        <BookOpen className="w-4 h-4 mr-2 text-slate-400" />
                                        {teacher.subjectCount} Subjects
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <Link
                                        href={`/admin/teachers/${teacher.id}`}
                                        className="inline-flex items-center text-purple-600 font-bold hover:text-purple-800 transition-colors"
                                    >
                                        View Details <ChevronRight className="ml-1 w-4 h-4" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
