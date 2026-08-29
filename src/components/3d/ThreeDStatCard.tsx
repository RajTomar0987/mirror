"use client";

import React, { useState, useEffect } from "react";
import { ThreeDCard } from "./ThreeDCard";

interface ThreeDStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  accentColor?: string; // e.g. "blue" | "purple" | "cyan" | "emerald" | "amber"
  trend?: string;
  className?: string;
}

export function ThreeDStatCard({
  title,
  value,
  subtitle,
  icon,
  accentColor = "blue",
  trend,
  className = "",
}: ThreeDStatCardProps) {
  const [displayValue, setDisplayValue] = useState<string | number>(0);

  // Smooth numeric counter animation if value is numeric or currency
  useEffect(() => {
    if (typeof value === "number") {
      let start = 0;
      const duration = 800;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutExpo
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        setDisplayValue(Math.round(start + (value - start) * eased));

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayValue(value);
        }
      };

      requestAnimationFrame(animate);
    } else {
      setDisplayValue(value);
    }
  }, [value]);

  const colorVariants: Record<string, { border: string; glow: string; text: string; bg: string }> = {
    blue: {
      border: "hover:border-blue-500/50",
      glow: "from-blue-500/10",
      text: "text-blue-500 dark:text-blue-400",
      bg: "bg-blue-500/10",
    },
    purple: {
      border: "hover:border-purple-500/50",
      glow: "from-purple-500/10",
      text: "text-purple-500 dark:text-purple-400",
      bg: "bg-purple-500/10",
    },
    cyan: {
      border: "hover:border-cyan-500/50",
      glow: "from-cyan-500/10",
      text: "text-cyan-500 dark:text-cyan-400",
      bg: "bg-cyan-500/10",
    },
    emerald: {
      border: "hover:border-emerald-500/50",
      glow: "from-emerald-500/10",
      text: "text-emerald-500 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    amber: {
      border: "hover:border-amber-500/50",
      glow: "from-amber-500/10",
      text: "text-amber-500 dark:text-amber-400",
      bg: "bg-amber-500/10",
    },
  };

  const theme = colorVariants[accentColor] || colorVariants.blue;

  return (
    <ThreeDCard
      maxRotation={5}
      depth={14}
      className={`p-5 bg-white dark:bg-[#0f1217] border border-brand-glass-border-light dark:border-white/[0.08] ${theme.border} shadow-sm group ${className}`}
    >
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-wider text-brand-gray block font-semibold">
            {title}
          </span>
          <div className="font-serif text-3xl font-light text-brand-charcoal dark:text-white tracking-tight flex items-baseline gap-1">
            <span>{displayValue}</span>
          </div>
          {subtitle && (
            <span className="text-[11px] text-brand-gray block font-sans">
              {subtitle}
            </span>
          )}
          {trend && (
            <span className="inline-block text-[9px] font-mono text-emerald-500 font-bold uppercase mt-1">
              {trend}
            </span>
          )}
        </div>

        {/* Floating 3D Icon Badge */}
        <div
          style={{ transform: "translateZ(18px)" }}
          className={`w-10 h-10 rounded-sm ${theme.bg} ${theme.text} flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110`}
        >
          {icon}
        </div>
      </div>

      {/* Ambient glass bevel edge */}
      <div
        className={`absolute inset-0 rounded-sm bg-gradient-to-br ${theme.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
      />
    </ThreeDCard>
  );
}
