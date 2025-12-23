"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    BookOpen,
    User,
    LogOut,
    Menu,
    X,
    Trophy
} from 'lucide-react';
import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/lib/redux/slices/authSlice';
import { RootState } from '@/lib/redux/store';
import { motion, AnimatePresence } from 'framer-motion';

const teacherItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Subjects', href: '/subjects', icon: BookOpen },
    { name: 'Profile', href: '/profile', icon: User },
];

export default function TeacherLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        dispatch(logout());
        window.location.href = '/login';
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#f8fafc] flex group/sidebar">
                {/* Sidebar - Desktop */}
                <aside className="hidden md:flex flex-col fixed h-full z-30">
                    <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-slate-200/60 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)] transition-all duration-300 ease-in-out w-20 group-hover/sidebar:w-64 overflow-hidden">
                        <div className="flex flex-col items-center group-hover/sidebar:items-start px-0 group-hover/sidebar:px-6 py-10 transition-all duration-300">
                            <Link href="/dashboard" className="flex items-center group/logo overflow-hidden">
                                <div className="min-w-[50px] w-[50px] h-[50px] bg-purple-600 rounded-[18px] flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover/logo:scale-105 transition-transform duration-300">
                                    <Trophy className="text-white w-7 h-7" />
                                </div>
                                <div className="ml-4 opacity-0 group-hover/sidebar:opacity-100 transition-all duration-300 whitespace-nowrap">
                                    <span className="block text-xl font-black text-slate-900 tracking-tighter leading-none">EDUDASH</span>
                                    <span className="text-[9px] font-bold text-purple-600 uppercase tracking-widest mt-1 block">
                                        Faculty Portal
                                    </span>
                                </div>
                            </Link>
                        </div>

                        <nav className="flex-1 px-3 group-hover/sidebar:px-4 space-y-2 overflow-y-auto custom-scrollbar overflow-x-hidden">
                            {teacherItems.map((item) => {
                                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center px-4 py-4 rounded-2xl font-bold transition-all duration-300 group ${isActive
                                            ? 'bg-purple-600 text-white shadow-xl shadow-purple-500/25'
                                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                            }`}
                                    >
                                        <div className="min-w-[20px] flex items-center justify-center">
                                            <item.icon className={`w-6 h-6 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-900'}`} />
                                        </div>
                                        <span className="ml-4 tracking-tight opacity-0 group-hover/sidebar:opacity-100 transition-all duration-300 whitespace-nowrap">{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="px-3 group-hover/sidebar:px-4 py-6 border-t border-slate-100">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center px-4 py-4 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-300 group font-bold"
                            >
                                <div className="min-w-[24px] flex items-center justify-center">
                                    <LogOut className="w-5 h-5" />
                                </div>
                                <span className="ml-4 opacity-0 group-hover/sidebar:opacity-100 transition-all duration-300 whitespace-nowrap">Logout</span>
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="grow md:ml-20 group-hover/sidebar:md:ml-64 transition-all duration-300 ease-in-out min-h-screen">
                    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-6 py-5 md:px-10 flex items-center justify-between">
                        <div>
                            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Academic Evaluation</h2>
                            <p className="text-lg font-bold text-slate-900 tracking-tight">Faculty Terminal</p>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="hidden sm:flex items-center bg-slate-100 rounded-2xl px-4 py-2 border border-slate-200/50">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-3" />
                                <span className="text-xs font-bold text-slate-600">Active Duty</span>
                            </div>
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 border border-white/10 flex items-center justify-center text-white font-black text-xs shadow-lg uppercase">
                                {user?.userName.substring(0, 2) || 'TR'}
                            </div>
                        </div>
                    </header>

                    {/* Content Wrapper with Animation */}
                    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-[calc(100vh-80px)]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={pathname}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Mobile Menu Trigger */}
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="md:hidden fixed bottom-6 right-6 z-50 w-16 h-16 bg-purple-600 text-white rounded-full shadow-2xl shadow-purple-500/40 flex items-center justify-center transition-transform active:scale-90"
                    >
                        <Menu className="w-8 h-8" />
                    </button>

                    {/* Mobile Sidebar Overlay */}
                    {isMobileMenuOpen && (
                        <div className="fixed inset-0 z-50 md:hidden overflow-hidden" onClick={() => setIsMobileMenuOpen(false)}>
                            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" />
                            <div
                                className="absolute inset-y-0 left-0 w-[280px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-500 rounded-r-[40px] border-r border-slate-100"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="p-8 flex items-center justify-between border-b border-slate-50">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                                            <Trophy className="text-white w-7 h-7" />
                                        </div>
                                        <div className="ml-4 text-left">
                                            <span className="block text-xl font-black text-slate-900 tracking-tighter">EDUDASH</span>
                                            <span className="text-[9px] font-bold text-purple-600 uppercase tracking-widest block">Teacher Portal</span>
                                        </div>
                                    </div>
                                    <button onClick={() => setIsMobileMenuOpen(false)} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center active:scale-90 transition-transform"><X className="w-5 h-5 text-slate-500" /></button>
                                </div>
                                <nav className="flex-1 px-4 space-y-2 pt-8">
                                    {teacherItems.map((item) => {
                                        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={`flex items-center px-6 py-5 rounded-2xl font-black transition-all text-sm ${isActive
                                                    ? 'bg-purple-600 text-white shadow-xl shadow-purple-500/25'
                                                    : 'text-slate-500 active:bg-slate-50'
                                                    }`}
                                            >
                                                <item.icon className={`w-5 h-5 mr-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                                                <span>{item.name}</span>
                                            </Link>
                                        );
                                    })}
                                </nav>
                                <div className="p-8 border-t border-slate-50">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center px-6 py-5 text-slate-600 font-black text-sm bg-slate-50 rounded-2xl active:scale-95 transition-all"
                                    >
                                        <LogOut className="w-5 h-5 mr-4 text-slate-400" />
                                        <span>Logout Session</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </ProtectedRoute>
    );
}
