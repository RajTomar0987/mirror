"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { OptimizedImage } from "./OptimizedImage";

export interface ServiceCardProps {
  slug: string;
  title: string;
  description: string;
  index: number;
  imageUrl?: string;
  image?: string;
  imageAlt?: string;
  complianceCode?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  slug,
  title,
  description,
  index,
  imageUrl,
  image,
  imageAlt,
  complianceCode = "AS1288",
}) => {
  const shouldReduceMotion = useReducedMotion();
  const formattedIndex = index < 10 ? `0${index}` : `${index}`;
  const activeImage = image || imageUrl;
  const activeAlt = imageAlt || `Architectural ${title} glass installation`;

  return (
    <motion.div
      whileHover={shouldReduceMotion ? {} : { y: -6, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const } }}
      className="h-full"
    >
      <Link
        href={`/services/${slug}`}
        className="group relative flex flex-col justify-between bg-white border border-[#e5e5e5] hover:border-[#111111] transition-all duration-500 h-full overflow-hidden shadow-subtle hover:shadow-premium"
        aria-label={`View specifications for service: ${title}`}
      >
        {/* Top 40-50% Height Image Area */}
        <div className="relative w-full aspect-[4/3] bg-[#f7f7f5] border-b border-[#e5e5e5] overflow-hidden">
          <motion.div
            className="w-full h-full"
            whileHover={shouldReduceMotion ? {} : { scale: 1.04 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
          >
            <OptimizedImage
              src={activeImage}
              alt={activeAlt}
              fill
              fallbackTitle={title}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          </motion.div>
        </div>

        {/* Card Body */}
        <div className="flex-1 flex flex-col justify-between p-6 md:p-8">
          <div>
            {/* Header: Number & Arrow */}
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono text-xs tracking-widest text-[#555555] font-bold">
                [{formattedIndex}]
              </span>
              <div className="w-8 h-8 rounded-full border border-[#e5e5e5] flex items-center justify-center text-[#111111] group-hover:bg-[#111111] group-hover:text-white transition-all duration-300">
                <ArrowUpRight size={14} />
              </div>
            </div>

            {/* Title */}
            <h3 className="font-serif text-2xl font-light tracking-tight text-[#111111] mb-3 leading-tight group-hover:text-[#111111]">
              {title}
            </h3>

            {/* Description */}
            <p className="text-xs md:text-sm text-[#555555] leading-relaxed font-sans font-light line-clamp-3">
              {description}
            </p>
          </div>

          {/* Footer Info */}
          <div className="pt-5 border-t border-[#e5e5e5] flex items-center justify-between mt-6">
            <span className="text-[9px] uppercase tracking-[0.2em] font-medium text-[#555555]">
              Custom Specification
            </span>
            <span className="text-xs font-mono font-bold text-[#111111]">
              {complianceCode}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
