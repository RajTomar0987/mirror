"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Menu, User, ExternalLink, Search, Bell, Plus } from "lucide-react";
import { clearAdminToken } from "@/lib/auth-client";
import { GlobalSearchModal } from "./GlobalSearchModal";

export const AdminNavbar: React.FC<{ onMenuToggle?: () => void }> = ({ onMenuToggle }) => {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Keyboard shortcut for Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
    <>
      <header className="sticky top-0 z-30 bg-brand-charcoal/95 backdrop-blur-md border-b border-brand-glass-border-dark px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 text-brand-gray hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            <Menu size={20} />
          </button>

          {/* Quick Search Bar Trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-sm text-xs font-mono text-[#888888] hover:text-white hover:border-white/20 transition-colors"
          >
            <Search size={13} />
            <span>Search POS & Sales...</span>
            <kbd className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-[#aaaaaa]">⌘K</kbd>
          </button>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* Mobile search button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="sm:hidden p-2 text-brand-gray hover:text-white"
            aria-label="Open search"
          >
            <Search size={18} />
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-brand-gray hover:text-white transition-colors font-mono"
          >
            <span className="hidden sm:inline">Live Site</span>
            <ExternalLink size={12} />
          </a>

          <div className="h-4 w-[1px] bg-brand-glass-border-dark" />

          {/* User Profile */}
          <div className="flex items-center gap-2 text-xs text-white font-sans">
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white">
              <User size={14} />
            </div>
            <span className="hidden md:inline font-mono text-[11px] text-[#cccccc]">CGI Admin</span>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-mono transition-colors ml-1"
            aria-label="Log Out"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};
