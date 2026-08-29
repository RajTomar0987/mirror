"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  Loader2,
  ShieldCheck,
  FileText,
  Calculator,
  Receipt,
  MessageSquare,
  Sparkles,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { getAuthHeaders } from "@/lib/auth-client";
import { POSProject } from "@/types";
import { ThreeDTimeline, TimelineStage } from "@/components/3d/ThreeDTimeline";
import { ThreeDCard } from "@/components/3d/ThreeDCard";

const EIGHT_STAGES: TimelineStage[] = [
  { id: "consultation", label: "Consultation", desc: "Initial architectural glazing requirements & structural feasibility check." },
  { id: "design", label: "Design & CAD", desc: "CAD shop drawings & AS1288 load calculations." },
  { id: "measurement", label: "Laser Templating", desc: "Digital 3D laser templating with ±0.5mm tolerance." },
  { id: "engineering", label: "Engineering Sign-off", desc: "Form 15 structural certification & spigot sign-off." },
  { id: "fabrication", label: "Furnace Tempering", desc: "CNC waterjet cutting, edge beveling & glass tempering." },
  { id: "delivery", label: "Site Dispatch", desc: "Specialist glass crane delivery to Vaucluse site." },
  { id: "installation", label: "Glazing Installation", desc: "Master glaziers hoist & fix duplex 2205 hardware." },
  { id: "completed", label: "Handover & Sign-off", desc: "AS1288 certificate of compliance handover." },
];

