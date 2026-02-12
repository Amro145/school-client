"use client";

import { Trash2 } from 'lucide-react';
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

    const handleDelete = async () => {
        const Swal = (await import('sweetalert2')).default;
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: warning || "This action cannot be undone and will delete related data!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            background: '#ffffff',
            customClass: {
                popup: 'rounded-[32px] border-none shadow-2xl',
                confirmButton: 'rounded-xl font-black uppercase tracking-widest text-xs px-8 py-4',
                cancelButton: 'rounded-xl font-black uppercase tracking-widest text-xs px-8 py-4'
            }
        });

        if (result.isConfirmed) {
            try {
                if (action) {
                    await action(userId);
                } else {
                    await dispatch(handleDeleteUser(userId)).unwrap();
                }

                await Swal.fire({
                    title: 'Deleted!',
                    text: 'Record has been removed successfully.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    background: '#ffffff',
                    customClass: {
                        popup: 'rounded-[32px] border-none shadow-2xl',
                    }
                });
            } catch {
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to delete the record.',
                    icon: 'error',
                    background: '#ffffff',
                    customClass: {
                        popup: 'rounded-[32px] border-none shadow-2xl',
                    }
                });
            }
        }
    };

    return (
        <button
            onClick={handleDelete}
            className="p-4 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all shadow-sm border border-slate-200/50 hover:border-red-100 active:scale-95 group"
            title={`Delete ${userName}`}
        >
            <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>
    );
}
