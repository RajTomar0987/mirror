"use client";

import React from "react";
import * as THREE from "three";

interface GlassMaterialProps {
  transmission?: number;
  roughness?: number;
  thickness?: number;
  ior?: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  color?: string;
  attenuationColor?: string;
  opacity?: number;
  transparent?: boolean;
}

export const GlassMaterial = React.forwardRef<THREE.MeshPhysicalMaterial, GlassMaterialProps>(
  (
    {
      transmission = 0.96,
      roughness = 0.04,
      thickness = 1.4,
      ior = 1.52, // Standard float glass index of refraction
      clearcoat = 1.0,
      clearcoatRoughness = 0.03,
      color = "#ffffff",
      attenuationColor = "#d7e4e8",
      opacity = 1,
      transparent = true,
      ...props
    },
    ref
  ) => {
    return (
      <meshPhysicalMaterial
        ref={ref}
        color={new THREE.Color(color)}
        transmission={transmission}
        roughness={roughness}
        thickness={thickness}
        ior={ior}
        clearcoat={clearcoat}
        clearcoatRoughness={clearcoatRoughness}
        opacity={opacity}
        transparent={transparent}
        metalness={0}
        reflectivity={0.6}
        attenuationColor={new THREE.Color(attenuationColor)}
        attenuationDistance={2.5}
        side={THREE.DoubleSide}
        depthWrite={false}
        {...props}
      />
    );
  }
);

GlassMaterial.displayName = "GlassMaterial";
