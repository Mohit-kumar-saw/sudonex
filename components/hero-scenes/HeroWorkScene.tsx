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

type Card = {
  group: THREE.Group;
  baseX: number;
  baseZ: number;
  baseRot: number;
  lines: THREE.Line[];
};

function createCard(): Card {
  const group = new THREE.Group();
  const w = 1.1;
  const h = 0.75;

  group.add(
    new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ color: HERO_DEEP, transparent: true, opacity: 0.8, side: THREE.DoubleSide }),
    ),
  );

  const border = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-w / 2, -h / 2, 0.01),
      new THREE.Vector3(w / 2, -h / 2, 0.01),
      new THREE.Vector3(w / 2, h / 2, 0.01),
      new THREE.Vector3(-w / 2, h / 2, 0.01),
      new THREE.Vector3(-w / 2, -h / 2, 0.01),
    ]),
    new THREE.LineBasicMaterial({ color: HERO_BRAND, transparent: true, opacity: 0.8 }),
  );
  group.add(border);

  const header = new THREE.Mesh(
    new THREE.PlaneGeometry(w * 0.9, 0.12),
    new THREE.MeshBasicMaterial({ color: HERO_BRAND, transparent: true, opacity: 0.45, side: THREE.DoubleSide }),
  );
  header.position.set(0, h * 0.32, 0.02);
  group.add(header);

  const lines: THREE.Line[] = [];
  [-0.12, -0.24, -0.36].forEach(yOff => {
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-w * 0.38, yOff, 0.02),
        new THREE.Vector3(w * 0.38, yOff, 0.02),
      ]),
      new THREE.LineBasicMaterial({ color: HERO_DIM, transparent: true, opacity: 0.5 }),
    );
    group.add(line);
    lines.push(line);
  });

  const badge = new THREE.Mesh(
    new THREE.CircleGeometry(0.08, 16),
    new THREE.MeshBasicMaterial({ color: HERO_GLOW, transparent: true, opacity: 0.9 }),
  );
  badge.position.set(w * 0.38, h * 0.38, 0.03);
  group.add(badge);

  return { group, baseX: 0, baseZ: 0, baseRot: 0, lines };
}

export default function HeroWorkScene() {
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

      const cardCount = 5;
      const cards: Card[] = [];
      const radius = 1.45;

      for (let i = 0; i < cardCount; i++) {
        const angle = (i / cardCount) * Math.PI * 2 - Math.PI / 2;
        const card = createCard();
        card.baseX = Math.cos(angle) * radius;
        card.baseZ = Math.sin(angle) * radius * 0.45;
        card.baseRot = -angle + Math.PI / 2;
        card.group.position.set(card.baseX, 0, card.baseZ);
        card.group.rotation.y = card.baseRot;
        root.add(card.group);
        cards.push(card);
      }

      const podium = new THREE.Mesh(
        new THREE.CylinderGeometry(1.8, 2, 0.1, 48),
        new THREE.MeshBasicMaterial({ color: HERO_DIM, transparent: true, opacity: 0.3 }),
      );
      podium.position.y = -0.55;
      root.add(podium);

      const sparks: THREE.Mesh[] = [];
      for (let i = 0; i < 8; i++) {
        const s = new THREE.Mesh(
          new THREE.SphereGeometry(0.025, 6, 6),
          new THREE.MeshBasicMaterial({ color: HERO_GLOW }),
        );
        root.add(s);
        sparks.push(s);
      }

      scene.add(new THREE.AmbientLight(HERO_DIM, 0.65));
      const light = new THREE.PointLight(HERO_BRAND, 1.5, 12);
      light.position.set(0, 1.5, 4);
      scene.add(light);

      const ro = bindHeroResize(container, camera, renderer);
      const unbindMouse = bindHeroMouse(container, mouse);
      const clock = new THREE.Clock();

      const animate = () => {
        const t = clock.getElapsedTime();
        root.rotation.y = t * 0.1;

        const active = Math.floor((t * 0.28) % cardCount);

        cards.forEach((card, i) => {
          const isActive = i === active;
          const targetY = isActive ? 0.25 : 0;
          const targetZ = card.baseZ + (isActive ? 0.35 : 0);
          card.group.position.y += (targetY - card.group.position.y) * 0.06;
          card.group.position.z += (targetZ - card.group.position.z) * 0.06;
          card.group.position.x = card.baseX;
          card.group.rotation.y = card.baseRot;
          card.group.scale.setScalar(isActive ? 1.08 : 0.92);

          const border = card.group.children[1] as THREE.Line;
          (border.material as THREE.LineBasicMaterial).opacity = isActive ? 1 : 0.45;
          const badge = card.group.children[card.group.children.length - 1] as THREE.Mesh;
          badge.scale.setScalar(isActive ? 1.2 + Math.sin(t * 4) * 0.15 : 0.7);
        });

        sparks.forEach((s, i) => {
          const c = cards[active];
          const a = t * 2 + (i / sparks.length) * Math.PI * 2;
          s.position.set(
            c.group.position.x + Math.cos(a) * 0.7,
            c.group.position.y + 0.2 + Math.sin(a * 2) * 0.15,
            c.group.position.z + Math.sin(a) * 0.4,
          );
        });

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

  if (useFallback) return <HeroFallback variant="work" />;

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[440px] aspect-square mx-auto [&_canvas]:block [&_canvas]:w-full [&_canvas]:h-full"
      aria-hidden
    />
  );
}
