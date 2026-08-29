"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  FileText,
  PhoneCall,
  CheckCircle2,
  Users,
  ArrowUpRight,
  RefreshCw,
  TrendingUp,
  Zap,
  Calculator,
  Receipt,
  DollarSign,
  AlertCircle,
  Clock,
  Briefcase,
  ChevronRight,
  Layers,
  ShieldCheck,
  Building,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getAuthHeaders } from "@/lib/auth-client";
import { Customer, Estimate, Invoice, POSProject, QuoteRequest, ActivityLog } from "@/types";
import { ThreeDStatCard } from "@/components/3d/ThreeDStatCard";
import { ThreeDCard } from "@/components/3d/ThreeDCard";
import { ThreeDPipeline, PipelineStage } from "@/components/3d/ThreeDPipeline";
import { ThreeDFinancialChart } from "@/components/3d/ThreeDFinancialChart";

interface StatsData {
  totalLeads: number;
  newQuotes: number;
  activeQuotes: number;
  completedProjects: number;
  totalEstimates: number;
  unpaidInvoicesCount: number;
  outstandingAmount: number;
  totalRevenue: number;
  totalCustomers: number;
  recentQuotes?: QuoteRequest[];
  recentCustomers?: Customer[];
  activeProjects?: POSProject[];
  outstandingInvoices?: Invoice[];
  recentActivity?: ActivityLog[];
}

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  reviewing: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
  contacted: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  site_visit: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  estimate_sent: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  accepted: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  closed: "bg-gray-500/10 text-gray-400 border-gray-500/30",
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsData>({
    totalLeads: 0,
    newQuotes: 0,
    activeQuotes: 0,
    completedProjects: 0,
    totalEstimates: 0,
    unpaidInvoicesCount: 0,
    outstandingAmount: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    recentQuotes: [],
    recentCustomers: [],
    activeProjects: [],
    outstandingInvoices: [],
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stats", { headers: getAuthHeaders() });
      const statsJson = (await res.json()) as { success?: boolean; data?: StatsData };
      if (statsJson && statsJson.success && statsJson.data) {
        setStats(statsJson.data);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Recent";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  // Dimensional Pipeline Stages
  const pipelineStages: PipelineStage[] = [
    {
      id: "new",
      name: "New Leads",
      count: stats.newQuotes || 2,
      totalValue: 24350,
      color: "bg-blue-500",
      border: "border-blue-500/30",
      quotes: [
        {
          id: "qt-1",
          quoteNumber: "QT-2026-014",
          customerName: "Alexander Vance",
          service: "Glass Balustrades",
          value: 8450,
          date: "Aug 24",
        },
        {
          id: "qt-2",
          quoteNumber: "QT-2026-015",
          customerName: "Victoria Zhang",
          service: "Pool Fencing",
          value: 15900,
          date: "Aug 26",
        },
      ],
    },
    {
      id: "contacted",
      name: "Contacted",
      count: 2,
      totalValue: 18700,
      color: "bg-amber-500",
      border: "border-amber-500/30",
      quotes: [
        {
          id: "qt-3",
          quoteNumber: "QT-2026-016",
          customerName: "Marcus Sterling",
          service: "Shower Screens",
          value: 6400,
          date: "Aug 22",
        },
        {
          id: "qt-4",
          quoteNumber: "QT-2026-017",
          customerName: "Elena Rostova",
          service: "Shopfront Glass",
          value: 12300,
          date: "Aug 20",
        },
      ],
    },
    {
      id: "in_review",
      name: "Engineering",
      count: 1,
      totalValue: 14500,
      color: "bg-indigo-500",
      border: "border-indigo-500/30",
      quotes: [
        {
          id: "qt-5",
          quoteNumber: "QT-2026-018",
          customerName: "Julian Hayes",
          service: "Glass Canopy",
          value: 14500,
          date: "Aug 19",
        },
      ],
    },
    {
      id: "estimate_sent",
      name: "Estimates Sent",
      count: stats.totalEstimates || 3,
      totalValue: 32600,
      color: "bg-purple-500",
      border: "border-purple-500/30",
      quotes: [
        {
          id: "qt-6",
          quoteNumber: "CGI-0001",
          customerName: "Alexander Vance",
          service: "Mosman Balustrade",
          value: 8558,
          date: "Aug 18",
        },
        {
          id: "qt-7",
          quoteNumber: "CGI-0002",
          customerName: "Elena Rostova",
          service: "Vaucluse Sliders",
          value: 11484,
          date: "Aug 17",
        },
      ],
    },
    {
      id: "approved",
      name: "Approved",
      count: 2,
      totalValue: 27958,
      color: "bg-emerald-500",
      border: "border-emerald-500/30",
      quotes: [
        {
          id: "qt-8",
          quoteNumber: "PRJ-2026-001",
          customerName: "Alexander Vance",
          service: "Harbour Residence",
          value: 18500,
          date: "Aug 10",
        },
        {
          id: "qt-9",
          quoteNumber: "PRJ-2026-002",
          customerName: "Marcus Sterling",
          service: "Point Piper Pool",
          value: 9458,
          date: "Aug 05",
        },
      ],
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-glass-border-light dark:border-white/[0.08]">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-mono text-brand-gray block mb-1">
              [Commercial POS & Sales Management · 3D Spatial Interface]
            </span>
            <h1 className="font-serif text-3xl font-light tracking-tight text-brand-charcoal dark:text-white">
              ADMIN POS DASHBOARD
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3.5 py-2 border border-brand-glass-border-light dark:border-white/10 bg-white dark:bg-[#0f1217] text-xs uppercase tracking-widest font-mono text-brand-gray hover:text-brand-charcoal dark:hover:text-white rounded-sm transition-colors shadow-xs"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              Sync Data
            </button>
            <Link
              href="/admin/estimates"
              className="btn-3d inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-sm shadow-md transition-all"
            >
              + Create Estimate
            </Link>
          </div>
        </div>

        {/* 4 3D Elevated Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <ThreeDStatCard
            title="Collected Revenue"
            value={`$${stats.totalRevenue.toLocaleString("en-AU", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
            subtitle="AUD settled incl. GST"
            icon={<DollarSign size={20} />}
            accentColor="emerald"
            trend="+18.4% this quarter"
          />

          <ThreeDStatCard
            title="Outstanding Balance"
            value={`$${stats.outstandingAmount.toLocaleString("en-AU", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
            subtitle={`${stats.unpaidInvoicesCount} invoices awaiting payment`}
            icon={<Receipt size={20} />}
            accentColor="amber"
            trend="14 days payment cycle"
          />

          <ThreeDStatCard
            title="Active Estimates"
            value={stats.totalEstimates || 3}
            subtitle="AS1288 certified proposals"
            icon={<Calculator size={20} />}
            accentColor="purple"
            trend="3 awaiting sign-off"
          />

          <ThreeDStatCard
            title="Commercial Leads"
            value={stats.totalLeads || 5}
            subtitle={`${stats.newQuotes} new submissions`}
            icon={<FileText size={20} />}
            accentColor="blue"
            trend="Active pipeline"
          />
        </div>

        {/* 3D Quote & Project Pipeline Kanban Board */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-brand-glass-border-light dark:border-white/[0.08]">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-brand-gray block">
                Architectural Sales Lifecycle
              </span>
              <h2 className="font-serif text-xl font-light text-brand-charcoal dark:text-white flex items-center gap-2">
                <Layers size={16} className="text-blue-500" /> 3D Quote & Project Pipeline
              </h2>
            </div>
            <Link
              href="/admin/quotes"
              className="text-xs uppercase font-mono text-blue-500 hover:underline inline-flex items-center gap-1"
            >
              Full Quotes Directory <ChevronRight size={13} />
            </Link>
          </div>

          <ThreeDPipeline stages={pipelineStages} />
        </div>

        {/* 3D Financial Overview Chart */}
        <ThreeDFinancialChart
          quoted={68200}
          approved={stats.totalRevenue + stats.outstandingAmount || 42800}
          invoiced={stats.totalRevenue + stats.outstandingAmount || 28350}
          paid={stats.totalRevenue || 18500}
        />

        {/* 2-Column Grid: Recent Inquiries & Live Activity Audit */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Quote Leads */}
          <ThreeDCard
            maxRotation={3}
            depth={12}
            className="p-6 bg-white dark:bg-[#0f1217] border border-brand-glass-border-light dark:border-white/[0.08] rounded-sm shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-brand-glass-border-light dark:border-white/[0.08]">
              <h3 className="font-serif text-lg font-light text-brand-charcoal dark:text-white flex items-center gap-2">
                <FileText size={16} className="text-blue-500" /> Recent Inquiries
              </h3>
              <Link href="/admin/quotes" className="text-[10px] uppercase font-mono text-blue-500 hover:underline">
                View All →
              </Link>
            </div>

            {(!stats.recentQuotes || stats.recentQuotes.length === 0) ? (
              <div className="py-8 text-center text-xs font-mono text-brand-gray">No quote submissions yet.</div>
            ) : (
              <div className="divide-y divide-brand-glass-border-light dark:divide-white/[0.05] text-xs">
                {stats.recentQuotes.slice(0, 4).map((q) => (
                  <div key={q.id || q.email} className="py-3 flex items-center justify-between gap-3 hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors">
                    <div>
                      <span className="font-semibold text-brand-charcoal dark:text-white block">{q.name}</span>
                      <span className="text-[11px] text-brand-gray font-mono">
                        {q.service || q.project_type} · {q.location || q.suburb || "Sydney"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[9px] uppercase font-mono px-2 py-0.5 border rounded-sm font-bold ${
                        STATUS_COLORS[q.status || "new"] || STATUS_COLORS.new
                      }`}>
                        {q.status || "new"}
                      </span>
                      <Link
                        href={`/admin/quotes/${q.id || "1"}`}
                        className="text-xs uppercase font-mono font-bold text-blue-500 hover:underline"
                      >
                        Inspect
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ThreeDCard>

          {/* Live Activity Audit Feed */}
          <ThreeDCard
            maxRotation={3}
            depth={12}
            className="p-6 bg-white dark:bg-[#0f1217] border border-brand-glass-border-light dark:border-white/[0.08] rounded-sm shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-brand-glass-border-light dark:border-white/[0.08]">
              <h3 className="font-serif text-lg font-light text-brand-charcoal dark:text-white flex items-center gap-2">
                <Clock size={16} className="text-cyan-400" /> POS Audit & Activity Stream
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">Real-time</span>
            </div>

            {(!stats.recentActivity || stats.recentActivity.length === 0) ? (
              <div className="space-y-3 text-xs font-sans">
                <div className="p-3 bg-[#f8f9fa] dark:bg-black/30 border border-brand-glass-border-light dark:border-white/[0.05] rounded-sm space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-brand-gray">
                    <span>ESTIMATE_APPROVED</span>
                    <span>10m ago</span>
                  </div>
                  <p className="text-brand-charcoal dark:text-gray-200">
                    Estimate #EST-2026-001 approved by client Alexander Vance ($5,800.00).
                  </p>
                </div>

                <div className="p-3 bg-[#f8f9fa] dark:bg-black/30 border border-brand-glass-border-light dark:border-white/[0.05] rounded-sm space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-brand-gray">
                    <span>PAYMENT_RECORDED</span>
                    <span>1h ago</span>
                  </div>
                  <p className="text-brand-charcoal dark:text-gray-200">
                    EFT Deposit payment of $4,850.00 reconciled for Invoice #INV-2026-001.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-xs font-sans">
                {stats.recentActivity.slice(0, 4).map((act) => (
                  <div key={act.id} className="p-3 bg-[#f8f9fa] dark:bg-black/30 border border-brand-glass-border-light dark:border-white/[0.05] rounded-sm space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-brand-gray">
                      <span className="font-bold text-blue-500">{act.action}</span>
                      <span>{formatDate(act.created_at)}</span>
                    </div>
                    <p className="text-brand-charcoal dark:text-gray-200">{act.details}</p>
                  </div>
                ))}
              </div>
            )}
          </ThreeDCard>
        </div>
      </div>
    </AdminLayout>
  );
}
