"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, FileText, Layers, ShieldCheck } from "lucide-react";
import { ThreeDCard } from "./ThreeDCard";

interface ThreeDQuoteCardProps {
  id: string;
  quoteNumber: string;
  service: string;
  amount: string | number;
  status: string;
  description: string;
  date: string;
  className?: string;
}

export function ThreeDQuoteCard({
  id,
  quoteNumber,
  service,
  amount,
  status,
  description,
  date,
  className = "",
}: ThreeDQuoteCardProps) {
  const statusColors: Record<string, string> = {
    new: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    contacted: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    in_review: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    estimate_sent: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  };

  const badgeStyle = statusColors[status.toLowerCase()] || "bg-gray-500/10 text-gray-400 border-gray-500/30";

  return (
    <ThreeDCard
      maxRotation={5}
      depth={14}
      className={`p-5 bg-white dark:bg-[#0f1217] border border-brand-glass-border-light dark:border-white/[0.08] shadow-sm hover:border-blue-500/40 transition-colors group ${className}`}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-[10px] font-mono uppercase text-brand-gray block">
              Quote {quoteNumber}
            </span>
            <h4 className="font-serif text-lg font-light text-brand-charcoal dark:text-white group-hover:text-blue-500 transition-colors">
              {service}
            </h4>
          </div>

          <span
            style={{ transform: "translateZ(12px)" }}
            className={`text-[9px] font-mono uppercase px-2 py-0.5 border rounded-sm font-bold ${badgeStyle}`}
          >
            {status.replace("_", " ")}
          </span>
        </div>

        {/* Small floating 3D glass panel preview */}
        <div
          style={{ transform: "translateZ(8px)" }}
          className="p-3 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 border border-brand-glass-border-light/40 dark:border-white/5 rounded-sm flex items-center justify-between text-xs font-mono"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-sm bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Layers size={13} />
            </div>
            <span className="text-brand-gray text-[11px] truncate max-w-[180px]">
              {description}
            </span>
          </div>

          <span className="font-bold text-brand-charcoal dark:text-white">
            ${typeof amount === "number" ? amount.toLocaleString() : amount}
          </span>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-brand-glass-border-light dark:border-white/[0.08] flex items-center justify-between text-xs">
          <span className="text-[10px] font-mono text-brand-gray">{date}</span>

          <Link
            href={`/portal/quotes/${id}`}
            style={{ transform: "translateZ(10px)" }}
            className="text-xs font-mono text-blue-500 hover:underline inline-flex items-center gap-1 font-semibold"
          >
            View Spec Sheet <ArrowUpRight size={12} />
          </Link>
        </div>
      </div>
    </ThreeDCard>
  );
}
