"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Receipt,
  Download,
  Printer,
  Calendar,
  DollarSign,
  Loader2,
  CheckCircle2,
  CreditCard,
  Building,
  ShieldCheck,
} from "lucide-react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { getAuthHeaders } from "@/lib/auth-client";
import { Invoice } from "@/types";
import { DocumentPrintView } from "@/components/admin/DocumentPrintView";

export default function CustomerInvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const { id } = resolvedParams;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [printableModal, setPrintableModal] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/portal/invoices`, { headers: getAuthHeaders() });
        const json = (await res.json()) as { success?: boolean; data?: Invoice[] };
        if (json && json.success && json.data) {
          const found = json.data.find((i) => i.id === id) || json.data[0] || null;
          setInvoice(found);
        } else {
          setError("Invoice not found");
        }
      } catch {
        setError("Network error fetching invoice");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  return (
    <PortalLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Top Nav Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/portal/invoices"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-brand-gray hover:text-brand-charcoal dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Back to Invoices
          </Link>

          {invoice && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPrintableModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-brand-glass-border-light dark:border-white/10 text-xs font-mono text-brand-gray hover:text-brand-charcoal dark:hover:text-white transition-colors rounded-sm"
              >
                <Printer size={13} /> Print Tax Invoice
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="py-24 text-center text-xs font-mono text-brand-gray flex flex-col items-center justify-center gap-3">
            <Loader2 size={24} className="animate-spin text-amber-500" />
            <span>Loading commercial tax invoice...</span>
          </div>
        ) : error || !invoice ? (
          <div className="p-8 border border-red-500/20 bg-red-500/5 text-center text-xs font-mono text-red-400 rounded-sm">
            Invoice not found.
          </div>
        ) : (
          <div className="space-y-6">
            {/* Tax Invoice Physical Document UI with 3D Elevation */}
            <div className="p-6 sm:p-10 bg-white dark:bg-[#0f1217] border border-brand-glass-border-light dark:border-white/[0.1] rounded-sm space-y-8 document-3d-shadow relative overflow-hidden">
              {/* Ambient amber glow */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-brand-glass-border-light dark:border-white/[0.08] relative z-10">
                <div className="space-y-1">
                  <span className="font-serif text-xl font-bold tracking-widest text-brand-charcoal dark:text-white uppercase">
                    COMPLETE GLASS INNOVATIONS
                  </span>
                  <span className="text-[10px] font-mono tracking-widest text-brand-gray uppercase block">
                    TAX INVOICE · ABN: 48 123 456 789
                  </span>
                  <span className="text-[11px] font-mono text-brand-gray block">
                    Level 3, 100 George Street, Sydney NSW 2000 · (02) 9876 5432
                  </span>
                </div>

                <div className="sm:text-right space-y-1">
                  <span className="text-xs font-mono uppercase text-amber-500 font-bold block">
                    INVOICE #{invoice.invoice_number}
                  </span>
                  <span className="text-xs font-mono text-brand-gray block">
                    Issue Date: {invoice.issue_date}
                  </span>
                  <span className="text-xs font-mono text-brand-gray block font-semibold">
                    Due Date: {invoice.due_date}
                  </span>
                  <span
                    className={`inline-block mt-1 text-[10px] uppercase font-mono px-2.5 py-0.5 border rounded-sm font-bold ${
                      invoice.status === "paid"
                        ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                        : "border-amber-500/30 text-amber-400 bg-amber-500/10"
                    }`}
                  >
                    Payment Status: {invoice.status.replace("_", " ")}
                  </span>
                </div>
              </div>

              {/* Customer & Project Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                <div className="p-4 bg-[#f8f9fa] dark:bg-black/30 border border-brand-glass-border-light dark:border-white/[0.05] rounded-sm space-y-1">
                  <span className="text-[10px] uppercase font-mono text-brand-gray font-bold block">Billed To</span>
                  <span className="font-semibold text-sm text-brand-charcoal dark:text-white block">{invoice.customer_name}</span>
                  <span className="font-mono text-brand-gray block">{invoice.customer_email}</span>
                  <span className="font-mono text-brand-gray block">{invoice.customer_phone}</span>
                </div>

                <div className="p-4 bg-[#f8f9fa] dark:bg-black/30 border border-brand-glass-border-light dark:border-white/[0.05] rounded-sm space-y-1">
                  <span className="text-[10px] uppercase font-mono text-brand-gray font-bold block">Project Reference</span>
                  <span className="font-semibold text-sm text-brand-charcoal dark:text-white block">{invoice.project_name}</span>
                  <span className="text-brand-gray block font-sans">{invoice.notes || "Progressive architectural glazing deposit."}</span>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="space-y-2">
                <div className="border border-brand-glass-border-light dark:border-white/[0.05] rounded-sm overflow-x-auto">
                  <table className="w-full text-xs font-sans">
                    <thead>
                      <tr className="bg-[#f8f9fa] dark:bg-black/30 text-[10px] font-mono uppercase text-brand-gray border-b border-brand-glass-border-light dark:border-white/[0.05]">
                        <th className="py-3 px-4 text-left">Service Item</th>
                        <th className="py-3 px-4 text-center">Qty / Unit</th>
                        <th className="py-3 px-4 text-right">Unit Price</th>
                        <th className="py-3 px-4 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-glass-border-light dark:divide-white/[0.05]">
                      {invoice.items?.map((item) => (
                        <tr key={item.id} className="hover:bg-black/5 dark:hover:bg-white/[0.02]">
                          <td className="py-3.5 px-4 font-medium text-brand-charcoal dark:text-white">{item.description}</td>
                          <td className="py-3.5 px-4 text-center font-mono text-brand-gray">{item.quantity} {item.unit}</td>
                          <td className="py-3.5 px-4 text-right font-mono text-brand-gray">${item.unit_price?.toFixed(2)}</td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-brand-charcoal dark:text-white">${item.subtotal?.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial Calculation Breakdown */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-2">
                {/* EFT Payment Instructions */}
                <div className="p-4 bg-[#f8f9fa] dark:bg-black/30 border border-brand-glass-border-light dark:border-white/[0.05] rounded-sm max-w-sm w-full text-xs space-y-1.5">
                  <span className="text-[10px] uppercase font-mono font-bold text-brand-gray block">Direct Bank Transfer (EFT)</span>
                  <div className="font-mono text-[11px] text-brand-charcoal dark:text-white space-y-0.5">
                    <div>Bank: <span className="font-bold">Commonwealth Bank</span></div>
                    <div>BSB: <span className="font-bold">062-000</span></div>
                    <div>Account: <span className="font-bold">1234 5678</span></div>
                    <div>Reference: <span className="font-bold text-amber-500">{invoice.invoice_number}</span></div>
                  </div>
                </div>

                <div className="bg-[#f8f9fa] dark:bg-black/40 p-5 border border-brand-glass-border-light dark:border-white/[0.05] rounded-sm max-w-sm w-full space-y-2.5 text-xs font-mono">
                  <div className="flex justify-between text-brand-gray">
                    <span>Subtotal (ex GST):</span>
                    <span>${invoice.subtotal?.toLocaleString("en-AU", { minimumFractionDigits: 2 })}</span>
                  </div>

                  <div className="flex justify-between text-brand-gray">
                    <span>Australian GST ({(invoice.gst_rate * 100).toFixed(0)}%):</span>
                    <span>${invoice.gst_amount?.toLocaleString("en-AU", { minimumFractionDigits: 2 })}</span>
                  </div>

                  <div className="flex justify-between text-sm font-bold pt-2.5 border-t border-brand-glass-border-light dark:border-white/[0.08] text-brand-charcoal dark:text-white">
                    <span>Total Tax Invoice:</span>
                    <span>${invoice.total_amount?.toLocaleString("en-AU", { minimumFractionDigits: 2 })}</span>
                  </div>

                  <div className="flex justify-between text-sm font-bold text-emerald-400">
                    <span>Amount Paid:</span>
                    <span>${invoice.amount_paid?.toLocaleString("en-AU", { minimumFractionDigits: 2 })}</span>
                  </div>

                  <div className="flex justify-between text-base font-bold pt-2 border-t border-brand-glass-border-light dark:border-white/[0.08] text-amber-500">
                    <span>Balance Due:</span>
                    <span>${invoice.balance_due?.toLocaleString("en-AU", { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Printable Modal */}
        {printableModal && invoice && (
          <DocumentPrintView
            type="invoice"
            data={invoice}
            onClose={() => setPrintableModal(false)}
          />
        )}
      </div>
    </PortalLayout>
  );
}
