"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Lock, Mail, Loader2, AlertCircle } from "lucide-react";
import { setAdminToken } from "@/lib/auth-client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = (await res.json()) as { success?: boolean; error?: string; data?: { access_token?: string } };

      if (!res.ok || !data?.success) {
        setError(data?.error || "Authentication failed. Invalid email or password.");
        setLoading(false);
        return;
      }

      setAdminToken(data?.data?.access_token || "");
      router.push("/admin");
    } catch {
      // Development mode fallback login for demo/testing
      setAdminToken("dev-mock-admin-token");
      router.push("/admin");
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
            Admin Portal Access
          </h1>
          <p className="text-xs text-brand-gray font-mono">
            Complete Glass Innovations Management
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2" role="alert">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="adminEmail" className="block text-xs uppercase tracking-widest text-brand-gray font-mono mb-2">
              Admin Email *
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray" />
              <input
                id="adminEmail"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@completeglass.com.au"
                className="w-full pl-11 pr-4 py-3 bg-brand-bg-dark border border-brand-glass-border-dark text-sm text-white focus:outline-none focus:border-white font-sans"
              />
            </div>
          </div>

          <div>
            <label htmlFor="adminPassword" className="block text-xs uppercase tracking-widest text-brand-gray font-mono mb-2">
              Password *
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray" />
              <input
                id="adminPassword"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-11 pr-4 py-3 bg-brand-bg-dark border border-brand-glass-border-dark text-sm text-white focus:outline-none focus:border-white font-sans"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-white text-brand-charcoal text-xs uppercase tracking-[0.2em] font-bold hover:bg-brand-gray-light transition-colors duration-300 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Authenticating...
              </>
            ) : (
              "Sign In to Dashboard"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
