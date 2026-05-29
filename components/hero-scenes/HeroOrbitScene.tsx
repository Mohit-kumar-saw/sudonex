'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { probeWebGL } from '@/lib/webgl';
import {
  HERO_BRAND,
  HERO_BRAND_LIGHT,
  applyCameraParallax,
  bindHeroMouse,
  bindHeroResize,
  createHeroRenderer,
  starField,
} from '@/lib/hero-three';
import { HeroFallback } from '@/components/hero-scenes/HeroFallback';

type OrbitDot = { mesh: THREE.Mesh; ring: THREE.Mesh; radius: number; phase: number; speed: number };

export default function HeroOrbitScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !probeWebGL()) {
      setUseFallback(true);
      return;
    }

    try {
      let raf = 0;
      const mouse = { x: 0, y: 0 };
      const targetCam = new THREE.Vector3(0, 0, 5.2);
      const currentCam = new THREE.Vector3(0, 0, 5.2);

      const { scene, camera, renderer } = createHeroRenderer(container);
      const group = new THREE.Group();
      scene.add(group);
      scene.add(starField(280, 14));

      const core = new THREE.Mesh(
        new THREE.SphereGeometry(0.72, 32, 32),
        new THREE.MeshBasicMaterial({ color: HERO_BRAND, transparent: true, opacity: 0.28 }),
      );
      group.add(core);

      const glow = new THREE.Mesh(
        new THREE.SphereGeometry(1.05, 32, 32),
        new THREE.MeshBasicMaterial({ color: HERO_BRAND, transparent: true, opacity: 0.08 }),
      );
      group.add(glow);

      const orbitDots: OrbitDot[] = [];
      const ringSpecs: [number, number, number, number][] = [
        [1.55, 0.2, 0.4, 0.5],
        [1.85, 1.1, 0.15, 0.35],
        [2.15, 0.5, 1.2, 0.28],
        [1.72, -0.8, 0.6, 0.22],
        [2.35, 0.35, -0.5, 0.18],
      ];

      ringSpecs.forEach(([radius, rx, rz, opacity], idx) => {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(radius, 0.014, 8, 120),
          new THREE.MeshBasicMaterial({
            color: idx % 2 === 0 ? HERO_BRAND : HERO_BRAND_LIGHT,
            transparent: true,
            opacity,
          }),
        );
        ring.rotation.x = rx;
        ring.rotation.z = rz;
        group.add(ring);

        for (let d = 0; d < 2; d++) {
          const dot = new THREE.Mesh(
            new THREE.SphereGeometry(0.045, 10, 10),
            new THREE.MeshBasicMaterial({ color: HERO_BRAND }),
          );
          group.add(dot);
          orbitDots.push({
            mesh: dot,
            ring,
            radius,
            phase: (d / 2) * Math.PI * 2 + idx * 0.9,
            speed: 0.35 + idx * 0.08 + d * 0.05,
          });
        }
      });

      scene.add(new THREE.AmbientLight(0xffffff, 0.4));
      const light = new THREE.PointLight(HERO_BRAND, 1.4, 14);
      light.position.set(1.5, 2, 4);
      scene.add(light);

      const ro = bindHeroResize(container, camera, renderer);
      const unbindMouse = bindHeroMouse(container, mouse);
      const clock = new THREE.Clock();

      const animate = () => {
        const t = clock.getElapsedTime();
        group.rotation.y = t * 0.12;
        group.rotation.x = Math.sin(t * 0.25) * 0.08;

        core.scale.setScalar(1 + Math.sin(t * 1.5) * 0.04);
        glow.scale.setScalar(1 + Math.sin(t * 1.2) * 0.06);
        light.intensity = 1 + Math.sin(t * 1.4) * 0.3;

        orbitDots.forEach(({ mesh, ring, radius, phase, speed }) => {
          const angle = t * speed + phase;
          const local = new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
          local.applyEuler(ring.rotation);
          mesh.position.copy(local);
          mesh.scale.setScalar(0.85 + Math.sin(t * 3 + phase) * 0.2);
        });

        applyCameraParallax(camera, mouse, currentCam, targetCam);
        renderer.render(scene, camera);
        raf = requestAnimationFrame(animate);
      };
      animate();

      return () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        unbindMouse();
        renderer.dispose();
        renderer.domElement.remove();
      };
    } catch {
      setUseFallback(true);
    }
  }, []);

  if (useFallback) return <HeroFallback variant="orbit" />;

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[440px] aspect-square mx-auto [&_canvas]:block [&_canvas]:w-full [&_canvas]:h-full"
      aria-hidden
    />
  );
}
