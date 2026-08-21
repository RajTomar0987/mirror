"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, ArrowLeft } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Uncaught application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-brand-charcoal text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full p-8 border border-brand-glass-border-dark bg-black/40 space-y-6">
        <div className="text-xs font-mono text-brand-gray uppercase tracking-widest">
          [System Exception]
        </div>

        <h1 className="font-serif text-3xl font-light text-white uppercase">
          TEMPORARY INTERRUPT
        </h1>

        <p className="text-xs text-brand-gray leading-relaxed font-sans font-light">
          An unexpected error occurred while processing your request. Our technical team has been notified.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-brand-charcoal text-xs uppercase font-mono font-bold hover:bg-brand-gray-light transition-colors"
          >
            <RefreshCw size={14} /> Try Again
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/20 text-white text-xs uppercase font-mono font-bold hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={14} /> Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
