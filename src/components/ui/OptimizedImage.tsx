"use client";

import React, { useState } from "react";
import Image from "next/image";

export interface OptimizedImageProps {
  src?: string | null;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  fallbackTitle?: string;
  aspectRatioClass?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  fill = false,
  width,
  height,
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  objectFit = "cover",
  fallbackTitle,
  aspectRatioClass = "",
}) => {
  const [hasError, setHasError] = useState(false);

  // If no source provided or error encountered during loading
  const showFallback = !src || hasError;

  if (showFallback) {
    return (
      <div
        className={`relative w-full h-full min-h-[180px] bg-[#f7f7f5] border border-[#e5e5e5] flex flex-col justify-between p-6 select-none ${aspectRatioClass} ${className}`}
        role="img"
        aria-label={alt || "Architectural Glass Specification"}
      >
        {/* Top bar metadata */}
        <div className="flex items-center justify-between text-[10px] uppercase font-mono tracking-widest text-[#555555]">
          <span>[Architectural Specification]</span>
          <span>AS1288 Glazing Code</span>
        </div>

        {/* Center title */}
        <div className="text-center my-4">
          <p className="font-serif text-sm md:text-base font-light italic text-[#111111]">
            {fallbackTitle || alt || "Complete Glass Innovations Installation"}
          </p>
        </div>

        {/* Bottom grid specs */}
        <div className="flex items-center justify-between text-[9px] font-mono text-[#555555] pt-2 border-t border-[#e5e5e5]">
          <span>Toughened Safety Glass</span>
          <span>Bespoke Engineering</span>
        </div>
      </div>
    );
  }

  // Next.js Image configuration
  const imageProps = fill
    ? { fill: true, sizes }
    : { width: width || 800, height: height || 600 };

  return (
    <div className={`relative overflow-hidden ${fill ? "w-full h-full" : ""} ${aspectRatioClass} ${className}`}>
      <Image
        src={src}
        alt={alt || "Architectural Glass Installation"}
        {...imageProps}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        className={`w-full h-full transition-all duration-500 ${
          objectFit === "cover"
            ? "object-cover"
            : objectFit === "contain"
            ? "object-contain"
            : "object-fill"
        }`}
        onError={() => setHasError(true)}
      />
    </div>
  );
};
