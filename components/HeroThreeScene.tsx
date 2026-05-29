'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { probeWebGL } from '@/lib/webgl';

const BRAND = 0xff6600;
const BRAND_LIGHT = 0xff8533;

/** Lat/lng → unit sphere xyz */
function latLngToVec3(lat: number, lng: number, radius: number) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

/** Even distribution on sphere (Fibonacci) */
function fibonacciSphere(count: number, radius: number, jitter = 0) {
  const pts: THREE.Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const rad = radius + (jitter ? (Math.random() - 0.5) * jitter : 0);
    pts.push(
      new THREE.Vector3(Math.cos(theta) * r * rad, y * rad, Math.sin(theta) * r * rad),
    );
  }
  return pts;
}

function HeroFallback() {
  return (
    <div className="relative w-full max-w-[420px] aspect-square mx-auto flex items-center justify-center">
      <svg viewBox="0 0 200 200" className="w-[85%] h-[85%] animate-[spin_48s_linear_infinite]" aria-hidden>
        <circle cx="100" cy="100" r="78" fill="none" stroke="rgba(255,102,0,0.35)" strokeWidth="0.8" />
        <ellipse cx="100" cy="100" rx="78" ry="24" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
        <ellipse cx="100" cy="100" rx="78" ry="48" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
        <ellipse cx="100" cy="100" rx="24" ry="78" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
      </svg>
      <div className="absolute w-3 h-3 rounded-full bg-brand-500/80 blur-sm animate-pulse" />
    </div>
  );
}

export default function HeroThreeScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !probeWebGL()) {
      setUseFallback(true);
      return;
    }

    try {
    let width = 0;
    let height = 0;
    let raf = 0;
    const mouse = { x: 0, y: 0 };
    const targetCam = new THREE.Vector3(0, 0, 5.2);
    const currentCam = new THREE.Vector3(0, 0, 5.2);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 50);
    camera.position.copy(currentCam);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'default',
      failIfMajorPerformanceCaveat: false,
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    container.appendChild(renderer.domElement);

    const core = new THREE.Group();
    scene.add(core);

    // Wireframe shell
    const shellGeo = new THREE.IcosahedronGeometry(1.5, 4);
    const edges = new THREE.EdgesGeometry(shellGeo, 12);
    const wireframe = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.14 }),
    );
    core.add(wireframe);

    // Land-like dot field (orange + white)
    const landPts = fibonacciSphere(900, 1.48, 0.06);
    const landPos = new Float32Array(landPts.length * 3);
    landPts.forEach((v, i) => {
      landPos[i * 3] = v.x;
      landPos[i * 3 + 1] = v.y;
      landPos[i * 3 + 2] = v.z;
    });
    const landCloud = new THREE.Points(
      new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(landPos, 3)),
      new THREE.PointsMaterial({
        color: BRAND_LIGHT,
        size: 0.028,
        transparent: true,
        opacity: 0.55,
        sizeAttenuation: true,
        depthWrite: false,
      }),
    );
    core.add(landCloud);

    const dimPos = new Float32Array(landPts.length * 3);
    landPts.forEach((v, i) => {
      const s = 1.42;
      dimPos[i * 3] = v.x * s;
      dimPos[i * 3 + 1] = v.y * s;
      dimPos[i * 3 + 2] = v.z * s;
    });
    core.add(
      new THREE.Points(
        new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(dimPos, 3)),
        new THREE.PointsMaterial({
          color: 0xffffff,
          size: 0.018,
          transparent: true,
          opacity: 0.22,
          sizeAttenuation: true,
          depthWrite: false,
        }),
      ),
    );

    // Orbital rings
    const rings: THREE.Mesh[] = [];
    const ringSpecs: [number, number, number, number, number][] = [
      [2.05, 1.15, 0.1, BRAND, 0.45],
      [2.28, 0.35, 0.75, BRAND_LIGHT, 0.22],
      [1.92, -0.55, 0.25, 0xffffff, 0.07],
    ];
    ringSpecs.forEach(([radius, rx, rz, color, opacity]) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.012, 6, 96),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity }),
      );
      ring.rotation.x = rx;
      ring.rotation.z = rz;
      core.add(ring);
      rings.push(ring);
    });

    // Hub markers (global delivery nodes)
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
        new THREE.MeshBasicMaterial({ color: BRAND }),
      );
      dot.position.copy(pos);
      core.add(dot);
      hubMeshes.push(dot);

      const glow = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 8, 8),
        new THREE.MeshBasicMaterial({ color: BRAND, transparent: true, opacity: 0.25 }),
      );
      glow.position.copy(pos);
      core.add(glow);
      hubMeshes.push(glow);
    });

    // Arc connections between hubs
    const arcGroup = new THREE.Group();
    core.add(arcGroup);
    const arcLines: THREE.Line[] = [];
    for (let i = 0; i < hubs.length; i++) {
      for (let j = i + 1; j < hubs.length; j++) {
        if (Math.random() > 0.45) continue;
        const a = latLngToVec3(hubs[i][0], hubs[i][1], 1.62);
        const b = latLngToVec3(hubs[j][0], hubs[j][1], 1.62);
        const mid = a.clone().add(b).normalize().multiplyScalar(2.1);
        const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
        const points = curve.getPoints(32);
        const line = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(points),
          new THREE.LineBasicMaterial({ color: BRAND, transparent: true, opacity: 0.2 }),
        );
        arcGroup.add(line);
        arcLines.push(line);
      }
    }

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const pulseLight = new THREE.PointLight(BRAND, 1.2, 12);
    pulseLight.position.set(2, 1, 3);
    scene.add(pulseLight);

    const resize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      if (width <= 0 || height <= 0) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    const onLeave = () => {
      mouse.x = 0;
      mouse.y = 0;
    };
    container.addEventListener('mousemove', onMove);
    container.addEventListener('mouseleave', onLeave);

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
        m.scale.setScalar(i % 2 === 0 ? pulse : 1 + (pulse - 1) * 0.5);
      });

      arcLines.forEach((line, i) => {
        const mat = line.material as THREE.LineBasicMaterial;
        mat.opacity = 0.12 + Math.sin(t * 1.8 + i) * 0.1;
      });

      pulseLight.intensity = 0.9 + Math.sin(t * 1.2) * 0.35;

      targetCam.set(mouse.x * 0.35, -mouse.y * 0.25, 5.2);
      currentCam.lerp(targetCam, 0.04);
      camera.position.copy(currentCam);
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      container.removeEventListener('mousemove', onMove);
      container.removeEventListener('mouseleave', onLeave);
      renderer.dispose();
      renderer.domElement.remove();
    };
    } catch {
      setUseFallback(true);
    }
  }, []);

  if (useFallback) return <HeroFallback />;

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[440px] aspect-square mx-auto [&_canvas]:block [&_canvas]:w-full [&_canvas]:h-full"
      aria-hidden
    />
  );
}
