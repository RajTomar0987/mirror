"use client";

import React from "react";
import { Check, Clock, Sparkles } from "lucide-react";
import { ThreeDCard } from "./ThreeDCard";

export interface TimelineStage {
  id: string;
  label: string;
  desc: string;
}

interface ThreeDTimelineProps {
  stages: TimelineStage[];
  currentStageIndex: number;
  className?: string;
}

export function ThreeDTimeline({
  stages,
  currentStageIndex = 0,
  className = "",
}: ThreeDTimelineProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-sans">
        {stages.map((st, idx) => {
          const isCompleted = idx < currentStageIndex;
          const isCurrent = idx === currentStageIndex;
          const isPending = idx > currentStageIndex;

          return (
            <ThreeDCard
              key={st.id}
              maxRotation={isCurrent ? 6 : 3}
              depth={isCurrent ? 20 : isCompleted ? 12 : 4}
              className={`p-4 border rounded-sm transition-all relative overflow-hidden ${
                isCurrent
                  ? "border-blue-500 bg-blue-500/10 text-brand-charcoal dark:text-white shadow-lg ring-1 ring-blue-500/50"
                  : isCompleted
                  ? "border-emerald-500/30 bg-emerald-500/5 text-brand-charcoal dark:text-white shadow-sm"
                  : "border-brand-glass-border-light/50 dark:border-white/5 bg-transparent opacity-60"
              }`}
            >
              {/* Active Pulsing Laser Glow Accent */}
              {isCurrent && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/20 rounded-full blur-xl animate-pulse pointer-events-none" />
              )}

              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[9px] uppercase tracking-widest text-brand-gray font-bold">
                  Stage 0{idx + 1}
                </span>

                {isCompleted ? (
                  <div
                    style={{ transform: "translateZ(14px)" }}
                    className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm"
                  >
                    <Check size={12} strokeWidth={3} />
                  </div>
                ) : isCurrent ? (
                  <div
                    style={{ transform: "translateZ(16px)" }}
                    className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md animate-pulse"
                  >
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border border-brand-gray/30 text-brand-gray flex items-center justify-center">
                    <Clock size={11} />
                  </div>
                )}
              </div>

              <div style={{ transform: isCurrent ? "translateZ(10px)" : "none" }}>
                <span className="font-bold text-sm text-brand-charcoal dark:text-white block mb-1">
                  {st.label}
                </span>
                <p className="text-[11px] text-brand-gray leading-snug font-sans">{st.desc}</p>
              </div>

              {isCurrent && (
                <div className="mt-3 pt-2 border-t border-blue-500/20 flex items-center gap-1.5 text-[9px] font-mono uppercase text-blue-400 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
                  Currently In Progress
                </div>
              )}
            </ThreeDCard>
          );
        })}
      </div>
    </div>
  );
}
