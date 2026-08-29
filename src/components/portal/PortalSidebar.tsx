"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Calculator,
  Briefcase,
  Receipt,
  CreditCard,
  MessageSquare,
  User,
  Settings,
  HelpCircle,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { clearAdminToken } from "@/lib/auth-client";

export const PortalSidebar: React.FC<{
  isOpen?: boolean;
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}> = ({ isOpen = true, onClose, collapsed = false, onToggleCollapse }) => {
  const pathname = usePathname();
  const router = useRouter();

  const mainNav = [
    { label: "Dashboard", href: "/portal", icon: LayoutDashboard },
    { label: "My Quotes", href: "/portal/quotes", icon: FileText },
    { label: "Estimates", href: "/portal/estimates", icon: Calculator },
    { label: "Projects", href: "/portal/projects", icon: Briefcase },
    { label: "Invoices", href: "/portal/invoices", icon: Receipt },
    { label: "Payments", href: "/portal/payments", icon: CreditCard },
    { label: "Messages", href: "/portal/messages", icon: MessageSquare },
  ];

  const accountNav = [
    { label: "Profile", href: "/portal/profile", icon: User },
    { label: "Settings", href: "/portal/settings", icon: Settings },
  ];

  const supportNav = [
    { label: "Help & Support", href: "/portal/help", icon: HelpCircle },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout API error:", err);
    }
    clearAdminToken();
    router.push("/auth?mode=login");
    router.refresh();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-[#0c0e12] border-r border-white/[0.08] flex flex-col justify-between transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          collapsed ? "w-20" : "w-64"
        } ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} shadow-2xl`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header Branding with 3D Sparkle */}
          <div className={`p-5 border-b border-white/[0.08] flex items-center justify-between ${collapsed ? "justify-center" : ""}`}>
            <Link href="/portal" className="flex items-center gap-3 min-w-0 group" title="Complete Glass Innovations Client Portal">
              <div className="w-8 h-8 rounded-sm bg-gradient-to-tr from-blue-600 via-cyan-500 to-emerald-400 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-md group-hover:scale-105 transition-transform">
                <Sparkles size={16} />
              </div>
              {!collapsed && (
                <div className="min-w-0 truncate">
                  <span className="font-serif text-xs font-light tracking-wider text-white block uppercase truncate">
                    COMPLETE GLASS
                  </span>
                  <span className="font-mono text-[9px] tracking-widest text-cyan-400 uppercase block truncate font-bold">
                    Client Portal 3D
                  </span>
                </div>
              )}
            </Link>

            {/* Mobile close */}
            <button
              onClick={onClose}
              className="lg:hidden p-1 text-gray-400 hover:text-white"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Items (Scrollable) */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
            {/* Main Section */}
            <div className="space-y-1">
              {!collapsed && (
                <span className="px-3 text-[9px] font-mono uppercase tracking-widest text-gray-500 block mb-1.5 font-bold">
                  Management
                </span>
              )}
              {mainNav.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href || (item.href !== "/portal" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 text-xs uppercase tracking-wider font-mono rounded-sm transition-all duration-200 ${
                      collapsed ? "justify-center px-0" : ""
                    } ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600/25 to-blue-500/10 text-white font-bold border-l-2 border-cyan-400 shadow-md translate-x-1"
                        : "text-gray-400 hover:text-white hover:bg-white/[0.04] hover:translate-x-0.5"
                    }`}
                  >
                    <Icon size={16} className={isActive ? "text-cyan-400 flex-shrink-0" : "flex-shrink-0"} />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>

            {/* Account Section */}
            <div className="space-y-1">
              {!collapsed && (
                <span className="px-3 text-[9px] font-mono uppercase tracking-widest text-gray-500 block mb-1.5 font-bold">
                  Account
                </span>
              )}
              {accountNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 text-xs uppercase tracking-wider font-mono rounded-sm transition-all duration-200 ${
                      collapsed ? "justify-center px-0" : ""
                    } ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600/25 to-blue-500/10 text-white font-bold border-l-2 border-cyan-400 shadow-md translate-x-1"
                        : "text-gray-400 hover:text-white hover:bg-white/[0.04] hover:translate-x-0.5"
                    }`}
                  >
                    <Icon size={16} className={isActive ? "text-cyan-400 flex-shrink-0" : "flex-shrink-0"} />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>

            {/* Support Section */}
            <div className="space-y-1">
              {!collapsed && (
                <span className="px-3 text-[9px] font-mono uppercase tracking-widest text-gray-500 block mb-1.5 font-bold">
                  Support
                </span>
              )}
              {supportNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 text-xs uppercase tracking-wider font-mono rounded-sm transition-all duration-200 ${
                      collapsed ? "justify-center px-0" : ""
                    } ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600/25 to-blue-500/10 text-white font-bold border-l-2 border-cyan-400 shadow-md translate-x-1"
                        : "text-gray-400 hover:text-white hover:bg-white/[0.04] hover:translate-x-0.5"
                    }`}
                  >
                    <Icon size={16} className={isActive ? "text-cyan-400 flex-shrink-0" : "flex-shrink-0"} />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Bottom Desktop Collapse & Logout Section */}
          <div className="p-3 border-t border-white/[0.08] space-y-2 bg-black/40">
            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                className="hidden lg:flex w-full items-center justify-center gap-2 p-2 text-xs font-mono text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-sm transition-colors"
                title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
                {!collapsed && <span className="text-[10px] uppercase font-mono tracking-wider">Collapse Menu</span>}
              </button>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-mono uppercase text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-sm transition-colors ${
                collapsed ? "justify-center px-0" : ""
              }`}
              title="Sign Out"
            >
              <LogOut size={16} className="flex-shrink-0" />
              {!collapsed && <span>Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
