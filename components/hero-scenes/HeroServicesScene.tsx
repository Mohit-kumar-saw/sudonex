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

type Layer = { group: THREE.Group; baseY: number; phase: number };
type Packet = { mesh: THREE.Mesh; from: number; to: number; t: number; speed: number };

export default function HeroServicesScene() {
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

      const layerCount = 7;
      const layers: Layer[] = [];
      const layerYs: number[] = [];

      for (let i = 0; i < layerCount; i++) {
        const group = new THREE.Group();
        const w = 2.4 - i * 0.08;
        const h = 0.14;
        const geo = new THREE.BoxGeometry(w, h, 1.1);
        group.add(
          new THREE.Mesh(
            geo,
            new THREE.MeshBasicMaterial({ color: HERO_DEEP, transparent: true, opacity: 0.55 + i * 0.04 }),
          ),
        );
        group.add(
          new THREE.LineSegments(
            new THREE.EdgesGeometry(geo),
            new THREE.LineBasicMaterial({
              color: i % 2 === 0 ? HERO_BRAND : HERO_GLOW,
              transparent: true,
              opacity: 0.55,
            }),
          ),
        );

        const y = -1.1 + i * 0.34;
        layerYs.push(y);
        group.position.set((i % 2 === 0 ? 1 : -1) * 0.06, y, 0);
        root.add(group);
        layers.push({ group, baseY: y, phase: i * 0.55 });
      }

      const spine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-0.95, layerYs[0], 0),
          new THREE.Vector3(-0.95, layerYs[layerCount - 1], 0),
        ]),
        new THREE.LineBasicMaterial({ color: HERO_BRAND, transparent: true, opacity: 0.35 }),
      );
      root.add(spine);

      const packets: Packet[] = [];
      for (let i = 0; i < 10; i++) {
        const mesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.04, 8, 8),
          new THREE.MeshBasicMaterial({ color: HERO_GLOW, transparent: true, opacity: 0.9 }),
        );
        root.add(mesh);
        const from = i % layerCount;
        const to = (from + 1) % layerCount;
        packets.push({ mesh, from, to, t: i / 10, speed: 0.18 + (i % 4) * 0.05 });
      }

      const gear = new THREE.Mesh(
        new THREE.TorusGeometry(0.35, 0.05, 8, 24),
        new THREE.MeshBasicMaterial({ color: HERO_DIM, transparent: true, opacity: 0.5 }),
      );
      gear.position.set(1.35, 0.2, 0.35);
      gear.rotation.x = Math.PI / 2;
      root.add(gear);

      scene.add(new THREE.AmbientLight(HERO_DIM, 0.65));
      const light = new THREE.PointLight(HERO_BRAND, 1.5, 12);
      light.position.set(1, 1, 4);
      scene.add(light);

      const ro = bindHeroResize(container, camera, renderer);
      const unbindMouse = bindHeroMouse(container, mouse);
      const clock = new THREE.Clock();

      const animate = () => {
        const t = clock.getElapsedTime();
        root.rotation.y = Math.sin(t * 0.2) * 0.22;

        layers.forEach((layer, i) => {
          const float = Math.sin(t * 1.1 + layer.phase) * 0.04;
          layer.group.position.y = layer.baseY + float;
          layer.group.position.x = (i % 2 === 0 ? 1 : -1) * (0.06 + Math.sin(t * 0.8 + i) * 0.03);
        });

        packets.forEach(p => {
          p.t = (p.t + p.speed * 0.008) % 1;
          const y = THREE.MathUtils.lerp(layerYs[p.from], layerYs[p.to], p.t);
          p.mesh.position.set(-0.75 + Math.sin(t * 2 + p.t * 8) * 0.05, y, 0.15);
          p.mesh.scale.setScalar(0.7 + Math.sin(t * 4) * 0.3);
        });

        gear.rotation.z = t * 0.6;
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

  if (useFallback) return <HeroFallback variant="services" />;

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[440px] aspect-square mx-auto [&_canvas]:block [&_canvas]:w-full [&_canvas]:h-full"
      aria-hidden
    />
  );
}
