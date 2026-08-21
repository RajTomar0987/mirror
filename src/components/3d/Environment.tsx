"use client";

import React, { useRef } from "react";
import { Environment as DreiEnvironment } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const Environment: React.FC = () => {
  const lightRef = useRef<THREE.PointLight>(null);

  // Subtle studio light position movement for specular highlights
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (lightRef.current) {
      lightRef.current.position.x = Math.sin(time * 0.4) * 2;
      lightRef.current.position.y = Math.cos(time * 0.3) * 1.5 + 2;
    }
  });

  return (
    <>
      {/* Soft Architectural Studio Ambient Light */}
      <ambientLight intensity={0.35} />

      {/* Main Directional Sun / Key Light */}
      <directionalLight
        position={[6, 12, 6]}
        intensity={1.8}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />

      {/* Rim Light for Glass Specular Edge Highlights */}
      <directionalLight position={[-6, 4, -4]} intensity={0.8} color="#e2eff2" />

      {/* Dynamic Specular Point Light */}
      <pointLight
        ref={lightRef}
        position={[-3, 3, 2]}
        intensity={2.2}
        color="#d7e4e8" // Subtle ice-blue glass reflection
      />

      {/* Drei HDRI Environment Preset for Physically Based Refractions */}
      <DreiEnvironment preset="city" />
    </>
  );
};
