"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, X, FileText, Calculator, Receipt, Briefcase, User, ArrowRight, Loader2 } from "lucide-react";
import { getAuthHeaders } from "@/lib/auth-client";
import { Customer, Estimate, Invoice, POSProject, QuoteRequest } from "@/types";

interface SearchResults {
  customers: Customer[];
  quotes: QuoteRequest[];
  estimates: Estimate[];
  invoices: Invoice[];
  projects: POSProject[];
}

export const GlobalSearchModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>({
    customers: [],
    quotes: [],
    estimates: [],
    invoices: [],
    projects: [],
  });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/search?q=${encodeURIComponent(query.trim())}`, {
          headers: getAuthHeaders(),
        });
        const json = (await res.json()) as { success?: boolean; data?: SearchResults };
        if (json && json.success && json.data) {
          setResults(json.data);
        }
      } catch (err) {
        console.error("Global search error:", err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const totalResults =
    results.customers.length +
    results.quotes.length +
    results.estimates.length +
    results.invoices.length +
    results.projects.length;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24 animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-[#0e0e10] border border-white/10 rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-white/[0.02]">
          <Search size={18} className="text-[#888888] flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search quotes, estimates, invoices, customers, projects..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-[#666666] focus:outline-none font-sans"
          />
          {loading && <Loader2 size={16} className="text-[#888888] animate-spin flex-shrink-0" />}
          {query && !loading && (
            <button
              onClick={() => setQuery("")}
              className="text-[#888888] hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 bg-white/10 text-[10px] font-mono text-[#888888] hover:text-white rounded-sm"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto space-y-6 flex-1 text-xs">
          {!query.trim() ? (
            <div className="py-12 text-center text-xs font-mono text-[#666666]">
              Type customer name, invoice #, estimate #, or project location...
            </div>
          ) : totalResults === 0 && !loading ? (
            <div className="py-12 text-center text-xs font-mono text-[#666666]">
              No records found matching &ldquo;{query}&rdquo;
            </div>
          ) : (
            <>
              {/* Quotes */}
              {results.quotes.length > 0 && (
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-widest text-[#888888] mb-2 flex items-center gap-1.5">
                    <FileText size={12} /> Quotes ({results.quotes.length})
                  </div>
                  <div className="space-y-1">
                    {results.quotes.map((q) => (
                      <Link
                        key={q.id}
                        href={`/admin/quotes/${q.id}`}
                        onClick={onClose}
                        className="flex items-center justify-between p-2.5 rounded-sm hover:bg-white/5 transition-colors group"
                      >
                        <div>
                          <span className="font-medium text-white group-hover:underline">
                            {q.name}
                          </span>
                          <span className="text-[11px] text-[#888888] block">
                            {q.service || q.project_type} · {q.location || q.suburb || "Sydney"}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 border border-white/10 text-[#aaaaaa]">
                          {q.status || "new"}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Estimates */}
              {results.estimates.length > 0 && (
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-widest text-[#888888] mb-2 flex items-center gap-1.5">
                    <Calculator size={12} /> Estimates ({results.estimates.length})
                  </div>
                  <div className="space-y-1">
                    {results.estimates.map((e) => (
                      <Link
                        key={e.id}
                        href={`/admin/estimates?id=${e.id}`}
                        onClick={onClose}
                        className="flex items-center justify-between p-2.5 rounded-sm hover:bg-white/5 transition-colors group"
                      >
                        <div>
                          <span className="font-mono text-white group-hover:underline font-bold">
                            {e.estimate_number}
                          </span>
                          <span className="text-[11px] text-[#888888] block">
                            {e.customer_name} · ${e.total_amount?.toLocaleString()} (incl. GST)
                          </span>
                        </div>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 border border-white/10 text-[#aaaaaa]">
                          {e.status}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Invoices */}
              {results.invoices.length > 0 && (
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-widest text-[#888888] mb-2 flex items-center gap-1.5">
                    <Receipt size={12} /> Invoices ({results.invoices.length})
                  </div>
                  <div className="space-y-1">
                    {results.invoices.map((inv) => (
                      <Link
                        key={inv.id}
                        href={`/admin/invoices?id=${inv.id}`}
                        onClick={onClose}
                        className="flex items-center justify-between p-2.5 rounded-sm hover:bg-white/5 transition-colors group"
                      >
                        <div>
                          <span className="font-mono text-white group-hover:underline font-bold">
                            {inv.invoice_number}
                          </span>
                          <span className="text-[11px] text-[#888888] block">
                            {inv.customer_name} · Total ${inv.total_amount?.toLocaleString()} · Balance ${inv.balance_due?.toLocaleString()}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 border border-white/10 text-[#aaaaaa]">
                          {inv.status.replace("_", " ")}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Customers */}
              {results.customers.length > 0 && (
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-widest text-[#888888] mb-2 flex items-center gap-1.5">
                    <User size={12} /> Customers ({results.customers.length})
                  </div>
                  <div className="space-y-1">
                    {results.customers.map((c) => (
                      <Link
                        key={c.id}
                        href={`/admin/customers?search=${encodeURIComponent(c.email)}`}
                        onClick={onClose}
                        className="flex items-center justify-between p-2.5 rounded-sm hover:bg-white/5 transition-colors group"
                      >
                        <div>
                          <span className="font-medium text-white group-hover:underline">
                            {c.name}
                          </span>
                          <span className="text-[11px] text-[#888888] block">
                            {c.email} · {c.phone}
                          </span>
                        </div>
                        <ArrowRight size={12} className="text-[#888888]" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {results.projects.length > 0 && (
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-widest text-[#888888] mb-2 flex items-center gap-1.5">
                    <Briefcase size={12} /> Projects ({results.projects.length})
                  </div>
                  <div className="space-y-1">
                    {results.projects.map((p) => (
                      <Link
                        key={p.id}
                        href="/admin/projects"
                        onClick={onClose}
                        className="flex items-center justify-between p-2.5 rounded-sm hover:bg-white/5 transition-colors group"
                      >
                        <div>
                          <span className="font-medium text-white group-hover:underline">
                            {p.project_name}
                          </span>
                          <span className="text-[11px] text-[#888888] block">
                            {p.customer_name} · {p.service} ({p.location})
                          </span>
                        </div>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 border border-white/10 text-[#aaaaaa]">
                          {p.status.replace("_", " ")}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-white/[0.01] border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-[#666666]">
          <span>Tip: Press Cmd/Ctrl + K from any admin page</span>
          <span>Complete Glass Innovations POS</span>
        </div>
      </div>
    </div>
  );
};
