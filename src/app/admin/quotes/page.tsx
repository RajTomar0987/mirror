"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Filter, ArrowUpRight, FileText } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getAuthHeaders } from "@/lib/auth-client";
import { QuoteRequest } from "@/types";

const STATUSES = ["All", "new", "contacted", "quote_sent", "in_progress", "completed", "closed"];

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);



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

  const filteredQuotes = quotes.filter((q) => {
    const matchesSearch =
      q.name.toLowerCase().includes(search.toLowerCase()) ||
      q.email.toLowerCase().includes(search.toLowerCase()) ||
      q.service.toLowerCase().includes(search.toLowerCase()) ||
      q.suburb.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "All" || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-glass-border-light dark:border-brand-glass-border-dark">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-mono text-brand-gray block mb-1">
              [Enquiry Pipeline]
            </span>
            <h1 className="font-serif text-3xl font-light tracking-tight text-brand-charcoal dark:text-white">
              QUOTE REQUESTS
            </h1>
          </div>
          <span className="text-xs font-mono text-brand-gray">
            Showing {filteredQuotes.length} of {quotes.length} total quotes
          </span>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer name, email, service, or suburb..."
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs text-brand-charcoal dark:text-white focus:outline-none font-sans"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={16} className="text-brand-gray" />
            <select
              value={statusFilter}
              aria-label="Filter Quotes by Status"
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs font-mono uppercase text-brand-charcoal dark:text-white focus:outline-none"
            >
              {STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st === "All" ? "All Statuses" : st.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark p-6 sm:p-8">
          {loading ? (
            <div className="text-center py-12 text-xs font-mono text-brand-gray">
              Loading quote requests...
            </div>
          ) : filteredQuotes.length === 0 ? (
            <div className="text-center py-16 text-xs font-mono text-brand-gray flex flex-col items-center gap-2">
              <FileText size={24} />
              <span>No quote requests found matching criteria.</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-brand-glass-border-light dark:border-brand-glass-border-dark text-[10px] uppercase font-mono text-brand-gray">
                    <th className="py-3 px-4">Customer Name</th>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Suburb</th>
                    <th className="py-3 px-4">Preferred Contact</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-glass-border-light dark:divide-brand-glass-border-dark">
                  {filteredQuotes.map((q) => (
                    <tr key={q.id || q.email} className="hover:bg-brand-bg/5 dark:hover:bg-brand-charcoal/5">
                      <td className="py-4 px-4 font-medium text-brand-charcoal dark:text-white">
                        {q.name}
                        <span className="block text-[10px] text-brand-gray font-mono">{q.email}</span>
                      </td>
                      <td className="py-4 px-4 text-brand-gray dark:text-brand-gray-light">{q.service}</td>
                      <td className="py-4 px-4 text-brand-gray dark:text-brand-gray-light">{q.suburb}</td>
                      <td className="py-4 px-4 uppercase text-[10px] font-mono text-brand-gray">{q.preferredContact}</td>
                      <td className="py-4 px-4">
                        <span className="text-[10px] uppercase font-mono px-2.5 py-1 border border-brand-glass-border-light dark:border-brand-glass-border-dark">
                          {(q.status || "new").replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Link
                          href={`/admin/quotes/${q.id || "1"}`}
                          className="inline-flex items-center gap-1 text-xs uppercase font-mono font-bold text-brand-charcoal dark:text-white hover:underline"
                        >
                          Inspect <ArrowUpRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
