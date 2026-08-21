"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getAuthHeaders } from "@/lib/auth-client";
import { useToast } from "@/components/admin/Toast";
import { Service } from "@/types";

export default function AdminServicesPage() {
  const { showToast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/services", { headers: getAuthHeaders() });
      const data = (await res.json()) as { success?: boolean; data?: Service[] };
      if (data && data.success && Array.isArray(data.data)) {
        setServices(data.data);
      }
    } catch (err) {
      console.error("Services fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const res = await fetch("/api/admin/services", { headers: getAuthHeaders() });
        const data = (await res.json()) as { success?: boolean; data?: Service[] };
        if (isMounted && data && data.success && Array.isArray(data.data)) {
          setServices(data.data);
        }
      } catch (err) {
        console.error("Services fetch error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleTogglePublish = async (service: Service) => {
    try {
      const res = await fetch(`/api/admin/services/${service.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ published: service.published === false }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (data && data.success) {
        showToast(`Service "${service.title}" ${service.published === false ? "published" : "unpublished"}`, "success");
        fetchServices();
      } else {
        showToast(data?.error || "Failed to update service", "error");
      }
    } catch {
      showToast("Network error updating service", "error");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="pb-6 border-b border-brand-glass-border-light dark:border-brand-glass-border-dark">
          <span className="text-xs uppercase tracking-[0.2em] font-mono text-brand-gray block mb-1">
            [Capabilities Management]
          </span>
          <h1 className="font-serif text-3xl font-light tracking-tight text-brand-charcoal dark:text-white">
            SERVICES DIRECTORY MANAGEMENT
          </h1>
        </div>

        <div className="border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark p-6 sm:p-8">
          {loading ? (
            <div className="text-center py-12 text-xs font-mono text-brand-gray">Loading services...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-brand-glass-border-light dark:border-brand-glass-border-dark text-[10px] uppercase font-mono text-brand-gray">
                    <th className="py-3 px-4">Service Category</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Compliance Standard</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Publication Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-glass-border-light dark:divide-brand-glass-border-dark">
                  {services.map((s) => (
                    <tr key={s.slug} className="hover:bg-brand-bg/5 dark:hover:bg-brand-charcoal/5">
                      <td className="py-4 px-4 font-serif font-light text-sm text-brand-charcoal dark:text-white">
                        {s.title}
                        <span className="block text-[10px] text-brand-gray font-mono">{s.slug}</span>
                      </td>
                      <td className="py-4 px-4 text-brand-gray max-w-xs truncate">{s.description}</td>
                      <td className="py-4 px-4 font-mono text-[10px] text-brand-gray">
                        <ShieldCheck size={12} className="inline mr-1" />
                        AS1288 Glazing Code
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`text-[10px] uppercase font-mono px-2.5 py-1 border ${
                            s.published !== false
                              ? "border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                              : "border-amber-500/40 text-amber-600 dark:text-amber-400"
                          }`}
                        >
                          {s.published !== false ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleTogglePublish(s)}
                          className="inline-flex items-center gap-1 text-xs font-mono font-bold text-brand-charcoal dark:text-white hover:underline"
                        >
                          {s.published !== false ? <EyeOff size={14} /> : <Eye size={14} />}
                          {s.published !== false ? "Unpublish" : "Publish"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
