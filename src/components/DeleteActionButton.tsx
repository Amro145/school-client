"use client";

import { useState } from 'react';
import { Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/redux/store';
import { handleDeleteUser } from '@/lib/redux/slices/adminSlice';

interface DeleteActionButtonProps {
    userId: string | number;
    userName: string;
}

export default function DeleteActionButton({ userId, userName }: DeleteActionButtonProps) {
    const dispatch = useDispatch<AppDispatch>();
    const [isConfirming, setIsConfirming] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const onDelete = async () => {
        setIsDeleting(true);
        try {
            await dispatch(handleDeleteUser(userId));
        } finally {
            setIsDeleting(false);
            setIsConfirming(false);
        }
    };

    if (isConfirming) {
        return (
            <div className="flex items-center space-x-2 animate-in fade-in zoom-in duration-200">
                <div className="flex items-center bg-red-50 border border-red-100 px-3 py-1.5 rounded-xl shadow-sm">
                    <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
                    <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider mr-3">Delete {userName}?</span>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setIsConfirming(false)}
                            className="text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 transition-colors"
                            disabled={isDeleting}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onDelete}
                            disabled={isDeleting}
                            className="bg-red-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center shadow-lg shadow-red-200"
                        >
                            {isDeleting ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                                "Confirm"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <button
            onClick={() => setIsConfirming(true)}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all group relative"
            title={`Delete ${userName}`}
        >
            <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>
    );
}
