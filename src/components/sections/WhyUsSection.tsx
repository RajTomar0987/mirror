"use client";

import React from "react";
import { Compass, ShieldCheck, Hammer, MapPin } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/Stagger";

const VALUE_PROPS = [
  {
    icon: Compass,
    title: "CUSTOM",
    subtitle: "Tailored Engineering",
    description:
      "Every panel is custom cut, tempered, and polished to exact project measurements, aligning seamlessly with structural layouts and architectural view lines.",
  },
  {
    icon: ShieldCheck,
    title: "QUALITY",
    subtitle: "Code Compliant",
    description:
      "Full compliance with Australian glazing code AS1288. We execute precise load calculations and use certified Grade A safety glass.",
  },
  {
    icon: Hammer,
    title: "CRAFTSMANSHIP",
    subtitle: "Precision Hardware",
    description:
      "Paired with marine-grade 2205 stainless steel spigots, heavy-duty patch fittings, and high-performance structural silicone joints.",
  },
  {
    icon: MapPin,
    title: "LOCAL",
    subtitle: "Australian Owned",
    description:
      "Australian owned and operated with dedicated local teams overseeing spatial measurement, delivery, and professional installation.",
  },
];

export const WhyUsSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 md:py-36 bg-[#f7f7f5] text-[#111111] border-b border-[#e5e5e5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        {/* Header */}
        <FadeIn direction="up" delay={0.1}>
          <div className="mb-12 sm:mb-20 max-w-3xl">
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#555555] block mb-4">
              [Distinctive Value]
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#111111] leading-tight">
              THE ARCHITECTURAL <br />
              <span className="italic font-normal">STANDARD OF EXCELLENCE</span>
            </h2>
          </div>
        </FadeIn>

        {/* 4-Column Value Grid */}
        <StaggerContainer staggerChildren={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {VALUE_PROPS.map((prop, i) => {
            const Icon = prop.icon;
            return (
              <StaggerItem key={prop.title} className="h-full">
                <div className="flex flex-col justify-between p-8 border border-[#e5e5e5] bg-white hover:border-[#111111] transition-all duration-300 min-h-[300px] h-full shadow-subtle hover:shadow-premium">
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <div className="w-10 h-10 rounded-full border border-[#e5e5e5] flex items-center justify-center text-[#111111]">
                        <Icon size={18} />
                      </div>
                      <span className="font-mono text-xs text-[#555555]">
                        0{i + 1}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl font-light tracking-wider text-[#111111] uppercase mb-1">
                      {prop.title}
                    </h3>
                    <span className="text-[10px] uppercase tracking-widest text-[#555555] block mb-4 font-sans font-bold">
                      {prop.subtitle}
                    </span>

                    <p className="text-sm text-[#555555] leading-relaxed font-sans font-light">
                      {prop.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-6 border-t border-[#e5e5e5]">
                    <span className="text-[9px] uppercase tracking-[0.2em] font-mono text-[#555555]">
                      Verified Standard
                    </span>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
};
