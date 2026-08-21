"use client";

import { useRef, useSyncExternalStore } from "react";
import * as THREE from "three";
import { ArchitecturalGlass } from "./ArchitecturalGlass";
import { Environment } from "./Environment";
import { CameraController } from "./CameraController";
import { ScrollScene } from "./ScrollScene";

const subscribeReducedMotion = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
};

const getReducedMotionSnapshot = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

const getServerReducedMotionSnapshot = () => false;

export const GlassHero = () => {
  const groupRef = useRef<THREE.Group>(null);
  const shouldReduceMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot
  );

  return (
    <>
      {/* Studio Lighting & HDRI Environment */}
      <Environment />

      {/* Camera Controller with Motion Constraints */}
      <CameraController disabled={shouldReduceMotion} />

      {/* Scroll Interpolation Controller */}
      <ScrollScene targetRef={groupRef} disabled={shouldReduceMotion} />

      {/* Main 3D Architectural Glass Installation */}
      <group ref={groupRef}>
        <ArchitecturalGlass position={[0, 0, 0]} />

        {/* Minimalist Architectural Floor Shadow Catcher */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.0, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <shadowMaterial opacity={0.08} />
        </mesh>
      </group>
    </>
  );
};
