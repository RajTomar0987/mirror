"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

export interface ProjectGalleryProps {
  images: string[];
  title?: string;
}

export const ProjectGallery: React.FC<ProjectGalleryProps> = ({
  images,
  title = "Project Showcase",
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // Fallback placeholder images if gallery is empty
  const displayImages = images.length > 0 ? images : [
    "", "", "", ""
  ];

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % displayImages.length);
  }, [selectedIndex, displayImages.length]);

  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + displayImages.length) % displayImages.length);
  }, [selectedIndex, displayImages.length]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    },
    [selectedIndex, handleNext, handlePrev]
  );

  useEffect(() => {
    if (selectedIndex !== null) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedIndex, handleKeyDown]);

  return (
    <div className="w-full">
      {/* Architectural Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayImages.map((src, index) => (
          <motion.div
            key={index}
            whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedIndex(index)}
            className="group relative aspect-[16/10] bg-[#f7f7f5] border border-[#e5e5e5] hover:border-[#111111] overflow-hidden cursor-pointer shadow-subtle transition-all duration-300"
            role="button"
            tabIndex={0}
            aria-label={`Open photo ${index + 1} of ${displayImages.length} in lightbox`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setSelectedIndex(index);
            }}
          >
            {src ? (
              <img
                src={src}
                alt={`${title} - Photo ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95 group-hover:opacity-100"
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-tr from-[#f4f4f2] via-[#f7f7f5] to-white flex flex-col justify-between p-8 text-[#111111]">
                <span className="font-mono text-xs text-[#555555]">[{index < 9 ? `0${index + 1}` : index + 1}]</span>
                <span className="font-serif text-sm font-light italic text-center text-[#555555]">
                  [Architectural Installation View]
                </span>
                <span className="text-right text-[10px] uppercase tracking-widest text-[#555555] font-mono">AS1288 Spec</span>
              </div>
            )}

            {/* Hover overlay icon */}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white">
              <div className="w-10 h-10 rounded-full border border-white/30 bg-black/50 backdrop-blur-md flex items-center justify-center">
                <Maximize2 size={16} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Motion Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col justify-between p-6 md:p-12"
            onClick={() => setSelectedIndex(null)}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between z-10 text-white" onClick={(e) => e.stopPropagation()}>
              <span className="text-xs uppercase tracking-[0.2em] font-mono text-gray-300">
                {title} — [{selectedIndex + 1} / {displayImages.length}]
              </span>
              <button
                onClick={() => setSelectedIndex(null)}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Close Lightbox"
              >
                <X size={20} />
              </button>
            </div>

            {/* Main Lightbox Content Area */}
            <div
              className="relative flex-1 flex items-center justify-center my-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {displayImages[selectedIndex] ? (
                <motion.img
                  key={selectedIndex}
                  src={displayImages[selectedIndex]}
                  alt={`${title} detail`}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="max-h-[75vh] max-w-full object-contain border border-white/10"
                />
              ) : (
                <motion.div
                  key={selectedIndex}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="w-full max-w-4xl aspect-[16/10] bg-[#111111] border border-white/20 flex flex-col justify-between p-12 text-white"
                >
                  <span className="font-mono text-xs text-gray-400">
                    Gallery View [{selectedIndex + 1} / {displayImages.length}]
                  </span>
                  <div className="text-center font-serif text-2xl font-light italic">
                    [High-Resolution Architectural Case Study Detail View]
                  </div>
                  <span className="text-right font-mono text-xs text-gray-400">
                    AS1288 Certified Glazing Installation
                  </span>
                </motion.div>
              )}
            </div>

            {/* Bottom Controls Bar */}
            <div
              className="flex items-center justify-between z-10 max-w-xl mx-auto w-full text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handlePrev}
                className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold py-3 px-6 border border-white/20 hover:bg-white hover:text-black transition-colors focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Previous image"
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              <span className="text-xs font-mono text-gray-400 hidden sm:inline">
                Use ← → Arrow Keys
              </span>
              <button
                onClick={handleNext}
                className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold py-3 px-6 border border-white/20 hover:bg-white hover:text-black transition-colors focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Next image"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
