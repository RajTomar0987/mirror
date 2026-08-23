"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Service } from "@/types";
import { OptimizedImage } from "./OptimizedImage";

export interface ServiceShowcaseProps {
  service: Service;
  index: number;
}

export const ServiceShowcase: React.FC<ServiceShowcaseProps> = ({ service, index }) => {
  const shouldReduceMotion = useReducedMotion();
  const formattedIndex = index < 10 ? `0${index}` : `${index}`;
  const activeImage = service.image || service.imageUrl;
  const activeAlt = service.imageAlt || `Architectural ${service.title} specification`;

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: shouldReduceMotion ? 0.2 : 0.7, ease: [0.16, 1, 0.3, 1] as const }}
      className="group relative flex flex-col justify-between bg-white border border-[#e5e5e5] hover:border-[#111111] transition-all duration-500 shadow-subtle hover:shadow-premium overflow-hidden"
    >
      {/* Top Image Banner */}
      <div className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-[#f7f7f5] border-b border-[#e5e5e5] overflow-hidden">
        <motion.div
          className="w-full h-full"
          whileHover={shouldReduceMotion ? {} : { scale: 1.04 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <OptimizedImage
            src={activeImage}
            alt={activeAlt}
            fill
            fallbackTitle={service.title}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </motion.div>
      </div>

      <div className="p-8 md:p-12 flex-1 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#e5e5e5]">
            <span className="font-mono text-sm tracking-widest text-[#555555] font-bold">
              [{formattedIndex}]
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-mono bg-[#f7f7f5] px-3 py-1 border border-[#e5e5e5] text-[#555555]">
              AS1288 Glazing Code
            </span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#111111] mb-6">
            {service.title}
          </h3>

          {/* Description */}
          <p className="text-base md:text-lg text-[#555555] leading-relaxed font-sans font-light mb-8 max-w-2xl">
            {service.description}
          </p>

          {/* Key Features Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
            {service.features.slice(0, 4).map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-[#555555]">
                <CheckCircle2 size={14} className="text-[#111111] mt-0.5 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="pt-8 border-t border-[#e5e5e5] flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-[#555555] font-mono">
            Custom Specification
          </span>
          <Link
            href={`/services/${service.slug}`}
            className="group/btn inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold text-[#111111] hover:text-[#555555] transition-colors"
          >
            Explore Service
            <ArrowRight size={14} className="group-hover/btn:translate-x-1.5 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
