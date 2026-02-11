import React from 'react';
import { UseFormRegisterReturn, FieldError } from 'react-hook-form';
import { LucideIcon, AlertCircle } from 'lucide-react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon: LucideIcon;
    error?: FieldError;
    register: UseFormRegisterReturn;
}

const FormInput: React.FC<FormInputProps> = ({
    label,
    icon: Icon,
    error,
    register,
    className = '',
    ...props
}) => {
    const isInvalid = !!error;

    return (
        <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                {label}
            </label>
            <div className="relative group">
                <div className={`absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none transition-colors ${isInvalid ? 'text-red-500' : 'text-slate-400 group-focus-within:text-blue-600'
                    }`}>
                    <Icon className="w-5 h-5" />
                </div>
                <input
                    {...register}
                    {...props}
                    className={`block w-full pl-14 pr-6 py-5 bg-slate-50/50 dark:bg-slate-800/50 border rounded-[24px] text-slate-900 dark:text-white font-bold placeholder:text-slate-300 focus:ring-4 transition-all outline-none ${isInvalid
                            ? 'border-red-500 focus:ring-red-50 dark:focus:ring-red-900/20 focus:border-red-600 shadow-[0_0_0_1px_rgba(239,68,68,0.1)]'
                            : 'border-slate-100 dark:border-slate-700 focus:ring-blue-50 dark:focus:ring-blue-900/20 focus:border-blue-500 dark:focus:bg-slate-800'
                        } ${className}`}
                />
            </div>
            {isInvalid && (
                <div className="flex items-center space-x-2 ml-2 mt-1 animate-in slide-in-from-top-1 duration-200">
                    <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                    <p className="text-[10px] font-black text-red-500 uppercase tracking-wider">
                        {error.message}
                    </p>
                </div>
            )}
        </div>
    );
};

export default FormInput;
