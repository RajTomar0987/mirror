"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Shield, Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid admin email address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = (await res.json()) as { success?: boolean; error?: string; message?: string };

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to process request. Please try again.");
        setLoading(false);
        return;
      }

      setSubmitted(true);
    } catch {
      setError("A network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-charcoal flex items-center justify-center p-6 text-white">
      <div className="w-full max-w-md bg-black/40 border border-brand-glass-border-dark p-8 md:p-10 shadow-premium">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white mb-4">
            <Shield size={24} />
          </div>
          <h1 className="font-serif text-2xl font-light tracking-wider uppercase mb-1">
            Reset Password
          </h1>
          <p className="text-xs text-brand-gray font-mono">
            Complete Glass Innovations Management
          </p>
        </div>

        {submitted ? (
          <div className="text-center space-y-6">
            <div className="w-14 h-14 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white mx-auto">
              <CheckCircle2 size={30} />
            </div>
            <p className="text-sm text-brand-gray-light leading-relaxed font-sans font-light">
              If an admin account exists for <span className="text-white font-medium">{email}</span>, a password reset link has been dispatched.
            </p>
            <Link
              href="/admin/login"
              className="inline-flex items-center justify-center gap-2 w-full py-4 bg-white text-brand-charcoal text-xs uppercase tracking-[0.2em] font-bold hover:bg-brand-gray-light transition-colors"
            >
              <ArrowLeft size={14} />
              Return to Login
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2" role="alert">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="adminResetEmail" className="block text-xs uppercase tracking-widest text-brand-gray font-mono mb-2">
                  Admin Email *
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray" />
                  <input
                    id="adminResetEmail"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@completeglass.com.au"
                    className="w-full pl-11 pr-4 py-3 bg-brand-bg-dark border border-brand-glass-border-dark text-sm text-white focus:outline-none focus:border-white font-sans"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-white text-brand-charcoal text-xs uppercase tracking-[0.2em] font-bold hover:bg-brand-gray-light transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending Reset Link...
                  </>
                ) : (
                  "Request Reset Link"
                )}
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-brand-gray hover:text-white transition-colors"
                >
                  <ArrowLeft size={12} />
                  Back to Login
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
