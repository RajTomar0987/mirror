"use client";

import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight, ArrowDown } from "lucide-react";
import { motion } from "motion/react";
import { MobileFallback } from "@/components/3d/MobileFallback";
import { Reveal } from "@/components/animations/Reveal";
import { FadeIn } from "@/components/animations/FadeIn";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

const GlassScene = dynamic(
  () => import("@/components/3d/GlassScene").then((mod) => mod.GlassScene),
  {
    ssr: false,
    loading: () => <MobileFallback />,
  }
);

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[calc(100vh-64px)] w-full flex flex-col justify-between pt-24 sm:pt-28 md:pt-32 pb-6 sm:pb-10 overflow-hidden bg-white text-[#111111]">
      {/* 3D Canvas Ambient Overlay */}
      <GlassScene />

      {/* Hero Editorial Grid */}
      <div className="flex-1 flex items-center max-w-7xl mx-auto px-4 sm:px-6 md:px-12 w-full z-10 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center w-full">

          {/* Mobile: Image first */}
          <div className="lg:hidden w-full">
            <FadeIn direction="up" delay={0.15} duration={0.8}>
              <div className="relative w-full aspect-[16/10] bg-[#f7f7f5] border border-[#e5e5e5] overflow-hidden shadow-premium group">
                <OptimizedImage
                  src="/images/hero/hero-glass-main.jpg"
                  alt="Modern Australian luxury architectural residence with expansive floor-to-ceiling frameless glass sliding walls"
                  fill
                  priority
                  fallbackTitle="Complete Glass Innovations Architectural Installation"
                  sizes="100vw"
                  className="group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                />
                {/* Mobile floating badge */}
                <div className="absolute bottom-3 left-3 right-3 p-3 bg-white/90 backdrop-blur-md border border-[#e5e5e5] shadow-subtle flex justify-between items-center text-[#111111]">
                  <div>
                    <span className="block text-[9px] uppercase font-mono tracking-widest text-[#555555]">
                      [Architectural Glazing]
                    </span>
                    <span className="font-serif text-xs font-light">
                      Frameless Ocean Residence
                    </span>
                  </div>
                  <span className="font-mono text-[9px] bg-[#111111] text-white px-2 py-0.5 uppercase tracking-wider">
                    AS1288
                  </span>
                </div>
              </div>
            </FadeIn>
          </div>
          
          {/* Left Column: Headline, Copy & CTAs */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center">
            {/* Eyebrow */}
            <FadeIn direction="up" delay={0.1} duration={0.6}>
              <span className="block text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] font-bold text-[#555555] mb-3 sm:mb-5">
                [Architectural Glass Solutions]
              </span>
            </FadeIn>

            {/* Main Heading Reveal */}
            <Reveal delay={0.2} duration={0.9}>
              <h1 className="font-serif text-[2rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light tracking-tight leading-[1.08] text-[#111111] mb-5 sm:mb-7">
                GLASS, <br />
                DESIGNED FOR <br />
                <span className="italic font-normal">MODERN LIVING.</span>
              </h1>
            </Reveal>

            {/* Supporting Text */}
            <FadeIn direction="up" delay={0.4} duration={0.7}>
              <p className="text-sm sm:text-base md:text-lg text-[#555555] leading-relaxed mb-7 sm:mb-9 max-w-lg font-sans font-light">
                Exquisite custom architectural glass engineered for structural compliance, spatial clarity, and contemporary Australian living spaces.
              </p>
            </FadeIn>

            {/* CTAs — Quote first */}
            <FadeIn direction="up" delay={0.5} duration={0.7}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full">
                <MagneticButton className="w-full sm:w-auto">
                  <Link
                    href="/quote"
                    className="group flex items-center justify-center gap-3 bg-[#111111] text-white text-xs uppercase tracking-[0.2em] font-bold py-4 px-8 hover:bg-[#333333] transition-all duration-300 shadow-premium w-full text-center"
                  >
                    Get a Free Quote
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </MagneticButton>

                <MagneticButton className="w-full sm:w-auto">
                  <Link
                    href="/projects"
                    className="group flex items-center justify-center gap-2 border border-[#e5e5e5] bg-white text-[#111111] text-xs uppercase tracking-[0.2em] font-bold py-4 px-8 hover:bg-[#f7f7f5] transition-all duration-300 shadow-subtle w-full text-center"
                  >
                    View Our Work
                  </Link>
                </MagneticButton>
              </div>
            </FadeIn>

            {/* Trust indicators */}
            <FadeIn direction="up" delay={0.6} duration={0.7}>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-8 sm:mt-10 pt-6 border-t border-[#e5e5e5]">
                <span className="text-[10px] uppercase tracking-widest font-mono text-[#555555]">AS1288 Certified</span>
                <span className="hidden sm:inline text-[#e5e5e5]">|</span>
                <span className="text-[10px] uppercase tracking-widest font-mono text-[#555555]">Australian Owned</span>
                <span className="hidden sm:inline text-[#e5e5e5]">|</span>
                <span className="text-[10px] uppercase tracking-widest font-mono text-[#555555]">15+ Years</span>
              </div>
            </FadeIn>
          </div>

          {/* Right Column: Desktop Hero Image with reveal animation */}
          <div className="hidden lg:block lg:col-span-6 xl:col-span-7">
            <FadeIn direction="up" delay={0.3} duration={0.8}>
              <div className="relative w-full aspect-[4/5] xl:aspect-[3/4] bg-[#f7f7f5] border border-[#e5e5e5] overflow-hidden shadow-premium group">
                {/* Clip-path reveal animation */}
                <motion.div
                  initial={{ clipPath: "inset(8% 8% 8% 8%)" }}
                  animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
                  className="w-full h-full"
                >
                  <OptimizedImage
                    src="/images/hero/hero-glass-main.jpg"
                    alt="Modern Australian luxury architectural residence with expansive floor-to-ceiling frameless glass sliding walls"
                    fill
                    priority
                    fallbackTitle="Complete Glass Innovations Architectural Installation"
                    sizes="55vw"
                    className="group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                  />
                </motion.div>
                
                {/* Floating Architectural Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute bottom-5 left-5 right-5 xl:bottom-6 xl:left-6 xl:right-6 p-4 bg-white/92 backdrop-blur-md border border-[#e5e5e5] shadow-subtle flex justify-between items-center text-[#111111]"
                >
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
                </motion.div>
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
