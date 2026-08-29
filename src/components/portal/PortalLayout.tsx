"use client";

import React, { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getAdminToken, getAuthHeaders, clearAdminToken, getAuthUser } from "@/lib/auth-client";
import { PortalSidebar } from "./PortalSidebar";
import { PortalNavbar } from "./PortalNavbar";
import { ToastProvider } from "@/components/admin/Toast";

export const PortalLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [authState, setAuthState] = useState<"loading" | "authorized">("loading");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      const token = getAdminToken();
      const localUser = getAuthUser();

      if (!token) {
        if (isMounted) setAuthState("loading");
        router.replace("/auth?mode=login");
        return;
      }

      // Check role locally first for instant routing
      if ((localUser?.role as string) === "admin") {
        router.replace("/admin");
        return;
      }

      try {
        const res = await fetch("/api/admin/me", { headers: getAuthHeaders() });
        const data = (await res.json()) as {
          success?: boolean;
          user?: { email?: string; role?: string };
        };

        if (isMounted) {
          if (res.status === 401 || !data || !data.success) {
            clearAdminToken();
            router.replace("/auth?mode=login");
            return;
          }

          if (data.user?.role === "admin") {
            router.replace("/admin");
            return;
          }

          setAuthState("authorized");
        }
      } catch {
        if (isMounted) {
          if ((localUser?.role as string) === "admin") {
            router.replace("/admin");
          } else {
            setAuthState("authorized");
          }
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (authState === "loading") {
    return (
      <div className="min-h-screen bg-[#0c0e12] flex flex-col items-center justify-center text-white p-6">
        <Loader2 size={32} className="animate-spin mb-4 text-blue-400" />
        <span className="font-mono text-xs uppercase tracking-widest text-gray-400">
          Loading Client Portal...
        </span>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#07090c] text-brand-charcoal dark:text-white font-sans flex">
        <PortalSidebar
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <div
          className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
            sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
          }`}
        >
          <PortalNavbar onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
          <main className="flex-1 p-4 sm:p-8 md:p-10 max-w-7xl w-full mx-auto">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
};
