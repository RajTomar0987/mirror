"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Calculator,
  Eye,
  Printer,
  Calendar,
  DollarSign,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  Download,
  Search,
} from "lucide-react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { getAuthHeaders } from "@/lib/auth-client";
import { Estimate, EstimateStatus } from "@/types";
import { DocumentPrintView } from "@/components/admin/DocumentPrintView";

const STATUS_BADGES: Record<EstimateStatus, string> = {
  draft: "bg-gray-500/10 text-gray-400 border-gray-500/30",
  sent: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  viewed: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
  accepted: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  declined: "bg-red-500/10 text-red-400 border-red-500/30",
  expired: "bg-amber-500/10 text-amber-400 border-amber-500/30",
};

export default function CustomerEstimatesPage() {
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [printableEstimate, setPrintableEstimate] = useState<Estimate | null>(null);

  useEffect(() => {
    const fetchEstimates = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/portal/estimates", { headers: getAuthHeaders() });
        const json = (await res.json()) as { success?: boolean; data?: Estimate[] };
        if (json && json.success && json.data) {
          setEstimates(json.data);
        }
      } catch (err) {
        console.error("Error fetching estimates:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEstimates();
  }, []);

  const stats = useMemo(() => {
    const total = estimates.length;
    const pending = estimates.filter((e) => e.status === "sent" || e.status === "viewed" || e.status === "draft").length;
    const approved = estimates.filter((e) => e.status === "accepted").length;
    const expired = estimates.filter((e) => e.status === "expired" || e.status === "declined").length;
    return { total, pending, approved, expired };
  }, [estimates]);

  const filteredEstimates = useMemo(() => {
    return estimates.filter((e) =>
      (e.estimate_number || "").toLowerCase().includes(search.toLowerCase()) ||
      (e.project_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (e.customer_name || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [estimates, search]);

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-glass-border-light dark:border-white/[0.08]">
          <div>
            <span className="text-xs uppercase tracking-widest font-mono text-purple-500 block mb-1">
              [Commercial Proposals & Sign-Offs]
            </span>
            <h1 className="font-serif text-3xl font-light tracking-tight text-brand-charcoal dark:text-white">
              MY ESTIMATES
            </h1>
          </div>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-4 bg-white dark:bg-[#0f1217] border border-brand-glass-border-light dark:border-white/[0.08] rounded-sm">
            <span className="text-[10px] uppercase font-mono text-brand-gray block mb-1">Total Estimates</span>
            <span className="font-serif text-2xl font-light text-brand-charcoal dark:text-white">{stats.total}</span>
          </div>

          <div className="p-4 bg-white dark:bg-[#0f1217] border border-brand-glass-border-light dark:border-white/[0.08] rounded-sm">
            <span className="text-[10px] uppercase font-mono text-purple-400 block mb-1">Pending Approval</span>
            <span className="font-serif text-2xl font-light text-purple-400">{stats.pending}</span>
          </div>

          <div className="p-4 bg-white dark:bg-[#0f1217] border border-brand-glass-border-light dark:border-white/[0.08] rounded-sm">
            <span className="text-[10px] uppercase font-mono text-emerald-400 block mb-1">Approved</span>
            <span className="font-serif text-2xl font-light text-emerald-400">{stats.approved}</span>
          </div>

          <div className="p-4 bg-white dark:bg-[#0f1217] border border-brand-glass-border-light dark:border-white/[0.08] rounded-sm">
            <span className="text-[10px] uppercase font-mono text-amber-500 block mb-1">Expired / Declined</span>
            <span className="font-serif text-2xl font-light text-amber-500">{stats.expired}</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-3 text-brand-gray" />
          <input
            type="text"
            placeholder="Search estimates by estimate #, project name, service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white dark:bg-[#0f1217] border border-brand-glass-border-light dark:border-white/[0.08] text-xs text-brand-charcoal dark:text-white font-sans focus:outline-none focus:border-purple-500 rounded-sm"
          />
        </div>

        {/* Estimates Table */}
        <div className="border border-brand-glass-border-light dark:border-white/[0.08] bg-white dark:bg-[#0f1217] rounded-sm overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center text-brand-gray font-mono text-xs gap-3">
              <Loader2 size={24} className="animate-spin text-purple-500" />
              <span>Fetching your estimates...</span>
            </div>
          ) : filteredEstimates.length === 0 ? (
            <div className="py-24 text-center space-y-3">
              <Calculator size={32} className="text-brand-gray mx-auto" />
              <p className="text-sm font-serif text-brand-charcoal dark:text-white">
                No estimates found matching your search.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-brand-glass-border-light dark:border-white/[0.08] text-[10px] uppercase font-mono text-brand-gray bg-[#f8f9fa] dark:bg-black/30">
                    <th className="py-3.5 px-4">Estimate #</th>
                    <th className="py-3.5 px-4">Project / Service</th>
                    <th className="py-3.5 px-4">Created Date</th>
                    <th className="py-3.5 px-4">Valid Until</th>
                    <th className="py-3.5 px-4 font-mono">Amount (incl. GST)</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-glass-border-light dark:divide-white/[0.05]">
                  {filteredEstimates.map((est) => {
                    const badgeClass = STATUS_BADGES[est.status] || STATUS_BADGES.draft;

                    return (
                      <tr
                        key={est.id}
                        className="hover:bg-[#f7f8f9] dark:hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="py-4 px-4 font-mono font-bold text-brand-charcoal dark:text-white">
                          {est.estimate_number}
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-semibold text-brand-charcoal dark:text-white block">{est.project_name}</span>
                          <span className="text-[10px] font-mono text-brand-gray">{est.items.length} Itemized Specs</span>
                        </td>
                        <td className="py-4 px-4 font-mono text-brand-gray text-[11px]">
                          {new Date(est.created_at || Date.now()).toLocaleDateString("en-AU")}
                        </td>
                        <td className="py-4 px-4 font-mono text-brand-gray text-[11px]">
                          {est.valid_until}
                        </td>
                        <td className="py-4 px-4 font-mono font-bold text-brand-charcoal dark:text-white">
                          ${est.total_amount?.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-block text-[10px] uppercase font-mono px-2.5 py-1 border rounded-sm font-bold ${badgeClass}`}
                          >
                            {est.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            <Link
                              href={`/portal/estimates/${est.id}`}
                              className="px-3 py-1.5 bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 border border-purple-500/30 text-[10px] font-mono uppercase font-bold rounded-sm transition-colors"
                            >
                              Review & Sign
                            </Link>
                            <button
                              onClick={() => setPrintableEstimate(est)}
                              className="p-1.5 text-brand-gray hover:text-brand-charcoal dark:hover:text-white transition-colors"
                              title="Print / Save PDF"
                            >
                              <Printer size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Printable View */}
        {printableEstimate && (
          <DocumentPrintView
            type="estimate"
            data={printableEstimate}
            onClose={() => setPrintableEstimate(null)}
          />
        )}
      </div>
    </PortalLayout>
  );
}
