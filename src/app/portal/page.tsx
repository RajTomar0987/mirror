"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Calculator,
  Briefcase,
  Receipt,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  DollarSign,
  Loader2,
  Sparkles,
  Layers,
  ShieldCheck,
  Compass,
} from "lucide-react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { getAuthHeaders, getAuthUser } from "@/lib/auth-client";
import { QuoteRequest } from "@/types";
import { ArchitecturalGlass3D } from "@/components/3d/ArchitecturalGlass3D";
import { ThreeDStatCard } from "@/components/3d/ThreeDStatCard";
import { ThreeDProjectCard } from "@/components/3d/ThreeDProjectCard";
import { ThreeDTimeline, TimelineStage } from "@/components/3d/ThreeDTimeline";
import { ThreeDFinancialChart } from "@/components/3d/ThreeDFinancialChart";
import { ThreeDQuoteCard } from "@/components/3d/ThreeDQuoteCard";
import { ThreeDCard } from "@/components/3d/ThreeDCard";

const PROJECT_STAGES: TimelineStage[] = [
  { id: "consultation", label: "Consultation", desc: "Structural glass requirements & site feasibility check." },
  { id: "design", label: "Design & CAD", desc: "CAD shop drawings & AS1288 load calculations." },
  { id: "measurement", label: "Laser Templating", desc: "Digital 3D laser templating with ±0.5mm tolerance." },
  { id: "engineering", label: "Engineering Sign-off", desc: "Form 15 structural certification & spigot sign-off." },
  { id: "fabrication", label: "Furnace Tempering", desc: "CNC waterjet cutting, edge beveling & glass tempering." },
  { id: "delivery", label: "Site Dispatch", desc: "Specialist glass crane delivery to Vaucluse site." },
  { id: "installation", label: "Glazing Installation", desc: "Master glaziers hoist & fix duplex 2205 hardware." },
  { id: "completed", label: "Handover & Sign-off", desc: "AS1288 certificate of compliance handover." },
];

