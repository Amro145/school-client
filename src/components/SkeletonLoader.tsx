'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'rect' | 'circle';
    count?: number;
}

export const Skeleton = ({ className = '', variant = 'rect', count = 1 }: SkeletonProps) => {
    const baseStyle = "bg-slate-200 animate-pulse";
    const variantStyle = {
        text: "h-4 w-full rounded-lg",
        rect: "h-24 w-full rounded-2xl",
        circle: "h-12 w-12 rounded-full",
    }[variant];

    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className={`${baseStyle} ${variantStyle} ${className}`}
                />
            ))}
        </>
    );
};

export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => {
    return (
        <div className="space-y-4 w-full">
            <div className="flex space-x-4 px-6 py-4">
                <Skeleton className="w-1/4 h-6" variant="text" />
                <Skeleton className="w-1/4 h-6" variant="text" />
                <Skeleton className="w-1/4 h-6" variant="text" />
                <Skeleton className="w-1/4 h-6 ml-auto" variant="text" />
            </div>
            <div className="divide-y divide-slate-100">
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-6 px-10 py-8">
                        <Skeleton variant="circle" className="w-14 h-14" />
                        <div className="flex-1 space-y-2">
                            <Skeleton variant="text" className="w-1/3" />
                            <Skeleton variant="text" className="w-1/4" />
                        </div>
                        <Skeleton variant="text" className="w-24 h-8" />
                        <Skeleton variant="text" className="w-32 h-8" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export const CardSkeleton = ({ count = 4 }: { count?: number }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="p-8 bg-white rounded-[40px] border border-slate-100 flex flex-col space-y-4">
                    <Skeleton variant="circle" className="w-12 h-12" />
                    <Skeleton variant="text" className="w-1/2 h-4" />
                    <Skeleton variant="text" className="w-3/4 h-8" />
                    <Skeleton variant="text" className="w-1/3 h-3" />
                </div>
            ))}
        </div>
    );
};
