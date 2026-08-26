"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Save, Loader2, Mail, Phone, MapPin, DollarSign, Calendar } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getAuthHeaders } from "@/lib/auth-client";
import { useToast } from "@/components/admin/Toast";
import { QuoteRequest } from "@/types";

const VALID_STATUSES = ["new", "contacted", "completed"];

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AdminQuoteDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { showToast } = useToast();
  const [quote, setQuote] = useState<QuoteRequest | null>(null);
  const [quoteFiles, setQuoteFiles] = useState<Array<{ id: string; file_name: string; file_size: number }>>([]);
  const [status, setStatus] = useState<string>("new");
  const [notes, setNotes] = useState<string>("");
  const [updating, setUpdating] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchQuoteDetail = async () => {
      try {
        const res = await fetch(`/api/admin/quotes/${id}`, { headers: getAuthHeaders() });
        const data = (await res.json()) as { success?: boolean; data?: QuoteRequest };
        if (isMounted && data && data.success && data.data) {
          const found = data.data;
          const foundObj = found as unknown as { quote_files?: Array<{ id: string; file_name: string; file_size: number }> };
          setQuote(found);
          setStatus(found.status || "new");
          setNotes(found.notes || "");
          if (foundObj.quote_files) setQuoteFiles(foundObj.quote_files);
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
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
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
      showToast("Network error updating quote status", "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      const res = await fetch(`/api/admin/quotes/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ notes }),
      });

      const data = (await res.json()) as { success?: boolean; error?: string };
      if (data && data.success) {
        showToast("Internal notes saved successfully", "success");
      } else {
        showToast(data?.error || "Failed to save notes", "error");
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
      <div className="space-y-8 max-w-4xl mx-auto">
        <Link
          href="/admin/quotes"
          className="inline-flex items-center gap-2 text-xs uppercase font-mono font-bold text-brand-gray hover:text-brand-charcoal dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Back to Quote Requests
        </Link>

        {loading ? (
          <div className="text-center py-12 font-mono text-xs text-brand-gray">Loading quote detail...</div>
        ) : !quote ? (
          <div className="text-center py-12 font-mono text-xs text-brand-gray">Quote request not found.</div>
        ) : (
          <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-glass-border-light dark:border-brand-glass-border-dark">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] font-mono text-brand-gray block mb-1">
                  [Quote Inspector — ID: {id}]
                </span>
                <h1 className="font-serif text-3xl font-light tracking-tight text-brand-charcoal dark:text-white">
                  {quote.name}
                </h1>
              </div>

              {/* Status Selector */}
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase font-mono text-brand-gray">Status:</span>
                <select
                  value={status}
                  aria-label="Update Quote Status"
                  disabled={updating}
                  onChange={(e) => handleStatusUpdate(e.target.value)}
                  className="px-4 py-2 bg-brand-charcoal text-white text-xs font-mono uppercase focus:outline-none border border-brand-glass-border-dark"
                >
                  {VALID_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Details Box */}
            <div className="p-8 border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div>
                  <span className="flex items-center gap-1.5 text-[10px] uppercase font-mono text-brand-gray mb-1">
                    Project Type / Service
                  </span>
                  <span className="font-serif text-lg font-light text-brand-charcoal dark:text-white">
                    {quote.project_type || quote.service || "Custom Glazing"}
                  </span>
                </div>
                <div>
                  <span className="flex items-center gap-1.5 text-[10px] uppercase font-mono text-brand-gray mb-1">
                    Customer Name
                  </span>
                  <span className="font-sans font-medium text-brand-charcoal dark:text-white">{quote.name}</span>
                </div>
                <div>
                  <span className="flex items-center gap-1.5 text-[10px] uppercase font-mono text-brand-gray mb-1">
                    <Mail size={12} /> Email Address
                  </span>
                  <a href={`mailto:${quote.email}`} className="text-brand-charcoal dark:text-white hover:underline">
                    {quote.email}
                  </a>
                </div>
                <div>
                  <span className="flex items-center gap-1.5 text-[10px] uppercase font-mono text-brand-gray mb-1">
                    <Phone size={12} /> Phone Number
                  </span>
                  <a href={`tel:${quote.phone}`} className="text-brand-charcoal dark:text-white hover:underline">
                    {quote.phone}
                  </a>
                </div>
                <div>
                  <span className="flex items-center gap-1.5 text-[10px] uppercase font-mono text-brand-gray mb-1">
                    <MapPin size={12} /> Location
                  </span>
                  <span className="text-brand-charcoal dark:text-white">
                    {quote.location || quote.suburb || "Sydney, NSW"}
                  </span>
                </div>
                <div>
                  <span className="flex items-center gap-1.5 text-[10px] uppercase font-mono text-brand-gray mb-1">
                    <DollarSign size={12} /> Estimated Budget
                  </span>
                  <span className="text-brand-charcoal dark:text-white">
                    {quote.budget || "Not specified / Flexible"}
                  </span>
                </div>
                <div>
                  <span className="flex items-center gap-1.5 text-[10px] uppercase font-mono text-brand-gray mb-1">
                    <Calendar size={12} /> Submitted At
                  </span>
                  <span className="text-brand-charcoal dark:text-white font-mono text-xs">
                    {formatDate(quote.created_at || quote.createdAt)}
                  </span>
                </div>
              </div>

              <div className="pt-6 border-t border-brand-glass-border-light dark:border-brand-glass-border-dark">
                <span className="block text-[10px] uppercase font-mono text-brand-gray mb-2">Message & Description</span>
                <p className="text-sm text-brand-gray dark:text-brand-gray-light leading-relaxed font-sans font-light bg-brand-bg/10 dark:bg-brand-charcoal/20 p-4 border border-brand-glass-border-light dark:border-brand-glass-border-dark whitespace-pre-wrap">
                  {quote.message || quote.description || "No description provided."}
                </p>
              </div>

              {/* Internal Notes Section */}
              <div className="pt-6 border-t border-brand-glass-border-light dark:border-brand-glass-border-dark space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono text-brand-gray tracking-wider">
                    Internal Staff Notes
                  </span>
                  <button
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-charcoal text-white dark:bg-white dark:text-brand-charcoal text-xs font-mono uppercase font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {savingNotes ? (
                      <>
                        <Loader2 size={12} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={12} />
                        Save Notes
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record customer communication, estimate details, installation schedule..."
                  className="w-full p-3 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs text-brand-charcoal dark:text-white focus:outline-none font-sans"
                />
              </div>

              {/* Private File Attachments */}
              {quoteFiles.length > 0 && (
                <div className="pt-6 border-t border-brand-glass-border-light dark:border-brand-glass-border-dark space-y-3">
                  <span className="block text-[10px] uppercase font-mono text-brand-gray">
                    Attached Private Files ({quoteFiles.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {quoteFiles.map((f) => (
                      <a
                        key={f.id}
                        href={`/api/admin/files/${f.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 border border-brand-glass-border-light dark:border-brand-glass-border-dark hover:border-brand-charcoal dark:hover:border-white transition-colors bg-brand-bg/5 dark:bg-brand-charcoal/5 text-xs font-mono text-brand-charcoal dark:text-white"
                      >
                        <span className="truncate">{f.file_name}</span>
                        <Download size={14} className="text-brand-gray flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

