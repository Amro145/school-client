"use client";

import Link from 'next/link';
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
    ShieldCheck
} from 'lucide-react';
import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useDispatch } from 'react-redux';
import { logout } from '@/lib/redux/slices/authSlice';

const sidebarItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Classes', href: '/admin/classes', icon: BookOpen },
    { name: 'Subjects', href: '/admin/subjects', icon: BarChart3 },
    { name: 'Students', href: '/admin/students', icon: GraduationCap },
    { name: 'Teachers', href: '/admin/teachers', icon: Users },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dispatch = useDispatch();

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        dispatch(logout());
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#f8fafc] flex">
                {/* Sidebar - Desktop */}
                <aside className="hidden md:flex w-80 flex-col fixed h-full z-30">
                    <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-slate-200/60 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)]">
                        <div className="px-8 py-10">
                            <Link href="/admin" className="flex items-center group">
                                <div className="w-12 h-12 bg-blue-600 rounded-[18px] flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform duration-300">
                                    <ShieldCheck className="text-white w-7 h-7" />
                                </div>
                                <div className="ml-4">
                                    <span className="block text-2xl font-black text-slate-900 tracking-tighter leading-none">EDUDASH</span>
                                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1 block">Administrator</span>
                                </div>
                            </Link>
                        </div>

                        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Main Navigation</p>
                            {sidebarItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center space-x-3 px-5 py-4 rounded-2xl font-bold transition-all duration-300 group ${isActive
                                            ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/25 translate-x-1'
                                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                            }`}
                                    >
                                        <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-900'}`} />
                                        <span className="tracking-tight">{item.name}</span>
                                        {isActive && (
                                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/40" />
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="p-6">
                            <div className="p-5 bg-slate-900 rounded-[32px] overflow-hidden relative group cursor-pointer border border-white/5 shadow-2xl">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-blue-500/30 transition-all duration-500" />
                                <div className="relative z-10">
                                    <p className="text-xs font-bold text-blue-400 mb-1">PRO PLAN</p>
                                    <p className="text-sm font-bold text-white mb-3">Upgrade to Enterprise</p>
                                    <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/10">Learn More</button>
                                </div>
                            </div>
                        </div>

                        <div className="px-4 py-6 border-t border-slate-100">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center space-x-3 px-5 py-4 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-300 group font-bold"
                            >
                                <div className="w-8 h-8 rounded-xl bg-slate-50 group-hover:bg-red-100 transition-colors flex items-center justify-center">
                                    <LogOut className="w-4 h-4" />
                                </div>
                                <span>Logout Session</span>
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="grow md:ml-80 min-h-screen">
                    {/* Header - Glass Effect */}
                    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-6 py-5 md:px-10 flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="md:hidden mr-4 p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            <div className="hidden md:block">
                                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Management Overview</h2>
                                <p className="text-lg font-bold text-slate-900 tracking-tight">System Terminal</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="hidden sm:flex items-center bg-slate-100 rounded-2xl px-4 py-2 border border-slate-200/50">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-3" />
                                <span className="text-xs font-bold text-slate-600">Cloud Status: Optimal</span>
                            </div>
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 border border-white/10 flex items-center justify-center text-white font-black text-xs shadow-lg">
                                AD
                            </div>
                        </div>
                    </header>

                    {/* Mobile Sidebar Overlay */}
                    {isMobileMenuOpen && (
                        <div className="fixed inset-0 z-50 md:hidden overflow-hidden" onClick={() => setIsMobileMenuOpen(false)}>
                            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />
                            <div
                                className="absolute inset-y-0 left-0 w-80 bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-500"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="p-8 flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                                            <ShieldCheck className="text-white w-6 h-6" />
                                        </div>
                                        <span className="ml-3 text-xl font-black text-slate-900 tracking-tighter">EDUDASH</span>
                                    </div>
                                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-50 rounded-xl"><X className="w-5 h-5 text-slate-500" /></button>
                                </div>
                                <nav className="flex-1 px-4 space-y-1.5 pt-4">
                                    {sidebarItems.map((item) => {
                                        const isActive = pathname === item.href;
                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={`flex items-center space-x-3 px-5 py-4 rounded-2xl font-bold transition-all ${isActive
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-slate-500'
                                                    }`}
                                            >
                                                <item.icon className="w-5 h-5" />
                                                <span>{item.name}</span>
                                            </Link>
                                        );
                                    })}
                                </nav>
                                <div className="p-6 border-t border-slate-100">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center space-x-3 px-5 py-4 text-slate-500 font-bold"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span>Log Out</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="p-6 md:p-12 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        {children}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
