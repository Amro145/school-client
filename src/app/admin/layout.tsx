"use client";


import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { usePathname } from 'next/navigation';
import {
    BarChart3,
    Users,
    BookOpen,
    GraduationCap,
    LayoutDashboard,
    LogOut,
    Menu,
    X,
    ShieldCheck,
    Table,
    FileText,
    Calendar,
    User
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/redux/slices/authSlice';
import { RootState } from '@/lib/redux/store';

const adminItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Classes', href: '/admin/classes', icon: BookOpen },
    { name: 'Subjects', href: '/subjects', icon: BarChart3 },
    { name: 'Students', href: '/students', icon: GraduationCap },
    { name: 'Teachers', href: '/admin/teachers', icon: Users },
    { name: 'Examinations', href: '/exams', icon: FileText },
    { name: 'Schedules', href: '/admin/schedules', icon: Table },
];

const teacherItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Subjects', href: '/subjects', icon: BookOpen },
    { name: 'My Classes', href: '/admin/classes', icon: Users },
    { name: 'Examinations', href: '/exams', icon: FileText },
    { name: 'Schedules', href: '/admin/schedules', icon: Table },
];

const studentItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Schedule', href: '/dashboard/my-schedule', icon: Calendar },
    { name: 'Profile', href: '/profile', icon: User },
    { name: "Exams", href: '/exams', icon: BookOpen },
];

interface SidebarItemProps {
    name: string;
    href: string;
    icon: any;
}

const SidebarItem = React.memo(({ item, pathname, isSidebarExpanded }: { item: SidebarItemProps, pathname: string, isSidebarExpanded: boolean }) => {
    const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
    return (
        <Link
            href={item.href}
            className={`flex items-center px-4 py-4 rounded-2xl font-bold transition-all duration-300 group ${isActive
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/25'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
                }`}
        >
            <div className="min-w-[20px] flex items-center justify-center">
                <item.icon className={`w-6 h-6 transition-colors ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white'}`} />
            </div>
            <span className="ml-4 tracking-tight transition-all duration-300 whitespace-nowrap opacity-100">
                {item.name}
            </span>
        </Link>
    );
});

