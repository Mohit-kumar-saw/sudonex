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

function latLngToVec3(lat: number, lng: number, radius: number) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function fibonacciSphere(count: number, radius: number, jitter = 0) {
  const pts: THREE.Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const rad = radius + (jitter ? (Math.random() - 0.5) * jitter : 0);
    pts.push(new THREE.Vector3(Math.cos(theta) * r * rad, y * rad, Math.sin(theta) * r * rad));
  }
  return pts;
}

export default function HeroGlobeScene() {
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
      const core = new THREE.Group();
      scene.add(core);

      const shellGeo = new THREE.IcosahedronGeometry(1.5, 4);
      core.add(
        new THREE.LineSegments(
          new THREE.EdgesGeometry(shellGeo, 12),
          new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.14 }),
        ),
      );

      const landPts = fibonacciSphere(900, 1.48, 0.06);
      const landPos = new Float32Array(landPts.length * 3);
      landPts.forEach((v, i) => {
        landPos[i * 3] = v.x;
        landPos[i * 3 + 1] = v.y;
        landPos[i * 3 + 2] = v.z;
      });
      core.add(
        new THREE.Points(
          new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(landPos, 3)),
          new THREE.PointsMaterial({
            color: HERO_BRAND_LIGHT,
            size: 0.028,
            transparent: true,
            opacity: 0.55,
            sizeAttenuation: true,
            depthWrite: false,
          }),
        ),
      );

      const rings: THREE.Mesh[] = [];
      (
        [
          [2.05, 1.15, 0.1, HERO_BRAND, 0.45],
          [2.28, 0.35, 0.75, HERO_BRAND_LIGHT, 0.22],
          [1.92, -0.55, 0.25, 0xffffff, 0.07],
        ] as const
      ).forEach(([radius, rx, rz, color, opacity]) => {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(radius, 0.012, 6, 96),
          new THREE.MeshBasicMaterial({ color, transparent: true, opacity }),
        );
        ring.rotation.x = rx;
        ring.rotation.z = rz;
        core.add(ring);
        rings.push(ring);
      });

      const hubs = [
        [40.7, -74],
        [51.5, -0.1],
        [25.2, 55.3],
        [1.3, 103.8],
        [-33.9, 18.4],
      ];
      const hubMeshes: THREE.Mesh[] = [];
      hubs.forEach(([lat, lng]) => {
        const pos = latLngToVec3(lat, lng, 1.54);
        const dot = new THREE.Mesh(
          new THREE.SphereGeometry(0.04, 8, 8),
          new THREE.MeshBasicMaterial({ color: HERO_BRAND }),
        );
        dot.position.copy(pos);
        core.add(dot);
        hubMeshes.push(dot);
      });

      const arcLines: THREE.Line[] = [];
      for (let i = 0; i < hubs.length; i++) {
        for (let j = i + 1; j < hubs.length; j++) {
          if (Math.random() > 0.45) continue;
          const a = latLngToVec3(hubs[i][0], hubs[i][1], 1.62);
          const b = latLngToVec3(hubs[j][0], hubs[j][1], 1.62);
          const mid = a.clone().add(b).normalize().multiplyScalar(2.1);
          const line = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(new THREE.QuadraticBezierCurve3(a, mid, b).getPoints(32)),
            new THREE.LineBasicMaterial({ color: HERO_BRAND, transparent: true, opacity: 0.2 }),
          );
          core.add(line);
          arcLines.push(line);
        }
      }

      scene.add(new THREE.AmbientLight(0xffffff, 0.35));
      const pulseLight = new THREE.PointLight(HERO_BRAND, 1.2, 12);
      pulseLight.position.set(2, 1, 3);
      scene.add(pulseLight);

      const ro = bindHeroResize(container, camera, renderer);
      const unbindMouse = bindHeroMouse(container, mouse);
      const clock = new THREE.Clock();

      const animate = () => {
        const t = clock.getElapsedTime();
        core.rotation.y = t * 0.22;
        core.rotation.x = Math.sin(t * 0.35) * 0.06;
        rings[0].rotation.z = t * 0.4;
        rings[1].rotation.y = -t * 0.28;
        rings[2].rotation.x = t * 0.18;
        hubMeshes.forEach((m, i) => {
          const pulse = 1 + Math.sin(t * 2.5 + i * 0.7) * 0.15;
          m.scale.setScalar(pulse);
        });
        arcLines.forEach((line, i) => {
          (line.material as THREE.LineBasicMaterial).opacity = 0.12 + Math.sin(t * 1.8 + i) * 0.1;
        });
        pulseLight.intensity = 0.9 + Math.sin(t * 1.2) * 0.35;
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

  if (useFallback) return <HeroFallback variant="globe" />;

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[440px] aspect-square mx-auto [&_canvas]:block [&_canvas]:w-full [&_canvas]:h-full"
      aria-hidden
    />
  );
}
