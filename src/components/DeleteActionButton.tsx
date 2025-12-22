"use client";

import { useState } from 'react';
import { Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/redux/store';
import { handleDeleteUser } from '@/lib/redux/slices/adminSlice';
interface DeleteActionButtonProps {
    userId: string | number;
    userName: string;
    warning?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    action?: (id: string | number) => any;
}

export default function DeleteActionButton({ userId, userName, warning, action }: DeleteActionButtonProps) {
    const dispatch = useDispatch<AppDispatch>();
    const [isConfirming, setIsConfirming] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const onDelete = async () => {
        setIsDeleting(true);
        try {
            if (action) {
                await dispatch(action(userId));
            } else {
                await dispatch(handleDeleteUser(userId));
            }
        } finally {
            setIsDeleting(false);
            setIsConfirming(false);
        }
    };

    if (isConfirming) {
        return (
            <div className="flex items-center space-x-2 animate-in fade-in zoom-in duration-200">
                <div className="flex flex-col md:flex-row items-center bg-red-50 border border-red-100 px-4 py-3 rounded-2xl shadow-xl shadow-red-200/50">
                    <div className="flex items-center mb-2 md:mb-0">
                        <AlertTriangle className="w-4 h-4 text-red-500 mr-2 shrink-0" />
                        <div className="flex flex-col">
                            <span className="text-[11px] font-black text-red-600 uppercase tracking-wider">Confirm Removal</span>
                            <span className="text-[10px] font-medium text-red-500 leading-tight pr-4">
                                {warning || `This will permanently delete ${userName}.`}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3 ml-auto">
                        <button
                            onClick={() => setIsConfirming(false)}
                            className="text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 transition-colors px-2"
                            disabled={isDeleting}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onDelete}
                            disabled={isDeleting}
                            className="bg-red-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center shadow-lg shadow-red-200 active:scale-95"
                        >
                            {isDeleting ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                                "Execute"
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