SidebarItem.displayName = 'SidebarItem';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();
    const { user, needsSchoolSetup } = useSelector((state: RootState) => state.auth);

    const sidebarItems = user?.role === 'teacher'
        ? teacherItems
        : user?.role === 'student'
            ? studentItems
            : adminItems;

    useEffect(() => {
        if (needsSchoolSetup && pathname !== '/admin/setup-school') {
            router.push('/admin/setup-school');
        }
    }, [needsSchoolSetup, pathname, router]);

    // If setting up school, show minimal layout or just the child
    if (pathname === '/admin/setup-school') {
        return <ProtectedRoute>{children}</ProtectedRoute>;
    }

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        dispatch(logout());
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 flex group/sidebar transition-colors duration-300">
                {/* Sidebar - Desktop */}
                <aside
                    className="hidden md:flex flex-col fixed h-full z-30 w-64"
                >
                    <div className="flex-1 flex flex-col min-h-0  dark:bg-slate-950 border-r border-slate-200/60 dark:border-slate-800 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)] transition-all duration-300 ease-in-out w-full overflow-hidden">
                        <div className="flex flex-col items-start px-6 py-10 transition-all duration-300">
                            <Link href="/admin" className="flex items-center group/logo overflow-hidden">
                                <div className="min-w-[50px] w-[50px] h-[50px] bg-blue-600 rounded-[18px] flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover/logo:scale-105 transition-transform duration-300">
                                    <ShieldCheck className="text-white w-7 h-7" />
                                </div>
                                <div className="ml-4 transition-all duration-300 whitespace-nowrap opacity-100">
                                    <span className="block text-xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">EDUDASH</span>
                                    <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mt-1 block">
                                        {user?.role === 'teacher' ? 'Teacher' : 'Admin'}
                                    </span>
                                </div>
                            </Link>
                        </div>

                        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar overflow-x-hidden">
                            {sidebarItems.map((item) => (
                                <SidebarItem
                                    key={item.name}
                                    item={item}
                                    pathname={pathname}
                                    isSidebarExpanded={isSidebarExpanded}
                                />
                            ))}
                        </nav>

                        <div className="px-4 py-6 border-t border-slate-100 dark:border-slate-800">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center px-4 py-4 text-slate-500 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all duration-300 group font-bold"
                            >
                                <div className="min-w-[24px] flex items-center justify-center">
                                    <LogOut className="w-5 h-5" />
                                </div>
                                <span className="ml-4 transition-all duration-300 whitespace-nowrap opacity-100">Logout</span>
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="grow md:ml-64 transition-all duration-300 ease-in-out min-h-screen">
                    {/* Header - Glass Effect */}
                    <header className="sticky top-0 z-40 /80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800 px-6 py-5 md:px-10 flex items-center justify-between transition-colors duration-300">
                        <div className="flex items-center gap-4">
                            {/* Mobile Menu Trigger */}
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="md:hidden p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 active:scale-90 transition-transform"
                            >
                                <Menu className="w-6 h-6" />
                            </button>

                            <div className="flex items-center space-x-2 md:hidden">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
                                    <ShieldCheck className="text-white w-5 h-5" />
                                </div>
                                <span className="text-lg font-black text-slate-900 dark:text-white tracking-tighter leading-none">EDU</span>
                            </div>

                            <div className="hidden md:block">
                                <h2 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                                    {user?.role === 'teacher' ? 'Academic Hub' : 'Management Overview'}
                                </h2>
                                <p className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                                    {user?.role === 'teacher' ? 'Evaluation Terminal' : 'System Terminal'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <ThemeToggle />
                            <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-2 border border-slate-200/50 dark:border-slate-700">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-3" />
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Active</span>
                            </div>
                            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-slate-800 to-slate-950 dark:from-slate-700 dark:to-slate-900 border border-white/10 flex items-center justify-center text-white font-black text-xs shadow-lg uppercase">
                                {user?.userName.substring(0, 2) || 'AD'}
                            </div>
                        </div>
                    </header>

                    {/* Mobile Floating Trigger - Hidden but kept for logic if needed (optional) */}
                    {/* <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="md:hidden fixed bottom-6 right-6 z-50 w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl shadow-blue-500/40 flex items-center justify-center transition-transform active:scale-90"
                    >
                        <Menu className="w-8 h-8" />
                    </button> */}

                    {/* Mobile Sidebar Overlay */}
                    {isMobileMenuOpen && (
                        <div className="fixed inset-0 z-50 md:hidden overflow-hidden" onClick={() => setIsMobileMenuOpen(false)}>
                            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" />
                            <div
                                className="absolute inset-y-0 left-0 w-[280px]  dark:bg-slate-950 shadow-2xl flex flex-col animate-in slide-in-from-left duration-500 rounded-r-[40px] border-r border-slate-100 dark:border-slate-800"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="p-8 flex items-center justify-between border-b border-slate-50 dark:border-slate-800">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                                            <ShieldCheck className="text-white w-7 h-7" />
                                        </div>
                                        <div className="ml-4 text-left">
                                            <span className="block text-xl font-black text-slate-900 dark:text-white tracking-tighter">EDUDASH</span>
                                            <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block">Portal Access</span>
                                        </div>
                                    </div>
                                    <button onClick={() => setIsMobileMenuOpen(false)} className="w-10 h-10 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center active:scale-90 transition-transform"><X className="w-5 h-5 text-slate-500" /></button>
                                </div>
                                <nav className="flex-1 px-4 space-y-2 pt-8">
                                    {sidebarItems.map((item: SidebarItemProps) => {
                                        const isActive = pathname === item.href;
                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={`flex items-center px-6 py-5 rounded-2xl font-black transition-all text-sm ${isActive
                                                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/25'
                                                    : 'text-slate-500 dark:text-slate-400 active:bg-slate-50 dark:active:bg-slate-900'
                                                    }`}
                                            >
                                                <item.icon className={`w-5 h-5 mr-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                                                <span>{item.name}</span>
                                            </Link>
                                        );
                                    })}
                                </nav>
                                <div className="p-8 border-t border-slate-50 dark:border-slate-800">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center px-6 py-5 text-slate-600 dark:text-slate-400 font-black text-sm bg-slate-50 dark:bg-slate-900 rounded-2xl active:scale-95 transition-all"
                                    >
                                        <LogOut className="w-5 h-5 mr-4 text-slate-400" />
                                        <span>Logout Session</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="p-4 md:p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        {children}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
