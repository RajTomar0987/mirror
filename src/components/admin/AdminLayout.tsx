"use client";

import React, { useEffect, useState, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ShieldAlert, ArrowLeft, LogOut } from "lucide-react";
import { getAdminToken, getAuthHeaders, clearAdminToken, getAuthUser } from "@/lib/auth-client";
import { AdminSidebar } from "./AdminSidebar";
import { AdminNavbar } from "./AdminNavbar";
import { ToastProvider } from "./Toast";

export const AdminLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [authState, setAuthState] = useState<"loading" | "authorized" | "denied">("loading");
  const [userRole, setUserRole] = useState<string>("user");
  const [userEmail, setUserEmail] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

          const role = data.user?.role || localUser?.role || "user";
          const email = data.user?.email || localUser?.email || "";
          setUserRole(role);
          setUserEmail(email);

          if (role === "admin") {
            setAuthState("authorized");
          } else {
            setAuthState("denied");
          }
        }
      } catch {
        if (isMounted) {
          if (localUser?.role === "admin") {
            setAuthState("authorized");
          } else {
            setAuthState("denied");
          }
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [pathname, router]);

  if (authState === "loading") {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center text-white p-6">
        <Loader2 size={32} className="animate-spin mb-4 text-[#d7e4e8]" />
        <span className="font-mono text-xs uppercase tracking-widest text-[#888888]">
          Authenticating Administrative Session...
        </span>
      </div>
    );
  }

  if (authState === "denied") {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center text-white p-6">
        <div className="max-w-md w-full bg-[#141416] border border-white/10 p-8 space-y-6 text-center shadow-2xl">
          <div className="w-14 h-14 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <ShieldAlert size={28} />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-widest font-mono text-red-400 block font-bold">
              [403 — Unauthorized Access]
            </span>
            <h1 className="font-serif text-2xl font-light text-white">Access Denied</h1>
            <p className="text-xs text-[#888888] leading-relaxed">
              Administrator privileges (<code className="text-white font-mono">role=&apos;admin&apos;</code>) are required to access the Complete Glass Innovations Sales & POS Portal.
            </p>
            {userEmail && (
              <p className="text-[11px] font-mono text-[#666666] pt-1">
                Logged in as: <span className="text-white">{userEmail}</span> (Role: {userRole})
              </p>
            )}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/account"
              className="px-4 py-2.5 bg-white text-black text-xs font-mono font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              Go to Client Account
            </Link>
            <button
              onClick={async () => {
                try {
                  await fetch("/api/auth/logout", { method: "POST" });
                } catch {}
                clearAdminToken();
                router.replace("/auth?mode=login");
              }}
              className="px-4 py-2.5 border border-white/20 text-white text-xs font-mono uppercase tracking-wider hover:bg-white/5 transition-colors inline-flex items-center justify-center gap-1.5"
            >
              <LogOut size={13} /> Switch Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-brand-bg dark:bg-[#0a0a0b] text-brand-charcoal dark:text-white font-sans flex">
        <AdminSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

        <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
          <AdminNavbar onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
          <main className="flex-1 p-6 sm:p-10 max-w-7xl w-full mx-auto">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
};
