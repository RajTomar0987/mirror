"use client";

import React, { useEffect, useState, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getAdminToken, getAuthHeaders } from "@/lib/auth-client";
import { AdminSidebar } from "./AdminSidebar";
import { AdminNavbar } from "./AdminNavbar";
import { ToastProvider } from "./Toast";

export const AdminLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(() => {
    if (pathname === "/admin/login") return true;
    return null;
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") return;

    let isMounted = true;
    const checkAuth = async () => {
      const token = getAdminToken();
      if (!token) {
        if (isMounted) setIsAuthorized(false);
        router.push("/admin/login");
        return;
      }

      try {
        const res = await fetch("/api/admin/me", { headers: getAuthHeaders() });
        const data = (await res.json()) as { success?: boolean };
        if (isMounted) {
          if (data && data.success) {
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
            router.push("/admin/login");
          }
        }
      } catch {
        if (isMounted) setIsAuthorized(true);
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [pathname, router]);

  if (pathname === "/admin/login") {
    return <ToastProvider>{children}</ToastProvider>;
  }

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-brand-charcoal flex flex-col items-center justify-center text-white p-6">
        <Loader2 size={32} className="animate-spin mb-4 text-brand-ice" />
        <span className="font-mono text-xs uppercase tracking-widest text-brand-gray">
          Authenticating Administrative Session...
        </span>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-brand-bg dark:bg-brand-charcoal text-brand-charcoal dark:text-white font-sans flex">
        <AdminSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        
        <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
          <AdminNavbar onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
          <main className="flex-1 p-6 sm:p-10 max-w-7xl w-full mx-auto">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
};
