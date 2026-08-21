"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowDown } from "lucide-react";
import { motion } from "motion/react";
import { GlassScene } from "@/components/3d/GlassScene";
import { Reveal } from "@/components/animations/Reveal";
import { FadeIn } from "@/components/animations/FadeIn";
import { MagneticButton } from "@/components/animations/MagneticButton";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between pt-36 pb-12 overflow-hidden bg-white text-[#111111]">
      {/* 3D Canvas Integration Point */}
      <GlassScene />

      {/* Hero Content Layer */}
      <div className="flex-1 flex flex-col justify-center max-w-7xl mx-auto px-6 md:px-12 w-full z-10">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <FadeIn direction="up" delay={0.1} duration={0.6}>
            <span className="block text-xs md:text-sm uppercase tracking-[0.3em] font-bold text-[#555555] mb-6">
              Architectural Glass Solutions
            </span>
          </FadeIn>

          {/* Main Heading Reveal */}
          <Reveal delay={0.2} duration={0.9}>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[1.05] text-[#111111] mb-8">
              GLASS, <br />
              DESIGNED FOR <br />
              <span className="italic font-normal">MODERN LIVING.</span>
            </h1>
          </Reveal>

          {/* Supporting Text Fade */}
          <FadeIn direction="up" delay={0.4} duration={0.7}>
            <p className="text-base md:text-lg lg:text-xl text-[#555555] leading-relaxed mb-10 max-w-xl font-sans font-light">
              Exquisite custom architectural glass engineered for structural compliance, spatial clarity, and contemporary Australian living spaces.
            </p>
          </FadeIn>

          {/* CTAs */}
          <FadeIn direction="up" delay={0.5} duration={0.7}>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <MagneticButton>
                <Link
                  href="/projects"
                  className="group flex items-center justify-center gap-3 bg-[#111111] text-white text-xs uppercase tracking-[0.2em] font-bold py-4 px-8 hover:bg-[#333333] transition-all duration-300 shadow-premium"
                >
                  View Our Work
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </MagneticButton>

              <MagneticButton>
                <Link
                  href="/quote"
                  className="group flex items-center justify-center gap-2 border border-[#e5e5e5] bg-white text-[#111111] text-xs uppercase tracking-[0.2em] font-bold py-4 px-8 hover:bg-[#f7f7f5] transition-all duration-300 shadow-subtle"
                >
                  Get a Free Quote
                </Link>
              </MagneticButton>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Motion Scroll Indicator */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center z-10 pt-8">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#555555] font-mono">
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
