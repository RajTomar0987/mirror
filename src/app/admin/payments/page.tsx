"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  CreditCard,
  Search,
  DollarSign,
  Calendar,
  Receipt,
  FileText,
  User,
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getAuthHeaders } from "@/lib/auth-client";
import { useToast } from "@/components/admin/Toast";
import { Invoice, Payment, PaymentMethod } from "@/types";

export default function AdminPaymentsPage() {
  const { showToast } = useToast();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("All");

  // New Payment Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState("");
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState<PaymentMethod>("bank_transfer");
  const [payDate, setPayDate] = useState(new Date().toISOString().split("T")[0]);
  const [payRef, setPayRef] = useState("");
  const [payNotes, setPayNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchPaymentsData = async () => {
    try {
      setLoading(true);
      const [payRes, invRes] = await Promise.all([
        fetch("/api/admin/payments", { headers: getAuthHeaders() }),
        fetch("/api/admin/invoices", { headers: getAuthHeaders() }),
      ]);
      const payData = (await payRes.json()) as { success?: boolean; data?: Payment[] };
      const invData = (await invRes.json()) as { success?: boolean; data?: Invoice[] };

      if (payData && payData.success && Array.isArray(payData.data)) {
        setPayments(payData.data);
      }
      if (invData && invData.success && Array.isArray(invData.data)) {
        setInvoices(invData.data);
      }
    } catch (err) {
      console.error("Payments fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentsData();
  }, []);

  const handleInvoiceSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const invId = e.target.value;
    setSelectedInvoiceId(invId);
    if (invId) {
      const inv = invoices.find((i) => i.id === invId);
      if (inv) {
        setPayAmount(inv.balance_due ? String(inv.balance_due) : String(inv.total_amount));
        setPayRef(`EFT-${Date.now().toString().slice(-6)}`);
      }
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoiceId) {
      showToast("Please select an invoice to apply this payment to", "error");
      return;
    }
    const amount = Number(payAmount);
    if (isNaN(amount) || amount <= 0) {
      showToast("Payment amount must be greater than zero", "error");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({
          invoice_id: selectedInvoiceId,
          amount,
          payment_method: payMethod,
          payment_date: payDate,
          reference_number: payRef,
          notes: payNotes,
        }),
      });

      const data = (await res.json()) as { success?: boolean; error?: string };
      if (data && data.success) {
        showToast("Payment recorded successfully", "success");
        setShowAddModal(false);
        setSelectedInvoiceId("");
        setPayAmount("");
        setPayRef("");
        setPayNotes("");
        fetchPaymentsData();
      } else {
        showToast(data?.error || "Failed to record payment", "error");
      }
    } catch {
      showToast("Error recording payment", "error");
    } finally {
      setSaving(false);
    }
  };

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const q = search.toLowerCase();
      const matchesSearch =
        p.payment_number.toLowerCase().includes(q) ||
        (p.customer_name && p.customer_name.toLowerCase().includes(q)) ||
        (p.invoice_number && p.invoice_number.toLowerCase().includes(q)) ||
        (p.reference_number && p.reference_number.toLowerCase().includes(q));

      const matchesMethod = methodFilter === "All" || p.payment_method === methodFilter;

      return matchesSearch && matchesMethod;
    });
  }, [payments, search, methodFilter]);

  const totalCollected = payments.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const bankTransfers = payments.filter((p) => p.payment_method === "bank_transfer").reduce((acc, curr) => acc + curr.amount, 0);
  const cardPayments = payments.filter((p) => p.payment_method === "card").reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-glass-border-light dark:border-brand-glass-border-dark">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-mono text-brand-gray block mb-1">
              [Financial Reconciliation & Ledger]
            </span>
            <h1 className="font-serif text-3xl font-light tracking-tight text-brand-charcoal dark:text-white">
              PAYMENTS REGISTER
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-sm transition-colors"
            >
              <Plus size={14} /> Record Manual Payment
            </button>
          </div>
        </div>

        {/* 3 KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark">
            <span className="text-[10px] uppercase font-mono text-brand-gray block mb-1">Total Revenue Collected</span>
            <span className="font-serif text-2xl font-light text-brand-charcoal dark:text-white block">
              ${totalCollected.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] font-mono text-emerald-500">{payments.length} verified transactions</span>
          </div>

          <div className="p-4 border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark">
            <span className="text-[10px] uppercase font-mono text-brand-gray block mb-1">Direct Bank Transfers (EFT)</span>
            <span className="font-serif text-2xl font-light text-brand-charcoal dark:text-white block">
              ${bankTransfers.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] font-mono text-blue-500">Primary BSB payment route</span>
          </div>

          <div className="p-4 border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark">
            <span className="text-[10px] uppercase font-mono text-brand-gray block mb-1">Terminal Card & Others</span>
            <span className="font-serif text-2xl font-light text-brand-charcoal dark:text-white block">
              ${cardPayments.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] font-mono text-purple-500">Card / Terminal receipts</span>
          </div>
        </div>

        {/* Search & Method Filter */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray" />
            <input
              type="text"
              placeholder="Search payment ID, invoice #, customer name, reference..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs text-brand-charcoal dark:text-white focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {["All", "bank_transfer", "card", "cash", "cheque", "other"].map((m) => (
              <button
                key={m}
                onClick={() => setMethodFilter(m)}
                className={`px-3 py-1.5 text-xs font-mono uppercase rounded-sm transition-colors ${
                  methodFilter === m
                    ? "bg-brand-charcoal text-white dark:bg-white dark:text-brand-charcoal font-bold"
                    : "bg-black/5 dark:bg-white/5 text-brand-gray hover:text-brand-charcoal dark:hover:text-white"
                }`}
              >
                {m.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Payments Table */}
        <div className="border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-xs font-mono text-brand-gray">
              <Loader2 size={24} className="animate-spin mx-auto mb-2" />
              Loading payments ledger...
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="py-20 text-center text-xs font-mono text-brand-gray">
              No payments recorded matching your filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-brand-glass-border-light dark:border-brand-glass-border-dark text-[10px] uppercase font-mono text-brand-gray bg-[#fbfbfa] dark:bg-black/20">
                    <th className="py-3 px-4">Payment ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Invoice #</th>
                    <th className="py-3 px-4 hidden sm:table-cell">Date</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4 hidden md:table-cell">Reference</th>
                    <th className="py-3 px-4 text-right">Amount (AUD)</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-glass-border-light dark:divide-brand-glass-border-dark">
                  {filteredPayments.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-[#f7f7f5] dark:hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-4 px-4 font-mono font-bold text-brand-charcoal dark:text-white">
                        {p.payment_number}
                      </td>
                      <td className="py-4 px-4 font-medium text-brand-charcoal dark:text-white">
                        {p.customer_name}
                      </td>
                      <td className="py-4 px-4 font-mono text-blue-500">
                        <Link href={`/admin/invoices?id=${p.invoice_id}`} className="hover:underline">
                          {p.invoice_number || p.invoice_id}
                        </Link>
                      </td>
                      <td className="py-4 px-4 text-brand-gray font-mono hidden sm:table-cell">
                        {p.payment_date}
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 border border-brand-glass-border-light dark:border-brand-glass-border-dark">
                          {p.payment_method.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-mono text-brand-gray text-[11px] hidden md:table-cell">
                        {p.reference_number || "—"}
                      </td>
                      <td className="py-4 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        +${p.amount.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase font-mono text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 size={12} /> {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* RECORD PAYMENT MODAL */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <form
              onSubmit={handleRecordPayment}
              className="bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark w-full max-w-lg p-6 sm:p-8 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-brand-glass-border-light dark:border-brand-glass-border-dark">
                <h3 className="font-serif text-xl font-light text-brand-charcoal dark:text-white">
                  Record Customer Payment
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="p-1 text-brand-gray hover:text-brand-charcoal dark:hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] uppercase font-mono text-brand-gray block mb-1">
                    Apply to Invoice *
                  </label>
                  <select
                    required
                    value={selectedInvoiceId}
                    onChange={handleInvoiceSelect}
                    className="w-full p-2.5 bg-[#f8f8f6] dark:bg-black/30 border border-brand-glass-border-light dark:border-brand-glass-border-dark font-mono text-xs text-brand-charcoal dark:text-white focus:outline-none"
                  >
                    <option value="">-- Select an active invoice --</option>
                    {invoices.map((inv) => (
                      <option key={inv.id} value={inv.id}>
                        {inv.invoice_number} — {inv.customer_name} (Balance: ${inv.balance_due?.toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-mono text-brand-gray block mb-1">
                      Payment Amount ($) *
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={payAmount}
                      onChange={(e) => setPayAmount(e.target.value)}
                      placeholder="e.g. 4279.00"
                      className="w-full p-2.5 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark font-mono text-brand-charcoal dark:text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono text-brand-gray block mb-1">
                      Payment Date
                    </label>
                    <input
                      type="date"
                      value={payDate}
                      onChange={(e) => setPayDate(e.target.value)}
                      className="w-full p-2.5 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark font-mono text-brand-charcoal dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-mono text-brand-gray block mb-1">
                      Payment Method *
                    </label>
                    <select
                      value={payMethod}
                      onChange={(e) => setPayMethod(e.target.value as PaymentMethod)}
                      className="w-full p-2.5 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark font-mono text-xs text-brand-charcoal dark:text-white focus:outline-none"
                    >
                      <option value="bank_transfer">Direct Bank Transfer (EFT)</option>
                      <option value="card">Card / POS Terminal</option>
                      <option value="cash">Cash</option>
                      <option value="cheque">Cheque</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono text-brand-gray block mb-1">
                      Bank Reference / Receipt #
                    </label>
                    <input
                      type="text"
                      value={payRef}
                      onChange={(e) => setPayRef(e.target.value)}
                      placeholder="e.g. EFT-VANCE-88219"
                      className="w-full p-2.5 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark font-mono text-brand-charcoal dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono text-brand-gray block mb-1">
                    Payment Notes / Ledger Entry
                  </label>
                  <textarea
                    rows={2}
                    value={payNotes}
                    onChange={(e) => setPayNotes(e.target.value)}
                    placeholder="e.g. 50% deposit for glass tempering order..."
                    className="w-full p-2.5 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs font-sans text-brand-charcoal dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-brand-glass-border-light dark:border-brand-glass-border-dark">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-mono uppercase text-brand-gray hover:text-brand-charcoal dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold uppercase rounded-sm transition-colors disabled:opacity-50"
                >
                  {saving ? "Recording..." : "Record Payment"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