export default function CustomerDashboardPage() {
  const [userName, setUserName] = useState<string>("Raj");
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState({
    activeQuotes: 3,
    pendingEstimates: 1,
    activeProjects: 2,
    unpaidInvoices: 1,
    outstandingBalance: 4850,
  });
  const [recentQuotes, setRecentQuotes] = useState<QuoteRequest[]>([]);

  useEffect(() => {
    const user = getAuthUser();
    if (user?.fullName) {
      setUserName(user.fullName.split(" ")[0]);
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/portal/stats", {
          headers: getAuthHeaders(),
        });
        const data = (await res.json()) as {
          success?: boolean;
          data?: {
            stats?: {
              activeQuotes: number;
              pendingEstimates: number;
              activeProjects: number;
              unpaidInvoices: number;
              outstandingBalance: number;
            };
            recentQuotes?: QuoteRequest[];
          };
        };
        if (data && data.success && data.data) {
          if (data.data.stats) {
            setStats(data.data.stats);
          }
          if (data.data.recentQuotes) {
            setRecentQuotes(data.data.recentQuotes);
          }
        }
      } catch (err) {
        console.error("Failed to load portal stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <PortalLayout>
      <div className="space-y-10">
        {/* =========================================================================
            1. 3D HERO SECTION: "Good morning, [Name]" + 3D Architectural Glass
           ========================================================================= */}
        <div className="p-6 sm:p-10 bg-white dark:bg-[#0f1217] border border-brand-glass-border-light dark:border-white/[0.08] rounded-sm shadow-md relative overflow-hidden">
          {/* Subtle Ambient Spatial Glow Background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Column: Heading & CTA */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-500 dark:text-cyan-400 font-bold">
                    [Live Architectural Glass Client Portal]
                  </span>
                </div>

                <h1 className="font-serif text-3xl sm:text-5xl font-light tracking-tight text-brand-charcoal dark:text-white leading-[1.1]">
                  Good morning, <span className="font-normal text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400">{userName}</span>
                </h1>

                <p className="text-sm sm:text-base text-brand-gray font-sans max-w-xl leading-relaxed">
                  Everything about your architectural glass installations, CAD blueprints, commercial proposals, and AS1288 compliance, in one place.
                </p>
              </div>

              {/* Quick Action Buttons with 3D Depth */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/quote"
                  className="btn-3d px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs uppercase font-bold tracking-wider rounded-sm transition-all inline-flex items-center gap-2 shadow-md"
                >
                  <Plus size={14} /> Request New Quote
                </Link>

                <Link
                  href="/portal/estimates"
                  className="px-5 py-3 border border-brand-glass-border-light dark:border-white/10 hover:border-brand-charcoal dark:hover:border-white text-brand-charcoal dark:text-white font-mono text-xs uppercase font-bold tracking-wider rounded-sm transition-all inline-flex items-center gap-2 bg-[#f8f9fa] dark:bg-black/30 shadow-xs"
                >
                  <Calculator size={14} className="text-purple-400" /> Review Estimates ({stats.pendingEstimates})
                </Link>
              </div>
            </div>

            {/* Right Column: 3D Architectural Glass Interactive Visualization */}
            <div className="lg:col-span-5 flex justify-center">
              <ArchitecturalGlass3D />
            </div>
          </div>
        </div>

        {/* =========================================================================
            2. 4 ELEVATED 3D STATISTICS CARDS
           ========================================================================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <ThreeDStatCard
            title="Active Projects"
            value={stats.activeProjects}
            subtitle="2 on-site installations"
            icon={<Briefcase size={20} />}
            accentColor="cyan"
            trend="+1 this month"
          />

          <ThreeDStatCard
            title="Pending Quotes"
            value={stats.activeQuotes}
            subtitle="Engineering feasibility"
            icon={<FileText size={20} />}
            accentColor="blue"
            trend="Under Review"
          />

          <ThreeDStatCard
            title="Estimates Awaiting"
            value={stats.pendingEstimates}
            subtitle="Ready for sign-off"
            icon={<Calculator size={20} />}
            accentColor="purple"
            trend="Action Required"
          />

          <ThreeDStatCard
            title="Outstanding Total"
            value={`$${stats.outstandingBalance.toLocaleString()}`}
            subtitle="Progress deposit balance"
            icon={<Receipt size={20} />}
            accentColor="amber"
            trend="Due in 14 days"
          />
        </div>

        {/* =========================================================================
            3. LARGE 3D PROJECT VISUALIZATION CARD
           ========================================================================= */}
        <ThreeDProjectCard
          id="pos-proj-1"
          title="Modern Harbour Residence"
          service="Frameless Glass Balustrades"
          location="14 Wentworth Road, Vaucluse NSW"
          progress={72}
          nextMilestone="Balustrade Spigot Core Drilling & Panel Fitting"
          completionDate="Sep 18, 2026"
          subStages={[
            { label: "CAD Engineering", percent: 100, status: "completed" },
            { label: "Laser Templating", percent: 100, status: "completed" },
            { label: "Glass Tempering", percent: 70, status: "in_progress" },
            { label: "Site Installation", percent: 40, status: "in_progress" },
          ]}
        />

        {/* =========================================================================
            4. 3D PROJECT TIMELINE: Complete 8-Stage Glazing Lifecycle
           ========================================================================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono tracking-widest text-brand-charcoal dark:text-white flex items-center gap-2 font-bold">
              <Layers size={14} className="text-blue-500" /> Architectural Glazing Milestone Sequence
            </span>
            <span className="text-xs font-mono text-brand-gray">Stage 05 of 08 Active</span>
          </div>

          <ThreeDTimeline
            stages={PROJECT_STAGES}
            currentStageIndex={4}
          />
        </div>

        {/* =========================================================================
            5. 3D FINANCIAL LIFECYCLE SECTION
           ========================================================================= */}
        <ThreeDFinancialChart
          quoted={24350}
          approved={18500}
          invoiced={9700}
          paid={4850}
        />

        {/* =========================================================================
            6. 3D QUOTE CARDS & UPCOMING SITE SCHEDULE
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent Quotes (3D Layered Cards) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-brand-glass-border-light dark:border-white/[0.08]">
              <span className="text-xs uppercase font-mono tracking-widest text-brand-charcoal dark:text-white font-bold flex items-center gap-2">
                <FileText size={14} className="text-blue-500" /> Recent Quote Requests
              </span>
              <Link
                href="/portal/quotes"
                className="text-xs font-mono text-blue-500 hover:underline inline-flex items-center gap-1"
              >
                View Directory <ArrowUpRight size={12} />
              </Link>
            </div>

            <div className="space-y-3">
              <ThreeDQuoteCard
                id="quote-1"
                quoteNumber="QT-2026-014"
                service="Frameless Glass Balustrade"
                amount={8450}
                status="estimate_sent"
                description="Perimeter frameless glass balustrades with 2205 duplex spigots"
                date="Aug 24, 2026"
              />

              <ThreeDQuoteCard
                id="quote-2"
                quoteNumber="QT-2026-015"
                service="Master Ensuite Fluted Screens"
                amount={5800}
                status="in_review"
                description="10mm toughened fluted shower screens with matte black fittings"
                date="Aug 26, 2026"
              />
            </div>
          </div>

          {/* Upcoming Schedule & Activity */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-brand-glass-border-light dark:border-white/[0.08]">
              <span className="text-xs uppercase font-mono tracking-widest text-brand-charcoal dark:text-white font-bold flex items-center gap-2">
                <Calendar size={14} className="text-cyan-400" /> Site Schedule & Activity
              </span>
            </div>

            <ThreeDCard
              maxRotation={4}
              depth={12}
              className="p-6 bg-white dark:bg-[#0f1217] border border-brand-glass-border-light dark:border-white/[0.08] rounded-sm space-y-4 shadow-sm"
            >
              <div className="space-y-3 text-xs font-sans">
                {/* Event 1 */}
                <div className="p-3.5 bg-blue-500/5 border border-blue-500/20 rounded-sm space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] uppercase font-bold text-blue-500">
                      Tuesday · Aug 30, 8:30 AM
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 bg-blue-500/20 text-blue-400 font-bold rounded-xs">
                      Confirmed
                    </span>
                  </div>
                  <span className="font-semibold text-brand-charcoal dark:text-white block">
                    Site Glazing Team Arrival & Crane Hoist
                  </span>
                  <p className="text-[11px] text-brand-gray">
                    Installation crew A (Marcus Croft) will hoist 12mm panels onto terrace.
                  </p>
                </div>

                {/* Event 2 */}
                <div className="p-3.5 bg-[#f8f9fa] dark:bg-black/30 border border-brand-glass-border-light dark:border-white/[0.05] rounded-sm space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] uppercase text-brand-gray">
                      Friday · Sep 04, 2:00 PM
                    </span>
                  </div>
                  <span className="font-semibold text-brand-charcoal dark:text-white block">
                    AS1288 Form 15 Compliance Inspection
                  </span>
                  <p className="text-[11px] text-brand-gray">
                    Independent structural glass engineering audit for certification handover.
                  </p>
                </div>
              </div>
            </ThreeDCard>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
