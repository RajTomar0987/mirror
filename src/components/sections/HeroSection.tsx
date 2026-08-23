"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowDown } from "lucide-react";
import { motion } from "motion/react";
import { GlassScene } from "@/components/3d/GlassScene";
import { Reveal } from "@/components/animations/Reveal";
import { FadeIn } from "@/components/animations/FadeIn";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[calc(100vh-64px)] w-full flex flex-col justify-between pt-24 sm:pt-28 md:pt-36 pb-8 sm:pb-12 overflow-hidden bg-white text-[#111111]">
      {/* 3D Canvas Ambient Overlay */}
      <GlassScene />

      {/* Hero Editorial Grid */}
      <div className="flex-1 flex items-center max-w-7xl mx-auto px-4 sm:px-6 md:px-12 w-full z-10 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center w-full">
          
          {/* Left Column: Headline, Copy & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Eyebrow */}
            <FadeIn direction="up" delay={0.1} duration={0.6}>
              <span className="block text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] font-bold text-[#555555] mb-4 sm:mb-6">
                [Architectural Glass Solutions]
              </span>
            </FadeIn>

            {/* Main Heading Reveal */}
            <Reveal delay={0.2} duration={0.9}>
              <h1 className="font-serif text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[1.1] text-[#111111] mb-6 sm:mb-8">
                GLASS, <br />
                DESIGNED FOR <br />
                <span className="italic font-normal">MODERN LIVING.</span>
              </h1>
            </Reveal>

            {/* Supporting Text Fade */}
            <FadeIn direction="up" delay={0.4} duration={0.7}>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#555555] leading-relaxed mb-8 sm:mb-10 max-w-xl font-sans font-light">
                Exquisite custom architectural glass engineered for structural compliance, spatial clarity, and contemporary Australian living spaces.
              </p>
            </FadeIn>

            {/* CTAs */}
            <FadeIn direction="up" delay={0.5} duration={0.7}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full">
                <MagneticButton className="w-full sm:w-auto">
                  <Link
                    href="/projects"
                    className="group flex items-center justify-center gap-3 bg-[#111111] text-white text-xs uppercase tracking-[0.2em] font-bold py-4 px-8 hover:bg-[#333333] transition-all duration-300 shadow-premium w-full text-center"
                  >
                    View Our Work
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </MagneticButton>

                <MagneticButton className="w-full sm:w-auto">
                  <Link
                    href="/quote"
                    className="group flex items-center justify-center gap-2 border border-[#e5e5e5] bg-white text-[#111111] text-xs uppercase tracking-[0.2em] font-bold py-4 px-8 hover:bg-[#f7f7f5] transition-all duration-300 shadow-subtle w-full text-center"
                  >
                    Get a Free Quote
                  </Link>
                </MagneticButton>
              </div>
            </FadeIn>
          </div>

          {/* Right Column: High-Resolution Architectural Glass Hero Photo */}
          <div className="lg:col-span-5 mt-4 lg:mt-0">
            <FadeIn direction="up" delay={0.3} duration={0.8}>
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/5] bg-[#f7f7f5] border border-[#e5e5e5] overflow-hidden shadow-premium group">
                <OptimizedImage
                  src="/images/hero/hero-glass-main.jpg"
                  alt="Modern Australian luxury architectural residence with expansive floor-to-ceiling frameless glass sliding walls"
                  fill
                  priority
                  fallbackTitle="Complete Glass Innovations Architectural Installation"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                />
                
                {/* Subtle Floating Architectural Badge */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 p-3 sm:p-4 bg-white/90 backdrop-blur-md border border-[#e5e5e5] shadow-subtle flex justify-between items-center text-[#111111]">
                  <div>
                    <span className="block text-[9px] sm:text-[10px] uppercase font-mono tracking-widest text-[#555555]">
                      [Architectural Glazing]
                    </span>
                    <span className="font-serif text-xs sm:text-sm font-light">
                      Frameless Ocean Residence
                    </span>
                  </div>
                  <span className="font-mono text-[9px] sm:text-[10px] bg-[#111111] text-white px-2 py-0.5 uppercase tracking-wider">
                    AS1288
                  </span>
                </div>
              </div>
            </FadeIn>
          </div>

        </div>
      </div>

      {/* Motion Scroll Indicator */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex justify-between items-center z-10 pt-2 sm:pt-4">
        <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#555555] font-mono">
          [Scroll to Explore]
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="flex items-center gap-2 text-[#555555]"
        >
          <ArrowDown size={14} />
        </motion.div>
      </div>
    </section>
  );
};
