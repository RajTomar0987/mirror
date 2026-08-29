"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Eye,
  Calendar,
  Loader2,
  Search,
  Filter,
  Download,
  MessageSquare,
  Printer,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { getAuthHeaders } from "@/lib/auth-client";
import { QuoteRequest } from "@/types";
import { DocumentPrintView } from "@/components/admin/DocumentPrintView";

const STATUS_BADGE_STYLES: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  contacted: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  reviewing: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  in_review: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  site_visit: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
  estimate_sent: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  accepted: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  declined: "bg-red-500/10 text-red-400 border-red-500/30",
  rejected: "bg-red-500/10 text-red-400 border-red-500/30",
  closed: "bg-gray-500/10 text-gray-400 border-gray-500/30",
};

export default function MyQuotesPage() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [serviceFilter, setServiceFilter] = useState("All");
  const [sortNewest, setSortNewest] = useState(true);

  // Printable View
  const [previewQuote, setPreviewQuote] = useState<QuoteRequest | null>(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/portal/quotes", { headers: getAuthHeaders() });
        const data = (await res.json()) as { success?: boolean; data?: QuoteRequest[] };
        if (data && data.success && data.data) {
          setQuotes(data.data);
        }
      } catch (err) {
        console.error("Error loading customer quotes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, []);

  // Filtered & Sorted Quotes
  const filteredQuotes = useMemo(() => {
    return quotes
      .filter((q) => {
        const matchesSearch =
          (q.service || "").toLowerCase().includes(search.toLowerCase()) ||
          (q.message || "").toLowerCase().includes(search.toLowerCase()) ||
          (q.id || "").toLowerCase().includes(search.toLowerCase());

        const qStatus = (q.status || "new").toLowerCase();
        const matchesStatus =
          statusFilter === "All" ||
          qStatus === statusFilter.toLowerCase() ||
          (statusFilter === "Pending" && (qStatus === "new" || qStatus === "contacted" || qStatus === "in_review"));

        const matchesService =
          serviceFilter === "All" || (q.service || q.project_type || "").toLowerCase().includes(serviceFilter.toLowerCase());

        return matchesSearch && matchesStatus && matchesService;
      })
      .sort((a, b) => {
        const dateA = new Date(a.created_at || a.createdAt || 0).getTime();
        const dateB = new Date(b.created_at || b.createdAt || 0).getTime();
        return sortNewest ? dateB - dateA : dateA - dateB;
      });
  }, [quotes, search, statusFilter, serviceFilter, sortNewest]);

  // Statistics
  const stats = useMemo(() => {
    const total = quotes.length;
    const pending = quotes.filter((q) => !q.status || q.status === "new" || q.status === "contacted").length;
    const inReview = quotes.filter((q) => q.status === "in_review" || q.status === "reviewing" || q.status === "site_visit").length;
    const approved = quotes.filter((q) => q.status === "approved" || q.status === "accepted" || q.status === "completed").length;
    return { total, pending, inReview, approved };
  }, [quotes]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Recent";
    try {
      return new Date(dateStr).toLocaleDateString("en-AU", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-glass-border-light dark:border-white/[0.08]">
          <div>
            <span className="text-xs uppercase tracking-widest font-mono text-blue-500 block mb-1">
              [Commercial Quotes Pipeline]
            </span>
            <h1 className="font-serif text-3xl font-light tracking-tight text-brand-charcoal dark:text-white">
              MY QUOTE REQUESTS
            </h1>
          </div>

          <Link
            href="/quote"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-sm transition-colors shadow-sm"
          >
            <Plus size={14} /> Request New Quote
          </Link>
        </div>

        {/* 4 Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-4 bg-white dark:bg-[#0f1217] border border-brand-glass-border-light dark:border-white/[0.08] rounded-sm">
            <span className="text-[10px] uppercase font-mono text-brand-gray block mb-1">Total Quotes</span>
            <span className="font-serif text-2xl font-light text-brand-charcoal dark:text-white">{stats.total}</span>
          </div>

          <div className="p-4 bg-white dark:bg-[#0f1217] border border-brand-glass-border-light dark:border-white/[0.08] rounded-sm">
            <span className="text-[10px] uppercase font-mono text-blue-400 block mb-1">Pending</span>
            <span className="font-serif text-2xl font-light text-blue-400">{stats.pending}</span>
          </div>

          <div className="p-4 bg-white dark:bg-[#0f1217] border border-brand-glass-border-light dark:border-white/[0.08] rounded-sm">
            <span className="text-[10px] uppercase font-mono text-purple-400 block mb-1">In Review</span>
            <span className="font-serif text-2xl font-light text-purple-400">{stats.inReview}</span>
          </div>

          <div className="p-4 bg-white dark:bg-[#0f1217] border border-brand-glass-border-light dark:border-white/[0.08] rounded-sm">
            <span className="text-[10px] uppercase font-mono text-emerald-400 block mb-1">Approved</span>
            <span className="font-serif text-2xl font-light text-emerald-400">{stats.approved}</span>
          </div>
        </div>

        {/* Top Filters Bar */}
        <div className="p-4 bg-white dark:bg-[#0f1217] border border-brand-glass-border-light dark:border-white/[0.08] rounded-sm grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
          <div className="sm:col-span-4 relative">
            <Search size={14} className="absolute left-3 top-3 text-brand-gray" />
            <input
              type="text"
              placeholder="Search quotes by service, description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#f8f9fa] dark:bg-black/30 border border-brand-glass-border-light dark:border-white/[0.05] text-xs text-brand-charcoal dark:text-white font-sans focus:outline-none focus:border-blue-500 rounded-sm"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 bg-[#f8f9fa] dark:bg-black/30 border border-brand-glass-border-light dark:border-white/[0.05] text-xs font-mono text-brand-charcoal dark:text-white rounded-sm focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="in_review">In Review</option>
              <option value="estimate_sent">Estimate Sent</option>
              <option value="approved">Approved</option>
              <option value="completed">Completed</option>
              <option value="declined">Rejected / Declined</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="w-full p-2 bg-[#f8f9fa] dark:bg-black/30 border border-brand-glass-border-light dark:border-white/[0.05] text-xs font-mono text-brand-charcoal dark:text-white rounded-sm focus:outline-none"
            >
              <option value="All">All Services</option>
              <option value="Balustrades">Frameless Balustrades</option>
              <option value="Pool Fencing">Glass Pool Fencing</option>
              <option value="Shower Screens">Custom Shower Screens</option>
              <option value="Commercial">Commercial Shopfronts</option>
              <option value="Canopy">Glass Canopies & Roofs</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <button
              onClick={() => setSortNewest(!sortNewest)}
              className="w-full py-2 px-3 border border-brand-glass-border-light dark:border-white/[0.05] bg-[#f8f9fa] dark:bg-black/30 text-xs font-mono text-brand-gray hover:text-brand-charcoal dark:hover:text-white rounded-sm transition-colors"
            >
              {sortNewest ? "Newest First" : "Oldest First"}
            </button>
          </div>
        </div>

        {/* Quotes Table */}
        <div className="border border-brand-glass-border-light dark:border-white/[0.08] bg-white dark:bg-[#0f1217] rounded-sm overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center text-brand-gray font-mono text-xs gap-3">
              <Loader2 size={24} className="animate-spin text-blue-500" />
              <span>Fetching quote requests...</span>
            </div>
          ) : filteredQuotes.length === 0 ? (
            <div className="py-24 text-center space-y-3">
              <FileText size={32} className="text-brand-gray mx-auto" />
              <p className="text-sm font-serif text-brand-charcoal dark:text-white">
                No quote requests matched your criteria.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                  setServiceFilter("All");
                }}
                className="text-xs font-mono text-blue-500 hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-brand-glass-border-light dark:border-white/[0.08] text-[10px] uppercase font-mono text-brand-gray bg-[#f8f9fa] dark:bg-black/30">
                    <th className="py-3.5 px-4">Quote ID</th>
                    <th className="py-3.5 px-4">Service</th>
                    <th className="py-3.5 px-4">Project / Scope</th>
                    <th className="py-3.5 px-4">Submitted</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 font-mono">Amount</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-glass-border-light dark:divide-white/[0.05]">
                  {filteredQuotes.map((q, idx) => {
                    const statusKey = (q.status || "new").toLowerCase();
                    const badge = STATUS_BADGE_STYLES[statusKey] || STATUS_BADGE_STYLES.new;
                    const displayId = q.id || `QT-2026-0${idx + 1}`;

                    return (
                      <tr
                        key={q.id || idx}
                        className="hover:bg-[#f7f8f9] dark:hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="py-4 px-4 font-mono font-bold text-brand-charcoal dark:text-white">
                          {displayId.slice(0, 11)}
                        </td>
                        <td className="py-4 px-4 font-semibold text-brand-charcoal dark:text-white">
                          {q.service || q.project_type || "Custom Glazing"}
                        </td>
                        <td className="py-4 px-4 text-brand-gray text-xs max-w-xs truncate">
                          {q.message || q.description || "—"}
                        </td>
                        <td className="py-4 px-4 font-mono text-brand-gray text-[11px]">
                          {formatDate(q.created_at || q.createdAt)}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-block text-[10px] uppercase font-mono px-2.5 py-1 border rounded-sm font-bold ${badge}`}
                          >
                            {statusKey.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-mono text-brand-charcoal dark:text-white">
                          ${q.estimated_value ? q.estimated_value.toLocaleString() : q.budget || "Flexible"}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            <Link
                              href={`/portal/quotes/${q.id}`}
                              className="px-2.5 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 text-[10px] font-mono uppercase font-bold rounded-sm transition-colors"
                            >
                              View
                            </Link>
                            <button
                              onClick={() => setPreviewQuote(q)}
                              className="p-1.5 text-brand-gray hover:text-brand-charcoal dark:hover:text-white rounded-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                              title="Print / Save Specification"
                            >
                              <Download size={14} />
                            </button>
                            <Link
                              href="/portal/messages"
                              className="p-1.5 text-brand-gray hover:text-brand-charcoal dark:hover:text-white rounded-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                              title="Message Staff"
                            >
                              <MessageSquare size={14} />
                            </Link>
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
        {previewQuote && (
          <DocumentPrintView
            type="quote"
            data={previewQuote}
            onClose={() => setPreviewQuote(null)}
          />
        )}
      </div>
    </PortalLayout>
  );
}
