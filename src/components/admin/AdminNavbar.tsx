"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LogOut, Menu, User, ExternalLink } from "lucide-react";
import { clearAdminToken } from "@/lib/auth-client";

export const AdminNavbar: React.FC<{ onMenuToggle?: () => void }> = ({ onMenuToggle }) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout API error:", err);
    }
    clearAdminToken();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-30 bg-brand-charcoal/95 backdrop-blur-md border-b border-brand-glass-border-dark px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-brand-gray hover:text-white"
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>
        <span className="text-xs uppercase tracking-widest font-mono text-brand-gray hidden sm:inline">
          System Overview
        </span>
      </div>

      <div className="flex items-center gap-4">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-brand-gray hover:text-white transition-colors font-mono"
        >
          <span>Live Site</span>
          <ExternalLink size={12} />
        </a>

        <div className="h-4 w-[1px] bg-brand-glass-border-dark" />

        <div className="flex items-center gap-2 text-xs text-white font-sans">
          <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
            <User size={14} />
          </div>
          <span className="hidden md:inline font-mono">Administrator</span>
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-mono transition-colors ml-2"
          aria-label="Log Out"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
