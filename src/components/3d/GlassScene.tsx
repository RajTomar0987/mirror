"use client";

import { Canvas } from "@react-three/fiber";
import React, { Suspense, useSyncExternalStore } from "react";
import { GlassHero } from "./GlassHero";
import { MobileFallback } from "./MobileFallback";

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
  return Math.min(2, window.devicePixelRatio || 1);
};
const getServerDprSnapshot = () => 1;

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

export const GlassScene = () => {
  const isMounted = useSyncExternalStore(
    subscribe,
    getMountedSnapshot,
    getServerMountedSnapshot
  );

  const hasWebGL = useSyncExternalStore(
    subscribe,
    getWebGLSnapshot,
    getServerWebGLSnapshot
  );

  const dpr = useSyncExternalStore(
    subscribe,
    getDprSnapshot,
    getServerDprSnapshot
  );

  if (!isMounted || !hasWebGL) {
    return <MobileFallback />;
  }

  return (
    <div className="absolute inset-0 w-full h-full -z-10 bg-gradient-to-b from-[#ffffff] via-[#f7f7f5] to-[#ffffff] overflow-hidden">
      {/* Light architectural dot texture */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[radial-gradient(#111111_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <Suspense fallback={<GlassLoader />}>
        <Canvas
          shadows
          dpr={dpr}
          camera={{ position: [0, 1.0, 5.0], fov: 45 }}
          gl={{
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true,
            powerPreference: "high-performance",
          }}
          className="w-full h-full"
        >
          <GlassHero />
        </Canvas>
      </Suspense>
    </div>
  );
};
