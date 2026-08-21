"use client";

import React from "react";
import { Star } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

export interface ReviewCardProps {
  author: string;
  suburb?: string;
  rating?: number;
  content: string;
  serviceType?: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  author,
  suburb = "Sydney, NSW",
  rating = 5,
  content,
  serviceType = "Architectural Glass",
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={shouldReduceMotion ? {} : { y: -4 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
      className="flex flex-col justify-between p-8 bg-white border border-[#e5e5e5] shadow-subtle hover:shadow-premium transition-all duration-300 h-full"
    >
      <div>
        {/* Rating Stars */}
        <div className="flex items-center gap-1 mb-6 text-[#111111]" aria-label={`Rating: ${rating} out of 5 stars`}>
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} size={14} className="fill-current text-[#111111]" />
          ))}
        </div>

        {/* Content */}
        <p className="font-serif text-lg text-[#111111] font-light italic leading-relaxed mb-8">
          &ldquo;{content}&rdquo;
        </p>
      </div>

      {/* Author Details */}
      <div className="pt-6 border-t border-[#e5e5e5] flex items-center justify-between">
        <div>
          <span className="block text-xs uppercase tracking-widest font-bold text-[#111111]">
            {author}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-[#555555]">
            {suburb}
          </span>
        </div>
        <span className="text-[10px] uppercase tracking-wider bg-[#f7f7f5] px-2.5 py-1 border border-[#e5e5e5] text-[#555555]">
          {serviceType}
        </span>
      </div>
    </motion.div>
  );
};
