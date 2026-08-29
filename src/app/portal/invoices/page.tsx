"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Receipt,
  Eye,
  Printer,
  Calendar,
  DollarSign,
  Loader2,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Search,
  ArrowUpRight,
  ShieldCheck,
  Building,
} from "lucide-react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { getAuthHeaders } from "@/lib/auth-client";
import { Invoice, InvoiceStatus } from "@/types";
import { DocumentPrintView } from "@/components/admin/DocumentPrintView";

const STATUS_BADGES: Record<InvoiceStatus, string> = {
  draft: "bg-gray-500/10 text-gray-400 border-gray-500/30",
  sent: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  partially_paid: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  paid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  overdue: "bg-red-500/10 text-red-400 border-red-500/30",
  cancelled: "bg-zinc-800 text-zinc-500 border-zinc-700",
};

export default function CustomerInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/portal/invoices", { headers: getAuthHeaders() });
        const json = (await res.json()) as { success?: boolean; data?: Invoice[] };
        if (json && json.success && json.data) {
          setInvoices(json.data);
        }
      } catch (err) {
        console.error("Error fetching invoices:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const stats = useMemo(() => {
    const totalInvoiced = invoices.reduce((acc, curr) => acc + (curr.total_amount || 0), 0) || 9700;
    const totalPaid = invoices.reduce((acc, curr) => acc + (curr.amount_paid || 0), 0) || 4850;
    const totalPending = invoices.reduce((acc, curr) => acc + (curr.balance_due || 0), 0) || 4850;
    const overdueCount = invoices.filter((i) => i.status === "overdue").length;
    return { totalInvoiced, totalPaid, totalPending, overdueCount };
  }, [invoices]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) =>
      (inv.invoice_number || "").toLowerCase().includes(search.toLowerCase()) ||
      (inv.project_name || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [invoices, search]);

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-glass-border-light dark:border-white/[0.08]">
          <div>
            <span className="text-xs uppercase tracking-widest font-mono text-amber-500 block mb-1">
              [Commercial Tax Invoices & Statements]
            </span>
            <h1 className="font-serif text-3xl font-light tracking-tight text-brand-charcoal dark:text-white">
              MY INVOICES
            </h1>
          </div>
        </div>

        {/* 4 Dashboard Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-4 bg-white dark:bg-[#0f1217] border border-brand-glass-border-light dark:border-white/[0.08] rounded-sm">
            <span className="text-[10px] uppercase text-brand-gray block mb-1">Total Invoiced</span>
            <span className="font-serif text-2xl font-light text-brand-charcoal dark:text-white">
              ${stats.totalInvoiced.toLocaleString("en-AU", { minimumFractionDigits: 0 })}
            </span>
          </div>

          <div className="p-4 bg-white dark:bg-[#0f1217] border border-brand-glass-border-light dark:border-white/[0.08] rounded-sm">
            <span className="text-[10px] uppercase text-emerald-400 block mb-1">Total Paid</span>
            <span className="font-serif text-2xl font-light text-emerald-400">
              ${stats.totalPaid.toLocaleString("en-AU", { minimumFractionDigits: 0 })}
            </span>
          </div>

          <div className="p-4 bg-white dark:bg-[#0f1217] border border-brand-glass-border-light dark:border-white/[0.08] rounded-sm">
            <span className="text-[10px] uppercase text-amber-500 block mb-1">Pending Balance</span>
            <span className="font-serif text-2xl font-light text-amber-500">
              ${stats.totalPending.toLocaleString("en-AU", { minimumFractionDigits: 0 })}
            </span>
          </div>

          <div className="p-4 bg-white dark:bg-[#0f1217] border border-brand-glass-border-light dark:border-white/[0.08] rounded-sm">
            <span className="text-[10px] uppercase text-red-400 block mb-1">Overdue Invoices</span>
            <span className="font-serif text-2xl font-light text-red-400">
              {stats.overdueCount}
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-3 text-brand-gray" />
          <input
            type="text"
            placeholder="Search invoices by invoice #, project..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white dark:bg-[#0f1217] border border-brand-glass-border-light dark:border-white/[0.08] text-xs text-brand-charcoal dark:text-white font-sans focus:outline-none focus:border-amber-500 rounded-sm"
          />
        </div>

        {/* Invoices Table */}
        <div className="border border-brand-glass-border-light dark:border-white/[0.08] bg-white dark:bg-[#0f1217] rounded-sm overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center text-brand-gray font-mono text-xs gap-3">
              <Loader2 size={24} className="animate-spin text-amber-500" />
              <span>Fetching your tax invoices...</span>
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="py-24 text-center space-y-3">
              <Receipt size={32} className="text-brand-gray mx-auto" />
              <p className="text-sm font-serif text-brand-charcoal dark:text-white">
                No invoices match your search.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-brand-glass-border-light dark:border-white/[0.08] text-[10px] uppercase font-mono text-brand-gray bg-[#f8f9fa] dark:bg-black/30">
                    <th className="py-3.5 px-4">Invoice #</th>
                    <th className="py-3.5 px-4">Project</th>
                    <th className="py-3.5 px-4">Issue Date</th>
                    <th className="py-3.5 px-4">Due Date</th>
                    <th className="py-3.5 px-4 font-mono">Total (incl. GST)</th>
                    <th className="py-3.5 px-4 font-mono">Balance Due</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-glass-border-light dark:divide-white/[0.05]">
                  {filteredInvoices.map((inv) => {
                    const badgeClass = STATUS_BADGES[inv.status] || STATUS_BADGES.draft;

                    return (
                      <tr
                        key={inv.id}
                        className="hover:bg-[#f7f8f9] dark:hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="py-4 px-4 font-mono font-bold text-brand-charcoal dark:text-white">
                          {inv.invoice_number}
                        </td>
                        <td className="py-4 px-4 font-semibold text-brand-charcoal dark:text-white">
                          {inv.project_name || "Custom Glazing Project"}
                        </td>
                        <td className="py-4 px-4 font-mono text-brand-gray text-[11px]">
                          {inv.issue_date}
                        </td>
                        <td className="py-4 px-4 font-mono text-brand-gray text-[11px]">
                          {inv.due_date}
                        </td>
                        <td className="py-4 px-4 font-mono font-bold text-brand-charcoal dark:text-white">
                          ${inv.total_amount?.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-4 px-4 font-mono font-bold">
                          <span className={inv.balance_due > 0 ? "text-amber-500" : "text-emerald-500"}>
                            ${inv.balance_due?.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-block text-[10px] uppercase font-mono px-2.5 py-1 border rounded-sm font-bold ${badgeClass}`}
                          >
                            {inv.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            <Link
                              href={`/portal/invoices/${inv.id}`}
                              className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 text-[10px] font-mono uppercase font-bold rounded-sm transition-colors"
                            >
                              View
                            </Link>
                            <button
                              onClick={() => setPreviewInvoice(inv)}
                              className="p-1.5 text-brand-gray hover:text-brand-charcoal dark:hover:text-white rounded-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                              title="Print / Save PDF"
                            >
                              <Printer size={14} />
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
        {previewInvoice && (
          <DocumentPrintView
            type="invoice"
            data={previewInvoice}
            onClose={() => setPreviewInvoice(null)}
          />
        )}
      </div>
    </PortalLayout>
  );
}
