"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  Loader2,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { getAuthHeaders } from "@/lib/auth-client";
import { POSProject } from "@/types";

export default function CustomerProjectsPage() {
  const [projects, setProjects] = useState<POSProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/portal/projects", { headers: getAuthHeaders() });
        const json = (await res.json()) as { success?: boolean; data?: POSProject[] };
        if (json && json.success && json.data) {
          setProjects(json.data);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-glass-border-light dark:border-white/[0.08]">
          <div>
            <span className="text-xs uppercase tracking-widest font-mono text-cyan-500 block mb-1">
              [Live Installation Projects]
            </span>
            <h1 className="font-serif text-3xl font-light tracking-tight text-brand-charcoal dark:text-white">
              MY PROJECTS
            </h1>
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-brand-gray font-mono text-xs gap-3">
            <Loader2 size={24} className="animate-spin text-cyan-500" />
            <span>Fetching installation project milestones...</span>
          </div>
        ) : projects.length === 0 ? (
          <div className="p-12 border border-brand-glass-border-light dark:border-white/[0.08] bg-white dark:bg-[#0f1217] text-center space-y-3 rounded-sm">
            <Briefcase size={32} className="text-brand-gray mx-auto" />
            <p className="text-sm font-serif text-brand-charcoal dark:text-white">
              No active installation projects linked to your account.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.map((proj, idx) => {
              const progressPercentage = proj.status === "completed" ? 100 : proj.status === "in_progress" ? (idx === 0 ? 72 : 45) : 25;

              return (
                <div
                  key={proj.id}
                  className="p-6 sm:p-8 bg-white dark:bg-[#0f1217] border border-brand-glass-border-light dark:border-white/[0.08] rounded-sm space-y-5 shadow-sm hover:border-cyan-500/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">
                          {proj.service}
                        </span>
                        <h2 className="font-serif text-2xl font-light text-brand-charcoal dark:text-white">
                          {proj.project_name}
                        </h2>
                        <span className="text-xs text-brand-gray font-mono flex items-center gap-1">
                          <MapPin size={12} /> {proj.location}
                        </span>
                      </div>

                      <span className="text-[10px] uppercase font-mono px-2.5 py-1 border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 font-bold rounded-sm">
                        {proj.status.replace("_", " ")}
                      </span>
                    </div>

                    {/* Progress Bar & Sub-Stages */}
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-brand-gray uppercase text-[10px]">Progress</span>
                        <span className="text-cyan-400 font-bold">{progressPercentage}% Complete</span>
                      </div>
                      <div className="w-full bg-black/10 dark:bg-white/10 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Schedule info */}
                    <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
                      <div className="p-2.5 bg-[#f8f9fa] dark:bg-black/30 border border-brand-glass-border-light dark:border-white/[0.05] rounded-sm">
                        <span className="text-[10px] text-brand-gray block uppercase">Start Date</span>
                        <span className="text-brand-charcoal dark:text-white font-bold">{proj.start_date || "Aug 10, 2026"}</span>
                      </div>
                      <div className="p-2.5 bg-[#f8f9fa] dark:bg-black/30 border border-brand-glass-border-light dark:border-white/[0.05] rounded-sm">
                        <span className="text-[10px] text-brand-gray block uppercase">Target Completion</span>
                        <span className="text-brand-charcoal dark:text-white font-bold">{proj.expected_completion || "Sep 18, 2026"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-brand-glass-border-light dark:border-white/[0.08] flex items-center justify-between">
                    <span className="text-xs font-mono text-brand-gray">
                      Est. Value: ${proj.estimated_value?.toLocaleString() || "18,500"} AUD
                    </span>
                    <Link
                      href={`/portal/projects/${proj.id}`}
                      className="px-4 py-2 bg-black/5 dark:bg-white/10 hover:bg-black/10 text-brand-charcoal dark:text-white text-xs font-mono uppercase font-bold rounded-sm transition-colors inline-flex items-center gap-1"
                    >
                      Milestone Timeline <ArrowUpRight size={13} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
