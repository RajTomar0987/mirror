"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  LogOut,
  Save,
  Loader2,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getAuthHeaders, clearAdminToken, getAuthUser, AuthUser } from "@/lib/auth-client";
import { useToast } from "@/components/admin/Toast";
import { QuoteRequest } from "@/types";

const STATUS_OPTIONS = ["All", "new", "contacted", "completed"];

export default function AdminQuotesPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [currentUser] = useState<AuthUser | null>(() => {
    if (typeof window === "undefined") return null;
    return getAuthUser();
  });
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // Quote detail modal state
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [modalNotes, setModalNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Delete confirmation modal state
  const [quoteToDelete, setQuoteToDelete] = useState<QuoteRequest | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const res = await fetch("/api/admin/quotes", { headers: getAuthHeaders() });
        const data = (await res.json()) as { success?: boolean; data?: QuoteRequest[] };
        if (isMounted && data && data.success && Array.isArray(data.data)) {
          setQuotes(data.data);
        }
      } catch (err) {
        console.error("Quotes fetch error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("Logout API error:", e);
    }
    clearAdminToken();
    router.push("/");
    router.refresh();
  };

  // Status update handler
  const handleUpdateStatus = async (quoteId: string, newStatus: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActionLoading(`${quoteId}-${newStatus}`);
    try {
      const res = await fetch(`/api/admin/quotes/${quoteId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = (await res.json()) as { success?: boolean; data?: QuoteRequest; error?: string };
      if (data && data.success) {
        setQuotes((prev) =>
          prev.map((q) => (q.id === quoteId ? { ...q, status: newStatus } : q))
        );
        if (selectedQuote && selectedQuote.id === quoteId) {
          setSelectedQuote((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
        showToast(`Quote marked as "${newStatus}"`, "success");
      } else {
        showToast(data?.error || "Failed to update status", "error");
      }
    } catch {
      showToast("Network error updating quote status", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // Save notes handler
  const handleSaveNotes = async () => {
    if (!selectedQuote?.id) return;
    setSavingNotes(true);
    try {
      const res = await fetch(`/api/admin/quotes/${selectedQuote.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
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

  // Delete quote handler
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
        showToast("Quote deleted successfully", "success");
        setQuoteToDelete(null);
      } else {
        showToast(data?.error || "Failed to delete quote", "error");
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

  // Compute metrics
  const totalCount = quotes.length;
  const newCount = quotes.filter((q) => !q.status || q.status === "new").length;
  const contactedCount = quotes.filter((q) => q.status === "contacted").length;
  const completedCount = quotes.filter((q) => q.status === "completed").length;

  // Filtered quotes
  const filteredQuotes = quotes.filter((q) => {
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

    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "new" && (!q.status || q.status === "new")) ||
      qStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
      <div className="space-y-8">
        {/* Dashboard Header with Logout */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-glass-border-light dark:border-brand-glass-border-dark">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-mono text-brand-gray block mb-1">
              Complete Glass Innovations — Admin Dashboard
            </span>
            <h1 className="font-serif text-3xl font-light tracking-tight text-brand-charcoal dark:text-white">
              QUOTE REQUESTS DASHBOARD
            </h1>
            {currentUser && (
              <span className="text-xs font-mono text-brand-gray mt-1 block">
                Logged in as: <span className="text-brand-charcoal dark:text-white font-medium">{currentUser.email}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs uppercase tracking-widest font-mono font-bold transition-colors"
              aria-label="Logout from Admin Portal"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-mono text-brand-gray">Total Quotes</span>
              <FileText size={18} className="text-brand-gray" />
            </div>
            <span className="font-serif text-3xl font-light text-brand-charcoal dark:text-white block">
              {totalCount}
            </span>
            <span className="text-[10px] font-mono text-brand-gray mt-1 block">All-time submissions</span>
          </div>

          <div className="p-5 border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-mono text-blue-500">New</span>
              <Clock size={18} className="text-blue-500" />
            </div>
            <span className="font-serif text-3xl font-light text-brand-charcoal dark:text-white block">
              {newCount}
            </span>
            <span className="text-[10px] font-mono text-blue-500 mt-1 block">Requires action</span>
          </div>

          <div className="p-5 border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-mono text-amber-500">Contacted</span>
              <PhoneCall size={18} className="text-amber-500" />
            </div>
            <span className="font-serif text-3xl font-light text-brand-charcoal dark:text-white block">
              {contactedCount}
            </span>
            <span className="text-[10px] font-mono text-amber-500 mt-1 block">In discussion</span>
          </div>

          <div className="p-5 border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-mono text-emerald-500">Completed</span>
              <CheckCircle2 size={18} className="text-emerald-500" />
            </div>
            <span className="font-serif text-3xl font-light text-brand-charcoal dark:text-white block">
              {completedCount}
            </span>
            <span className="text-[10px] font-mono text-emerald-500 mt-1 block">Resolved & fulfilled</span>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
          <div className="relative flex-1 max-w-lg">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customer, email, phone, project type, location..."
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs text-brand-charcoal dark:text-white focus:outline-none focus:border-brand-charcoal dark:focus:border-white font-sans"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={16} className="text-brand-gray hidden sm:inline" />
            <div className="flex bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark p-1">
              {STATUS_OPTIONS.map((st) => {
                const isActive = statusFilter === st;
                return (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 text-xs font-mono uppercase transition-colors ${
                      isActive
                        ? "bg-brand-charcoal text-white dark:bg-white dark:text-brand-charcoal font-bold"
                        : "text-brand-gray hover:text-brand-charcoal dark:hover:text-white"
                    }`}
                  >
                    {st === "All" ? "All" : st}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quote Request Table */}
        <div className="border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark overflow-hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-brand-gray font-mono text-xs gap-3">
              <Loader2 size={24} className="animate-spin" />
              <span>Loading quotes from database...</span>
            </div>
          ) : filteredQuotes.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-brand-gray font-mono text-xs gap-2">
              <FileText size={28} />
              <span>No quote requests found matching your filter.</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-brand-glass-border-light dark:border-brand-glass-border-dark text-[10px] uppercase font-mono text-brand-gray bg-brand-bg/50 dark:bg-black/20">
                    <th className="py-3.5 px-4">ID</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Phone</th>
                    <th className="py-3.5 px-4">Project</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-glass-border-light dark:divide-brand-glass-border-dark">
                  {filteredQuotes.map((q, idx) => {
                    const currentStatus = q.status || "new";
                    const projectType = q.project_type || q.service || "Custom Glazing";
                    const location = q.location || q.suburb || "Sydney, NSW";
                    const submitted = formatDate(q.created_at || q.createdAt);
                    const displayId = q.id ? q.id.slice(0, 8) : `#${idx + 1}`;

                    return (
                      <tr
                        key={q.id || q.email}
                        onClick={() => openQuoteDetail(q)}
                        className="hover:bg-brand-bg/60 dark:hover:bg-white/5 cursor-pointer transition-colors"
                      >
                        <td className="py-4 px-4 font-mono text-brand-gray text-[11px]">
                          {displayId}
                        </td>
                        <td className="py-4 px-4 font-medium text-brand-charcoal dark:text-white">
                          <span className="font-semibold">{q.name}</span>
                        </td>
                        <td className="py-4 px-4 text-brand-gray font-mono">
                          <a
                            href={`mailto:${q.email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="hover:text-brand-charcoal dark:hover:text-white hover:underline"
                          >
                            {q.email}
                          </a>
                        </td>
                        <td className="py-4 px-4 text-brand-gray font-mono">
                          <a
                            href={`tel:${q.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="hover:text-brand-charcoal dark:hover:text-white hover:underline"
                          >
                            {q.phone}
                          </a>
                        </td>
                        <td className="py-4 px-4 text-brand-charcoal dark:text-brand-gray-light">
                          {projectType}
                        </td>
                        <td className="py-4 px-4 text-brand-gray font-mono">
                          {location}
                        </td>
                        <td className="py-4 px-4 text-brand-gray font-mono text-[11px]">
                          {submitted}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-block text-[10px] uppercase font-mono px-2.5 py-1 font-bold ${
                              currentStatus === "new"
                                ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                                : currentStatus === "contacted"
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                                : currentStatus === "completed"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                : "bg-gray-500/10 text-gray-400 border border-gray-500/30"
                            }`}
                          >
                            {currentStatus}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div
                            className="inline-flex items-center gap-1.5 justify-end"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* View Button */}
                            <button
                              onClick={() => openQuoteDetail(q)}
                              title="View Quote Details"
                              className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 text-brand-charcoal dark:text-white transition-colors"
                            >
                              <Eye size={15} />
                            </button>

                            {/* Mark Contacted Button */}
                            {currentStatus !== "contacted" && (
                              <button
                                onClick={(e) => handleUpdateStatus(q.id || "", "contacted", e)}
                                disabled={actionLoading === `${q.id}-contacted`}
                                title="Mark Contacted"
                                className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-mono uppercase font-bold transition-colors disabled:opacity-50"
                              >
                                {actionLoading === `${q.id}-contacted` ? (
                                  <Loader2 size={12} className="animate-spin" />
                                ) : (
                                  "Contact"
                                )}
                              </button>
                            )}

                            {/* Mark Completed Button */}
                            {currentStatus !== "completed" && (
                              <button
                                onClick={(e) => handleUpdateStatus(q.id || "", "completed", e)}
                                disabled={actionLoading === `${q.id}-completed`}
                                title="Mark Completed"
                                className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono uppercase font-bold transition-colors disabled:opacity-50"
                              >
                                {actionLoading === `${q.id}-completed` ? (
                                  <Loader2 size={12} className="animate-spin" />
                                ) : (
                                  "Complete"
                                )}
                              </button>
                            )}

                            {/* Delete Button */}
                            <button
                              onClick={() => setQuoteToDelete(q)}
                              title="Delete/Archive Quote"
                              className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                            >
                              <Trash2 size={15} />
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
        </div>

        {/* QUOTE DETAIL MODAL */}
        {selectedQuote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-brand-charcoal border border-brand-glass-border-light dark:border-brand-glass-border-dark w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-brand-glass-border-light dark:border-brand-glass-border-dark">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-mono text-brand-gray block">
                    [Quote Inspector]
                  </span>
                  <h2 className="font-serif text-2xl font-light text-brand-charcoal dark:text-white">
                    {selectedQuote.name}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedQuote(null)}
                  className="p-2 text-brand-gray hover:text-brand-charcoal dark:hover:text-white transition-colors"
                  aria-label="Close quote modal"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Status Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-brand-bg/50 dark:bg-black/30 border border-brand-glass-border-light dark:border-brand-glass-border-dark">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-mono text-brand-gray">Status:</span>
                  <span
                    className={`text-xs uppercase font-mono px-2.5 py-1 font-bold ${
                      (selectedQuote.status || "new") === "new"
                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                        : selectedQuote.status === "contacted"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                    }`}
                  >
                    {selectedQuote.status || "new"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedQuote.id || "", "new")}
                    disabled={actionLoading === `${selectedQuote.id}-new`}
                    className="px-2.5 py-1 text-xs font-mono uppercase border border-brand-glass-border-light dark:border-brand-glass-border-dark hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                  >
                    Set New
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedQuote.id || "", "contacted")}
                    disabled={actionLoading === `${selectedQuote.id}-contacted`}
                    className="px-2.5 py-1 text-xs font-mono uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-colors"
                  >
                    Set Contacted
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedQuote.id || "", "completed")}
                    disabled={actionLoading === `${selectedQuote.id}-completed`}
                    className="px-2.5 py-1 text-xs font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors"
                  >
                    Set Completed
                  </button>
                </div>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div className="p-3.5 border border-brand-glass-border-light dark:border-brand-glass-border-dark space-y-1">
                  <span className="flex items-center gap-1.5 text-[10px] uppercase font-mono text-brand-gray">
                    <Mail size={12} /> Email
                  </span>
                  <a
                    href={`mailto:${selectedQuote.email}`}
                    className="font-medium text-brand-charcoal dark:text-white hover:underline block"
                  >
                    {selectedQuote.email}
                  </a>
                </div>

                <div className="p-3.5 border border-brand-glass-border-light dark:border-brand-glass-border-dark space-y-1">
                  <span className="flex items-center gap-1.5 text-[10px] uppercase font-mono text-brand-gray">
                    <Phone size={12} /> Phone
                  </span>
                  <a
                    href={`tel:${selectedQuote.phone}`}
                    className="font-medium text-brand-charcoal dark:text-white hover:underline block"
                  >
                    {selectedQuote.phone}
                  </a>
                </div>

                <div className="p-3.5 border border-brand-glass-border-light dark:border-brand-glass-border-dark space-y-1">
                  <span className="flex items-center gap-1.5 text-[10px] uppercase font-mono text-brand-gray">
                    <FileText size={12} /> Project Type
                  </span>
                  <span className="font-medium text-brand-charcoal dark:text-white block">
                    {selectedQuote.project_type || selectedQuote.service || "Custom Glazing"}
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

                <div className="p-3.5 border border-brand-glass-border-light dark:border-brand-glass-border-dark space-y-1">
                  <span className="flex items-center gap-1.5 text-[10px] uppercase font-mono text-brand-gray">
                    <DollarSign size={12} /> Budget
                  </span>
                  <span className="font-medium text-brand-charcoal dark:text-white block">
                    {selectedQuote.budget || "Not specified / Flexible"}
                  </span>
                </div>

                <div className="p-3.5 border border-brand-glass-border-light dark:border-brand-glass-border-dark space-y-1">
                  <span className="flex items-center gap-1.5 text-[10px] uppercase font-mono text-brand-gray">
                    <Calendar size={12} /> Submitted Date/Time
                  </span>
                  <span className="font-medium text-brand-charcoal dark:text-white block">
                    {formatDate(selectedQuote.created_at || selectedQuote.createdAt)}
                  </span>
                </div>
              </div>

              {/* Customer Message */}
              <div>
                <span className="block text-[10px] uppercase font-mono text-brand-gray mb-2">
                  Customer Message / Requirements
                </span>
                <div className="p-4 bg-brand-bg/60 dark:bg-black/20 border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs text-brand-charcoal dark:text-brand-gray-light leading-relaxed whitespace-pre-wrap">
                  {selectedQuote.message || selectedQuote.description || "No specific details provided."}
                </div>
              </div>

              {/* Internal Notes Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="internalNotes"
                    className="text-[10px] uppercase font-mono text-brand-gray tracking-wider"
                  >
                    Internal Staff Notes
                  </label>
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
                  id="internalNotes"
                  rows={3}
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  placeholder="Add private staff notes, customer call logs, site measure notes..."
                  className="w-full p-3 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs text-brand-charcoal dark:text-white focus:outline-none font-sans"
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-brand-glass-border-light dark:border-brand-glass-border-dark flex items-center justify-between">
                <button
                  onClick={() => {
                    const toDelete = selectedQuote;
                    setSelectedQuote(null);
                    setQuoteToDelete(toDelete);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 size={14} />
                  <span>Delete Quote</span>
                </button>

                <button
                  onClick={() => setSelectedQuote(null)}
                  className="px-5 py-2.5 bg-brand-charcoal text-white dark:bg-white dark:text-brand-charcoal text-xs font-mono uppercase font-bold hover:opacity-90 transition-opacity"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {quoteToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-brand-charcoal border border-red-500/30 w-full max-w-md p-6 space-y-6 shadow-2xl">
              <div className="flex items-center gap-3 text-red-400">
                <AlertTriangle size={24} />
                <h3 className="font-serif text-xl font-light text-brand-charcoal dark:text-white">
                  Confirm Deletion
                </h3>
              </div>

              <p className="text-xs text-brand-gray font-sans leading-relaxed">
                Are you sure you want to permanently remove the quote request submitted by{" "}
                <strong className="text-brand-charcoal dark:text-white font-semibold">
                  {quoteToDelete.name}
                </strong>
                ? This action cannot be undone.
              </p>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-glass-border-light dark:border-brand-glass-border-dark">
                <button
                  onClick={() => setQuoteToDelete(null)}
                  disabled={deleting}
                  className="px-4 py-2 text-xs font-mono uppercase text-brand-gray hover:text-brand-charcoal dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteQuote}
                  disabled={deleting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-xs font-mono uppercase font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deleting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={14} />
                      Delete Permanently
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
