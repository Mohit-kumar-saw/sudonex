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

type Packet = { mesh: THREE.Mesh; from: THREE.Vector3; to: THREE.Vector3; t: number; speed: number };

export default function HeroNetworkScene() {
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

      const geo = new THREE.IcosahedronGeometry(1.35, 1);
      group.add(
        new THREE.LineSegments(
          new THREE.EdgesGeometry(geo, 1),
          new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 }),
        ),
      );

      const inner = new THREE.Mesh(
        geo,
        new THREE.MeshBasicMaterial({ color: HERO_BRAND, transparent: true, opacity: 0.06, wireframe: true }),
      );
      group.add(inner);

      const verts = geo.attributes.position;
      const nodes: THREE.Vector3[] = [];
      for (let i = 0; i < verts.count; i++) {
        nodes.push(new THREE.Vector3(verts.getX(i), verts.getY(i), verts.getZ(i)));
      }

      const nodeMeshes: THREE.Mesh[] = [];
      nodes.forEach((v, i) => {
        const n = new THREE.Mesh(
          new THREE.SphereGeometry(0.055, 10, 10),
          new THREE.MeshBasicMaterial({
            color: i % 3 === 0 ? HERO_BRAND : HERO_BRAND_LIGHT,
            transparent: true,
            opacity: 0.85,
          }),
        );
        n.position.copy(v.clone().multiplyScalar(1.02));
        group.add(n);
        nodeMeshes.push(n);
      });

      const edges: [THREE.Vector3, THREE.Vector3][] = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          if (nodes[i].distanceTo(nodes[j]) < 1.35) {
            edges.push([nodes[i], nodes[j]]);
            const line = new THREE.Line(
              new THREE.BufferGeometry().setFromPoints([
                nodes[i].clone().multiplyScalar(1.02),
                nodes[j].clone().multiplyScalar(1.02),
              ]),
              new THREE.LineBasicMaterial({ color: HERO_BRAND, transparent: true, opacity: 0.15 }),
            );
            group.add(line);
          }
        }
      }

      const packets: Packet[] = [];
      edges.slice(0, 12).forEach(([a, b], i) => {
        const mesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.035, 8, 8),
          new THREE.MeshBasicMaterial({ color: 0xffffff }),
        );
        group.add(mesh);
        packets.push({
          mesh,
          from: a.clone().multiplyScalar(1.02),
          to: b.clone().multiplyScalar(1.02),
          t: Math.random(),
          speed: 0.25 + (i % 5) * 0.06,
        });
      });

      scene.add(new THREE.AmbientLight(0xffffff, 0.35));
      const ro = bindHeroResize(container, camera, renderer);
      const unbindMouse = bindHeroMouse(container, mouse);
      const clock = new THREE.Clock();

      const animate = () => {
        const t = clock.getElapsedTime();
        group.rotation.y = t * 0.18;
        group.rotation.x = Math.sin(t * 0.3) * 0.12;

        nodeMeshes.forEach((n, i) => {
          const s = 1 + Math.sin(t * 2.2 + i * 0.5) * 0.18;
          n.scale.setScalar(s);
        });

        packets.forEach(p => {
          p.t += p.speed * 0.008;
          if (p.t > 1) {
            p.t = 0;
            [p.from, p.to] = [p.to, p.from];
          }
          p.mesh.position.lerpVectors(p.from, p.to, p.t);
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

  if (useFallback) return <HeroFallback variant="network" />;

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[440px] aspect-square mx-auto [&_canvas]:block [&_canvas]:w-full [&_canvas]:h-full"
      aria-hidden
    />
  );
}
