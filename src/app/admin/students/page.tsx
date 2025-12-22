import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Students Management | EduDash",
    description: "Maintain student records, enrollment, and contact information.",
};
import { getData } from '@/lib/data';
import { Plus, Trash2, Mail, BookOpen, Search } from 'lucide-react';

export default function StudentsListPage() {
    const data = getData();

    const studentsWithDetails = data.students.map(student => {
        const cls = data.classes.find(c => c.id === student.classId);
        return {
            ...student,
            className: cls?.name || 'Unassigned'
        };
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Students Management</h1>
                    <p className="text-slate-500 mt-2">Maintain student records, enrollment, and contact information.</p>
                </div>
                <Link
                    href="/admin/students/new"
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center shadow-lg shadow-blue-100"
                >
                    <Plus className="w-5 h-5 mr-2" /> Add New Student
                </Link>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 relative">
                    <div className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-400">
                        <Search className="w-5 h-5" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search students by name or email..."
                        className="w-full pl-12 pr-6 py-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-100 placeholder-slate-400 transition-all font-medium"
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-sm font-semibold uppercase tracking-wider">
                                <th className="px-8 py-4">Student Name</th>
                                <th className="px-8 py-4">Class</th>
                                <th className="px-8 py-4">Email</th>
                                <th className="px-8 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {studentsWithDetails.map((student) => (
                                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                                                {student.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <span className="font-bold text-slate-900">{student.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center text-slate-600 font-medium">
                                            <BookOpen className="w-4 h-4 mr-2 text-slate-300" />
                                            {student.className}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center text-slate-600 font-medium">
                                            <Mail className="w-4 h-4 mr-2 text-slate-300" />
                                            {student.email}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                                <Search className="w-5 h-5" />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-6 bg-slate-50/30 border-t border-slate-50 text-center">
                    <button className="text-slate-500 hover:text-slate-900 font-bold text-sm transition-colors">Load More Students</button>
                </div>
            </div>
        </div>
    );
}
