"use client";

import React, { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Calculator,
  Plus,
  Trash2,
  Eye,
  Send,
  CheckCircle2,
  FileText,
  DollarSign,
  Receipt,
  Printer,
  Calendar,
  X,
  Loader2,
  ArrowRight,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getAuthHeaders } from "@/lib/auth-client";
import { useToast } from "@/components/admin/Toast";
import { Customer, Estimate, EstimateItem, EstimateStatus } from "@/types";
import { DocumentPrintView } from "@/components/admin/DocumentPrintView";

interface LineItemState {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
}

const STATUS_BADGES: Record<EstimateStatus, string> = {
  draft: "bg-gray-500/10 text-gray-400 border-gray-500/30",
  sent: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  viewed: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
  accepted: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  declined: "bg-red-500/10 text-red-400 border-red-500/30",
  expired: "bg-amber-500/10 text-amber-400 border-amber-500/30",
};

function EstimatesContent() {
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Builder Modal State
  const [showBuilder, setShowBuilder] = useState(false);
  const [builderSaving, setBuilderSaving] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [custName, setCustName] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [projectName, setProjectName] = useState("");
  const [validUntil, setValidUntil] = useState(
    new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().split("T")[0]
  );
  const [items, setItems] = useState<LineItemState[]>([
    {
      id: "item-1",
      description: "12mm Toughened Clear Glass Balustrade Panels (AS1288)",
      quantity: 12,
      unit: "m",
      unit_price: 250,
    },
    {
      id: "item-2",
      description: "Duplex 2205 Stainless Steel Base Spigots (Core Drilled)",
      quantity: 24,
      unit: "item",
      unit_price: 110,
    },
    {
      id: "item-3",
      description: "On-Site Installation, Alignment & Glazing Compliance Certificate",
      quantity: 1,
      unit: "service",
      unit_price: 950,
    },
  ]);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [estimateNotes, setEstimateNotes] = useState(
    "Structural glazing compliant with AS1288:2021. 50% deposit required upon confirmation."
  );

  // Print Preview
  const [previewEstimate, setPreviewEstimate] = useState<Estimate | null>(null);

  const fetchEstimates = async () => {
    try {
      setLoading(true);
      const [estRes, custRes] = await Promise.all([
        fetch("/api/admin/estimates", { headers: getAuthHeaders() }),
        fetch("/api/admin/customers", { headers: getAuthHeaders() }),
      ]);
      const estData = (await estRes.json()) as { success?: boolean; data?: Estimate[] };
      const custData = (await custRes.json()) as { success?: boolean; data?: Customer[] };

      if (estData && estData.success && Array.isArray(estData.data)) {
        setEstimates(estData.data);
      }
      if (custData && custData.success && Array.isArray(custData.data)) {
        setCustomers(custData.data);
      }
    } catch (err) {
      console.error("Estimates fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstimates();
  }, []);

  // Handle URL pre-fill params from quotes page
  useEffect(() => {
    const quoteId = searchParams.get("quoteId");
    const cName = searchParams.get("customerName");
    const cEmail = searchParams.get("customerEmail");
    const cPhone = searchParams.get("customerPhone");
    const service = searchParams.get("service");

    if (quoteId || cName || cEmail) {
      if (cName) setCustName(cName);
      if (cEmail) setCustEmail(cEmail);
      if (cPhone) setCustPhone(cPhone);
      if (service) setProjectName(`${service} Installation`);
      setShowBuilder(true);
    }
  }, [searchParams]);

  // Handle customer selection change in builder
  const handleCustomerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cid = e.target.value;
    setSelectedCustomerId(cid);
    if (cid) {
      const c = customers.find((cust) => cust.id === cid);
      if (c) {
        setCustName(c.name);
        setCustEmail(c.email);
        setCustPhone(c.phone);
      }
    }
  };

  // Line item manipulation
  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}`,
        description: "",
        quantity: 1,
        unit: "m",
        unit_price: 0,
      },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateItem = (id: string, field: keyof LineItemState, value: unknown) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // Calculations for Builder Modal
  const calculatedSubtotal = useMemo(() => {
    return items.reduce((acc, curr) => acc + (Number(curr.quantity) || 0) * (Number(curr.unit_price) || 0), 0);
  }, [items]);

  const calculatedGst = useMemo(() => {
    const taxable = Math.max(0, calculatedSubtotal - (Number(discountAmount) || 0));
    return Math.round(taxable * 0.10 * 100) / 100;
  }, [calculatedSubtotal, discountAmount]);

  const calculatedTotal = useMemo(() => {
    const taxable = Math.max(0, calculatedSubtotal - (Number(discountAmount) || 0));
    return Math.round((taxable + calculatedGst) * 100) / 100;
  }, [calculatedSubtotal, calculatedGst, discountAmount]);

  // Save Estimate
  const handleSaveEstimate = async (status: EstimateStatus = "draft") => {
    if (!custName || !custEmail) {
      showToast("Customer name and email are required", "error");
      return;
    }
    if (items.some((i) => !i.description || i.unit_price <= 0)) {
      showToast("Please provide valid descriptions and unit prices for all items", "error");
      return;
    }

    setBuilderSaving(true);
    try {
      const res = await fetch("/api/admin/estimates", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({
          customer_id: selectedCustomerId || undefined,
          customer_name: custName,
          customer_email: custEmail,
          customer_phone: custPhone,
          project_name: projectName || "Custom Architectural Glazing",
          valid_until: validUntil,
          items,
          discount_amount: Number(discountAmount) || 0,
          notes: estimateNotes,
        }),
      });

      const data = (await res.json()) as { success?: boolean; error?: string };
      if (data && data.success) {
        showToast(
          status === "sent" ? "Estimate saved and marked as SENT" : "Estimate draft saved successfully",
          "success"
        );
        setShowBuilder(false);
        fetchEstimates();
      } else {
        showToast(data?.error || "Failed to save estimate", "error");
      }
    } catch {
      showToast("Network error saving estimate", "error");
    } finally {
      setBuilderSaving(false);
    }
  };

  // Status changes & Convert to Invoice
  const handleUpdateStatus = async (estimateId: string, status: EstimateStatus) => {
    try {
      const res = await fetch(`/api/admin/estimates/${estimateId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ status }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (data && data.success) {
        showToast(`Estimate marked as ${status.toUpperCase()}`, "success");
        fetchEstimates();
      }
    } catch {
      showToast("Error updating estimate status", "error");
    }
  };

  const handleConvertToInvoice = async (estimateId: string) => {
    try {
      const res = await fetch(`/api/admin/estimates/${estimateId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ action: "convert_to_invoice" }),
      });
      const data = (await res.json()) as { success?: boolean; message?: string; error?: string };
      if (data && data.success) {
        showToast(data.message || "Converted to commercial invoice", "success");
        fetchEstimates();
      } else {
        showToast(data?.error || "Failed to convert estimate", "error");
      }
    } catch {
      showToast("Error converting estimate to invoice", "error");
    }
  };

  const filteredEstimates = useMemo(() => {
    if (statusFilter === "All") return estimates;
    return estimates.filter((e) => e.status === statusFilter);
  }, [estimates, statusFilter]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-glass-border-light dark:border-brand-glass-border-dark">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-mono text-brand-gray block mb-1">
              [Commercial Costing & Quotation Engine]
            </span>
            <h1 className="font-serif text-3xl font-light tracking-tight text-brand-charcoal dark:text-white">
              ESTIMATE BUILDER
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedCustomerId("");
                setCustName("");
                setCustEmail("");
                setCustPhone("");
                setProjectName("");
                setShowBuilder(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-charcoal dark:bg-white text-white dark:text-brand-charcoal text-xs font-mono font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              <Plus size={14} /> New Estimate
            </button>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {["All", "draft", "sent", "viewed", "accepted", "declined", "expired"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-mono uppercase transition-colors rounded-sm ${
                statusFilter === st
                  ? "bg-brand-charcoal text-white dark:bg-white dark:text-brand-charcoal font-bold"
                  : "bg-black/5 dark:bg-white/5 text-brand-gray hover:text-brand-charcoal dark:hover:text-white"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Estimates Table */}
        <div className="border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-xs font-mono text-brand-gray">
              <Loader2 size={24} className="animate-spin mx-auto mb-2" />
              Loading estimates...
            </div>
          ) : filteredEstimates.length === 0 ? (
            <div className="py-20 text-center text-xs font-mono text-brand-gray">
              No estimates found matching the filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-brand-glass-border-light dark:border-brand-glass-border-dark text-[10px] uppercase font-mono text-brand-gray bg-[#fbfbfa] dark:bg-black/20">
                    <th className="py-3 px-4">Estimate #</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Project</th>
                    <th className="py-3 px-4 hidden md:table-cell">Valid Until</th>
                    <th className="py-3 px-4 text-right">Subtotal</th>
                    <th className="py-3 px-4 text-right">GST (10%)</th>
                    <th className="py-3 px-4 text-right">Total (AUD)</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-glass-border-light dark:divide-brand-glass-border-dark">
                  {filteredEstimates.map((e) => (
                    <tr
                      key={e.id}
                      className="hover:bg-[#f7f7f5] dark:hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-4 px-4 font-mono font-bold text-brand-charcoal dark:text-white">
                        {e.estimate_number}
                      </td>
                      <td className="py-4 px-4 font-medium text-brand-charcoal dark:text-white">
                        <span className="block">{e.customer_name}</span>
                        <span className="text-[10px] text-brand-gray font-mono">{e.customer_email}</span>
                      </td>
                      <td className="py-4 px-4 text-brand-gray dark:text-brand-gray-light">
                        {e.project_name || "Custom Glazing"}
                      </td>
                      <td className="py-4 px-4 text-brand-gray font-mono hidden md:table-cell">
                        {e.valid_until}
                      </td>
                      <td className="py-4 px-4 text-right font-mono text-brand-gray">
                        ${e.subtotal.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-right font-mono text-brand-gray">
                        ${e.gst_amount.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-right font-mono font-bold text-brand-charcoal dark:text-white">
                        ${e.total_amount.toFixed(2)}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block text-[10px] uppercase font-mono px-2.5 py-1 border rounded-sm font-bold ${
                            STATUS_BADGES[e.status] || STATUS_BADGES.draft
                          }`}
                        >
                          {e.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            onClick={() => setPreviewEstimate(e)}
                            className="p-1.5 text-brand-gray hover:text-brand-charcoal dark:hover:text-white transition-colors"
                            title="Preview / Print Document"
                          >
                            <Eye size={15} />
                          </button>

                          {e.status === "draft" && (
                            <button
                              onClick={() => handleUpdateStatus(e.id, "sent")}
                              className="px-2 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-mono uppercase font-bold"
                              title="Mark as Sent"
                            >
                              Send
                            </button>
                          )}

                          {e.status !== "accepted" && (
                            <button
                              onClick={() => handleUpdateStatus(e.id, "accepted")}
                              className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono uppercase font-bold"
                              title="Mark Accepted"
                            >
                              Accept
                            </button>
                          )}

                          {!e.converted_to_invoice_id && (
                            <button
                              onClick={() => handleConvertToInvoice(e.id)}
                              className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-mono uppercase font-bold rounded-sm"
                              title="Convert to Commercial Tax Invoice"
                            >
                              Invoice →
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

        {/* ESTIMATE BUILDER MODAL */}
        {showBuilder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
            <div className="bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 my-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-brand-glass-border-light dark:border-brand-glass-border-dark">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-mono text-brand-gray block">
                    [Estimate Builder — AS1288 Glass Engineering]
                  </span>
                  <h2 className="font-serif text-2xl font-light text-brand-charcoal dark:text-white">
                    Create Estimate #CGI-{(estimates.length + 1).toString().padStart(4, "0")}
                  </h2>
                </div>
                <button
                  onClick={() => setShowBuilder(false)}
                  className="p-2 text-brand-gray hover:text-brand-charcoal dark:hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Customer & Project Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
                <div>
                  <label className="text-[10px] uppercase font-mono text-brand-gray block mb-1">
                    Select Existing Customer
                  </label>
                  <select
                    value={selectedCustomerId}
                    onChange={handleCustomerSelect}
                    className="w-full p-2.5 bg-[#f8f8f6] dark:bg-black/30 border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs font-mono text-brand-charcoal dark:text-white focus:outline-none"
                  >
                    <option value="">-- Or enter new client below --</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono text-brand-gray block mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    placeholder="e.g. Alexander Vance"
                    className="w-full p-2.5 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs text-brand-charcoal dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono text-brand-gray block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={custEmail}
                    onChange={(e) => setCustEmail(e.target.value)}
                    placeholder="e.g. alexander@vance.com.au"
                    className="w-full p-2.5 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs font-mono text-brand-charcoal dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono text-brand-gray block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                    placeholder="e.g. +61 412 345 678"
                    className="w-full p-2.5 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs font-mono text-brand-charcoal dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono text-brand-gray block mb-1">
                    Project Title / Service
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g. Mosman Balustrades Installation"
                    className="w-full p-2.5 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs text-brand-charcoal dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono text-brand-gray block mb-1">
                    Valid Until
                  </label>
                  <input
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className="w-full p-2.5 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs font-mono text-brand-charcoal dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Line Items Editor */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-brand-glass-border-light dark:border-brand-glass-border-dark">
                  <h3 className="text-xs uppercase font-mono tracking-widest text-brand-gray">
                    Itemized Glass, Hardware & Labour (ex GST)
                  </h3>
                  <button
                    type="button"
                    onClick={addItem}
                    className="inline-flex items-center gap-1 text-xs font-mono uppercase font-bold text-blue-500 hover:underline"
                  >
                    <Plus size={13} /> Add Line Item
                  </button>
                </div>

                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-12 gap-2 p-3 bg-[#fbfbfa] dark:bg-black/20 border border-brand-glass-border-light dark:border-brand-glass-border-dark items-center text-xs"
                    >
                      <div className="col-span-12 sm:col-span-5">
                        <label className="text-[9px] uppercase font-mono text-brand-gray block mb-0.5 sm:hidden">
                          Description
                        </label>
                        <input
                          type="text"
                          required
                          value={item.description}
                          onChange={(e) => updateItem(item.id, "description", e.target.value)}
                          placeholder="Item description / glass thickness..."
                          className="w-full p-2 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark text-brand-charcoal dark:text-white focus:outline-none font-sans text-xs"
                        />
                      </div>

                      <div className="col-span-4 sm:col-span-2">
                        <label className="text-[9px] uppercase font-mono text-brand-gray block mb-0.5 sm:hidden">
                          Qty
                        </label>
                        <input
                          type="number"
                          step="any"
                          required
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
                          className="w-full p-2 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark font-mono text-brand-charcoal dark:text-white focus:outline-none text-xs"
                        />
                      </div>

                      <div className="col-span-4 sm:col-span-2">
                        <label className="text-[9px] uppercase font-mono text-brand-gray block mb-0.5 sm:hidden">
                          Unit
                        </label>
                        <select
                          value={item.unit}
                          onChange={(e) => updateItem(item.id, "unit", e.target.value)}
                          className="w-full p-2 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark font-mono text-brand-charcoal dark:text-white focus:outline-none text-xs"
                        >
                          <option value="m">m (linear)</option>
                          <option value="sqm">sqm</option>
                          <option value="panel">panel</option>
                          <option value="item">item</option>
                          <option value="set">set</option>
                          <option value="service">service</option>
                          <option value="hours">hours</option>
                        </select>
                      </div>

                      <div className="col-span-3 sm:col-span-2">
                        <label className="text-[9px] uppercase font-mono text-brand-gray block mb-0.5 sm:hidden">
                          Unit Price ($)
                        </label>
                        <input
                          type="number"
                          step="any"
                          required
                          value={item.unit_price}
                          onChange={(e) => updateItem(item.id, "unit_price", e.target.value)}
                          className="w-full p-2 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark font-mono text-brand-charcoal dark:text-white focus:outline-none text-xs"
                        />
                      </div>

                      <div className="col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          disabled={items.length <= 1}
                          className="p-1.5 text-red-500 hover:text-red-700 disabled:opacity-20"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Automatic GST & Totals Calculation */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-4 border-t border-brand-glass-border-light dark:border-brand-glass-border-dark">
                <div className="w-full sm:w-1/2 space-y-2">
                  <label className="text-[10px] uppercase font-mono text-brand-gray block">
                    Terms & Australian AS1288 Disclaimer:
                  </label>
                  <textarea
                    rows={3}
                    value={estimateNotes}
                    onChange={(e) => setEstimateNotes(e.target.value)}
                    className="w-full p-2.5 bg-[#f8f8f6] dark:bg-black/20 border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs font-sans text-brand-charcoal dark:text-white focus:outline-none"
                  />
                </div>

                <div className="w-full sm:w-72 space-y-2.5 text-xs font-mono bg-[#fbfbfa] dark:bg-black/30 p-4 border border-brand-glass-border-light dark:border-brand-glass-border-dark">
                  <div className="flex justify-between text-brand-gray">
                    <span>Subtotal:</span>
                    <span>${calculatedSubtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between text-emerald-600">
                    <span>Discount ($):</span>
                    <input
                      type="number"
                      value={discountAmount}
                      onChange={(e) => setDiscountAmount(Number(e.target.value) || 0)}
                      className="w-20 p-1 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark text-right text-xs font-mono"
                    />
                  </div>

                  <div className="flex justify-between text-brand-gray">
                    <span>Australian GST (10%):</span>
                    <span>${calculatedGst.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between font-bold text-sm text-brand-charcoal dark:text-white pt-2 border-t border-brand-glass-border-light dark:border-brand-glass-border-dark">
                    <span>TOTAL AMOUNT:</span>
                    <span>${calculatedTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-brand-glass-border-light dark:border-brand-glass-border-dark">
                <button
                  type="button"
                  onClick={() => setShowBuilder(false)}
                  className="px-4 py-2.5 text-xs font-mono uppercase text-brand-gray hover:text-brand-charcoal dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={builderSaving}
                  onClick={() => handleSaveEstimate("draft")}
                  className="px-5 py-2.5 bg-black/10 dark:bg-white/10 text-brand-charcoal dark:text-white text-xs font-mono uppercase font-bold hover:bg-black/15 transition-colors disabled:opacity-50"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  disabled={builderSaving}
                  onClick={() => handleSaveEstimate("sent")}
                  className="px-6 py-2.5 bg-brand-charcoal text-white dark:bg-white dark:text-brand-charcoal text-xs font-mono uppercase font-bold hover:opacity-90 transition-opacity disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {builderSaving ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                  Save & Mark Sent
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Printable View */}
        {previewEstimate && (
          <DocumentPrintView
            type="estimate"
            data={previewEstimate}
            onClose={() => setPreviewEstimate(null)}
          />
        )}
      </div>
    </AdminLayout>
  );
}

export default function AdminEstimatesPage() {
  return (
    <Suspense
      fallback={
        <AdminLayout>
          <div className="py-20 text-center text-xs font-mono text-brand-gray">
            <Loader2 size={24} className="animate-spin mx-auto mb-2" />
            Loading estimate module...
          </div>
        </AdminLayout>
      }
    >
      <EstimatesContent />
    </Suspense>
  );
}
