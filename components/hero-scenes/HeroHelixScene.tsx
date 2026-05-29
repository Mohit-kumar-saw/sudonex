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
} from '@/lib/hero-three';
import { HeroFallback } from '@/components/hero-scenes/HeroFallback';

function helixPoint(t: number, strand: number, radius: number, height: number) {
  const angle = t * Math.PI * 4 + strand * Math.PI;
  return new THREE.Vector3(Math.cos(angle) * radius, (t - 0.5) * height, Math.sin(angle) * radius);
}

export default function HeroHelixScene() {
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

      const strands = [0, 1];
      const rungs: THREE.Line[] = [];
      strands.forEach(strand => {
        const pts: THREE.Vector3[] = [];
        for (let i = 0; i <= 80; i++) {
          pts.push(helixPoint(i / 80, strand, 0.85, 3.2));
        }
        group.add(
          new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(pts),
            new THREE.LineBasicMaterial({
              color: strand === 0 ? HERO_BRAND : HERO_BRAND_LIGHT,
              transparent: true,
              opacity: 0.55,
            }),
          ),
        );

        for (let i = 0; i < 80; i += 4) {
          const bead = new THREE.Mesh(
            new THREE.SphereGeometry(0.04, 8, 8),
            new THREE.MeshBasicMaterial({ color: strand === 0 ? HERO_BRAND : 0xffffff, transparent: true, opacity: 0.7 }),
          );
          bead.position.copy(pts[i]);
          group.add(bead);
        }
      });

      for (let i = 0; i < 80; i += 6) {
        const a = helixPoint(i / 80, 0, 0.85, 3.2);
        const b = helixPoint(i / 80, 1, 0.85, 3.2);
        const rung = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([a, b]),
          new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.12 }),
        );
        group.add(rung);
        rungs.push(rung);
      }

      const flowDots: THREE.Mesh[] = [];
      for (let i = 0; i < 8; i++) {
        const dot = new THREE.Mesh(
          new THREE.SphereGeometry(0.03, 8, 8),
          new THREE.MeshBasicMaterial({ color: HERO_BRAND_LIGHT }),
        );
        group.add(dot);
        flowDots.push(dot);
      }

      scene.add(new THREE.AmbientLight(0xffffff, 0.4));
      const ro = bindHeroResize(container, camera, renderer);
      const unbindMouse = bindHeroMouse(container, mouse);
      const clock = new THREE.Clock();

      const animate = () => {
        const t = clock.getElapsedTime();
        group.rotation.y = t * 0.25;

        rungs.forEach((r, i) => {
          (r.material as THREE.LineBasicMaterial).opacity = 0.08 + Math.sin(t * 2 + i * 0.3) * 0.06;
        });

        flowDots.forEach((dot, i) => {
          const progress = ((t * 0.15 + i * 0.12) % 1);
          const strand = i % 2;
          dot.position.copy(helixPoint(progress, strand, 0.85, 3.2));
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

  if (useFallback) return <HeroFallback variant="helix" />;

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[440px] aspect-square mx-auto [&_canvas]:block [&_canvas]:w-full [&_canvas]:h-full"
      aria-hidden
    />
  );
}
