"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { Reveal } from "@/components/animations/Reveal";
import { MagneticButton } from "@/components/animations/MagneticButton";

export const QuoteCtaSection: React.FC = () => {
  return (
    <section className="py-32 md:py-40 bg-[#f4f4f2] text-[#111111] text-center relative overflow-hidden border-t border-b border-[#e5e5e5]">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <FadeIn direction="up" delay={0.1}>
          <span className="text-xs uppercase tracking-[0.3em] text-[#555555] block mb-6">
            [Start Your Project]
          </span>
        </FadeIn>

        <Reveal delay={0.2} duration={0.9}>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-7xl font-light tracking-tight leading-[1.08] mb-8 text-[#111111]">
            READY TO TRANSFORM <br />
            <span className="italic font-normal">YOUR SPACE?</span>
          </h2>
        </Reveal>

        <FadeIn direction="up" delay={0.3}>
          <p className="text-[#555555] text-base md:text-lg lg:text-xl leading-relaxed max-w-xl mx-auto mb-12 font-sans font-light">
            Elevate your home or commercial structure with customized, compliant architectural glass solutions. Contact our engineering team or request a comprehensive free estimate today.
          </p>
        </FadeIn>

        <FadeIn direction="up" delay={0.4}>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <MagneticButton>
              <Link
                href="/quote"
                className="group flex items-center justify-center gap-3 bg-[#111111] text-white text-xs uppercase tracking-[0.2em] font-bold py-4 px-8 hover:bg-[#333333] transition-all duration-300 w-full sm:w-auto shadow-subtle focus-visible:ring-2 focus-visible:ring-[#111111]"
              >
                Get a Free Quote
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </MagneticButton>

            <MagneticButton>
              <Link
                href="/contact"
                className="group flex items-center justify-center gap-2 border border-[#e5e5e5] bg-white text-[#111111] text-xs uppercase tracking-[0.2em] font-bold py-4 px-8 hover:bg-[#f7f7f5] transition-all duration-300 w-full sm:w-auto focus-visible:ring-2 focus-visible:ring-[#111111] shadow-subtle"
              >
                Contact Us
              </Link>
            </MagneticButton>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
