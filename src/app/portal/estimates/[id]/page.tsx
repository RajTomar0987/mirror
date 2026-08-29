"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calculator,
  Download,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Printer,
  Calendar,
  DollarSign,
  Loader2,
  ShieldCheck,
  Building,
  AlertTriangle,
} from "lucide-react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { getAuthHeaders } from "@/lib/auth-client";
import { useToast } from "@/components/admin/Toast";
import { Estimate } from "@/types";
import { DocumentPrintView } from "@/components/admin/DocumentPrintView";

export default function CustomerEstimateDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const { id } = resolvedParams;
  const { showToast } = useToast();

  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Approval & Rejection Confirmation States
  const [confirmAction, setConfirmAction] = useState<"approve" | "reject" | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Printable View
  const [printableModal, setPrintableModal] = useState(false);

  const fetchEstimate = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/portal/estimates/${id}`, { headers: getAuthHeaders() });
      const json = (await res.json()) as { success?: boolean; data?: Estimate; error?: string };
      if (json && json.success && json.data) {
        setEstimate(json.data);
      } else {
        setError(json.error || "Estimate not found");
      }
    } catch {
      setError("Network error fetching estimate");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstimate();
  }, [id]);

  const handleEstimateAction = async () => {
    if (!estimate || !confirmAction) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/portal/estimates/${estimate.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          action: confirmAction,
          reason: rejectionReason,
        }),
      });

      const json = (await res.json()) as { success?: boolean; message?: string; error?: string };
      if (res.ok && json.success) {
        showToast(
          json.message ||
            (confirmAction === "approve"
              ? "Estimate approved successfully! Our project team has been notified."
              : "Estimate declined."),
          "success"
        );
        setConfirmAction(null);
        setRejectionReason("");
        fetchEstimate();
      } else {
        showToast(json.error || "Action failed", "error");
      }
    } catch {
      showToast("Network error executing action", "error");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Back Link & Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/portal/estimates"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-brand-gray hover:text-brand-charcoal dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Back to Estimates
          </Link>

          {estimate && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPrintableModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-brand-glass-border-light dark:border-white/10 text-xs font-mono text-brand-gray hover:text-brand-charcoal dark:hover:text-white transition-colors rounded-sm"
              >
                <Download size={13} /> Download PDF / Print
              </button>
              <Link
                href="/portal/messages"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/10 text-blue-400 border border-blue-500/30 text-xs font-mono font-bold uppercase rounded-sm hover:bg-blue-600/20 transition-colors"
              >
                <MessageSquare size={13} /> Message Staff
              </Link>
            </div>
          )}
        </div>

        {loading ? (
          <div className="py-24 text-center text-xs font-mono text-brand-gray flex flex-col items-center justify-center gap-3">
            <Loader2 size={24} className="animate-spin text-purple-500" />
            <span>Loading commercial estimate document...</span>
          </div>
        ) : error || !estimate ? (
          <div className="p-8 border border-red-500/20 bg-red-500/5 text-center space-y-2 rounded-sm">
            <p className="text-sm text-red-400 font-bold">{error || "Estimate not found"}</p>
            <Link href="/portal/estimates" className="text-xs font-mono text-blue-500 underline">
              Return to estimates directory
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Commercial Estimate Physical Document UI with 3D Elevation */}
            <div className="p-6 sm:p-10 bg-white dark:bg-[#0f1217] border border-brand-glass-border-light dark:border-white/[0.1] rounded-sm space-y-8 document-3d-shadow relative overflow-hidden">
              {/* Subtle ambient light gleam */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

              {/* Document Top Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-brand-glass-border-light dark:border-white/[0.08] relative z-10">
                <div className="space-y-1">
                  <span className="font-serif text-lg sm:text-xl font-bold tracking-widest text-brand-charcoal dark:text-white uppercase">
                    COMPLETE GLASS INNOVATIONS
                  </span>
                  <span className="text-[10px] font-mono tracking-widest text-brand-gray uppercase block">
                    ABN: 48 123 456 789 · AS1288 Glazing Certified
                  </span>
                  <span className="text-[11px] font-mono text-brand-gray block">
                    Level 3, 100 George Street, Sydney NSW 2000
                  </span>
                </div>

                <div className="sm:text-right space-y-1">
                  <span className="text-xs font-mono uppercase text-purple-400 font-bold block">
                    ESTIMATE #{estimate.estimate_number}
                  </span>
                  <span className="text-xs font-mono text-brand-gray block">
                    Issue Date: {new Date(estimate.created_at || Date.now()).toLocaleDateString("en-AU")}
                  </span>
                  <span className="text-xs font-mono text-brand-gray block font-semibold">
                    Valid Until: {estimate.valid_until}
                  </span>
                  <span
                    className={`inline-block mt-1 text-[10px] uppercase font-mono px-2.5 py-0.5 border rounded-sm font-bold ${
                      estimate.status === "accepted"
                        ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                        : estimate.status === "declined"
                        ? "border-red-500/30 text-red-400 bg-red-500/10"
                        : "border-purple-500/30 text-purple-400 bg-purple-500/10"
                    }`}
                  >
                    Status: {estimate.status}
                  </span>
                </div>
              </div>

              {/* Customer & Project Two-Column Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                <div className="p-4 bg-[#f8f9fa] dark:bg-black/30 border border-brand-glass-border-light dark:border-white/[0.05] rounded-sm space-y-1.5">
                  <span className="text-[10px] uppercase font-mono text-brand-gray font-bold block">
                    Customer Details
                  </span>
                  <span className="font-semibold text-sm text-brand-charcoal dark:text-white block">
                    {estimate.customer_name}
                  </span>
                  <span className="font-mono text-brand-gray block">{estimate.customer_email}</span>
                  <span className="font-mono text-brand-gray block">{estimate.customer_phone}</span>
                </div>

                <div className="p-4 bg-[#f8f9fa] dark:bg-black/30 border border-brand-glass-border-light dark:border-white/[0.05] rounded-sm space-y-1.5">
                  <span className="text-[10px] uppercase font-mono text-brand-gray font-bold block">
                    Project Scope
                  </span>
                  <span className="font-semibold text-sm text-brand-charcoal dark:text-white block">
                    {estimate.project_name}
                  </span>
                  <span className="text-brand-gray block font-sans">
                    {estimate.notes || "Complete glass installation including templating and hardware."}
                  </span>
                </div>
              </div>

              {/* Itemized Line Items Table */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-brand-gray block font-bold">
                  Itemized Glass, Hardware & Labour (ex GST)
                </span>
                <div className="border border-brand-glass-border-light dark:border-white/[0.05] rounded-sm overflow-x-auto">
                  <table className="w-full text-xs font-sans">
                    <thead>
                      <tr className="bg-[#f8f9fa] dark:bg-black/30 text-[10px] font-mono uppercase text-brand-gray border-b border-brand-glass-border-light dark:border-white/[0.05]">
                        <th className="py-3 px-4 text-left">Item Description</th>
                        <th className="py-3 px-4 text-center">Qty / Unit</th>
                        <th className="py-3 px-4 text-right">Unit Price (AUD)</th>
                        <th className="py-3 px-4 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-glass-border-light dark:divide-white/[0.05]">
                      {estimate.items?.map((item) => (
                        <tr key={item.id} className="hover:bg-black/5 dark:hover:bg-white/[0.02] transition-colors">
                          <td className="py-3.5 px-4 font-medium text-brand-charcoal dark:text-white">
                            {item.description}
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono text-brand-gray">
                            {item.quantity} {item.unit}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono text-brand-gray">
                            ${item.unit_price?.toFixed(2)}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-brand-charcoal dark:text-white">
                            ${item.subtotal?.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial Calculation Breakdown */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-2">
                <div className="p-4 bg-[#f8f9fa] dark:bg-black/30 border border-brand-glass-border-light dark:border-white/[0.05] rounded-sm max-w-sm w-full text-xs space-y-1.5">
                  <span className="text-[10px] uppercase font-mono font-bold text-brand-gray block">
                    Terms & Guarantee
                  </span>
                  <p className="text-brand-gray leading-snug">
                    All glass supplied and fitted in accordance with Australian Standards AS1288:2021 and AS2208. 10-year manufacturer warranty on structural integrity.
                  </p>
                </div>

                <div className="bg-[#f8f9fa] dark:bg-black/40 p-5 border border-brand-glass-border-light dark:border-white/[0.05] rounded-sm max-w-sm w-full space-y-2.5 text-xs font-mono">
                  <div className="flex justify-between text-brand-gray">
                    <span>Subtotal (ex GST):</span>
                    <span>${estimate.subtotal?.toLocaleString("en-AU", { minimumFractionDigits: 2 })}</span>
                  </div>

                  {estimate.discount_amount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-semibold">
                      <span>Discount:</span>
                      <span>-${estimate.discount_amount?.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-brand-gray">
                    <span>Australian GST ({(estimate.gst_rate * 100).toFixed(0)}%):</span>
                    <span>${estimate.gst_amount?.toLocaleString("en-AU", { minimumFractionDigits: 2 })}</span>
                  </div>

                  <div className="flex justify-between text-sm font-bold pt-2.5 border-t border-brand-glass-border-light dark:border-white/[0.08] text-brand-charcoal dark:text-white">
                    <span>Total Amount (AUD):</span>
                    <span className="text-base text-purple-400">
                      ${estimate.total_amount?.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-brand-glass-border-light dark:border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setPrintableModal(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-brand-gray hover:text-brand-charcoal dark:hover:text-white transition-colors"
                >
                  <Printer size={14} /> Print Document
                </button>

                <div className="flex items-center gap-3">
                  {estimate.status !== "accepted" && estimate.status !== "declined" ? (
                    <>
                      <button
                        onClick={() => setConfirmAction("reject")}
                        className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-mono uppercase font-bold rounded-sm transition-colors inline-flex items-center gap-1.5"
                      >
                        <XCircle size={14} /> Reject Estimate
                      </button>

                      <button
                        onClick={() => setConfirmAction("approve")}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono uppercase font-bold tracking-wider rounded-sm transition-colors inline-flex items-center gap-1.5 shadow-md"
                      >
                        <CheckCircle2 size={14} /> Approve Estimate
                      </button>
                    </>
                  ) : (
                    <span
                      className={`px-4 py-2 text-xs font-mono uppercase font-bold rounded-sm border ${
                        estimate.status === "accepted"
                          ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                          : "border-red-500/30 text-red-400 bg-red-500/10"
                      }`}
                    >
                      Estimate {estimate.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* APPROVAL / REJECTION CONFIRMATION MODAL */}
        {confirmAction && estimate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-[#111419] border border-brand-glass-border-light dark:border-white/[0.08] max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl rounded-sm">
              <div className="flex items-center gap-2.5 text-brand-charcoal dark:text-white">
                {confirmAction === "approve" ? (
                  <CheckCircle2 size={26} className="text-emerald-500" />
                ) : (
                  <AlertTriangle size={26} className="text-amber-500" />
                )}
                <h3 className="font-serif text-xl font-light">
                  {confirmAction === "approve" ? "Confirm Estimate Approval" : "Confirm Estimate Rejection"}
                </h3>
              </div>

              <p className="text-xs text-brand-gray leading-relaxed font-sans">
                {confirmAction === "approve"
                  ? `Are you sure you want to approve Estimate #${estimate.estimate_number} for $${estimate.total_amount?.toFixed(2)} AUD? Upon confirmation, our fabrication and site installation schedule will be locked in.`
                  : `Are you sure you want to decline Estimate #${estimate.estimate_number}? Our engineering team will review your feedback.`}
              </p>

              {confirmAction === "reject" && (
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-brand-gray font-bold">Feedback / Reason (Optional):</label>
                  <textarea
                    rows={2}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Pricing, timing, scope alteration..."
                    className="w-full p-2.5 bg-[#f8f9fa] dark:bg-black/30 border border-brand-glass-border-light dark:border-white/[0.08] text-xs text-brand-charcoal dark:text-white font-sans focus:outline-none rounded-sm"
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-brand-glass-border-light dark:border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setConfirmAction(null)}
                  className="px-4 py-2 text-xs font-mono uppercase text-brand-gray hover:text-brand-charcoal dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleEstimateAction}
                  className={`px-5 py-2 text-xs font-mono uppercase font-bold text-white rounded-sm transition-colors inline-flex items-center gap-1.5 disabled:opacity-50 ${
                    confirmAction === "approve" ? "bg-emerald-600 hover:bg-emerald-700 shadow-md" : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {actionLoading ? <Loader2 size={13} className="animate-spin" /> : null}
                  {confirmAction === "approve" ? "Confirm Approval" : "Confirm Decline"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Printable View */}
        {printableModal && estimate && (
          <DocumentPrintView
            type="estimate"
            data={estimate}
            onClose={() => setPrintableModal(false)}
          />
        )}
      </div>
    </PortalLayout>
  );
}
