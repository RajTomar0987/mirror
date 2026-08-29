"use client";

import React, { useState } from "react";
import { TrendingUp, DollarSign, ShieldCheck } from "lucide-react";
import { ThreeDCard } from "./ThreeDCard";

interface FinancialStage {
  label: string;
  amount: number;
  color: string;
  bgGradient: string;
  glow: string;
  percentage: number;
}

export function ThreeDFinancialChart({
  quoted = 24350,
  approved = 18500,
  invoiced = 9700,
  paid = 4850,
  className = "",
}: {
  quoted?: number;
  approved?: number;
  invoiced?: number;
  paid?: number;
  className?: string;
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const maxVal = Math.max(quoted, approved, invoiced, paid, 1);

  const stages: FinancialStage[] = [
    {
      label: "Quoted Value",
      amount: quoted,
      color: "text-blue-500",
      bgGradient: "from-blue-600 to-cyan-500",
      glow: "rgba(0, 102, 255, 0.4)",
      percentage: Math.round((quoted / maxVal) * 100),
    },
    {
      label: "Approved Contracts",
      amount: approved,
      color: "text-purple-500",
      bgGradient: "from-purple-600 to-indigo-500",
      glow: "rgba(168, 85, 247, 0.4)",
      percentage: Math.round((approved / maxVal) * 100),
    },
    {
      label: "Progressive Invoiced",
      amount: invoiced,
      color: "text-amber-500",
      bgGradient: "from-amber-500 to-orange-500",
      glow: "rgba(245, 158, 11, 0.4)",
      percentage: Math.round((invoiced / maxVal) * 100),
    },
    {
      label: "Settled / Paid",
      amount: paid,
      color: "text-emerald-500",
      bgGradient: "from-emerald-500 to-teal-400",
      glow: "rgba(16, 185, 129, 0.4)",
      percentage: Math.round((paid / maxVal) * 100),
    },
  ];

  return (
    <ThreeDCard
      maxRotation={3}
      depth={14}
      className={`p-6 sm:p-8 bg-white dark:bg-[#0f1217] border border-brand-glass-border-light dark:border-white/[0.08] shadow-md space-y-6 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-brand-glass-border-light dark:border-white/[0.08]">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-bold block mb-0.5">
            [Financial Execution Lifecycle]
          </span>
          <h3 className="font-serif text-xl font-light text-brand-charcoal dark:text-white">
            Capital Allocation & Conversion
          </h3>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-brand-gray">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Audited in AUD (10% GST Inclusive)</span>
        </div>
      </div>

      {/* 3D Visual Bar Chart Columns with Spatial Stacking */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-end pt-4 min-h-[220px]">
        {stages.map((st, idx) => {
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={st.label}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="flex flex-col items-center gap-2 group cursor-pointer transition-all"
            >
              {/* Floating Value Pill */}
              <div
                style={{
                  transform: isHovered ? "translateY(-6px) scale(1.05)" : "none",
                  transition: "transform 0.2s ease",
                }}
                className="px-2.5 py-1 bg-[#f8f9fa] dark:bg-black/50 border border-brand-glass-border-light dark:border-white/[0.08] rounded-sm text-center shadow-xs"
              >
                <span className="font-mono text-xs font-bold text-brand-charcoal dark:text-white block">
                  ${st.amount.toLocaleString("en-AU")}
                </span>
                <span className="text-[9px] font-mono text-brand-gray">
                  {st.percentage}%
                </span>
              </div>

              {/* 3D Dimensional Bar Column */}
              <div className="w-full max-w-[70px] h-[140px] bg-black/5 dark:bg-white/5 rounded-t-md p-1 flex items-end relative overflow-hidden border border-black/5 dark:border-white/5 shadow-inner">
                <div
                  style={{
                    height: `${st.percentage}%`,
                    boxShadow: isHovered ? `0 0 20px ${st.glow}` : "none",
                  }}
                  className={`w-full bg-gradient-to-t ${st.bgGradient} rounded-t-sm transition-all duration-700 relative`}
                >
                  {/* Glass Sheen Streak */}
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Label */}
              <span className="text-[10px] font-mono uppercase text-brand-gray text-center font-semibold pt-1">
                {st.label}
              </span>
            </div>
          );
        })}
      </div>
    </ThreeDCard>
  );
}
