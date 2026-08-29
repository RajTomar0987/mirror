"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Shield, LogOut, ArrowRight, FileText, CheckCircle2, Clock } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/animations/PageTransition";
import { FadeIn } from "@/components/animations/FadeIn";
import { getAuthUser, clearAuthSession, AuthUser } from "@/lib/auth-client";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getAuthUser();
    if (!currentUser) {
      router.replace("/auth?mode=login&error=unauthorized");
      return;
    }
    setUser(currentUser);
    setLoading(false);
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("Logout error:", e);
    }
    clearAuthSession();
    router.replace("/auth?mode=login");
  };

  if (loading || !user) {
    return (
      <PageTransition>
        <Navbar />
        <main className="min-h-screen pt-36 bg-[#f7f7f5] flex items-center justify-center">
          <div className="text-center font-mono text-xs text-[#555555]">
            Loading Account Dashboard...
          </div>
        </main>
        <Footer />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Navbar />

      <main className="min-h-screen pt-32 sm:pt-36 pb-20 bg-[#f7f7f5] text-[#111111]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Header Banner */}
          <div className="bg-white border border-[#e5e5e5] p-6 sm:p-8 md:p-10 mb-8 shadow-premium">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#e5e5e5]">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#f7f7f5] border border-[#e5e5e5] flex items-center justify-center text-[#111111] shadow-subtle shrink-0">
                  <User size={26} />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#555555] block mb-1">
                    [Client Portal]
                  </span>
                  <h1 className="font-serif text-2xl sm:text-3xl font-light tracking-tight text-[#111111]">
                    {user.fullName || "Valued Client"}
                  </h1>
                  <span className="text-xs font-mono text-[#555555]">{user.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs uppercase tracking-widest font-mono font-bold transition-colors"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            </div>

            {/* Account Metadata Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-xs">
              <div className="p-4 bg-[#f7f7f5] border border-[#e5e5e5]">
                <span className="text-[10px] uppercase font-mono text-[#555555] block mb-1">
                  Account Type
                </span>
                <span className="font-bold text-[#111111] uppercase font-mono">
                  {user.role === "admin" ? "Administrator" : "Standard Client"}
                </span>
              </div>

              <div className="p-4 bg-[#f7f7f5] border border-[#e5e5e5]">
                <span className="text-[10px] uppercase font-mono text-[#555555] block mb-1">
                  Access Level
                </span>
                <span className="font-bold text-[#111111] font-mono">
                  {user.role === "admin" ? "Full Management" : "Client Portal"}
                </span>
              </div>

              <div className="p-4 bg-[#f7f7f5] border border-[#e5e5e5]">
                <span className="text-[10px] uppercase font-mono text-[#555555] block mb-1">
                  Status
                </span>
                <span className="font-bold text-emerald-600 font-mono flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> Active Session
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions & Quotes Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-[#e5e5e5] p-6 sm:p-8 shadow-premium flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#555555] block mb-2">
                  [New Project]
                </span>
                <h2 className="font-serif text-xl font-light text-[#111111] mb-3">
                  Request an Architectural Quote
                </h2>
                <p className="text-xs text-[#555555] font-sans leading-relaxed mb-6">
                  Submit architectural glazing specifications, plans, and requirements for balustrades, shower screens, or custom glass solutions.
                </p>
              </div>
              <Link
                href="/quote"
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-[#111111] text-white text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#333333] transition-colors shadow-subtle text-center"
              >
                Request a Free Quote
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="bg-white border border-[#e5e5e5] p-6 sm:p-8 shadow-premium flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#555555] block mb-2">
                  [Our Services]
                </span>
                <h2 className="font-serif text-xl font-light text-[#111111] mb-3">
                  Explore Glass Solutions
                </h2>
                <p className="text-xs text-[#555555] font-sans leading-relaxed mb-6">
                  Browse our portfolio of completed projects, architectural glass specifications, and Australian Standard AS1288 compliant products.
                </p>
              </div>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 border border-[#e5e5e5] bg-white text-[#111111] text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#f7f7f5] transition-colors shadow-subtle text-center"
              >
                View Services Overview
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </PageTransition>
  );
}
