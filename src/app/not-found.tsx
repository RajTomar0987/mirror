import React from "react";
import Link from "next/link";
import { ArrowLeft, Grid } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-charcoal text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 py-24">
        <div className="max-w-2xl w-full text-center space-y-8">
          <div className="inline-block p-4 rounded-full bg-white/5 border border-brand-glass-border-dark font-mono text-xs text-brand-gray tracking-widest uppercase">
            [Error 404 — Page Not Found]
          </div>

          <h1 className="font-serif text-5xl sm:text-7xl font-light tracking-tight text-white uppercase">
            SPECS OUT OF BOUNDS
          </h1>

          <p className="text-sm sm:text-base text-brand-gray font-light max-w-md mx-auto leading-relaxed">
            The architectural detail or page requested could not be located. It may have been relocated or updated.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-charcoal text-xs uppercase font-mono font-bold hover:bg-brand-gray-light transition-colors"
            >
              <ArrowLeft size={16} /> Return to Homepage
            </Link>

            <Link
              href="/services"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-white/20 text-white text-xs uppercase font-mono font-bold hover:bg-white/10 transition-colors"
            >
              <Grid size={16} /> View Services
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
