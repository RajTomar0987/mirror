"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Layers, Sparkles, Eye } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { FadeIn } from "@/components/animations/FadeIn";
import { Reveal } from "@/components/animations/Reveal";
import { MagneticButton } from "@/components/animations/MagneticButton";

export const GlassMaterialExperience: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-28 md:py-36 bg-white text-[#111111] relative overflow-hidden border-b border-[#e5e5e5]">
      {/* Background Subtle Texture */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[radial-gradient(#111111_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="editorial-grid items-center">
          {/* Left Column: Heading & Description */}
          <div className="col-span-12 lg:col-span-6 mb-12 lg:mb-0">
            <FadeIn direction="up" delay={0.1}>
              <span className="text-xs uppercase tracking-[0.3em] text-[#555555] block mb-4">
                [Material Science & Optics]
              </span>
            </FadeIn>

            <Reveal delay={0.2} duration={0.9}>
              <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-tight leading-tight mb-8 text-[#111111]">
                THE MATERIAL <br />
                THAT DEFINES <br />
                <span className="italic font-normal">THE SPACE.</span>
              </h2>
            </Reveal>

            <FadeIn direction="up" delay={0.3}>
              <p className="text-base md:text-lg text-[#555555] leading-relaxed font-sans font-light mb-10 max-w-lg">
                Explore how structural safety glass transmits natural light, eliminates visual barriers, and delivers structural durability to high-end architectural environments.
              </p>
            </FadeIn>

            <FadeIn direction="up" delay={0.4}>
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-[#e5e5e5] mb-10">
                <div className="flex items-center gap-3">
                  <Layers size={18} className="text-[#111111]" />
                  <span className="text-xs uppercase tracking-wider text-[#555555]">
                    Low-Iron Clarity
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Sparkles size={18} className="text-[#111111]" />
                  <span className="text-xs uppercase tracking-wider text-[#555555]">
                    Refractive Optics
                  </span>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={0.5}>
              <MagneticButton>
                <Link
                  href="/quote"
                  className="group inline-flex items-center gap-3 bg-[#111111] text-white text-xs uppercase tracking-[0.2em] font-bold py-4 px-8 hover:bg-[#333333] transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#111111]"
                >
                  Request Technical Datasheet
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </MagneticButton>
            </FadeIn>
          </div>

          {/* Right Column: 3D Material Experience Container */}
          <div className="col-span-12 lg:col-span-6">
            <FadeIn direction="up" delay={0.3} duration={0.8}>
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
                className="relative aspect-[4/3] w-full bg-[#f7f7f5] border border-[#e5e5e5] overflow-hidden flex flex-col justify-between p-8 group shadow-subtle hover:shadow-premium"
              >
                <div className="flex items-center justify-between z-10">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#555555]">
                    [3D WebGL Material Shader]
                  </span>
                  <span className="text-[10px] uppercase tracking-widest bg-white border border-[#e5e5e5] px-2.5 py-1 rounded-sm text-[#111111]">
                    Interactive Engine
                  </span>
                </div>

                {/* Central Interactive Preview Graphic */}
                <div className="relative z-10 my-auto text-center p-6 border border-[#e5e5e5] bg-white shadow-subtle">
                  <Eye size={32} className="mx-auto mb-4 text-[#111111] opacity-80" />
                  <h3 className="font-serif text-xl font-light text-[#111111] mb-2">
                    Interactive Glass Material Shader
                  </h3>
                  <p className="text-xs text-[#555555] max-w-sm mx-auto font-sans">
                    Real-time refractive transmission, roughness tuning, and specular reflection preview container.
                  </p>
                </div>

                <div className="flex items-center justify-between z-10 pt-4 border-t border-[#e5e5e5]">
                  <span className="text-xs font-mono text-[#555555]">
                    Refraction Index: 1.52 (Float Glass)
                  </span>
                  <span className="text-xs font-mono text-[#555555]">
                    AS/NZS 2208
                  </span>
                </div>
              </motion.div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};
