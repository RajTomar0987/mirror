"use client";

import { Canvas } from "@react-three/fiber";
import React, { Suspense, useEffect, useState, useRef } from "react";
import { GlassHero } from "./GlassHero";
import { MobileFallback } from "./MobileFallback";

// Refined Light Architectural Loading Indicator
const GlassLoader = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
    <div className="flex flex-col items-center gap-3 bg-white/90 backdrop-blur-md px-6 py-4 rounded-sm border border-[#e5e5e5] text-[#111111] shadow-premium">
      <span className="font-serif text-sm font-light tracking-widest uppercase">
        GLASS / ARCHITECTURE
      </span>
      <div className="w-24 h-[1px] bg-[#e5e5e5] overflow-hidden relative">
        <div className="absolute inset-0 bg-[#111111] animate-pulse"></div>
      </div>
    </div>
  </div>
);

const subscribe = () => () => {};
const getMountedSnapshot = () => true;
const getServerMountedSnapshot = () => false;

const getWebGLSnapshot = () => {
  if (typeof window === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
};
const getServerWebGLSnapshot = () => true;

const getDprSnapshot = () => {
  if (typeof window === "undefined") return 1;
  return Math.min(1.5, window.devicePixelRatio || 1);
};
const getServerDprSnapshot = () => 1;

export const GlassScene = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const isMounted = React.useSyncExternalStore(
    subscribe,
    getMountedSnapshot,
    getServerMountedSnapshot
  );

  const hasWebGL = React.useSyncExternalStore(
    subscribe,
    getWebGLSnapshot,
    getServerWebGLSnapshot
  );

  const dpr = React.useSyncExternalStore(
    subscribe,
    getDprSnapshot,
    getServerDprSnapshot
  );

  useEffect(() => {
    // IntersectionObserver to only render WebGL when hero section is in view
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Pause WebGL rendering if tab is hidden
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsVisible(false);
      } else if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setIsVisible(rect.bottom > 0 && rect.top < window.innerHeight);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  if (!isMounted || !hasWebGL) {
    return <MobileFallback />;
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full -z-10 bg-gradient-to-b from-[#ffffff] via-[#f7f7f5] to-[#ffffff] overflow-hidden"
    >
      {/* Light architectural dot texture */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[radial-gradient(#111111_1px,transparent_1px)] [background-size:16px_16px]"></div>

      {isVisible ? (
        <Suspense fallback={<GlassLoader />}>
          <Canvas
            shadows
            dpr={dpr}
            camera={{ position: [0, 1.0, 5.0], fov: 45 }}
            gl={{
              antialias: true,
              alpha: true,
              preserveDrawingBuffer: false,
              powerPreference: "high-performance",
            }}
            frameloop={isVisible ? "always" : "never"}
            className="w-full h-full"
          >
            <GlassHero />
          </Canvas>
        </Suspense>
      ) : (
        <MobileFallback />
      )}
    </div>
  );
};

