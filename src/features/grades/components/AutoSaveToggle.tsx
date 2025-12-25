'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { setAutoSave, toggleAutoSave } from '@/lib/redux/slices/adminSlice';
import { Save, SaveOff } from 'lucide-react';

export default function AutoSaveToggle() {
    const dispatch = useDispatch();
    const isAutoSaveEnabled = useSelector((state: RootState) => state.admin.isAutoSaveEnabled);

    // Initialize from localStorage on mount
    useEffect(() => {
        const storedPref = localStorage.getItem('isAutoSaveEnabled');
        if (storedPref !== null) {
            dispatch(setAutoSave(storedPref === 'true'));
        }
    }, [dispatch]);

    const handleToggle = () => {
        const newState = !isAutoSaveEnabled;
        dispatch(toggleAutoSave());
        localStorage.setItem('isAutoSaveEnabled', String(newState));
    };

    return (
        <button
            onClick={handleToggle}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${isAutoSaveEnabled
                    ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400'
                    : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500'
                }`}
            title={isAutoSaveEnabled ? 'Auto-save Enabled' : 'Auto-save Disabled'}
        >
            {isAutoSaveEnabled ? (
                <>
                    <Save className="w-3 h-3" />
                    <span>Auto-Save On</span>
                </>
            ) : (
                <>
                    <SaveOff className="w-3 h-3" />
                    <span>Auto-Save Off</span>
                </>
            )}
        </button>
    );
}
