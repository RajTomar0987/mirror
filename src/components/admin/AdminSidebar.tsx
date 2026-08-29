"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  Briefcase,
  Calculator,
  Receipt,
  CreditCard,
  Grid,
  Settings,
  Shield,
  LogOut,
  X,
  Sparkles,
} from "lucide-react";
import { clearAdminToken } from "@/lib/auth-client";

export const AdminSidebar: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({
  isOpen = true,
  onClose,
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Quotes", href: "/admin/quotes", icon: FileText },
    { label: "Customers", href: "/admin/customers", icon: Users },
    { label: "Projects", href: "/admin/projects", icon: Briefcase },
    { label: "Estimates", href: "/admin/estimates", icon: Calculator },
    { label: "Invoices", href: "/admin/invoices", icon: Receipt },
    { label: "Payments", href: "/admin/payments", icon: CreditCard },
    { label: "Services", href: "/admin/services", icon: Grid },
    { label: "Settings", href: "/admin/settings", icon: Settings },
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
      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0a0a0b] border-r border-white/[0.08] flex flex-col justify-between transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-2xl ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Header Branding */}
          <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3 group" title="Complete Glass Innovations Admin POS">
              <div className="w-8 h-8 rounded-sm bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <Shield size={18} />
              </div>
              <div>
                <span className="font-serif text-sm font-light tracking-wider text-white block uppercase">
                  COMPLETE GLASS
                </span>
                <span className="font-mono text-[9px] tracking-widest text-cyan-400 uppercase font-bold">
                  Admin POS 3D
                </span>
              </div>
            </Link>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1 text-[#777777] hover:text-white transition-colors"
              aria-label="Close navigation menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Items with 3D Elevated Active Surface */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-2.5 text-xs uppercase tracking-widest font-mono rounded-sm transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600/30 to-blue-500/10 text-white font-bold border-l-2 border-cyan-400 shadow-md translate-x-1"
                      : "text-gray-400 hover:text-white hover:bg-white/[0.04] hover:translate-x-0.5"
                  }`}
                >
                  <Icon size={15} className={isActive ? "text-cyan-400" : ""} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer: Logout + Version */}
        <div className="p-4 border-t border-white/[0.08] space-y-3 bg-black/40">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 w-full text-xs uppercase tracking-widest font-mono text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 rounded-sm"
          >
            <LogOut size={15} />
            <span>Logout</span>
          </button>
          <div className="px-4 text-[10px] font-mono text-gray-500">
            <span className="block font-bold text-gray-400 mb-0.5">AS1288 Certified System</span>
            <span>POS Sales Edition · 10% GST</span>
          </div>
        </div>
      </aside>
    </>
  );
};
