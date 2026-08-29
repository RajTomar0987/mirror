"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Filter,
  FileText,
  Clock,
  CheckCircle2,
  PhoneCall,
  Eye,
  Trash2,
  X,
  Save,
  Loader2,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Calendar,
  AlertTriangle,
  Calculator,
  Archive,
  ArrowUpRight,
  Send,
  UserCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getAuthHeaders, getAuthUser, AuthUser } from "@/lib/auth-client";
import { useToast } from "@/components/admin/Toast";
import { QuoteRequest, QuoteStatus } from "@/types";

const PIPELINE_STAGES: Array<{ key: string; label: string; countKey?: string }> = [
  { key: "All", label: "All Quotes" },
  { key: "new", label: "New" },
  { key: "reviewing", label: "Reviewing" },
  { key: "contacted", label: "Contacted" },
  { key: "site_visit", label: "Site Visit" },
  { key: "estimate_sent", label: "Estimate Sent" },
  { key: "accepted", label: "Accepted" },
  { key: "completed", label: "Completed" },
  { key: "closed", label: "Closed" },
  { key: "archived", label: "Archived" },
];

const SERVICE_OPTIONS = [
  "All",
  "Glass Balustrades",
  "Frameless Glass",
  "Shower Screens",
  "Glass Pool Fencing",
  "Glass Splashbacks",
  "Custom Mirrors",
  "Window Repairs & Glazing",
  "Pet Doors in Glass",
];

const STATUS_BADGE_STYLES: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  reviewing: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
  contacted: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  site_visit: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  estimate_sent: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  accepted: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  closed: "bg-gray-500/10 text-gray-400 border-gray-500/30",
  archived: "bg-zinc-800 text-zinc-400 border-zinc-700",
};

