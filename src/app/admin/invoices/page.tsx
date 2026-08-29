"use client";

import React, { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Receipt,
  Search,
  Filter,
  DollarSign,
  CreditCard,
  Eye,
  Printer,
  Calendar,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getAuthHeaders } from "@/lib/auth-client";
import { useToast } from "@/components/admin/Toast";
import { Invoice, InvoiceStatus, PaymentMethod } from "@/types";
import { DocumentPrintView } from "@/components/admin/DocumentPrintView";

const STATUS_BADGES: Record<InvoiceStatus, string> = {
  draft: "bg-gray-500/10 text-gray-400 border-gray-500/30",
  sent: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  partially_paid: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  paid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  overdue: "bg-red-500/10 text-red-400 border-red-500/30",
  cancelled: "bg-zinc-800 text-zinc-500 border-zinc-700",
};

function InvoicesContent() {
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Payment Recording Modal State
  const [paymentInvoice, setPaymentInvoice] = useState<Invoice | null>(null);
  const [payAmount, setPayAmount] = useState<string>("");
  const [payMethod, setPayMethod] = useState<PaymentMethod>("bank_transfer");
  const [payRef, setPayRef] = useState<string>("");
  const [payNotes, setPayNotes] = useState<string>("");
  const [recordingPay, setRecordingPay] = useState(false);

  // Print Preview Modal State
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/invoices", { headers: getAuthHeaders() });
      const data = (await res.json()) as { success?: boolean; data?: Invoice[] };
      if (data && data.success && Array.isArray(data.data)) {
        setInvoices(data.data);
      }
    } catch (err) {
      console.error("Invoices fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Handle URL pre-fill invoice lookup
  useEffect(() => {
    const invId = searchParams.get("id");
    if (invId && invoices.length > 0) {
      const found = invoices.find((i) => i.id === invId || i.invoice_number === invId);
      if (found) {
        setPreviewInvoice(found);
      }
    }
  }, [searchParams, invoices]);

  const openPaymentModal = (invoice: Invoice) => {
    setPaymentInvoice(invoice);
    setPayAmount(invoice.balance_due ? String(invoice.balance_due) : String(invoice.total_amount));
    setPayMethod("bank_transfer");
    setPayRef(`EFT-${Date.now().toString().slice(-6)}`);
    setPayNotes("");
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentInvoice) return;

    const amount = Number(payAmount);
    if (isNaN(amount) || amount <= 0) {
      showToast("Please enter a valid payment amount", "error");
      return;
    }

    setRecordingPay(true);
    try {
      const res = await fetch("/api/admin/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({
          invoice_id: paymentInvoice.id,
          amount,
          payment_method: payMethod,
          reference_number: payRef,
          notes: payNotes,
        }),
      });

      const data = (await res.json()) as { success?: boolean; error?: string };
      if (data && data.success) {
        showToast(
          `Payment of $${amount.toFixed(2)} recorded successfully against #${paymentInvoice.invoice_number}`,
          "success"
        );
        setPaymentInvoice(null);
        fetchInvoices();
      } else {
        showToast(data?.error || "Failed to record payment", "error");
      }
    } catch {
      showToast("Network error recording payment", "error");
    } finally {
      setRecordingPay(false);
    }
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const q = search.toLowerCase();
      const matchesSearch =
        inv.invoice_number.toLowerCase().includes(q) ||
        (inv.customer_name && inv.customer_name.toLowerCase().includes(q)) ||
        (inv.customer_email && inv.customer_email.toLowerCase().includes(q)) ||
        (inv.project_name && inv.project_name.toLowerCase().includes(q));

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "unpaid" && inv.status !== "paid" && inv.status !== "cancelled") ||
        inv.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [invoices, search, statusFilter]);

  // Aggregate totals
  const totalReceivables = invoices.reduce((acc, curr) => acc + (curr.total_amount || 0), 0);
  const totalCollected = invoices.reduce((acc, curr) => acc + (curr.amount_paid || 0), 0);
  const totalOutstanding = invoices.reduce((acc, curr) => acc + (curr.balance_due || 0), 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-glass-border-light dark:border-brand-glass-border-dark">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-mono text-brand-gray block mb-1">
              [Commercial Billing & Tax Invoices]
            </span>
            <h1 className="font-serif text-3xl font-light tracking-tight text-brand-charcoal dark:text-white">
              INVOICES
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/payments"
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark text-xs font-mono text-brand-charcoal dark:text-white uppercase tracking-wider hover:bg-black/5 transition-colors"
            >
              <CreditCard size={14} /> Payments Register
            </Link>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark">
            <span className="text-[10px] uppercase font-mono text-brand-gray block mb-1">Total Invoiced</span>
            <span className="font-serif text-2xl font-light text-brand-charcoal dark:text-white block">
              ${totalReceivables.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] font-mono text-brand-gray">Australian AUD (incl. GST)</span>
          </div>

          <div className="p-4 border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark">
            <span className="text-[10px] uppercase font-mono text-emerald-500 block mb-1">Amount Collected</span>
            <span className="font-serif text-2xl font-light text-emerald-600 dark:text-emerald-400 block">
              ${totalCollected.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] font-mono text-emerald-500">Verified receipts</span>
          </div>

          <div className="p-4 border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark">
            <span className="text-[10px] uppercase font-mono text-amber-500 block mb-1">Outstanding Balance</span>
            <span className="font-serif text-2xl font-light text-amber-600 dark:text-amber-400 block">
              ${totalOutstanding.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] font-mono text-amber-500">Awaiting client payment</span>
          </div>
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray" />
            <input
              type="text"
              placeholder="Search invoice number, customer name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs text-brand-charcoal dark:text-white focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {["All", "unpaid", "paid", "partially_paid", "overdue", "draft"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 text-xs font-mono uppercase rounded-sm transition-colors ${
                  statusFilter === st
                    ? "bg-brand-charcoal text-white dark:bg-white dark:text-brand-charcoal font-bold"
                    : "bg-black/5 dark:bg-white/5 text-brand-gray hover:text-brand-charcoal dark:hover:text-white"
                }`}
              >
                {st.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Invoices Table */}
        <div className="border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-xs font-mono text-brand-gray">
              <Loader2 size={24} className="animate-spin mx-auto mb-2" />
              Loading invoices...
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="py-20 text-center text-xs font-mono text-brand-gray">
              No invoices match your filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-brand-glass-border-light dark:border-brand-glass-border-dark text-[10px] uppercase font-mono text-brand-gray bg-[#fbfbfa] dark:bg-black/20">
                    <th className="py-3 px-4">Invoice #</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4 hidden md:table-cell">Project</th>
                    <th className="py-3 px-4 hidden sm:table-cell">Due Date</th>
                    <th className="py-3 px-4 text-right">Total (AUD)</th>
                    <th className="py-3 px-4 text-right">Paid</th>
                    <th className="py-3 px-4 text-right">Balance Due</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-glass-border-light dark:divide-brand-glass-border-dark">
                  {filteredInvoices.map((inv) => (
                    <tr
                      key={inv.id}
                      className="hover:bg-[#f7f7f5] dark:hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-4 px-4 font-mono font-bold text-brand-charcoal dark:text-white">
                        {inv.invoice_number}
                      </td>
                      <td className="py-4 px-4 font-medium text-brand-charcoal dark:text-white">
                        <span className="block">{inv.customer_name}</span>
                        <span className="text-[10px] text-brand-gray font-mono">{inv.customer_email}</span>
                      </td>
                      <td className="py-4 px-4 text-brand-gray dark:text-brand-gray-light hidden md:table-cell">
                        {inv.project_name || "Custom Glazing"}
                      </td>
                      <td className="py-4 px-4 text-brand-gray font-mono hidden sm:table-cell">
                        {inv.due_date}
                      </td>
                      <td className="py-4 px-4 text-right font-mono font-bold text-brand-charcoal dark:text-white">
                        ${inv.total_amount?.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">
                        ${inv.amount_paid?.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-right font-mono font-bold text-amber-600 dark:text-amber-400">
                        ${inv.balance_due?.toFixed(2)}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block text-[10px] uppercase font-mono px-2.5 py-1 border rounded-sm font-bold ${
                            STATUS_BADGES[inv.status] || STATUS_BADGES.draft
                          }`}
                        >
                          {inv.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            onClick={() => setPreviewInvoice(inv)}
                            className="p-1.5 text-brand-gray hover:text-brand-charcoal dark:hover:text-white transition-colors"
                            title="Preview / Print Tax Invoice"
                          >
                            <Printer size={15} />
                          </button>

                          {inv.status !== "paid" && (
                            <button
                              onClick={() => openPaymentModal(inv)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-mono uppercase font-bold rounded-sm transition-colors"
                            >
                              + Pay
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* RECORD PAYMENT MODAL */}
        {paymentInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <form
              onSubmit={handleRecordPayment}
              className="bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark w-full max-w-md p-6 sm:p-8 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-brand-glass-border-light dark:border-brand-glass-border-dark">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-brand-gray block">
                    [Manual Payment Recording]
                  </span>
                  <h3 className="font-serif text-xl font-light text-brand-charcoal dark:text-white">
                    Record Payment · #{paymentInvoice.invoice_number}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setPaymentInvoice(null)}
                  className="p-1 text-brand-gray hover:text-brand-charcoal dark:hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Invoice Summary */}
              <div className="p-3 bg-[#f8f8f6] dark:bg-black/30 border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-brand-gray">Customer:</span>
                  <span className="font-bold text-brand-charcoal dark:text-white">{paymentInvoice.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-gray">Invoice Total:</span>
                  <span>${paymentInvoice.total_amount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-amber-600">
                  <span>Current Balance Due:</span>
                  <span>${paymentInvoice.balance_due?.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] uppercase font-mono text-brand-gray block mb-1">
                    Payment Amount (AUD) *
                  </label>
                  <div className="relative">
                    <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray" />
                    <input
                      type="number"
                      step="any"
                      required
                      value={payAmount}
                      onChange={(e) => setPayAmount(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark font-mono text-brand-charcoal dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono text-brand-gray block mb-1">
                    Payment Method *
                  </label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value as PaymentMethod)}
                    className="w-full p-2 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark font-mono text-xs text-brand-charcoal dark:text-white focus:outline-none"
                  >
                    <option value="bank_transfer">Direct Bank Transfer (EFT)</option>
                    <option value="card">Credit / Debit Card (Terminal)</option>
                    <option value="cash">Cash</option>
                    <option value="cheque">Company Cheque</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono text-brand-gray block mb-1">
                    Reference / Receipt #
                  </label>
                  <input
                    type="text"
                    value={payRef}
                    onChange={(e) => setPayRef(e.target.value)}
                    placeholder="e.g. EFT-VANCE-88219"
                    className="w-full p-2 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark font-mono text-xs text-brand-charcoal dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono text-brand-gray block mb-1">
                    Payment Notes
                  </label>
                  <textarea
                    rows={2}
                    value={payNotes}
                    onChange={(e) => setPayNotes(e.target.value)}
                    placeholder="Deposit, final balance, bank reference details..."
                    className="w-full p-2 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs text-brand-charcoal dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-brand-glass-border-light dark:border-brand-glass-border-dark">
                <button
                  type="button"
                  onClick={() => setPaymentInvoice(null)}
                  className="px-4 py-2 text-xs font-mono uppercase text-brand-gray hover:text-brand-charcoal dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={recordingPay}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold uppercase rounded-sm transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {recordingPay ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Printable View */}
        {previewInvoice && (
          <DocumentPrintView
            type="invoice"
            data={previewInvoice}
            onClose={() => setPreviewInvoice(null)}
          />
        )}
      </div>
    </AdminLayout>
  );
}

export default function AdminInvoicesPage() {
  return (
    <Suspense
      fallback={
        <AdminLayout>
          <div className="py-20 text-center text-xs font-mono text-brand-gray">
            <Loader2 size={24} className="animate-spin mx-auto mb-2" />
            Loading invoices module...
          </div>
        </AdminLayout>
      }
    >
      <InvoicesContent />
    </Suspense>
  );
}
