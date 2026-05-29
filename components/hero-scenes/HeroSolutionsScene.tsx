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

type Module = { group: THREE.Group; home: THREE.Vector3; angle: number; phase: number };

function createHexModule(size: number): THREE.Group {
  const g = new THREE.Group();
  const geo = new THREE.CylinderGeometry(size, size, 0.22, 6);
  g.add(
    new THREE.Mesh(
      geo,
      new THREE.MeshBasicMaterial({ color: HERO_DEEP, transparent: true, opacity: 0.7 }),
    ),
  );
  g.add(
    new THREE.LineSegments(
      new THREE.EdgesGeometry(geo),
      new THREE.LineBasicMaterial({ color: HERO_BRAND, transparent: true, opacity: 0.75 }),
    ),
  );
  const top = new THREE.Mesh(
    new THREE.CircleGeometry(size * 0.85, 6),
    new THREE.MeshBasicMaterial({ color: HERO_BRAND, transparent: true, opacity: 0.25, side: THREE.DoubleSide }),
  );
  top.rotation.x = -Math.PI / 2;
  top.position.y = 0.11;
  g.add(top);
  return g;
}

export default function HeroSolutionsScene() {
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
      scene.add(root);

      const hubGeo = new THREE.BoxGeometry(0.75, 0.75, 0.75);
      const hub = new THREE.Mesh(
        hubGeo,
        new THREE.MeshBasicMaterial({ color: HERO_DEEP, transparent: true, opacity: 0.65 }),
      );
      root.add(hub);
      root.add(
        new THREE.LineSegments(
          new THREE.EdgesGeometry(hubGeo),
          new THREE.LineBasicMaterial({ color: HERO_GLOW, transparent: true, opacity: 0.9 }),
        ),
      );

      const hubGlow = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 0.9, 0.9),
        new THREE.MeshBasicMaterial({ color: HERO_BRAND, transparent: true, opacity: 0.08, wireframe: true }),
      );
      root.add(hubGlow);

      const moduleCount = 6;
      const modules: Module[] = [];
      const linkLines: THREE.Line[] = [];

      for (let i = 0; i < moduleCount; i++) {
        const angle = (i / moduleCount) * Math.PI * 2;
        const home = new THREE.Vector3(Math.cos(angle) * 1.55, Math.sin(angle) * 0.35, Math.sin(angle) * 1.55);
        const mod = createHexModule(0.38);
        mod.position.copy(home);
        mod.lookAt(0, 0, 0);
        root.add(mod);
        modules.push({ group: mod, home, angle, phase: i * 0.9 });

        const line = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), home.clone().multiplyScalar(0.55)]),
          new THREE.LineBasicMaterial({ color: HERO_BRAND_LIGHT, transparent: true, opacity: 0.2 }),
        );
        root.add(line);
        linkLines.push(line);
      }

      const orbitRing = new THREE.Mesh(
        new THREE.TorusGeometry(1.65, 0.012, 6, 80),
        new THREE.MeshBasicMaterial({ color: HERO_DIM, transparent: true, opacity: 0.4 }),
      );
      orbitRing.rotation.x = Math.PI / 2.2;
      root.add(orbitRing);

      const sparks: THREE.Mesh[] = [];
      for (let i = 0; i < 8; i++) {
        const s = new THREE.Mesh(
          new THREE.SphereGeometry(0.03, 6, 6),
          new THREE.MeshBasicMaterial({ color: HERO_GLOW }),
        );
        root.add(s);
        sparks.push(s);
      }

      scene.add(new THREE.AmbientLight(HERO_DIM, 0.65));
      const light = new THREE.PointLight(HERO_BRAND, 1.5, 12);
      light.position.set(0, 2, 4);
      scene.add(light);

      const ro = bindHeroResize(container, camera, renderer);
      const unbindMouse = bindHeroMouse(container, mouse);
      const clock = new THREE.Clock();

      const animate = () => {
        const t = clock.getElapsedTime();
        root.rotation.y = t * 0.15;

        hub.rotation.y = t * 0.4;
        hub.rotation.x = Math.sin(t * 0.35) * 0.12;
        hubGlow.scale.setScalar(1 + Math.sin(t * 1.2) * 0.08);

        modules.forEach((m, i) => {
          const snap = (Math.sin(t * 0.6 + m.phase) + 1) / 2;
          const pull = snap * 0.22;
          m.group.position.lerpVectors(m.home, new THREE.Vector3(0, 0, 0), pull);
          m.group.lookAt(0, 0, 0);
          m.group.position.y += Math.sin(t * 1.4 + i) * 0.05;
          m.group.scale.setScalar(0.92 + snap * 0.12);
        });

        linkLines.forEach((line, i) => {
          const snap = (Math.sin(t * 0.6 + i * 0.9) + 1) / 2;
          (line.material as THREE.LineBasicMaterial).opacity = 0.12 + snap * 0.35;
        });

        orbitRing.rotation.z = -t * 0.3;

        sparks.forEach((s, i) => {
          const a = t * 0.5 + (i / sparks.length) * Math.PI * 2;
          s.position.set(Math.cos(a) * 1.2, Math.sin(a * 2) * 0.25, Math.sin(a) * 1.2);
        });

        light.intensity = 1.1 + Math.sin(t * 1.4) * 0.35;
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

  if (useFallback) return <HeroFallback variant="solutions" />;

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[440px] aspect-square mx-auto [&_canvas]:block [&_canvas]:w-full [&_canvas]:h-full"
      aria-hidden
    />
  );
}
