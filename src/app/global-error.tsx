'use client';

import React from 'react';
import './globals.css';
import Link from 'next/link';

export const runtime = 'edge';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-slate-950 text-white font-sans overflow-hidden relative">
           {/* Background Decorations */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/20 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 w-full max-w-2xl text-center space-y-8 p-12 rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl bg-white/5">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 mb-4 animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-2">Critical System Error</h1>
            
            <p className="text-xl text-slate-400 font-medium max-w-lg mx-auto leading-relaxed">
              We've encountered a critical issue that prevents the application from loading correctly.
            </p>

            {error.digest && (
                <div className="bg-red-950/50 border border-red-900/50 rounded-lg px-4 py-2 inline-block font-mono text-xs text-red-200">
                    ID: {error.digest}
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <button
                onClick={() => reset()}
                className="px-8 py-4 bg-white text-slate-950 rounded-2xl font-black hover:scale-105 transition-transform duration-200 active:scale-95 shadow-xl shadow-white/10"
              >
                Attempt Recovery
              </button>
              <button
                 onClick={() => window.location.reload()}
                 className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-colors active:scale-95"
              >
                Reload Page
              </button>
            </div>
          </div>
          
          <div className="absolute bottom-8 text-slate-500 text-sm font-medium">
             School Management System V3
          </div>
        </div>
      </body>
    </html>
  );
}
