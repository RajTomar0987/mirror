"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState } from "react";
import { motion } from "motion/react";

interface BeforeAfterSliderProps {
  beforeImage?: string;
  afterImage?: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export const BeforeAfterSlider = ({
  beforeImage = "",
  afterImage = "",
  beforeLabel = "Before Glazing",
  afterLabel = "Finished Installation",
  className = "",
}: BeforeAfterSliderProps) => {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      setSliderPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === "ArrowRight") {
      setSliderPosition((prev) => Math.min(100, prev + 5));
    }
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`relative overflow-hidden w-full aspect-[16/10] border border-[#e5e5e5] select-none shadow-subtle focus-visible:ring-2 focus-visible:ring-[#111111] ${className}`}
      aria-label="Before and after comparison slider. Use left and right arrow keys to adjust position."
    >
      {/* AFTER IMAGE (Background - Full width) */}
      <div className="absolute inset-0 w-full h-full bg-[#f7f7f5] flex items-center justify-center text-xs uppercase tracking-widest text-[#555555]">
        {afterImage ? (
          <img src={afterImage} alt={afterLabel} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col justify-between p-8 bg-[#f7f7f5]">
            <span className="font-mono text-xs text-[#555555] font-bold">[{afterLabel}]</span>
            <span className="text-center font-serif text-base md:text-lg font-light italic text-[#111111]">
              [Completed Architectural Glass Installation]
            </span>
            <span className="text-right text-[10px] font-mono text-[#555555]">AS1288 Certified</span>
          </div>
        )}
      </div>

      {/* BEFORE IMAGE (Foreground - Clipped width) */}
      <div
        className="absolute inset-0 h-full overflow-hidden bg-[#f4f4f2]"
        style={{ width: `${sliderPosition}%` }}
      >
        <div className="absolute inset-0 w-full h-full min-w-full aspect-[16/10] flex items-center justify-center text-xs uppercase tracking-widest text-[#555555]">
          {beforeImage ? (
            <img src={beforeImage} alt={beforeLabel} className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex flex-col justify-between p-8 bg-[#f4f4f2] w-[1000px] max-w-[100vw]">
              <span className="font-mono text-xs text-[#555555] font-bold">[{beforeLabel}]</span>
              <span className="text-center font-serif text-base md:text-lg font-light italic text-[#111111]">
                [Pre-Installation Site Structure]
              </span>
              <span className="font-mono text-[10px] text-[#555555]">Initial Site Assessment</span>
            </div>
          )}
        </div>
      </div>

      {/* DRAG HANDLE BAR */}
      <div
        className="absolute top-0 bottom-0 w-[1px] bg-[#111111] z-20 pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Central button handle */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#111111] text-white shadow-premium flex items-center justify-center text-xs font-mono font-bold"
        >
          ↔
        </motion.div>
      </div>

      {/* ACCESSIBLE SLIDER INPUT */}
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onChange={handleSliderChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
        aria-label="Before and after comparison slider handle"
      />
    </div>
  );
};
