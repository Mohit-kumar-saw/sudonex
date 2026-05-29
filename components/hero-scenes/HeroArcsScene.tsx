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

type ArcRunner = { mesh: THREE.Mesh; curve: THREE.QuadraticBezierCurve3; t: number; speed: number };

export default function HeroArcsScene() {
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

      const arcLines: THREE.Line[] = [];
      const runners: ArcRunner[] = [];
      const arcCount = 7;

      for (let i = 0; i < arcCount; i++) {
        const spread = (i - (arcCount - 1) / 2) * 0.55;
        const start = new THREE.Vector3(spread - 1.2, -1.4, 0);
        const end = new THREE.Vector3(spread + 1.2, -1.4, 0);
        const peak = new THREE.Vector3(spread * 0.3, 1.2 + (i % 3) * 0.35, 0.2);
        const curve = new THREE.QuadraticBezierCurve3(start, peak, end);
        const line = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(curve.getPoints(48)),
          new THREE.LineBasicMaterial({
            color: i % 2 === 0 ? HERO_BRAND : HERO_BRAND_LIGHT,
            transparent: true,
            opacity: 0.25 + (i % 3) * 0.08,
          }),
        );
        group.add(line);
        arcLines.push(line);

        const runner = new THREE.Mesh(
          new THREE.SphereGeometry(0.045, 10, 10),
          new THREE.MeshBasicMaterial({ color: 0xffffff }),
        );
        group.add(runner);
        runners.push({ mesh: runner, curve, t: i / arcCount, speed: 0.18 + (i % 4) * 0.04 });
      }

      const base = new THREE.Mesh(
        new THREE.PlaneGeometry(5, 0.02),
        new THREE.MeshBasicMaterial({ color: HERO_BRAND, transparent: true, opacity: 0.15 }),
      );
      base.position.y = -1.45;
      group.add(base);

      scene.add(new THREE.AmbientLight(0xffffff, 0.45));
      const ro = bindHeroResize(container, camera, renderer);
      const unbindMouse = bindHeroMouse(container, mouse);
      const clock = new THREE.Clock();

      const animate = () => {
        const t = clock.getElapsedTime();
        group.rotation.y = Math.sin(t * 0.2) * 0.15;

        arcLines.forEach((line, i) => {
          (line.material as THREE.LineBasicMaterial).opacity =
            0.18 + Math.sin(t * 1.6 + i * 0.7) * 0.12 + (i % 3) * 0.06;
        });

        runners.forEach(r => {
          r.t = (r.t + r.speed * 0.006) % 1;
          r.mesh.position.copy(r.curve.getPoint(r.t));
          r.mesh.scale.setScalar(0.8 + Math.sin(t * 4 + r.t * 10) * 0.25);
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

  if (useFallback) return <HeroFallback variant="arcs" />;

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[440px] aspect-square mx-auto [&_canvas]:block [&_canvas]:w-full [&_canvas]:h-full"
      aria-hidden
    />
  );
}
