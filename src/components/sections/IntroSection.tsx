"use client";

import React from "react";
import { ShieldCheck, Award } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { Reveal } from "@/components/animations/Reveal";

export const IntroSection: React.FC = () => {
  return (
    <section className="py-28 md:py-36 bg-[#f7f7f5] text-[#111111] overflow-hidden border-t border-b border-[#e5e5e5]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="editorial-grid">
          {/* Eyebrow */}
          <div className="col-span-12 mb-8">
            <FadeIn direction="up" delay={0.1}>
              <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#555555] block">
                [Philosophy & Engineering]
              </span>
            </FadeIn>
          </div>

          {/* Left Column - Large Architectural Statement */}
          <div className="col-span-12 lg:col-span-7">
            <Reveal delay={0.2} duration={0.9}>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.15] text-[#111111]">
                REDEFINING ARCHITECTURAL SPACE THROUGH THE LIGHT, STRENGTH, AND TIMELESS AESTHETICS OF <span className="italic font-normal">STRUCTURAL GLASS</span>.
              </h2>
            </Reveal>
          </div>

          {/* Right Column - Supporting Business Description */}
          <div className="col-span-12 lg:col-span-5 flex flex-col justify-between mt-8 lg:mt-0 lg:pl-8 border-t lg:border-t-0 lg:border-l border-[#e5e5e5] pt-8 lg:pt-0">
            <FadeIn direction="up" delay={0.3} duration={0.7}>
              <div className="space-y-6 text-base md:text-lg text-[#555555] leading-relaxed font-sans font-light">
                <p>
                  At Complete Glass Innovations, we bridge the vision of leading architects and property owners with uncompromising precision execution.
                </p>
                <p>
                  Founded on compliance, safety, and bespoke design, we engineer premium structural glass solutions including frameless balustrades, pool fencing, custom shower enclosures, and architectural partitions across Australian residential and commercial projects.
                </p>
              </div>
            </FadeIn>

            {/* Compliance & Safety Badges */}
            <FadeIn direction="up" delay={0.4} duration={0.7}>
              <div className="flex items-center gap-8 pt-8 mt-8 border-t border-[#e5e5e5]">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={20} className="text-[#111111]" />
                  <div>
                    <span className="block font-serif text-xl font-light text-[#111111]">AS1288</span>
                    <span className="text-[10px] uppercase tracking-wider text-[#555555]">Glazing Code Compliant</span>
                  </div>
                </div>
                
                <div className="w-[1px] h-10 bg-[#e5e5e5]"></div>

                <div className="flex items-center gap-3">
                  <Award size={20} className="text-[#111111]" />
                  <div>
                    <span className="block font-serif text-xl font-light text-[#111111]">Grade A</span>
                    <span className="text-[10px] uppercase tracking-wider text-[#555555]">Toughened & Laminated</span>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};
