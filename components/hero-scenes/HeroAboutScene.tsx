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

type Bar = { mesh: THREE.Mesh; edges: THREE.LineSegments; baseH: number; phase: number };

export default function HeroAboutScene() {
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
      const targetCam = new THREE.Vector3(0.2, 0.15, 5.2);
      const currentCam = new THREE.Vector3(0.2, 0.15, 5.2);

      const { scene, camera, renderer } = createHeroRenderer(container);
      camera.position.set(0.2, 0.15, 5.2);

      const root = new THREE.Group();
      root.rotation.x = -0.35;
      root.rotation.y = 0.45;
      scene.add(root);

      const gridSize = 3.2;
      const gridDiv = 10;
      const gridVerts: number[] = [];
      for (let i = 0; i <= gridDiv; i++) {
        const t = (i / gridDiv - 0.5) * gridSize;
        gridVerts.push(-gridSize / 2, 0, t, gridSize / 2, 0, t);
        gridVerts.push(t, 0, -gridSize / 2, t, 0, gridSize / 2);
      }
      const grid = new THREE.LineSegments(
        new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(gridVerts, 3)),
        new THREE.LineBasicMaterial({ color: HERO_DIM, transparent: true, opacity: 0.35 }),
      );
      root.add(grid);

      const yAxis = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-1.35, 0, -1.35),
          new THREE.Vector3(-1.35, 2.2, -1.35),
        ]),
        new THREE.LineBasicMaterial({ color: HERO_BRAND, transparent: true, opacity: 0.5 }),
      );
      root.add(yAxis);

      const barCount = 8;
      const bars: Bar[] = [];
      const barTops: THREE.Vector3[] = [];
      const spacing = 0.38;
      const startX = -((barCount - 1) * spacing) / 2;

      for (let i = 0; i < barCount; i++) {
        const baseH = 0.45 + ((i * 0.17 + Math.sin(i * 1.2) * 0.2 + 1) % 1) * 1.35;
        const geo = new THREE.BoxGeometry(0.22, baseH, 0.22);
        const mesh = new THREE.Mesh(
          geo,
          new THREE.MeshBasicMaterial({ color: HERO_DEEP, transparent: true, opacity: 0.75 }),
        );
        mesh.position.set(startX + i * spacing, baseH / 2, 0);
        root.add(mesh);

        const edges = new THREE.LineSegments(
          new THREE.EdgesGeometry(geo),
          new THREE.LineBasicMaterial({ color: HERO_BRAND, transparent: true, opacity: 0.7 }),
        );
        edges.position.copy(mesh.position);
        root.add(edges);

        bars.push({ mesh, edges, baseH, phase: i * 0.7 });
        barTops.push(new THREE.Vector3(startX + i * spacing, baseH, 0));
      }

      const curvePoints: THREE.Vector3[] = [];
      for (let i = 0; i < barCount; i++) {
        const x = startX + i * spacing;
        const y = bars[i].baseH + 0.12;
        curvePoints.push(new THREE.Vector3(x, y, 0.08));
      }
      const growthCurve = new THREE.CatmullRomCurve3(curvePoints, false, 'catmullrom', 0.45);
      const linePts = growthCurve.getPoints(80);

      const growthLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(linePts),
        new THREE.LineBasicMaterial({ color: HERO_GLOW, transparent: true, opacity: 0.9 }),
      );
      root.add(growthLine);

      const fillShape = new THREE.Shape();
      fillShape.moveTo(linePts[0].x, linePts[0].y);
      linePts.forEach(p => fillShape.lineTo(p.x, p.y));
      fillShape.lineTo(linePts[linePts.length - 1].x, 0);
      fillShape.lineTo(linePts[0].x, 0);
      fillShape.closePath();
      const areaFill = new THREE.Mesh(
        new THREE.ShapeGeometry(fillShape),
        new THREE.MeshBasicMaterial({ color: HERO_BRAND, transparent: true, opacity: 0.1, side: THREE.DoubleSide }),
      );
      areaFill.position.z = 0.02;
      root.add(areaFill);

      const tracer = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 12, 12),
        new THREE.MeshBasicMaterial({ color: HERO_GLOW }),
      );
      root.add(tracer);

      const tracerGlow = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 12, 12),
        new THREE.MeshBasicMaterial({ color: HERO_BRAND, transparent: true, opacity: 0.25 }),
      );
      root.add(tracerGlow);

      const dots: THREE.Mesh[] = [];
      for (let i = 0; i < 12; i++) {
        const dot = new THREE.Mesh(
          new THREE.SphereGeometry(0.025, 6, 6),
          new THREE.MeshBasicMaterial({ color: HERO_BRAND_LIGHT, transparent: true, opacity: 0.6 }),
        );
        root.add(dot);
        dots.push(dot);
      }

      scene.add(new THREE.AmbientLight(HERO_DIM, 0.7));
      const light = new THREE.PointLight(HERO_BRAND, 1.4, 14);
      light.position.set(2, 3, 4);
      scene.add(light);

      const ro = bindHeroResize(container, camera, renderer);
      const unbindMouse = bindHeroMouse(container, mouse);
      const clock = new THREE.Clock();
      let tracerT = 0;

      const animate = () => {
        const t = clock.getElapsedTime();

        root.rotation.y = 0.45 + Math.sin(t * 0.15) * 0.08;

        bars.forEach((b, i) => {
          const h = b.baseH * (0.82 + Math.sin(t * 1.2 + b.phase) * 0.18);
          b.mesh.scale.y = h / b.baseH;
          b.mesh.position.y = h / 2;
          b.edges.scale.y = h / b.baseH;
          b.edges.position.y = h / 2;
          barTops[i].y = h;

          const mat = b.mesh.material as THREE.MeshBasicMaterial;
          mat.opacity = 0.55 + Math.sin(t * 1.5 + i) * 0.2;
        });

        const updatedPts = bars.map((b, i) =>
          new THREE.Vector3(startX + i * spacing, barTops[i].y + 0.1, 0.08),
        );
        const liveCurve = new THREE.CatmullRomCurve3(updatedPts, false, 'catmullrom', 0.45);
        const liveLine = liveCurve.getPoints(80);
        growthLine.geometry.dispose();
        growthLine.geometry = new THREE.BufferGeometry().setFromPoints(liveLine);

        tracerT = (tracerT + 0.003) % 1;
        const pt = liveCurve.getPoint(tracerT);
        const tangent = liveCurve.getTangent(tracerT);
        tracer.position.copy(pt);
        tracerGlow.position.copy(pt);
        tracer.scale.setScalar(0.9 + Math.sin(t * 4) * 0.2);
        tracerGlow.scale.setScalar(1.4 + Math.sin(t * 3) * 0.3);

        areaFill.geometry.dispose();
        const shape = new THREE.Shape();
        shape.moveTo(liveLine[0].x, liveLine[0].y);
        liveLine.forEach(p => shape.lineTo(p.x, p.y));
        shape.lineTo(liveLine[liveLine.length - 1].x, 0);
        shape.lineTo(liveLine[0].x, 0);
        shape.closePath();
        areaFill.geometry = new THREE.ShapeGeometry(shape);

        dots.forEach((dot, i) => {
          const p = liveCurve.getPoint((i / dots.length + t * 0.05) % 1);
          dot.position.set(p.x, p.y - 0.08, p.z);
        });

        (growthLine.material as THREE.LineBasicMaterial).opacity = 0.7 + Math.sin(t * 2) * 0.2;
        light.intensity = 1.1 + Math.sin(t * 1.2) * 0.3;
        applyCameraParallax(camera, mouse, currentCam, targetCam, 5.2, 0.3);
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

  if (useFallback) return <HeroFallback variant="about" />;

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[440px] aspect-square mx-auto [&_canvas]:block [&_canvas]:w-full [&_canvas]:h-full"
      aria-hidden
    />
  );
}
