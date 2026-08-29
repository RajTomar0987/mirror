"use client";

import React from "react";
import { Compass, ShieldCheck, Hammer, MapPin } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/Stagger";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

const VALUE_PROPS = [
  {
    icon: Compass,
    title: "CUSTOM ENGINEERING",
    subtitle: "Tailored Solutions",
    description:
      "Every panel is custom cut, tempered, and polished to exact project measurements, aligning seamlessly with structural layouts and architectural view lines.",
  },
  {
    icon: ShieldCheck,
    title: "CODE COMPLIANT",
    subtitle: "AS1288 Certified",
    description:
      "Full compliance with Australian glazing code AS1288. We execute precise load calculations and use certified Grade A safety glass.",
  },
  {
    icon: Hammer,
    title: "PRECISION CRAFTSMANSHIP",
    subtitle: "Premium Hardware",
    description:
      "Paired with marine-grade 2205 stainless steel spigots, heavy-duty patch fittings, and high-performance structural silicone joints.",
  },
  {
    icon: MapPin,
    title: "AUSTRALIAN OWNED",
    subtitle: "Local Teams",
    description:
      "Australian owned and operated with dedicated local teams overseeing spatial measurement, delivery, and professional installation.",
  },
];

const STATS = [
  { value: "15+", label: "Years Experience" },
  { value: "500+", label: "Projects Completed" },
  { value: "AS1288", label: "Fully Certified" },
  { value: "100%", label: "Australian Owned" },
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

        {/* Split Layout: Image + Values */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left: Large architectural image */}
          <div className="lg:col-span-5">
            <FadeIn direction="up" delay={0.2} duration={0.8}>
              <div className="relative w-full aspect-[3/4] bg-[#f7f7f5] border border-[#e5e5e5] overflow-hidden shadow-premium group sticky top-32">
                <OptimizedImage
                  src="/images/why-us/featured-project.jpg"
                  alt="Premium architectural glass installation showcasing precision craftsmanship and Australian engineering standards"
                  fill
                  fallbackTitle="Complete Glass Innovations — Precision Engineering"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                />

                {/* Overlay badge */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 p-4 bg-white/90 backdrop-blur-md border border-[#e5e5e5] shadow-subtle">
                  <span className="block text-[9px] uppercase font-mono tracking-widest text-[#555555] mb-1">
                    [Verified Standard]
                  </span>
                  <span className="font-serif text-sm font-light text-[#111111]">
                    AS1288 & AS1170 Certified Installation
                  </span>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right: 4 Value Props */}
          <div className="lg:col-span-7">
            <StaggerContainer staggerChildren={0.1} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {VALUE_PROPS.map((prop, i) => {
                const Icon = prop.icon;
                return (
                  <StaggerItem key={prop.title} className="h-full">
                    <div className="flex flex-col justify-between p-6 sm:p-8 border border-[#e5e5e5] bg-white hover:border-[#111111] transition-all duration-300 min-h-[240px] h-full shadow-subtle hover:shadow-premium group">
                      <div>
                        <div className="flex items-center justify-between mb-6">
                          <div className="w-10 h-10 rounded-full border border-[#e5e5e5] flex items-center justify-center text-[#111111] group-hover:bg-[#111111] group-hover:text-white transition-all duration-300">
                            <Icon size={18} />
                          </div>
                          <span className="font-mono text-xs text-[#555555]">
                            0{i + 1}
                          </span>
                        </div>

                        <h3 className="font-serif text-lg sm:text-xl font-light tracking-wider text-[#111111] uppercase mb-1">
                          {prop.title}
                        </h3>
                        <span className="text-[10px] uppercase tracking-widest text-[#555555] block mb-4 font-sans font-bold">
                          {prop.subtitle}
                        </span>

                        <p className="text-sm text-[#555555] leading-relaxed font-sans font-light">
                          {prop.description}
                        </p>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>

            {/* Statistics / Trust indicators row */}
            <FadeIn direction="up" delay={0.6}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 sm:mt-10">
                {STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="text-center p-4 sm:p-6 border border-[#e5e5e5] bg-white"
                  >
                    <span className="block font-serif text-2xl sm:text-3xl font-light text-[#111111] mb-1">
                      {stat.value}
                    </span>
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-widest font-mono text-[#555555]">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};
