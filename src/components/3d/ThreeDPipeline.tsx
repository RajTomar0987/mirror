"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight, Layers, FileText } from "lucide-react";
import { ThreeDCard } from "./ThreeDCard";

export interface PipelineStage {
  id: string;
  name: string;
  count: number;
  totalValue: number;
  color: string;
  border: string;
  quotes: Array<{
    id: string;
    quoteNumber: string;
    customerName: string;
    service: string;
    value: number;
    date: string;
  }>;
}

interface ThreeDPipelineProps {
  stages: PipelineStage[];
  onSelectQuote?: (id: string) => void;
  className?: string;
}

export function ThreeDPipeline({
  stages,
  onSelectQuote,
  className = "",
}: ThreeDPipelineProps) {
  return (
    <div className={`overflow-x-auto pb-4 ${className}`}>
      <div className="flex gap-4 min-w-[900px]">
        {stages.map((st) => (
          <div
            key={st.id}
            className="flex-1 min-w-[200px] p-3.5 bg-white dark:bg-[#0f1217] border border-brand-glass-border-light dark:border-white/[0.08] rounded-sm space-y-3 flex flex-col justify-between shadow-xs"
          >
            {/* Stage Column Header */}
            <div className="pb-2 border-b border-brand-glass-border-light dark:border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${st.color}`} />
                <span className="font-mono text-xs font-bold uppercase text-brand-charcoal dark:text-white">
                  {st.name}
                </span>
              </div>
              <span className="px-1.5 py-0.5 bg-black/5 dark:bg-white/10 rounded-sm font-mono text-[10px] font-bold text-brand-charcoal dark:text-white">
                {st.count}
              </span>
            </div>

            {/* Stage Quotes List */}
            <div className="space-y-2 flex-1">
              {st.quotes.length === 0 ? (
                <div className="py-6 text-center text-[10px] font-mono text-brand-gray border border-dashed border-brand-glass-border-light dark:border-white/[0.05] rounded-sm">
                  Empty
                </div>
              ) : (
                st.quotes.map((q) => (
                  <ThreeDCard
                    key={q.id}
                    maxRotation={4}
                    depth={8}
                    onClick={() => onSelectQuote?.(q.id)}
                    className="p-3 bg-[#f8f9fa] dark:bg-black/30 border border-brand-glass-border-light dark:border-white/[0.05] hover:border-blue-500/40 rounded-sm space-y-1.5 cursor-pointer shadow-xs transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] text-blue-500 font-bold uppercase">
                        {q.quoteNumber}
                      </span>
                      <span className="font-mono text-[9px] text-brand-gray">{q.date}</span>
                    </div>

                    <span className="font-semibold text-xs text-brand-charcoal dark:text-white block group-hover:text-blue-400 transition-colors">
                      {q.customerName}
                    </span>

                    <div className="flex items-center justify-between pt-1 border-t border-brand-glass-border-light/50 dark:border-white/[0.03] text-[10px] font-mono">
                      <span className="text-brand-gray truncate max-w-[100px]">{q.service}</span>
                      <span className="font-bold text-brand-charcoal dark:text-white">
                        ${q.value.toLocaleString()}
                      </span>
                    </div>
                  </ThreeDCard>
                ))
              )}
            </div>

            {/* Column Summary Footer */}
            <div className="pt-2 border-t border-brand-glass-border-light dark:border-white/[0.08] text-[10px] font-mono flex justify-between text-brand-gray">
              <span>Total Value</span>
              <span className="font-bold text-brand-charcoal dark:text-white">
                ${st.totalValue.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
