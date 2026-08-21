"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Grid,
  Star,
  MessageSquare,
  Settings,
  Shield,
} from "lucide-react";

export const AdminSidebar: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({
  isOpen = true,
  onClose,
}) => {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Quotes", href: "/admin/quotes", icon: FileText },
    { label: "Projects", href: "/admin/projects", icon: Briefcase },
    { label: "Services", href: "/admin/services", icon: Grid },
    { label: "Reviews", href: "/admin/reviews", icon: Star },
    { label: "Messages", href: "/admin/messages", icon: MessageSquare },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-brand-charcoal border-r border-brand-glass-border-dark flex flex-col justify-between transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div>
        {/* Header Branding */}
        <div className="p-6 border-b border-brand-glass-border-dark flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-white/10 flex items-center justify-center text-white">
            <Shield size={18} />
          </div>
          <div>
            <span className="font-serif text-sm font-light tracking-wider text-white block uppercase">
              CGI ADMIN
            </span>
            <span className="font-mono text-[9px] tracking-widest text-brand-gray uppercase">
              Management Portal
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-mono transition-all duration-200 ${
                  isActive
                    ? "bg-white/10 text-white font-bold border-l-2 border-brand-ice"
                    : "text-brand-gray hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer System Indicator */}
      <div className="p-6 border-t border-brand-glass-border-dark text-[10px] font-mono text-brand-gray">
        <span className="block font-bold text-white mb-1">AS1288 Certified System</span>
        <span>Version 1.0.0 — Production</span>
      </div>
    </aside>
  );
};
