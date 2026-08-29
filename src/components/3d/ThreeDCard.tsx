"use client";

import React, { useRef, useState, useEffect } from "react";

interface ThreeDCardProps {
  children: React.ReactNode;
  className?: string;
  maxRotation?: number; // max degrees of tilt (default: 6)
  depth?: number; // translateZ in pixels (default: 16)
  glareOpacity?: number; // max reflection opacity (default: 0.15)
  perspective?: number; // perspective depth in px (default: 1000)
  onClick?: () => void;
}

export function ThreeDCard({
  children,
  className = "",
  maxRotation = 6,
  depth = 16,
  glareOpacity = 0.12,
  perspective = 1000,
  onClick,
}: ThreeDCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);

      const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Mouse coordinates relative to card center (-1 to 1)
    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;

    // Inverted Y for natural pitch
    const newRotateX = -mouseY * maxRotation * 2;
    const newRotateY = mouseX * maxRotation * 2;

    setRotateX(newRotateX);
    setRotateY(newRotateY);

    // Glare position percentage
    setGlarePosition({
      x: ((e.clientX - rect.left) / width) * 100,
      y: ((e.clientY - rect.top) / height) * 100,
    });
  };

  const handleMouseEnter = () => {
    if (!prefersReducedMotion) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  const transformStyle = prefersReducedMotion
    ? {}
    : {
        transform: isHovered
          ? `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(${depth}px)`
          : `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) translateZ(0px)`,
        transition: isHovered ? "transform 0.1s ease-out" : "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
      };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={transformStyle}
      className={`relative preserve-3d rounded-sm will-change-transform ${className}`}
    >
      {/* Dynamic Specular Glass Glare / Sheen Overlay */}
      {!prefersReducedMotion && (
        <div
          className="pointer-events-none absolute inset-0 rounded-sm z-20 transition-opacity duration-300 overflow-hidden"
          style={{
            opacity: isHovered ? glareOpacity : 0,
            background: `radial-gradient(circle 280px at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.8), transparent 70%)`,
          }}
        />
      )}

      {/* Child elements */}
      {children}
    </div>
  );
}
