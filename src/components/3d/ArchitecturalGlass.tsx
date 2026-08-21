"use client";

import React from "react";
import { GlassMaterial } from "./GlassMaterial";

interface ArchitecturalGlassProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export const ArchitecturalGlass: React.FC<ArchitecturalGlassProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}) => {
  return (
    <group position={position} rotation={rotation}>
      {/* PANEL 1: Primary Large Structural Glass Pane (Central Balustrade Panel) */}
      <group position={[0, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.2, 2.2, 0.08]} />
          <GlassMaterial transmission={0.96} roughness={0.04} thickness={1.4} />
        </mesh>

        {/* Polished Glass Bevel Edge Highlight Overlays */}
        <mesh position={[0, 1.1, 0]}>
          <boxGeometry args={[3.22, 0.02, 0.09]} />
          <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.8} opacity={0.4} transparent />
        </mesh>
        <mesh position={[0, -1.1, 0]}>
          <boxGeometry args={[3.22, 0.02, 0.09]} />
          <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.8} opacity={0.4} transparent />
        </mesh>

        {/* Stainless Steel Floor Spigot Mounts (Duplex 2205 Marine Grade) */}
        <group position={[-1.2, -1.15, 0]}>
          <mesh castShadow position={[0, -0.15, 0]}>
            <cylinderGeometry args={[0.06, 0.07, 0.3, 32]} />
            <meshStandardMaterial color="#a1a1aa" metalness={0.95} roughness={0.15} />
          </mesh>
          <mesh position={[0, -0.3, 0]}>
            <boxGeometry args={[0.18, 0.04, 0.18]} />
            <meshStandardMaterial color="#71717a" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>

        <group position={[1.2, -1.15, 0]}>
          <mesh castShadow position={[0, -0.15, 0]}>
            <cylinderGeometry args={[0.06, 0.07, 0.3, 32]} />
            <meshStandardMaterial color="#a1a1aa" metalness={0.95} roughness={0.15} />
          </mesh>
          <mesh position={[0, -0.3, 0]}>
            <boxGeometry args={[0.18, 0.04, 0.18]} />
            <meshStandardMaterial color="#71717a" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* PANEL 2: Secondary Intersecting Architectural Partition Glass */}
      <group position={[1.4, 0.4, -0.7]} rotation={[0, -0.45, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.8, 2.4, 0.08]} />
          <GlassMaterial transmission={0.94} roughness={0.06} thickness={1.6} attenuationColor="#c5dbdf" />
        </mesh>

        {/* Structural Glass Clamps */}
        <mesh position={[-0.85, 0.8, 0.05]}>
          <boxGeometry args={[0.08, 0.12, 0.14]} />
          <meshStandardMaterial color="#8e8e93" metalness={0.92} roughness={0.1} />
        </mesh>
        <mesh position={[-0.85, -0.8, 0.05]}>
          <boxGeometry args={[0.08, 0.12, 0.14]} />
          <meshStandardMaterial color="#8e8e93" metalness={0.92} roughness={0.1} />
        </mesh>
      </group>

      {/* PANEL 3: Foreground Vertical Accent Glass Pane */}
      <group position={[-1.5, -0.3, 0.6]} rotation={[0, 0.35, 0.08]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.2, 1.8, 0.08]} />
          <GlassMaterial transmission={0.97} roughness={0.03} thickness={1.2} />
        </mesh>

        {/* Pin Fixing Mount */}
        <mesh position={[0.45, 0.6, 0.05]}>
          <cylinderGeometry args={[0.035, 0.035, 0.12, 24]} />
          <meshStandardMaterial color="#a1a1aa" metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[0.45, -0.6, 0.05]}>
          <cylinderGeometry args={[0.035, 0.035, 0.12, 24]} />
          <meshStandardMaterial color="#a1a1aa" metalness={0.9} roughness={0.15} />
        </mesh>
      </group>
    </group>
  );
};
