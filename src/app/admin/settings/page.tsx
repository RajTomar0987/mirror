"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Shield, Key, Database, LogOut, CheckCircle2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { clearAdminToken } from "@/lib/auth-client";
import { useToast } from "@/components/admin/Toast";

export default function AdminSettingsPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const handleLogout = () => {
    clearAdminToken();
    showToast("Logged out of administrative session", "info");
    router.push("/admin/login");
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="pb-6 border-b border-brand-glass-border-light dark:border-brand-glass-border-dark">
          <span className="text-xs uppercase tracking-[0.2em] font-mono text-brand-gray block mb-1">
            [System Settings]
          </span>
          <h1 className="font-serif text-3xl font-light tracking-tight text-brand-charcoal dark:text-white">
            ADMINISTRATIVE SETTINGS & SECURITY
          </h1>
        </div>

        {/* Security Overview */}
        <div className="p-8 border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-brand-glass-border-light dark:border-brand-glass-border-dark">
            <Shield size={20} className="text-brand-charcoal dark:text-white" />
            <h2 className="font-serif text-xl font-light text-brand-charcoal dark:text-white">
              Row Level Security & Compliance
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
            <div className="p-4 border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-brand-bg/10 dark:bg-brand-charcoal/10 flex items-start gap-3">
              <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-brand-charcoal dark:text-white block mb-1 font-mono uppercase">
                  Service Role Isolation
                </span>
                <p className="text-brand-gray leading-relaxed font-light">
                  SUPABASE_SERVICE_ROLE_KEY is isolated on server-side API handlers only.
                </p>
              </div>
            </div>

            <div className="p-4 border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-brand-bg/10 dark:bg-brand-charcoal/10 flex items-start gap-3">
              <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-brand-charcoal dark:text-white block mb-1 font-mono uppercase">
                  AS1288 Glazing Standards
                </span>
                <p className="text-brand-gray leading-relaxed font-light">
                  All structural glass specs and load tables conform to Australian standards.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* System Credentials & Session */}
        <div className="p-8 border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-brand-glass-border-light dark:border-brand-glass-border-dark">
            <Key size={20} className="text-brand-charcoal dark:text-white" />
            <h2 className="font-serif text-xl font-light text-brand-charcoal dark:text-white">
              Active Session Details
            </h2>
          </div>

          <div className="space-y-4 text-xs font-mono text-brand-gray">
            <div className="flex justify-between items-center py-2 border-b border-brand-glass-border-light dark:border-brand-glass-border-dark">
              <span>Account Privilege Level</span>
              <span className="text-brand-charcoal dark:text-white font-bold uppercase">Super Administrator</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-brand-glass-border-light dark:border-brand-glass-border-dark">
              <span>Database Engine</span>
              <span className="text-brand-charcoal dark:text-white font-bold flex items-center gap-1">
                <Database size={12} /> Supabase PostgreSQL
              </span>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 bg-red-600 text-white text-xs uppercase font-mono font-bold py-3 px-6 hover:bg-red-700 transition-colors"
            >
              <LogOut size={14} /> End Session & Log Out
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
