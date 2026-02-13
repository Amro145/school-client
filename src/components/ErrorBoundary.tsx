'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center space-y-6 animate-in fade-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center border-4 border-red-100 dark:border-red-900/30">
                        <AlertTriangle className="w-10 h-10 text-red-500" />
                    </div>

                    <div className="max-w-md space-y-2">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">System Malfunction</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">
                            An unexpected anomaly was detected in the interface rendering pipeline.
                        </p>
                        {this.state.error && (
                            <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-900 rounded-xl text-left text-xs font-mono text-red-500 overflow-auto max-h-32 border border-slate-200 dark:border-slate-800">
                                {this.state.error.message}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => {
                            this.setState({ hasError: false, error: null });
                            window.location.reload();
                        }}
                        className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform flex items-center shadow-xl active:scale-95"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Reload Module
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
