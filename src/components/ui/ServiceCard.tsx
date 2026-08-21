"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

export interface ServiceCardProps {
  slug: string;
  title: string;
  description: string;
  index: number;
  imageUrl?: string;
  complianceCode?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  slug,
  title,
  description,
  index,
  imageUrl,
  complianceCode = "AS1288",
}) => {
  const shouldReduceMotion = useReducedMotion();
  const formattedIndex = index < 10 ? `0${index}` : `${index}`;

  return (
    <motion.div
      whileHover={shouldReduceMotion ? {} : { y: -6, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const } }}
      className="h-full"
    >
      <Link
        href={`/services/${slug}`}
        className="group relative flex flex-col justify-between p-8 bg-white border border-[#e5e5e5] hover:border-[#111111] transition-all duration-500 min-h-[340px] h-full overflow-hidden shadow-subtle hover:shadow-premium"
        aria-label={`View details for service: ${title}`}
      >
        {/* Background visual image overlay if provided */}
        {imageUrl && (
          <div
            className="absolute inset-0 opacity-10 group-hover:opacity-20 group-hover:scale-105 transition-all duration-700 bg-cover bg-center pointer-events-none"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        )}

        {/* Top Header */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <span className="font-mono text-xs tracking-widest text-[#555555] font-bold">
              [{formattedIndex}]
            </span>
            <div className="w-9 h-9 rounded-full border border-[#e5e5e5] flex items-center justify-center text-[#111111] group-hover:bg-[#111111] group-hover:text-white transition-all duration-300">
              <ArrowUpRight size={15} />
            </div>
          </div>

          <h3 className="font-serif text-2xl md:text-3xl font-light tracking-tight text-[#111111] mb-4 leading-tight">
            {title}
          </h3>
          
          <p className="text-sm text-[#555555] leading-relaxed font-sans font-light">
            {description}
          </p>
        </div>

        {/* Footer Info */}
        <div className="relative z-10 pt-6 border-t border-[#e5e5e5] flex items-center justify-between mt-8">
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#555555]">
            Custom Specification
          </span>
          <span className="text-xs font-mono font-bold text-[#111111]">
            {complianceCode}
          </span>
        </div>
      </Link>
    </motion.div>
  );
};
