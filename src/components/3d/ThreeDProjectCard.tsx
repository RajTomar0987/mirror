"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Layers, MapPin, Calendar, Clock } from "lucide-react";
import { ThreeDCard } from "./ThreeDCard";

interface SubStage {
  label: string;
  percent: number;
  status: "completed" | "in_progress" | "pending";
}

interface ThreeDProjectCardProps {
  id?: string;
  title: string;
  service: string;
  location: string;
  progress: number;
  subStages: SubStage[];
  nextMilestone: string;
  completionDate: string;
  className?: string;
}

export function ThreeDProjectCard({
  id = "pos-proj-1",
  title,
  service,
  location,
  progress = 72,
  subStages,
  nextMilestone,
  completionDate,
  className = "",
}: ThreeDProjectCardProps) {
  return (
    <ThreeDCard
      maxRotation={4}
      depth={16}
      className={`p-6 sm:p-8 bg-white dark:bg-[#0f1217] border border-brand-glass-border-light dark:border-white/[0.08] shadow-md relative overflow-hidden group ${className}`}
    >
      {/* Background Architectural Blueprint Blueprint Grid Line Overlay */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 dark:opacity-20 pointer-events-none bg-[radial-gradient(#0066ff_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="relative z-10 space-y-6">
        {/* Top Header with Dimensional Tag */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                style={{ transform: "translateZ(8px)" }}
                className="text-[10px] font-mono uppercase px-2.5 py-0.5 border border-cyan-500/30 text-cyan-400 bg-cyan-500/10 font-bold rounded-sm inline-flex items-center gap-1"
              >
                <Layers size={10} /> {service}
              </span>
              <span className="text-xs font-mono text-brand-gray flex items-center gap-1">
                <MapPin size={11} /> {location}
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-light text-brand-charcoal dark:text-white pt-1">
              {title}
            </h2>
          </div>

          {/* 3D Circular Progress Radial Badge */}
          <div
            style={{ transform: "translateZ(20px)" }}
            className="flex items-center gap-3 p-3 bg-[#f8f9fa] dark:bg-black/40 border border-brand-glass-border-light dark:border-white/[0.08] rounded-sm shadow-sm self-start"
          >
            <div className="text-right">
              <span className="text-[9px] uppercase font-mono text-brand-gray block">Overall</span>
              <span className="font-serif text-2xl font-light text-cyan-400 font-bold block leading-none">
                {progress}%
              </span>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin-slow flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </div>
          </div>
        </div>

        {/* 3D Layered Progress Bar with Glass Elevation */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-brand-gray">
            <span>Progress Execution</span>
            <span className="text-cyan-400 font-bold">{progress}% Complete</span>
          </div>
          <div
            style={{ transform: "translateZ(6px)" }}
            className="w-full bg-black/10 dark:bg-white/10 h-3 rounded-full overflow-hidden p-0.5 border border-black/5 dark:border-white/5 shadow-inner"
          >
            <div
              className="bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-700 shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 4 Dimensional Sub-Stage Progress Gauges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-sans">
          {subStages.map((st, idx) => (
            <div
              key={idx}
              style={{ transform: "translateZ(10px)" }}
              className="p-3 bg-[#f8f9fa] dark:bg-black/30 border border-brand-glass-border-light dark:border-white/[0.05] rounded-sm space-y-1.5 shadow-xs hover:border-cyan-500/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-brand-gray font-bold">
                  {st.label}
                </span>
                <span className="text-[10px] font-mono text-cyan-400 font-bold">
                  {st.percent}%
                </span>
              </div>
              <div className="w-full bg-black/10 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    st.percent === 100 ? "bg-emerald-400" : "bg-cyan-400"
                  }`}
                  style={{ width: `${st.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Footer Meta & Direct Link */}
        <div className="pt-4 border-t border-brand-glass-border-light dark:border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs font-mono text-brand-gray">
            <div className="flex items-center gap-1.5">
              <Clock size={13} className="text-cyan-400" />
              <span>Next: <strong className="text-brand-charcoal dark:text-white">{nextMilestone}</strong></span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <Calendar size={13} className="text-brand-gray" />
              <span>Handover: <strong className="text-brand-charcoal dark:text-white">{completionDate}</strong></span>
            </div>
          </div>

          <Link
            href={`/portal/projects/${id}`}
            style={{ transform: "translateZ(14px)" }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold uppercase rounded-sm transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto shadow-md"
          >
            Full Project View <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>
    </ThreeDCard>
  );
}
