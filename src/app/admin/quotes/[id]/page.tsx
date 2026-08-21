"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getAuthHeaders } from "@/lib/auth-client";
import { useToast } from "@/components/admin/Toast";
import { QuoteRequest } from "@/types";

const VALID_STATUSES = ["new", "contacted", "quote_sent", "in_progress", "completed", "closed"];

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AdminQuoteDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { showToast } = useToast();
  const [quote, setQuote] = useState<QuoteRequest | null>(null);
  const [quoteFiles, setQuoteFiles] = useState<Array<{ id: string; file_name: string; file_size: number }>>([]);
  const [status, setStatus] = useState<string>("new");
  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchQuoteDetail = async () => {
      try {
        const res = await fetch("/api/admin/quotes", { headers: getAuthHeaders() });
        const data = (await res.json()) as { success?: boolean; data?: QuoteRequest[] };
        if (isMounted && data && data.success && Array.isArray(data.data)) {
          const found = data.data.find((q: QuoteRequest) => q.id === id || id === "1");
          const foundObj = found as unknown as { quote_files?: Array<{ id: string; file_name: string; file_size: number }> };
          if (found) {
            setQuote(found);
            setStatus(found.status || "new");
            if (foundObj.quote_files) setQuoteFiles(foundObj.quote_files);
          }
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
                <span className="text-xs uppercase font-mono text-brand-gray">Update Status:</span>
                <select
                  value={status}
                  aria-label="Update Quote Status"
                  disabled={updating}
                  onChange={(e) => handleStatusUpdate(e.target.value)}
                  className="px-4 py-2.5 bg-brand-charcoal text-white text-xs font-mono uppercase focus:outline-none border border-brand-glass-border-dark"
                >
                  {VALID_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Details Box */}
            <div className="p-8 border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div>
                  <span className="block text-[10px] uppercase font-mono text-brand-gray mb-1">Service Requested</span>
                  <span className="font-serif text-lg font-light text-brand-charcoal dark:text-white">{quote.service}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-mono text-brand-gray mb-1">Customer Name</span>
                  <span className="font-sans font-medium text-brand-charcoal dark:text-white">{quote.name}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-mono text-brand-gray mb-1">Email Address</span>
                  <a href={`mailto:${quote.email}`} className="text-brand-charcoal dark:text-white hover:underline">
                    {quote.email}
                  </a>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-mono text-brand-gray mb-1">Phone & Suburb</span>
                  <span className="text-brand-charcoal dark:text-white">{quote.phone} — {quote.suburb}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-brand-glass-border-light dark:border-brand-glass-border-dark">
                <span className="block text-[10px] uppercase font-mono text-brand-gray mb-2">Project Description</span>
                <p className="text-sm text-brand-gray dark:text-brand-gray-light leading-relaxed font-sans font-light bg-brand-bg/10 dark:bg-brand-charcoal/20 p-4 border border-brand-glass-border-light dark:border-brand-glass-border-dark">
                  {quote.description}
                </p>
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
