"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";

export interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  width?: "fit-content" | "100%";
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  delay = 0,
  duration = 0.8,
  className = "",
  width = "100%",
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div style={{ position: "relative", width, overflow: "hidden" }} className={className}>
      <motion.div
        initial={{
          opacity: 0,
          y: shouldReduceMotion ? 0 : 30,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{ once: true }}
        transition={{
          duration: shouldReduceMotion ? 0.2 : duration,
          delay,
          ease: [0.16, 1, 0.3, 1] as const,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};
