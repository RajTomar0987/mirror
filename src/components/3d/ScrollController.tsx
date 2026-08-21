"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export const ScrollController = ({ targetRef }: { targetRef: React.RefObject<THREE.Group | null> }) => {
  const scrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      scrollY.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame(() => {
    if (targetRef.current) {
      // Rotate glass structure based on scroll
      const targetRotationY = scrollY.current * 0.0005;
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
    }
  });

  return null;
};
