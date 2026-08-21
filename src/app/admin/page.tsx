"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  FileText,
  Clock,
  Briefcase,
  Grid,
  MessageSquare,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getAuthHeaders } from "@/lib/auth-client";
import { QuoteRequest } from "@/types";

interface StatsData {
  newEnquiries: number;
  pendingQuotes: number;
  projectsCount: number;
  publishedServicesCount: number;
  unreadMessages: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsData>({
    newEnquiries: 0,
    pendingQuotes: 0,
    projectsCount: 0,
    publishedServicesCount: 0,
    unreadMessages: 0,
  });
  const [recentQuotes, setRecentQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, quotesRes] = await Promise.all([
        fetch("/api/admin/stats", { headers: getAuthHeaders() }),
        fetch("/api/admin/quotes", { headers: getAuthHeaders() }),
      ]);

      const statsJson = (await statsRes.json()) as { success?: boolean; data?: typeof stats };
      if (statsJson && statsJson.success && statsJson.data) {
        setStats(statsJson.data);
      }

      const quotesJson = (await quotesRes.json()) as { success?: boolean; data?: QuoteRequest[] };
      if (quotesJson && quotesJson.success && Array.isArray(quotesJson.data)) {
        setRecentQuotes(quotesJson.data.slice(0, 5));
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const [statsRes, quotesRes] = await Promise.all([
          fetch("/api/admin/stats", { headers: getAuthHeaders() }),
          fetch("/api/admin/quotes", { headers: getAuthHeaders() }),
        ]);

        const statsJson = (await statsRes.json()) as { success?: boolean; data?: typeof stats };
        if (isMounted && statsJson && statsJson.success && statsJson.data) {
          setStats(statsJson.data);
        }

        const quotesJson = (await quotesRes.json()) as { success?: boolean; data?: QuoteRequest[] };
        if (isMounted && quotesJson && quotesJson.success && Array.isArray(quotesJson.data)) {
          setRecentQuotes(quotesJson.data.slice(0, 5));
        }
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-glass-border-light dark:border-brand-glass-border-dark">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-mono text-brand-gray block mb-1">
              [Overview]
            </span>
            <h1 className="font-serif text-3xl font-light tracking-tight text-brand-charcoal dark:text-white">
              ADMIN DASHBOARD
            </h1>
          </div>

          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-mono text-brand-gray hover:text-brand-charcoal dark:hover:text-white transition-colors"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh Metrics
          </button>
        </div>

        {/* 5 Real Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="p-6 border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase font-mono text-brand-gray">New Enquiries</span>
              <FileText size={18} className="text-brand-gray" />
            </div>
            <span className="font-serif text-4xl font-light text-brand-charcoal dark:text-white block mb-2">
              {stats.newEnquiries}
            </span>
            <span className="text-[10px] font-mono text-brand-gray">Status = new</span>
          </div>

          <div className="p-6 border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase font-mono text-brand-gray">Pending Quotes</span>
              <Clock size={18} className="text-brand-gray" />
            </div>
            <span className="font-serif text-4xl font-light text-brand-charcoal dark:text-white block mb-2">
              {stats.pendingQuotes}
            </span>
            <span className="text-[10px] font-mono text-brand-gray">Active Pipeline</span>
          </div>

          <div className="p-6 border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase font-mono text-brand-gray">Projects</span>
              <Briefcase size={18} className="text-brand-gray" />
            </div>
            <span className="font-serif text-4xl font-light text-brand-charcoal dark:text-white block mb-2">
              {stats.projectsCount}
            </span>
            <span className="text-[10px] font-mono text-brand-gray">Total Case Studies</span>
          </div>

          <div className="p-6 border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase font-mono text-brand-gray">Services</span>
              <Grid size={18} className="text-brand-gray" />
            </div>
            <span className="font-serif text-4xl font-light text-brand-charcoal dark:text-white block mb-2">
              {stats.publishedServicesCount}
            </span>
            <span className="text-[10px] font-mono text-brand-gray">Published Categories</span>
          </div>

          <div className="p-6 border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase font-mono text-brand-gray">Messages</span>
              <MessageSquare size={18} className="text-brand-gray" />
            </div>
            <span className="font-serif text-4xl font-light text-brand-charcoal dark:text-white block mb-2">
              {stats.unreadMessages}
            </span>
            <span className="text-[10px] font-mono text-brand-gray">Unread Inquiries</span>
          </div>
        </div>

        {/* Recent Quotes Table */}
        <div className="border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-brand-glass-border-light dark:border-brand-glass-border-dark">
            <h2 className="font-serif text-xl font-light text-brand-charcoal dark:text-white">
              Recent Quote Submissions
            </h2>
            <Link
              href="/admin/quotes"
              className="text-xs uppercase tracking-widest font-mono text-brand-gray hover:text-brand-charcoal dark:hover:text-white inline-flex items-center gap-1"
            >
              View All Quotes <ArrowUpRight size={14} />
            </Link>
          </div>

          {recentQuotes.length === 0 ? (
            <div className="text-center py-12 text-xs font-mono text-brand-gray">
              No quote enquiries submitted yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-brand-glass-border-light dark:border-brand-glass-border-dark text-[10px] uppercase font-mono text-brand-gray">
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-glass-border-light dark:divide-brand-glass-border-dark">
                  {recentQuotes.map((q) => (
                    <tr key={q.id || q.email} className="hover:bg-brand-bg/5 dark:hover:bg-brand-charcoal/5">
                      <td className="py-4 px-4 font-medium text-brand-charcoal dark:text-white">
                        {q.name}
                        <span className="block text-[10px] text-brand-gray font-mono">{q.email}</span>
                      </td>
                      <td className="py-4 px-4 text-brand-gray dark:text-brand-gray-light">{q.service}</td>
                      <td className="py-4 px-4 text-brand-gray dark:text-brand-gray-light">{q.suburb}</td>
                      <td className="py-4 px-4">
                        <span className="text-[10px] uppercase font-mono px-2.5 py-1 border border-brand-glass-border-light dark:border-brand-glass-border-dark">
                          {q.status || "new"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Link
                          href={`/admin/quotes/${q.id || "1"}`}
                          className="text-xs uppercase font-mono font-bold text-brand-charcoal dark:text-white hover:underline"
                        >
                          View Details
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
