"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export interface ScrollSceneProps {
  targetRef: React.RefObject<THREE.Group | null>;
  disabled?: boolean;
}

export const ScrollScene = ({ targetRef, disabled = false }: ScrollSceneProps) => {
  const scrollY = useRef(0);

  useEffect(() => {
    if (disabled) return;
    const handleScroll = () => {
      scrollY.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [disabled]);

  useFrame(() => {
    if (disabled || !targetRef.current) return;

    // Smooth architectural scroll rotation
    const targetRotationY = scrollY.current * 0.0004;
    const targetRotationX = scrollY.current * 0.0001;

    targetRef.current.rotation.y = THREE.MathUtils.lerp(
      targetRef.current.rotation.y,
      targetRotationY,
      0.05
    );
    targetRef.current.rotation.x = THREE.MathUtils.lerp(
      targetRef.current.rotation.x,
      targetRotationX,
      0.05
    );
  });

  return null;
};