export default function CustomerProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const { id } = resolvedParams;

  const [project, setProject] = useState<POSProject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/portal/projects", { headers: getAuthHeaders() });
        const json = (await res.json()) as { success?: boolean; data?: POSProject[] };
        if (json && json.success && json.data) {
          const found = json.data.find((p) => p.id === id) || json.data[0] || null;
          setProject(found);
        }
      } catch (err) {
        console.error("Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [id]);

  const currentStageIndex = project?.status === "completed" ? 7 : project?.status === "in_progress" ? 4 : project?.status === "scheduled" ? 2 : 1;
  const progressPercentage = Math.round(((currentStageIndex + 1) / EIGHT_STAGES.length) * 100);

  return (
    <PortalLayout>
      <div className="space-y-8 max-w-5xl">
        {/* Back Link & Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/portal/projects"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-brand-gray hover:text-brand-charcoal dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Back to Projects
          </Link>

          <Link
            href="/portal/messages"
            className="btn-3d inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold uppercase rounded-sm transition-all shadow-md self-start sm:self-auto"
          >
            <MessageSquare size={13} /> Message Project Manager
          </Link>
        </div>

        {loading ? (
          <div className="py-24 text-center text-xs font-mono text-brand-gray flex flex-col items-center justify-center gap-3">
            <Loader2 size={24} className="animate-spin text-cyan-500" />
            <span>Loading project milestones...</span>
          </div>
        ) : !project ? (
          <div className="p-8 border border-red-500/20 bg-red-500/5 text-center text-xs font-mono text-red-400 rounded-sm">
            Project not found.
          </div>
        ) : (
          <div className="space-y-8">
            {/* Overview Card with 3D Depth */}
            <ThreeDCard
              maxRotation={3}
              depth={16}
              className="p-6 sm:p-8 bg-white dark:bg-[#0f1217] border border-brand-glass-border-light dark:border-white/[0.08] rounded-sm space-y-6 shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-glass-border-light dark:border-white/[0.08]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 border border-cyan-500/30 text-cyan-400 bg-cyan-500/10 font-bold rounded-sm">
                      {project.status.replace("_", " ")}
                    </span>
                    <span className="text-xs font-mono text-brand-gray">Project ID: {project.id?.slice(0, 11)}</span>
                  </div>
                  <h1 className="font-serif text-3xl font-light text-brand-charcoal dark:text-white">
                    {project.project_name}
                  </h1>
                </div>

                <div className="sm:text-right">
                  <span className="text-[10px] uppercase font-mono text-brand-gray block">Overall Completion</span>
                  <span className="font-serif text-3xl font-bold text-cyan-400">{progressPercentage}%</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="w-full bg-black/10 dark:bg-white/10 h-3 rounded-full overflow-hidden p-0.5 shadow-inner">
                  <div
                    className="bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-700"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="p-3.5 bg-[#f8f9fa] dark:bg-black/30 border border-brand-glass-border-light dark:border-white/[0.05] rounded-sm space-y-1">
                  <span className="text-[10px] uppercase font-mono text-brand-gray block">Service Category</span>
                  <span className="font-semibold text-brand-charcoal dark:text-white block">{project.service}</span>
                </div>

                <div className="p-3.5 bg-[#f8f9fa] dark:bg-black/30 border border-brand-glass-border-light dark:border-white/[0.05] rounded-sm space-y-1">
                  <span className="text-[10px] uppercase font-mono text-brand-gray block">Site Location</span>
                  <span className="font-medium text-brand-charcoal dark:text-white block">{project.location}</span>
                </div>

                <div className="p-3.5 bg-[#f8f9fa] dark:bg-black/30 border border-brand-glass-border-light dark:border-white/[0.05] rounded-sm space-y-1">
                  <span className="text-[10px] uppercase font-mono text-brand-gray block">Start Date</span>
                  <span className="font-mono text-brand-charcoal dark:text-white block">{project.start_date || "Aug 10, 2026"}</span>
                </div>

                <div className="p-3.5 bg-[#f8f9fa] dark:bg-black/30 border border-brand-glass-border-light dark:border-white/[0.05] rounded-sm space-y-1">
                  <span className="text-[10px] uppercase font-mono text-brand-gray block">Expected Handover</span>
                  <span className="font-mono text-brand-charcoal dark:text-white block">{project.expected_completion || "Sep 18, 2026"}</span>
                </div>
              </div>
            </ThreeDCard>

            {/* 3D 8-STAGE PROJECT TIMELINE */}
            <div className="space-y-4">
              <h2 className="text-xs uppercase font-mono tracking-widest text-brand-charcoal dark:text-white flex items-center gap-2 pb-2 border-b border-brand-glass-border-light dark:border-white/[0.08] font-bold">
                <Layers size={14} className="text-cyan-400" /> Complete 8-Stage Architectural Glazing Sequence
              </h2>

              <ThreeDTimeline
                stages={EIGHT_STAGES}
                currentStageIndex={currentStageIndex}
              />
            </div>

            {/* Quick Links to Linked Documents */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href="/portal/quotes"
                className="p-4 bg-white dark:bg-[#0f1217] border border-brand-glass-border-light dark:border-white/[0.08] hover:border-blue-500/40 rounded-sm transition-all flex items-center justify-between text-xs group shadow-sm hover:translate-y-[-2px]"
              >
                <div className="flex items-center gap-3">
                  <FileText size={16} className="text-blue-400" />
                  <span className="font-mono uppercase font-bold text-brand-charcoal dark:text-white">Linked Quote Spec</span>
                </div>
                <ArrowUpRight size={14} className="text-brand-gray group-hover:text-blue-400" />
              </Link>

              <Link
                href="/portal/estimates"
                className="p-4 bg-white dark:bg-[#0f1217] border border-brand-glass-border-light dark:border-white/[0.08] hover:border-purple-500/40 rounded-sm transition-all flex items-center justify-between text-xs group shadow-sm hover:translate-y-[-2px]"
              >
                <div className="flex items-center gap-3">
                  <Calculator size={16} className="text-purple-400" />
                  <span className="font-mono uppercase font-bold text-brand-charcoal dark:text-white">Commercial Estimate</span>
                </div>
                <ArrowUpRight size={14} className="text-brand-gray group-hover:text-purple-400" />
              </Link>

              <Link
                href="/portal/invoices"
                className="p-4 bg-white dark:bg-[#0f1217] border border-brand-glass-border-light dark:border-white/[0.08] hover:border-amber-500/40 rounded-sm transition-all flex items-center justify-between text-xs group shadow-sm hover:translate-y-[-2px]"
              >
                <div className="flex items-center gap-3">
                  <Receipt size={16} className="text-amber-400" />
                  <span className="font-mono uppercase font-bold text-brand-charcoal dark:text-white">Deposit Invoices</span>
                </div>
                <ArrowUpRight size={14} className="text-brand-gray group-hover:text-amber-400" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