export default function AdminQuotesPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [search, setSearch] = useState("");
  const [activeStage, setActiveStage] = useState("All");
  const [serviceFilter, setServiceFilter] = useState("All");
  const [sortNewest, setSortNewest] = useState(true);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Selected quote for detail drawer / modal
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [modalNotes, setModalNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [quoteToDelete, setQuoteToDelete] = useState<QuoteRequest | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/quotes", { headers: getAuthHeaders() });
      if (res.status === 401 || res.status === 403) {
        router.replace("/admin/login");
        return;
      }
      const data = (await res.json()) as { success?: boolean; data?: QuoteRequest[]; error?: string };
      if (data && data.success && Array.isArray(data.data)) {
        setQuotes(data.data);
      }
    } catch (err) {
      console.error("Quotes fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleUpdateStatus = async (quoteId: string, newStatus: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActionLoading(`${quoteId}-${newStatus}`);
    try {
      const res = await fetch(`/api/admin/quotes/${quoteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (data && data.success) {
        setQuotes((prev) =>
          prev.map((q) => (q.id === quoteId ? { ...q, status: newStatus } : q))
        );
        if (selectedQuote && selectedQuote.id === quoteId) {
          setSelectedQuote((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
        showToast(`Quote moved to "${newStatus.replace("_", " ")}"`, "success");
      } else {
        showToast(data?.error || "Failed to update status", "error");
      }
    } catch {
      showToast("Network error updating quote status", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleArchive = async (quoteId: string, archived: boolean, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActionLoading(`${quoteId}-archive`);
    try {
      const res = await fetch(`/api/admin/quotes/${quoteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ archived }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (data && data.success) {
        setQuotes((prev) =>
          prev.map((q) => (q.id === quoteId ? { ...q, archived } : q))
        );
        showToast(archived ? "Quote archived" : "Quote unarchived", "success");
        if (selectedQuote && selectedQuote.id === quoteId) {
          setSelectedQuote((prev) => (prev ? { ...prev, archived } : null));
        }
      }
    } catch {
      showToast("Error updating archive status", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedQuote?.id) return;
    setSavingNotes(true);
    try {
      const res = await fetch(`/api/admin/quotes/${selectedQuote.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ notes: modalNotes }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (data && data.success) {
        setQuotes((prev) =>
          prev.map((q) => (q.id === selectedQuote.id ? { ...q, notes: modalNotes } : q))
        );
        setSelectedQuote((prev) => (prev ? { ...prev, notes: modalNotes } : null));
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

  const handleDeleteQuote = async () => {
    if (!quoteToDelete?.id) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/quotes/${quoteToDelete.id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (data && data.success) {
        setQuotes((prev) => prev.filter((q) => q.id !== quoteToDelete.id));
        if (selectedQuote?.id === quoteToDelete.id) {
          setSelectedQuote(null);
        }
        showToast("Quote permanently deleted", "success");
        setQuoteToDelete(null);
      }
    } catch {
      showToast("Network error deleting quote", "error");
    } finally {
      setDeleting(false);
    }
  };

  const openQuoteDetail = (quote: QuoteRequest) => {
    setSelectedQuote(quote);
    setModalNotes(quote.notes || "");
  };

  // Filter and sort quotes
  const filteredQuotes = useMemo(() => {
    return quotes
      .filter((q) => {
        const name = q.name || "";
        const email = q.email || "";
        const phone = q.phone || "";
        const service = q.service || q.project_type || "";
        const location = q.location || q.suburb || "";
        const qStatus = q.status || "new";

        const matchesSearch =
          name.toLowerCase().includes(search.toLowerCase()) ||
          email.toLowerCase().includes(search.toLowerCase()) ||
          phone.toLowerCase().includes(search.toLowerCase()) ||
          service.toLowerCase().includes(search.toLowerCase()) ||
          location.toLowerCase().includes(search.toLowerCase());

        let matchesStage = true;
        if (activeStage === "archived") {
          matchesStage = !!q.archived;
        } else if (activeStage !== "All") {
          matchesStage = !q.archived && qStatus === activeStage;
        } else {
          // If All, default show non-archived unless archived stage selected
          matchesStage = !q.archived;
        }

        const matchesService =
          serviceFilter === "All" ||
          service.toLowerCase().includes(serviceFilter.toLowerCase());

        return matchesSearch && matchesStage && matchesService;
      })
      .sort((a, b) => {
        const dateA = new Date(a.created_at || a.createdAt || 0).getTime();
        const dateB = new Date(b.created_at || b.createdAt || 0).getTime();
        return sortNewest ? dateB - dateA : dateA - dateB;
      });
  }, [quotes, search, activeStage, serviceFilter, sortNewest]);

  // Paginated quotes
  const totalPages = Math.max(1, Math.ceil(filteredQuotes.length / pageSize));
  const paginatedQuotes = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredQuotes.slice(start, start + pageSize);
  }, [filteredQuotes, currentPage]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Just now";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-AU", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-glass-border-light dark:border-brand-glass-border-dark">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-mono text-brand-gray block mb-1">
              [Sales Lead Management]
            </span>
            <h1 className="font-serif text-3xl font-light tracking-tight text-brand-charcoal dark:text-white">
              QUOTE PIPELINE
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/estimates"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-charcoal dark:bg-white text-white dark:text-brand-charcoal text-xs font-mono font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              <Calculator size={14} /> Create Estimate
            </Link>
          </div>
        </div>

        {/* Visual Pipeline Stage Tabs */}
        <div className="overflow-x-auto pb-1">
          <div className="flex border-b border-brand-glass-border-light dark:border-brand-glass-border-dark gap-1 min-w-max">
            {PIPELINE_STAGES.map((stage) => {
              const count =
                stage.key === "All"
                  ? quotes.filter((q) => !q.archived).length
                  : stage.key === "archived"
                  ? quotes.filter((q) => q.archived).length
                  : quotes.filter((q) => !q.archived && (q.status || "new") === stage.key).length;

              const isActive = activeStage === stage.key;

              return (
                <button
                  key={stage.key}
                  onClick={() => {
                    setActiveStage(stage.key);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-mono uppercase tracking-wider border-b-2 transition-all duration-150 ${
                    isActive
                      ? "border-brand-charcoal dark:border-white text-brand-charcoal dark:text-white font-bold"
                      : "border-transparent text-brand-gray hover:text-brand-charcoal dark:hover:text-white"
                  }`}
                >
                  <span>{stage.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive
                        ? "bg-brand-charcoal text-white dark:bg-white dark:text-brand-charcoal"
                        : "bg-black/5 dark:bg-white/10 text-brand-gray"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="relative sm:col-span-6">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by customer name, email, phone, location..."
              className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs text-brand-charcoal dark:text-white focus:outline-none font-sans"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={serviceFilter}
              onChange={(e) => {
                setServiceFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2.5 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs font-mono text-brand-charcoal dark:text-white focus:outline-none"
              aria-label="Filter by service"
            >
              {SERVICE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === "All" ? "All Services" : opt}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 flex justify-end">
            <button
              onClick={() => setSortNewest(!sortNewest)}
              className="w-full px-3 py-2.5 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs font-mono text-brand-gray hover:text-brand-charcoal dark:hover:text-white transition-colors flex items-center justify-center gap-1.5"
            >
              <Calendar size={13} />
              {sortNewest ? "Newest First" : "Oldest First"}
            </button>
          </div>
        </div>

        {/* Quotes Table */}
        <div className="border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark overflow-hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-brand-gray font-mono text-xs gap-3">
              <Loader2 size={24} className="animate-spin" />
              <span>Loading quotes pipeline...</span>
            </div>
          ) : filteredQuotes.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-brand-gray font-mono text-xs gap-2">
              <FileText size={28} />
              <span>No quote requests match your filter.</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-brand-glass-border-light dark:border-brand-glass-border-dark text-[10px] uppercase font-mono text-brand-gray bg-[#fbfbfa] dark:bg-black/20">
                    <th className="py-3.5 px-4">Quote ID</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4 hidden md:table-cell">Contact (Email / Phone)</th>
                    <th className="py-3.5 px-4">Service</th>
                    <th className="py-3.5 px-4 hidden lg:table-cell">Message Scope</th>
                    <th className="py-3.5 px-4 hidden sm:table-cell">Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-glass-border-light dark:divide-brand-glass-border-dark">
                  {paginatedQuotes.map((q, idx) => {
                    const currentStatus = q.status || "new";
                    const displayId = q.id || `#${idx + 1}`;
                    const badgeClass = STATUS_BADGE_STYLES[currentStatus] || STATUS_BADGE_STYLES.new;

                    return (
                      <tr
                        key={q.id || q.email}
                        onClick={() => openQuoteDetail(q)}
                        className="hover:bg-[#f7f7f5] dark:hover:bg-white/[0.02] cursor-pointer transition-colors"
                      >
                        <td className="py-4 px-4 font-mono text-brand-gray text-[11px]">
                          {displayId.slice(0, 10)}
                        </td>
                        <td className="py-4 px-4 font-medium text-brand-charcoal dark:text-white">
                          <span className="font-semibold block">{q.name}</span>
                          <span className="text-[10px] text-brand-gray font-mono md:hidden">{q.email}</span>
                        </td>
                        <td className="py-4 px-4 text-brand-gray font-mono text-xs hidden md:table-cell">
                          <div>
                            <span className="block text-brand-charcoal dark:text-white">{q.email}</span>
                            <span className="text-[11px] text-brand-gray">{q.phone}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-brand-gray dark:text-brand-gray-light">
                          {q.service || q.project_type || "Custom Glazing"}
                        </td>
                        <td className="py-4 px-4 text-brand-gray text-xs max-w-xs truncate hidden lg:table-cell">
                          {q.message || q.description || "—"}
                        </td>
                        <td className="py-4 px-4 text-brand-gray font-mono text-[11px] hidden sm:table-cell">
                          {formatDate(q.created_at || q.createdAt)}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-block text-[10px] uppercase font-mono px-2.5 py-1 border rounded-sm font-bold ${badgeClass}`}>
                            {currentStatus.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div
                            className="inline-flex items-center gap-1.5 justify-end"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => openQuoteDetail(q)}
                              className="px-2 py-1 bg-black/5 dark:bg-white/5 hover:bg-black/10 text-brand-charcoal dark:text-white text-[10px] font-mono uppercase font-bold transition-colors"
                              title="View Quote Details"
                            >
                              View
                            </button>

                            {currentStatus !== "contacted" && currentStatus !== "completed" && (
                              <button
                                onClick={(e) => handleUpdateStatus(q.id || "", "contacted", e)}
                                disabled={actionLoading === `${q.id}-contacted`}
                                className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 text-[10px] font-mono uppercase font-bold transition-colors disabled:opacity-50"
                                title="Mark Contacted"
                              >
                                Contacted
                              </button>
                            )}

                            {currentStatus !== "completed" && (
                              <button
                                onClick={(e) => handleUpdateStatus(q.id || "", "completed", e)}
                                disabled={actionLoading === `${q.id}-completed`}
                                className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 text-[10px] font-mono uppercase font-bold transition-colors disabled:opacity-50"
                                title="Mark Completed"
                              >
                                Completed
                              </button>
                            )}

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setQuoteToDelete(q);
                              }}
                              className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-500/10 rounded-sm transition-colors"
                              title="Delete Quote"
                            >
                              <Trash2 size={14} />
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

          {/* Pagination Bar */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-brand-glass-border-light dark:border-brand-glass-border-dark flex items-center justify-between text-xs font-mono">
              <span className="text-brand-gray">
                Showing page {currentPage} of {totalPages} ({filteredQuotes.length} total)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 border border-brand-glass-border-light dark:border-brand-glass-border-dark disabled:opacity-30 hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 border border-brand-glass-border-light dark:border-brand-glass-border-dark disabled:opacity-30 hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* QUOTE DETAIL MODAL */}
        {selectedQuote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-brand-glass-border-light dark:border-brand-glass-border-dark">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-mono text-brand-gray block">
                    [Quote Inspector — ID: {selectedQuote.id}]
                  </span>
                  <h2 className="font-serif text-2xl font-light text-brand-charcoal dark:text-white">
                    {selectedQuote.name}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedQuote(null)}
                  className="p-2 text-brand-gray hover:text-brand-charcoal dark:hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Status Selector Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#f8f8f6] dark:bg-black/30 border border-brand-glass-border-light dark:border-brand-glass-border-dark">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-mono text-brand-gray">Stage:</span>
                  <select
                    value={selectedQuote.status || "new"}
                    onChange={(e) => handleUpdateStatus(selectedQuote.id || "", e.target.value)}
                    className="px-3 py-1.5 bg-brand-charcoal text-white text-xs font-mono uppercase focus:outline-none border border-brand-glass-border-dark"
                  >
                    {PIPELINE_STAGES.filter((s) => s.key !== "All" && s.key !== "archived").map((st) => (
                      <option key={st.key} value={st.key}>
                        {st.label}
                      </option>
                    ))}
                  </select>
                </div>

                <Link
                  href={`/admin/estimates?quoteId=${selectedQuote.id}&customerName=${encodeURIComponent(selectedQuote.name)}&customerEmail=${encodeURIComponent(selectedQuote.email)}&customerPhone=${encodeURIComponent(selectedQuote.phone)}&service=${encodeURIComponent(selectedQuote.service || selectedQuote.project_type || "Custom Glazing")}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white text-xs font-mono font-bold uppercase hover:bg-purple-700 transition-colors"
                >
                  <Calculator size={13} /> Create Estimate
                </Link>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div className="p-3.5 border border-brand-glass-border-light dark:border-brand-glass-border-dark space-y-1">
                  <span className="flex items-center gap-1.5 text-[10px] uppercase font-mono text-brand-gray">
                    <Mail size={12} /> Email
                  </span>
                  <a href={`mailto:${selectedQuote.email}`} className="font-medium text-brand-charcoal dark:text-white hover:underline block">
                    {selectedQuote.email}
                  </a>
                </div>

                <div className="p-3.5 border border-brand-glass-border-light dark:border-brand-glass-border-dark space-y-1">
                  <span className="flex items-center gap-1.5 text-[10px] uppercase font-mono text-brand-gray">
                    <Phone size={12} /> Phone
                  </span>
                  <a href={`tel:${selectedQuote.phone}`} className="font-medium text-brand-charcoal dark:text-white hover:underline block">
                    {selectedQuote.phone}
                  </a>
                </div>

                <div className="p-3.5 border border-brand-glass-border-light dark:border-brand-glass-border-dark space-y-1">
                  <span className="flex items-center gap-1.5 text-[10px] uppercase font-mono text-brand-gray">
                    <FileText size={12} /> Service
                  </span>
                  <span className="font-medium text-brand-charcoal dark:text-white block">
                    {selectedQuote.service || selectedQuote.project_type || "Custom Glazing"}
                  </span>
                </div>

                <div className="p-3.5 border border-brand-glass-border-light dark:border-brand-glass-border-dark space-y-1">
                  <span className="flex items-center gap-1.5 text-[10px] uppercase font-mono text-brand-gray">
                    <MapPin size={12} /> Location
                  </span>
                  <span className="font-medium text-brand-charcoal dark:text-white block">
                    {selectedQuote.location || selectedQuote.suburb || "Sydney, NSW"}
                  </span>
                </div>
              </div>

              {/* Message & Measurements */}
              <div>
                <span className="block text-[10px] uppercase font-mono text-brand-gray mb-1">
                  Customer Requirements & Scope
                </span>
                <div className="p-4 bg-[#f8f8f6] dark:bg-black/20 border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs text-brand-charcoal dark:text-brand-gray-light leading-relaxed whitespace-pre-wrap">
                  {selectedQuote.message || selectedQuote.description || "No specific scope provided."}
                </div>
                {selectedQuote.measurements && (
                  <div className="mt-2 p-2.5 bg-blue-500/5 border border-blue-500/20 text-xs font-mono text-blue-500">
                    Measurements: {selectedQuote.measurements}
                  </div>
                )}
              </div>

              {/* Staff Notes */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase font-mono text-brand-gray tracking-wider">
                    Internal Staff Notes
                  </label>
                  <button
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-charcoal text-white dark:bg-white dark:text-brand-charcoal text-xs font-mono uppercase font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {savingNotes ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                    Save Notes
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  placeholder="Record customer communication, site measurement schedule..."
                  className="w-full p-3 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs text-brand-charcoal dark:text-white focus:outline-none font-sans"
                />
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-brand-glass-border-light dark:border-brand-glass-border-dark flex items-center justify-between">
                <Link
                  href={`/admin/quotes/${selectedQuote.id}`}
                  className="inline-flex items-center gap-1 text-xs font-mono uppercase font-bold text-brand-charcoal dark:text-white hover:underline"
                >
                  Full Quote Page <ArrowUpRight size={13} />
                </Link>
                <button
                  onClick={() => setSelectedQuote(null)}
                  className="px-5 py-2 bg-brand-charcoal text-white dark:bg-white dark:text-brand-charcoal text-xs font-mono uppercase font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {quoteToDelete && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in">
            <div className="bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl">
              <h3 className="font-serif text-xl font-light text-brand-charcoal dark:text-white">
                Confirm Quote Deletion
              </h3>
              <p className="text-xs text-brand-gray leading-relaxed font-sans">
                Are you sure you want to permanently delete quote <span className="font-bold text-brand-charcoal dark:text-white">#{quoteToDelete.id}</span> for <span className="font-bold text-brand-charcoal dark:text-white">{quoteToDelete.name}</span>? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3 pt-3 border-t border-brand-glass-border-light dark:border-brand-glass-border-dark">
                <button
                  onClick={() => setQuoteToDelete(null)}
                  className="px-4 py-2 text-xs font-mono uppercase text-brand-gray hover:text-brand-charcoal dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteQuote}
                  disabled={deleting}
                  className="px-5 py-2 text-xs font-mono uppercase bg-red-600 hover:bg-red-700 text-white font-bold transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {deleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
