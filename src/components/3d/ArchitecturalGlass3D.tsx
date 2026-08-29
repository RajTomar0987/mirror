"use client";

import React, { useRef, useState, useEffect } from "react";
import { Sparkles, Shield, Compass, Maximize2 } from "lucide-react";

export function ArchitecturalGlass3D({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: -4, y: 8 });
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    setRotation({
      x: -y * 14,
      y: x * 18,
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setRotation({ x: -4, y: 8 });
      }}
      className={`relative w-full h-[320px] sm:h-[380px] perspective-1200 flex items-center justify-center select-none ${className}`}
    >
      {/* Background Architectural Cad Grid & Radial Ambient Glow */}
      <div className="absolute inset-0 rounded-md bg-[radial-gradient(ellipse_at_center,rgba(0,102,255,0.08)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-4 rounded-md border border-brand-glass-border-light/30 dark:border-white/[0.04] bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* 3D Root Transformation Pane */}
      <div
        style={{
          transform: prefersReducedMotion
            ? "none"
            : `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: isHovered ? "transform 0.12s ease-out" : "transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
        className="relative preserve-3d w-[280px] sm:w-[340px] h-[220px] sm:h-[260px] animate-float-3d"
      >
        {/* Deep Projected Ground Shadow */}
        <div
          style={{ transform: "translateZ(-40px) translateY(70px) rotateX(85deg)" }}
          className="absolute inset-x-4 h-24 bg-black/20 dark:bg-black/40 blur-xl rounded-full pointer-events-none"
        />

        {/* REAR GLASS REFLECTION LAYER (translateZ: -12px) */}
        <div
          style={{ transform: "translateZ(-12px)" }}
          className="absolute inset-0 rounded-md border border-cyan-500/20 bg-cyan-900/5 dark:bg-cyan-500/5 backdrop-blur-[2px]"
        />

        {/* 12mm GLASS THICKNESS BEVEL EDGES */}
        <div
          style={{ transform: "translateZ(-6px)" }}
          className="absolute inset-[-1px] rounded-md border border-white/40 dark:border-cyan-400/20"
        />

        {/* MAIN FRONT STRUCTURAL GLASS PANEL (translateZ: 0px) */}
        <div
          style={{ transform: "translateZ(0px)" }}
          className="absolute inset-0 rounded-md bg-gradient-to-br from-white/80 via-white/40 to-white/10 dark:from-white/[0.12] dark:via-white/[0.04] dark:to-transparent backdrop-blur-md border border-white/60 dark:border-white/20 shadow-2xl p-4 flex flex-col justify-between overflow-hidden"
        >
          {/* Gleam light beam sweep */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 dark:via-white/15 to-transparent -skew-x-12 animate-gleam pointer-events-none" />

          {/* Top Panel Specifications */}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[9px] font-mono uppercase font-bold tracking-widest text-cyan-500 dark:text-cyan-400">
                12mm Toughened AS1288
              </span>
            </div>
            <span className="text-[9px] font-mono text-brand-gray tracking-wider">
              2400 × 1200 mm
            </span>
          </div>

          {/* Center Precision Blueprint Crosshairs */}
          <div className="relative z-10 flex flex-col items-center justify-center space-y-1 text-center py-4">
            <div className="w-10 h-10 rounded-full border border-dashed border-cyan-500/40 flex items-center justify-center text-cyan-500 dark:text-cyan-400">
              <Compass size={18} />
            </div>
            <span className="font-serif text-sm font-light text-brand-charcoal dark:text-white tracking-wide">
              Architectural Glass Unit
            </span>
            <span className="text-[9px] font-mono text-brand-gray uppercase">
              2205 Marine Duplex Spigots Attached
            </span>
          </div>

          {/* Bottom Laser Calibration Scale */}
          <div className="relative z-10 flex items-center justify-between pt-2 border-t border-brand-glass-border-light/40 dark:border-white/10 text-[9px] font-mono text-brand-gray">
            <span>Tolerance: ±0.5mm</span>
            <span className="text-emerald-500 font-bold">AS/NZS 2208:1996</span>
          </div>
        </div>

        {/* 3D FLOATING STAINLESS HARDWARE SPIGOTS (translateZ: +22px) */}
        {/* Bottom Left Spigot */}
        <div
          style={{ transform: "translateZ(22px)" }}
          className="absolute -bottom-3 left-6 w-8 h-10 rounded-sm bg-gradient-to-br from-zinc-200 via-zinc-400 to-zinc-600 dark:from-zinc-300 dark:via-zinc-500 dark:to-zinc-800 border border-white/60 shadow-lg flex flex-col items-center justify-between p-1"
        >
          <div className="w-2 h-2 rounded-full bg-zinc-800 dark:bg-black/60 shadow-inner" />
          <span className="text-[6px] font-mono uppercase text-zinc-900 dark:text-zinc-100 font-bold">2205</span>
          <div className="w-3 h-1 rounded-full bg-zinc-700 dark:bg-zinc-900" />
        </div>

        {/* Bottom Right Spigot */}
        <div
          style={{ transform: "translateZ(22px)" }}
          className="absolute -bottom-3 right-6 w-8 h-10 rounded-sm bg-gradient-to-br from-zinc-200 via-zinc-400 to-zinc-600 dark:from-zinc-300 dark:via-zinc-500 dark:to-zinc-800 border border-white/60 shadow-lg flex flex-col items-center justify-between p-1"
        >
          <div className="w-2 h-2 rounded-full bg-zinc-800 dark:bg-black/60 shadow-inner" />
          <span className="text-[6px] font-mono uppercase text-zinc-900 dark:text-zinc-100 font-bold">2205</span>
          <div className="w-3 h-1 rounded-full bg-zinc-700 dark:bg-zinc-900" />
        </div>

        {/* FLOATING MEASUREMENT CALLOUT BADGE (translateZ: +34px) */}
        <div
          style={{ transform: "translateZ(34px)" }}
          className="absolute -top-3 -right-3 px-2.5 py-1 bg-blue-600 text-white font-mono text-[9px] font-bold uppercase rounded-sm shadow-xl flex items-center gap-1 border border-blue-400/40"
        >
          <Shield size={10} /> Certified Safe
        </div>
      </div>
    </div>
  );
}
