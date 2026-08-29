"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  Plus,
  Bell,
  HelpCircle,
  User,
  Settings,
  LogOut,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { getAuthUser, clearAdminToken, AuthUser } from "@/lib/auth-client";

export const PortalNavbar: React.FC<{ onMenuToggle: () => void }> = ({ onMenuToggle }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(() => getAuthUser());

  // Dropdown States
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    clearAdminToken();
    router.push("/auth?mode=login");
    router.refresh();
  };

  // Breadcrumbs title helper
  const getPageTitle = () => {
    if (pathname === "/portal") return "Dashboard";
    if (pathname.startsWith("/portal/quotes")) return "My Quotes";
    if (pathname.startsWith("/portal/estimates")) return "Estimates";
    if (pathname.startsWith("/portal/projects")) return "Projects";
    if (pathname.startsWith("/portal/invoices")) return "Invoices";
    if (pathname.startsWith("/portal/payments")) return "Payments";
    if (pathname.startsWith("/portal/messages")) return "Messages";
    if (pathname.startsWith("/portal/profile")) return "Account Profile";
    if (pathname.startsWith("/portal/settings")) return "Settings";
    if (pathname.startsWith("/portal/help")) return "Help & Support";
    if (pathname.startsWith("/portal/notifications")) return "Notifications";
    return "Client Portal";
  };

  const sampleNotifications = [
    {
      id: "notif-1",
      title: "Estimate #EST-2026-001 is ready",
      desc: "Master Ensuite Custom Fluted Shower Screens estimate is available for approval.",
      time: "10m ago",
      href: "/portal/estimates",
      unread: true,
    },
    {
      id: "notif-2",
      title: "Project Milestone Updated",
      desc: "Modern Harbour Residence glass tempering is 100% complete.",
      time: "2h ago",
      href: "/portal/projects",
      unread: true,
    },
    {
      id: "notif-3",
      title: "New Message from Project Manager",
      desc: "Installation crew confirmed for Tuesday 8:30 AM arrival.",
      time: "1d ago",
      href: "/portal/messages",
      unread: false,
    },
  ];

  return (
    <header className="sticky top-0 z-20 bg-white/90 dark:bg-[#0c0e12]/90 backdrop-blur-md border-b border-brand-glass-border-light dark:border-white/[0.08] px-4 sm:px-8 py-3 flex items-center justify-between transition-colors">
      {/* Left: Mobile Toggle + Breadcrumb */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-brand-gray hover:text-brand-charcoal dark:hover:text-white transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-brand-gray">
          <Link href="/portal" className="hover:text-blue-500 transition-colors hidden sm:inline">
            Portal
          </Link>
          <span className="text-gray-400 hidden sm:inline">/</span>
          <span className="text-brand-charcoal dark:text-white font-bold uppercase tracking-wider truncate">
            {getPageTitle()}
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Help Center Shortcut */}
        <Link
          href="/portal/help"
          className="p-2 text-brand-gray hover:text-brand-charcoal dark:hover:text-white transition-colors rounded-sm hover:bg-black/5 dark:hover:bg-white/5 hidden sm:inline-flex"
          title="Help & Support Center"
        >
          <HelpCircle size={18} />
        </Link>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifMenuRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 text-brand-gray hover:text-brand-charcoal dark:hover:text-white transition-colors relative rounded-sm hover:bg-black/5 dark:hover:bg-white/5"
            title="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#12151b] border border-brand-glass-border-light dark:border-white/[0.08] shadow-2xl rounded-sm py-2 z-50 animate-in fade-in">
              <div className="px-4 py-2 border-b border-brand-glass-border-light dark:border-white/[0.05] flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wider font-bold text-brand-charcoal dark:text-white">
                  Notifications
                </span>
                <span className="text-[10px] font-mono text-blue-500">2 New</span>
              </div>

              <div className="divide-y divide-brand-glass-border-light dark:divide-white/[0.05] max-h-72 overflow-y-auto">
                {sampleNotifications.map((notif) => (
                  <Link
                    key={notif.id}
                    href={notif.href}
                    onClick={() => setNotificationsOpen(false)}
                    className="p-3.5 block hover:bg-black/5 dark:hover:bg-white/[0.03] transition-colors text-left"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-brand-charcoal dark:text-white block">
                        {notif.title}
                      </span>
                      <span className="text-[10px] font-mono text-brand-gray">{notif.time}</span>
                    </div>
                    <p className="text-[11px] text-brand-gray leading-snug">{notif.desc}</p>
                  </Link>
                ))}
              </div>

              <div className="p-2 border-t border-brand-glass-border-light dark:border-white/[0.05] text-center">
                <Link
                  href="/portal/notifications"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-[11px] font-mono text-blue-500 hover:underline inline-flex items-center gap-1"
                >
                  View All Notifications <ArrowRight size={11} />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Request New Quote CTA Button */}
        <Link
          href="/quote"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono uppercase font-bold tracking-wider rounded-sm transition-colors shadow-sm"
        >
          <Plus size={13} /> <span className="hidden sm:inline">Request</span> Quote
        </Link>

        {/* Customer Profile Dropdown */}
        <div className="relative pl-2 border-l border-brand-glass-border-light dark:border-white/[0.08]" ref={profileMenuRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-mono text-xs font-bold shadow-sm">
              {user?.fullName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "C"}
            </div>
            <div className="hidden md:block text-left">
              <span className="block text-xs font-semibold text-brand-charcoal dark:text-white leading-tight truncate max-w-[110px]">
                {user?.fullName || "Client Account"}
              </span>
              <span className="block text-[10px] font-mono text-brand-gray truncate max-w-[110px]">
                {user?.email || "customer"}
              </span>
            </div>
            <ChevronDown size={14} className="text-brand-gray hidden sm:block" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#12151b] border border-brand-glass-border-light dark:border-white/[0.08] shadow-2xl rounded-sm py-2 z-50 animate-in fade-in text-xs font-sans">
              <div className="px-4 py-2 border-b border-brand-glass-border-light dark:border-white/[0.05]">
                <span className="block font-bold text-brand-charcoal dark:text-white truncate">
                  {user?.fullName || "Client Account"}
                </span>
                <span className="block text-[10px] font-mono text-brand-gray truncate">
                  {user?.email}
                </span>
              </div>

              <div className="py-1">
                <Link
                  href="/portal/profile"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-brand-gray hover:text-brand-charcoal dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <User size={14} /> My Profile
                </Link>

                <Link
                  href="/portal/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-brand-gray hover:text-brand-charcoal dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <Settings size={14} /> Account Settings
                </Link>

                <Link
                  href="/portal/help"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-brand-gray hover:text-brand-charcoal dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <HelpCircle size={14} /> Help & Support
                </Link>
              </div>

              <div className="pt-1 border-t border-brand-glass-border-light dark:border-white/[0.05]">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 px-4 py-2 w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
