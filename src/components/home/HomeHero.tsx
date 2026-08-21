"use client";

import Link from "next/link";
import { ArrowRight, ArrowDown } from "lucide-react";
import { GlassScene } from "@/components/3d/GlassScene";

export const HomeHero = () => {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between pt-32 pb-12 overflow-hidden">
      {/* 3D Canvas Background */}
      <GlassScene />

      {/* Hero Content */}
      <div className="flex-1 flex flex-col justify-center max-w-7xl mx-auto px-6 md:px-12 w-full z-10">
        <div className="max-w-3xl">
          {/* Sub-headline */}
          <span className="block text-xs md:text-sm uppercase tracking-[0.3em] font-bold text-brand-gray mb-6 animate-pulse">
            Premium Architectural Glass Solutions
          </span>
          
          {/* Title */}
          <h1 className="font-serif text-5xl md:text-7xl font-light tracking-tight leading-[1.1] mb-8 text-brand-charcoal dark:text-white">
            GLASS, DESIGNED FOR <br className="hidden md:inline" />
            <span className="italic font-normal">MODERN LIVING.</span>
          </h1>
          
          {/* Supporting Text */}
          <p className="text-base md:text-lg text-brand-gray leading-relaxed mb-10 max-w-xl dark:text-brand-gray-light">
            Custom glass solutions crafted for contemporary residential and commercial spaces. Engineered for durability, design, and sophisticated aesthetics.
          </p>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              href="/quote"
              className="group flex items-center justify-center gap-2 bg-brand-charcoal dark:bg-white text-white dark:text-brand-charcoal text-xs uppercase tracking-widest font-bold py-4 px-8 hover:bg-brand-gray dark:hover:bg-brand-gray-light transition-all duration-300"
            >
              Get a Free Quote
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="/projects"
              className="group flex items-center justify-center gap-2 border border-brand-charcoal/20 dark:border-white/20 text-brand-charcoal dark:text-white text-xs uppercase tracking-widest font-bold py-4 px-8 hover:bg-white/50 dark:hover:bg-white/10 transition-all duration-300"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center z-10">
        <span className="text-[10px] uppercase tracking-[0.2em] text-brand-gray/60 font-mono">
          [Scroll to Explore]
        </span>
        <div className="flex items-center gap-2 text-brand-gray/60 animate-bounce">
          <ArrowDown size={14} />
        </div>
      </div>
    </section>
  );
};
