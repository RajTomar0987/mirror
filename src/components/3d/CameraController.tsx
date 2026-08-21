"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export interface CameraControllerProps {
  disabled?: boolean;
}

export const CameraController = ({ disabled = false }: CameraControllerProps) => {
  const mouse = useRef({ x: 0, y: 0 });
  const scrollY = useRef(0);

  useEffect(() => {
    if (disabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleScroll = () => {
      scrollY.current = window.scrollY;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [disabled]);

  useFrame((state) => {
    const { camera } = state;
    if (disabled) {
      camera.position.set(0, 1.0, 5.0);
      camera.lookAt(0, 0, 0);
      return;
    }

    // Base position with subtle mouse & scroll influence
    const targetX = mouse.current.x * 0.4;
    const targetY = mouse.current.y * 0.25 + 1.0 - scrollY.current * 0.0025;
    const targetZ = 5.0 - scrollY.current * 0.0008;

    // Clamp camera Z position to prevent clipping through glass
    const clampedZ = Math.max(targetZ, 2.8);

    // Smooth lerp camera position
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, clampedZ, 0.05);

    // Dynamic look target
    const lookTarget = new THREE.Vector3(0, -(scrollY.current * 0.001), 0);
    camera.lookAt(lookTarget);
  });

  return null;
};
