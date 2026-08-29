"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Save,
  Loader2,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Calendar,
  Calculator,
  Printer,
  Archive,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Layers,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getAuthHeaders } from "@/lib/auth-client";
import { useToast } from "@/components/admin/Toast";
import { QuoteRequest } from "@/types";
import { DocumentPrintView } from "@/components/admin/DocumentPrintView";

const VALID_STATUSES = [
  "new",
  "reviewing",
  "contacted",
  "site_visit",
  "estimate_sent",
  "accepted",
  "completed",
  "closed",
];

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AdminQuoteDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { showToast } = useToast();
  const [quote, setQuote] = useState<QuoteRequest | null>(null);
  const [status, setStatus] = useState<string>("new");
  const [notes, setNotes] = useState<string>("");
  const [measurements, setMeasurements] = useState<string>("");
  const [estimatedValue, setEstimatedValue] = useState<string>("");
  const [updating, setUpdating] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPrintModal, setShowPrintModal] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchQuoteDetail = async () => {
      try {
        const res = await fetch(`/api/admin/quotes/${id}`, { headers: getAuthHeaders() });
        const data = (await res.json()) as { success?: boolean; data?: QuoteRequest };
        if (isMounted && data && data.success && data.data) {
          const found = data.data as QuoteRequest;
          setQuote(found);
          setStatus(found.status || "new");
          setNotes(found.notes || "");
          setMeasurements(found.measurements || "");
          setEstimatedValue(found.estimated_value ? String(found.estimated_value) : "");
        }
      } catch (err) {
        console.error("Quote detail error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchQuoteDetail();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleStatusUpdate = async (newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/quotes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (data && data.success) {
        setStatus(newStatus);
        showToast(`Quote status updated to "${newStatus.replace("_", " ")}"`, "success");
      } else {
        showToast(data?.error || "Failed to update status", "error");
      }
    } catch {
      showToast("Network error updating status", "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveNotesAndSpecs = async () => {
    setSavingNotes(true);
    try {
      const res = await fetch(`/api/admin/quotes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({
          notes,
          measurements,
          estimated_value: Number(estimatedValue) || 0,
        }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (data && data.success) {
        showToast("Quote specifications & staff notes saved", "success");
      } else {
        showToast(data?.error || "Failed to save details", "error");
      }
    } catch {
      showToast("Network error saving notes", "error");
    } finally {
      setSavingNotes(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Just now";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-AU", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <Link
            href="/admin/quotes"
            className="inline-flex items-center gap-2 text-xs uppercase font-mono font-bold text-brand-gray hover:text-brand-charcoal dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Back to Quote Pipeline
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPrintModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs font-mono text-brand-gray hover:text-brand-charcoal dark:hover:text-white transition-colors"
            >
              <Printer size={13} /> Print Spec Sheet
            </button>

            {quote && (
              <Link
                href={`/admin/estimates?quoteId=${quote.id}&customerName=${encodeURIComponent(quote.name)}&customerEmail=${encodeURIComponent(quote.email)}&customerPhone=${encodeURIComponent(quote.phone)}&service=${encodeURIComponent(quote.service || quote.project_type || "Custom Glazing")}&measurements=${encodeURIComponent(measurements)}`}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-mono font-bold uppercase rounded-sm transition-colors"
              >
                <Calculator size={13} /> Create Estimate
              </Link>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 font-mono text-xs text-brand-gray">Loading quote detail...</div>
        ) : !quote ? (
          <div className="text-center py-20 font-mono text-xs text-brand-gray">Quote request not found.</div>
        ) : (
          <div className="space-y-6">
            {/* Header Card */}
            <div className="p-6 border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-brand-gray block mb-1">
                  [Quote Specification — #{quote.id}]
                </span>
                <h1 className="font-serif text-3xl font-light text-brand-charcoal dark:text-white">
                  {quote.name}
                </h1>
                <span className="text-xs font-mono text-brand-gray">
                  Submitted {formatDate(quote.created_at || quote.createdAt)}
                </span>
              </div>

              {/* Status Select */}
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase font-mono text-brand-gray">Pipeline Stage:</span>
                <select
                  value={status}
                  disabled={updating}
                  onChange={(e) => handleStatusUpdate(e.target.value)}
                  className="px-4 py-2 bg-brand-charcoal text-white text-xs font-mono uppercase focus:outline-none border border-brand-glass-border-dark font-bold"
                >
                  {VALID_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 2-Column Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Section 1: Customer Profile */}
              <div className="p-6 border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark space-y-4">
                <h2 className="text-xs uppercase tracking-widest font-mono text-brand-gray border-b border-brand-glass-border-light dark:border-brand-glass-border-dark pb-2">
                  1. Customer Profile
                </h2>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-brand-gray block">Full Name</span>
                    <span className="font-bold text-sm text-brand-charcoal dark:text-white">{quote.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-brand-gray block">Email Address</span>
                    <a href={`mailto:${quote.email}`} className="text-blue-500 hover:underline flex items-center gap-1">
                      <Mail size={12} /> {quote.email}
                    </a>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-brand-gray block">Phone Contact</span>
                    <a href={`tel:${quote.phone}`} className="text-brand-charcoal dark:text-white font-mono hover:underline flex items-center gap-1">
                      <Phone size={12} /> {quote.phone}
                    </a>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-brand-gray block">Location / Suburb</span>
                    <span className="text-brand-charcoal dark:text-white flex items-center gap-1">
                      <MapPin size={12} /> {quote.location || quote.suburb || "Sydney, NSW"}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-brand-glass-border-light dark:border-brand-glass-border-dark flex gap-2">
                  <a
                    href={`mailto:${quote.email}?subject=Complete Glass Innovations - Quote Enquiry #${quote.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-black/5 dark:bg-white/5 hover:bg-black/10 text-xs font-mono uppercase text-brand-charcoal dark:text-white"
                  >
                    <Mail size={12} /> Email Client
                  </a>
                  <a
                    href={`tel:${quote.phone}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-black/5 dark:bg-white/5 hover:bg-black/10 text-xs font-mono uppercase text-brand-charcoal dark:text-white"
                  >
                    <Phone size={12} /> Call Client
                  </a>
                </div>
              </div>

              {/* Section 2: Glazing Scope & Specifications */}
              <div className="p-6 border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark space-y-4">
                <h2 className="text-xs uppercase tracking-widest font-mono text-brand-gray border-b border-brand-glass-border-light dark:border-brand-glass-border-dark pb-2">
                  2. Glazing Scope & Measurements
                </h2>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-brand-gray block">Service Requested</span>
                    <span className="font-serif text-lg font-light text-brand-charcoal dark:text-white">
                      {quote.service || quote.project_type || "Custom Glazing"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-brand-gray block">Indicative Budget</span>
                    <span className="font-mono text-brand-charcoal dark:text-white">
                      {quote.budget || "Flexible / Not specified"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-brand-gray block">Estimated Value (AUD)</span>
                    <div className="relative mt-1">
                      <DollarSign size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray" />
                      <input
                        type="number"
                        value={estimatedValue}
                        onChange={(e) => setEstimatedValue(e.target.value)}
                        placeholder="e.g. 8500"
                        className="w-full pl-8 pr-3 py-1.5 bg-[#f8f8f6] dark:bg-black/30 border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs font-mono text-brand-charcoal dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scope Message & Measurements Editor */}
            <div className="p-6 border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark space-y-4">
              <h2 className="text-xs uppercase tracking-widest font-mono text-brand-gray border-b border-brand-glass-border-light dark:border-brand-glass-border-dark pb-2">
                3. Customer Requirements & Laser Measurements
              </h2>

              <div>
                <span className="text-[10px] uppercase font-mono text-brand-gray block mb-1">Customer Description:</span>
                <p className="p-4 bg-[#f8f8f6] dark:bg-black/20 border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs leading-relaxed text-brand-charcoal dark:text-brand-gray-light whitespace-pre-wrap">
                  {quote.message || quote.description || "No specific details provided."}
                </p>
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-brand-gray block mb-1">
                  Structural Measurements & Engineering Specs (AS1288):
                </label>
                <textarea
                  rows={2}
                  value={measurements}
                  onChange={(e) => setMeasurements(e.target.value)}
                  placeholder="e.g. 14 linear meters balustrade, 1200mm height, 12mm toughened clear glass, 28 Duplex 2205 spigots"
                  className="w-full p-3 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs font-mono text-brand-charcoal dark:text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Internal Staff Notes */}
            <div className="p-6 border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark space-y-4">
              <div className="flex items-center justify-between border-b border-brand-glass-border-light dark:border-brand-glass-border-dark pb-2">
                <h2 className="text-xs uppercase tracking-widest font-mono text-brand-gray">
                  4. Staff Communication Log & Internal Notes
                </h2>
                <button
                  onClick={handleSaveNotesAndSpecs}
                  disabled={savingNotes}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-brand-charcoal text-white dark:bg-white dark:text-brand-charcoal text-xs font-mono uppercase font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {savingNotes ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                  Save All Changes
                </button>
              </div>

              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Log internal consultation notes, structural substrate notes, installer dispatch notes..."
                className="w-full p-3 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs text-brand-charcoal dark:text-white focus:outline-none font-sans"
              />
            </div>
          </div>
        )}

        {/* Printable View Modal */}
        {showPrintModal && quote && (
          <DocumentPrintView
            type="quote"
            data={quote}
            onClose={() => setShowPrintModal(false)}
          />
        )}
      </div>
    </AdminLayout>
  );
}
