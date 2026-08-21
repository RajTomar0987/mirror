"use client";
/* eslint-disable @next/next/no-img-element */

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

export interface ProjectCardProps {
  slug: string;
  title: string;
  category: string;
  location: string;
  year?: string;
  description?: string;
  imageUrl?: string;
  aspectRatio?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  slug,
  title,
  category,
  location,
  year = "2025",
  description,
  imageUrl,
  aspectRatio = "aspect-[16/10]",
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={shouldReduceMotion ? {} : { y: -4 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
      className="group flex flex-col justify-between w-full"
    >
      <Link
        href={`/projects/${slug}`}
        className={`relative block w-full ${aspectRatio} bg-[#f7f7f5] border border-[#e5e5e5] hover:border-[#111111] overflow-hidden mb-6 shadow-subtle group hover:shadow-premium transition-all duration-500`}
        aria-label={`View project details for ${title}`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${title} - ${category} in ${location}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95 group-hover:opacity-100"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-tr from-[#f4f4f2] via-[#f7f7f5] to-white opacity-90 group-hover:scale-105 transition-transform duration-700" />
        )}

        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col justify-between p-8 text-[#111111] z-10 bg-gradient-to-t from-white/90 via-transparent to-white/30">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium bg-white/90 backdrop-blur-md px-3 py-1 rounded-sm border border-[#e5e5e5] text-[#111111] shadow-subtle">
              {category}
            </span>
            <div className="w-9 h-9 rounded-full border border-[#111111]/20 flex items-center justify-center bg-white/80 backdrop-blur-sm group-hover:bg-[#111111] group-hover:text-white transition-all duration-300">
              <ArrowUpRight size={15} />
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-[0.2em] text-[#555555] mb-1">
              Location: {location}
            </span>
            <span className="font-mono text-[10px] text-[#555555]">
              Completed: {year}
            </span>
          </div>
        </div>
      </Link>

      <div className="flex flex-col">
        <h3 className="font-serif text-2xl font-light tracking-tight text-[#111111] mb-2">
          <Link href={`/projects/${slug}`} className="hover:underline">
            {title}
          </Link>
        </h3>
        {description && (
          <p className="text-sm text-[#555555] leading-relaxed max-w-xl font-sans font-light">
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
};
