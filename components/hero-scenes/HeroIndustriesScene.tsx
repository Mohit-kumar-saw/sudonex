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

const HERO_DIM = 0x993d00;
const HERO_DEEP = 0x331400;
const HERO_GLOW = 0xff8533;

type Sector = { mesh: THREE.Mesh; edges: THREE.LineSegments; angle: number; length: number };

export default function HeroIndustriesScene() {
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
      const root = new THREE.Group();
      root.rotation.x = -0.25;
      scene.add(root);

      const hub = new THREE.Mesh(
        new THREE.CylinderGeometry(0.42, 0.42, 0.12, 32),
        new THREE.MeshBasicMaterial({ color: HERO_BRAND, transparent: true, opacity: 0.35 }),
      );
      hub.rotation.x = Math.PI / 2;
      root.add(hub);

      root.add(
        new THREE.LineSegments(
          new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.42, 0.42, 0.12, 6)),
          new THREE.LineBasicMaterial({ color: HERO_GLOW, transparent: true, opacity: 0.7 }),
        ),
      );

      const outerRing = new THREE.Mesh(
        new THREE.RingGeometry(1.55, 1.58, 64),
        new THREE.MeshBasicMaterial({ color: HERO_DIM, transparent: true, opacity: 0.45, side: THREE.DoubleSide }),
      );
      outerRing.rotation.x = -Math.PI / 2;
      root.add(outerRing);

      const sectorCount = 6;
      const sectors: Sector[] = [];
      const lengths = [1.35, 1.05, 1.5, 0.95, 1.25, 1.15];

      for (let i = 0; i < sectorCount; i++) {
        const angle = (i / sectorCount) * Math.PI * 2 - Math.PI / 2;
        const len = lengths[i];
        const geo = new THREE.BoxGeometry(0.14, len, 0.14);
        const mesh = new THREE.Mesh(
          geo,
          new THREE.MeshBasicMaterial({ color: HERO_DEEP, transparent: true, opacity: 0.7 }),
        );
        const edges = new THREE.LineSegments(
          new THREE.EdgesGeometry(geo),
          new THREE.LineBasicMaterial({ color: HERO_BRAND, transparent: true, opacity: 0.65 }),
        );

        const x = Math.cos(angle) * (len / 2 + 0.35);
        const z = Math.sin(angle) * (len / 2 + 0.35);
        mesh.position.set(x, 0.07, z);
        mesh.rotation.y = -angle + Math.PI / 2;
        edges.position.copy(mesh.position);
        edges.rotation.copy(mesh.rotation);

        root.add(mesh);
        root.add(edges);
        sectors.push({ mesh, edges, angle, length: len });
      }

      const axisLines: THREE.Line[] = [];
      sectors.forEach(s => {
        const end = new THREE.Vector3(
          Math.cos(s.angle) * 1.75,
          0.07,
          Math.sin(s.angle) * 1.75,
        );
        const line = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0.07, 0), end]),
          new THREE.LineBasicMaterial({ color: HERO_DIM, transparent: true, opacity: 0.25 }),
        );
        root.add(line);
        axisLines.push(line);
      });

      const markers: THREE.Mesh[] = [];
      for (let i = 0; i < sectorCount; i++) {
        const m = new THREE.Mesh(
          new THREE.SphereGeometry(0.06, 10, 10),
          new THREE.MeshBasicMaterial({ color: HERO_GLOW, transparent: true, opacity: 0.85 }),
        );
        root.add(m);
        markers.push(m);
      }

      const sweep = new THREE.Mesh(
        new THREE.RingGeometry(0.5, 1.6, 64, 1, 0, Math.PI / 3),
        new THREE.MeshBasicMaterial({
          color: HERO_BRAND_LIGHT,
          transparent: true,
          opacity: 0.12,
          side: THREE.DoubleSide,
        }),
      );
      sweep.rotation.x = -Math.PI / 2;
      sweep.position.y = 0.05;
      root.add(sweep);

      scene.add(new THREE.AmbientLight(HERO_DIM, 0.65));
      const light = new THREE.PointLight(HERO_BRAND, 1.5, 12);
      light.position.set(0, 2, 4);
      scene.add(light);

      const ro = bindHeroResize(container, camera, renderer);
      const unbindMouse = bindHeroMouse(container, mouse);
      const clock = new THREE.Clock();

      const animate = () => {
        const t = clock.getElapsedTime();
        root.rotation.y = t * 0.12;

        const active = Math.floor((t * 0.35) % sectorCount);

        sectors.forEach((s, i) => {
          const pulse = 0.85 + Math.sin(t * 1.5 + i) * 0.15;
          const boost = i === active ? 1.18 : 1;
          s.mesh.scale.y = pulse * boost;
          s.edges.scale.y = pulse * boost;
          const len = s.length * pulse * boost;
          const x = Math.cos(s.angle) * (len / 2 + 0.35);
          const z = Math.sin(s.angle) * (len / 2 + 0.35);
          s.mesh.position.set(x, 0.07, z);
          s.edges.position.copy(s.mesh.position);
          (s.mesh.material as THREE.MeshBasicMaterial).opacity = i === active ? 0.85 : 0.55;
        });

        markers.forEach((m, i) => {
          const s = sectors[i];
          const len = s.length * s.mesh.scale.y;
          m.position.set(
            Math.cos(s.angle) * (len + 0.45),
            0.12,
            Math.sin(s.angle) * (len + 0.45),
          );
          m.scale.setScalar(i === active ? 1.3 : 0.85);
        });

        sweep.rotation.z = t * 0.5;
        (sweep.material as THREE.MeshBasicMaterial).opacity = 0.08 + Math.sin(t * 2) * 0.06;

        light.intensity = 1.1 + Math.sin(t * 1.3) * 0.35;
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

  if (useFallback) return <HeroFallback variant="industries" />;

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[440px] aspect-square mx-auto [&_canvas]:block [&_canvas]:w-full [&_canvas]:h-full"
      aria-hidden
    />
  );
}
