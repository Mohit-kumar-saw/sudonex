'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { probeWebGL } from '@/lib/webgl';
import {
  HERO_BRAND,
  applyCameraParallax,
  bindHeroMouse,
  bindHeroResize,
  createHeroRenderer,
} from '@/lib/hero-three';
import { HeroFallback } from '@/components/hero-scenes/HeroFallback';

export default function HeroWaveScene() {
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
      camera.position.set(0, 0.3, 5.2);
      camera.lookAt(0, 0, 0);

      const group = new THREE.Group();
      group.rotation.x = -0.35;
      scene.add(group);

      const segments = 48;
      const geo = new THREE.PlaneGeometry(4.5, 4.5, segments, segments);
      const positions = geo.attributes.position;

      const surface = new THREE.Mesh(
        geo,
        new THREE.MeshBasicMaterial({
          color: HERO_BRAND,
          wireframe: true,
          transparent: true,
          opacity: 0.35,
        }),
      );
      group.add(surface);

      const peaks: THREE.Mesh[] = [];
      for (let i = 0; i < 12; i++) {
        const peak = new THREE.Mesh(
          new THREE.SphereGeometry(0.04, 8, 8),
          new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 }),
        );
        group.add(peak);
        peaks.push(peak);
      }

      scene.add(new THREE.AmbientLight(0xffffff, 0.4));
      const ro = bindHeroResize(container, camera, renderer);
      const unbindMouse = bindHeroMouse(container, mouse);
      const clock = new THREE.Clock();

      const animate = () => {
        const t = clock.getElapsedTime();

        for (let i = 0; i < positions.count; i++) {
          const x = positions.getX(i);
          const y = positions.getY(i);
          const z =
            Math.sin(x * 1.8 + t * 1.2) * 0.22 +
            Math.cos(y * 1.6 + t * 0.9) * 0.18 +
            Math.sin((x + y) * 1.2 + t * 0.7) * 0.1;
          positions.setZ(i, z);
        }
        positions.needsUpdate = true;

        peaks.forEach((peak, i) => {
          const angle = (i / peaks.length) * Math.PI * 2 + t * 0.3;
          const radius = 1.1 + Math.sin(t + i) * 0.15;
          const px = Math.cos(angle) * radius;
          const py = Math.sin(angle) * radius;
          const pz =
            Math.sin(px * 1.8 + t * 1.2) * 0.22 +
            Math.cos(py * 1.6 + t * 0.9) * 0.18;
          peak.position.set(px, py, pz + 0.15);
        });

        group.rotation.z = Math.sin(t * 0.15) * 0.08;
        applyCameraParallax(camera, mouse, currentCam, targetCam, 5.2, 0.28);
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

  if (useFallback) return <HeroFallback variant="wave" />;

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[440px] aspect-square mx-auto [&_canvas]:block [&_canvas]:w-full [&_canvas]:h-full"
      aria-hidden
    />
  );
}
