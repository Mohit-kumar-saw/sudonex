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

type OutgoingMail = {
  group: THREE.Group;
  phase: number;
  active: boolean;
  t: number;
  curve: THREE.CubicBezierCurve3;
};

function line(points: THREE.Vector3[], color: number, opacity: number) {
  return new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({ color, transparent: true, opacity }),
  );
}

function createEnvelope(w: number, h: number): THREE.Group {
  const g = new THREE.Group();
  const hw = w / 2;
  const hh = h / 2;

  g.add(
    new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ color: HERO_DEEP, transparent: true, opacity: 0.85, side: THREE.DoubleSide }),
    ),
  );

  g.add(
    line(
      [
        new THREE.Vector3(-hw, -hh, 0.01),
        new THREE.Vector3(hw, -hh, 0.01),
        new THREE.Vector3(hw, hh, 0.01),
        new THREE.Vector3(-hw, hh, 0.01),
        new THREE.Vector3(-hw, -hh, 0.01),
      ],
      HERO_BRAND,
      0.9,
    ),
  );
  g.add(
    line(
      [new THREE.Vector3(-hw, hh, 0.02), new THREE.Vector3(0, 0, 0.02), new THREE.Vector3(hw, hh, 0.02)],
      HERO_GLOW,
      0.85,
    ),
  );
  g.add(
    line(
      [new THREE.Vector3(-hw, -hh, 0.02), new THREE.Vector3(0, 0, 0.02)],
      HERO_DIM,
      0.45,
    ),
  );
  g.add(
    line(
      [new THREE.Vector3(hw, -hh, 0.02), new THREE.Vector3(0, 0, 0.02)],
      HERO_DIM,
      0.45,
    ),
  );

  const stamp = new THREE.Mesh(
    new THREE.PlaneGeometry(w * 0.22, h * 0.18),
    new THREE.MeshBasicMaterial({ color: HERO_BRAND, transparent: true, opacity: 0.55, side: THREE.DoubleSide }),
  );
  stamp.position.set(hw * 0.55, hh * 0.45, 0.03);
  g.add(stamp);

  return g;
}

function buildPostbox(): THREE.Group {
  const box = new THREE.Group();

  const bodyGeo = new THREE.CylinderGeometry(0.82, 0.88, 1.75, 28);
  box.add(
    new THREE.Mesh(
      bodyGeo,
      new THREE.MeshBasicMaterial({ color: HERO_DEEP, transparent: true, opacity: 0.55 }),
    ),
  );
  box.add(
    new THREE.LineSegments(
      new THREE.EdgesGeometry(bodyGeo, 12),
      new THREE.LineBasicMaterial({ color: HERO_BRAND, transparent: true, opacity: 0.7 }),
    ),
  );

  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(0.82, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: HERO_DEEP, transparent: true, opacity: 0.6 }),
  );
  dome.position.y = 0.875;
  box.add(dome);
  box.add(
    new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.SphereGeometry(0.82, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), 8),
      new THREE.LineBasicMaterial({ color: HERO_GLOW, transparent: true, opacity: 0.5 }),
    ),
  );

  const slot = new THREE.Mesh(
    new THREE.PlaneGeometry(0.55, 0.1),
    new THREE.MeshBasicMaterial({ color: HERO_BRAND, transparent: true, opacity: 0.85 }),
  );
  slot.position.set(0, 0.35, 0.89);
  box.add(slot);

  const slotGlow = new THREE.Mesh(
    new THREE.PlaneGeometry(0.62, 0.16),
    new THREE.MeshBasicMaterial({ color: HERO_GLOW, transparent: true, opacity: 0.15 }),
  );
  slotGlow.position.set(0, 0.35, 0.86);
  box.add(slotGlow);

  const flagPivot = new THREE.Group();
  flagPivot.position.set(0.95, 0.1, 0);
  box.add(flagPivot);

  const flagPole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.025, 0.55, 8),
    new THREE.MeshBasicMaterial({ color: HERO_DIM }),
  );
  flagPole.position.y = 0.28;
  flagPivot.add(flagPole);

  const flag = new THREE.Mesh(
    new THREE.PlaneGeometry(0.35, 0.22),
    new THREE.MeshBasicMaterial({ color: HERO_BRAND, transparent: true, opacity: 0.85, side: THREE.DoubleSide }),
  );
  flag.position.set(0.2, 0.48, 0);
  flagPivot.add(flag);

  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.95, 1.05, 0.12, 28),
    new THREE.MeshBasicMaterial({ color: HERO_DIM, transparent: true, opacity: 0.5 }),
  );
  base.position.y = -0.93;
  box.add(base);

  return box;
}

export default function HeroContactScene() {
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

      const postbox = buildPostbox();
      root.add(postbox);

      const flagPivot = postbox.children.find(
        c => c instanceof THREE.Group && c.position.x > 0.5,
      ) as THREE.Group;

      const atRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.32, 0.04, 8, 32),
        new THREE.MeshBasicMaterial({ color: HERO_BRAND, transparent: true, opacity: 0.65 }),
      );
      atRing.position.set(0, 1.65, 0.2);
      root.add(atRing);

      const atTail = line(
        [new THREE.Vector3(0.32, 1.65, 0.2), new THREE.Vector3(0.32, 1.35, 0.2)],
        HERO_GLOW,
        0.7,
      );
      root.add(atTail);

      const outgoing: OutgoingMail[] = [];
      for (let i = 0; i < 3; i++) {
        const env = createEnvelope(0.55, 0.38);
        env.visible = false;
        root.add(env);

        const start = new THREE.Vector3(0, 0.35, 1.05);
        const end = new THREE.Vector3(-1.4 + i * 1.4, 2.1, 0.3);
        const c1 = new THREE.Vector3(0.2, 1.2, 1.2);
        const c2 = new THREE.Vector3(-0.3 + i * 0.6, 1.8, 0.6);
        outgoing.push({
          group: env,
          phase: i * 2.1,
          active: false,
          t: 0,
          curve: new THREE.CubicBezierCurve3(start, c1, c2, end),
        });
      }

      const incoming = createEnvelope(0.42, 0.3);
      incoming.visible = false;
      root.add(incoming);

      const trails: THREE.Line[] = [];
      outgoing.forEach(() => {
        const trail = new THREE.Line(
          new THREE.BufferGeometry(),
          new THREE.LineBasicMaterial({ color: HERO_GLOW, transparent: true, opacity: 0.35 }),
        );
        root.add(trail);
        trails.push(trail);
      });

      const ripples: THREE.Mesh[] = [];
      for (let i = 0; i < 3; i++) {
        const r = new THREE.Mesh(
          new THREE.RingGeometry(0.9, 0.93, 48),
          new THREE.MeshBasicMaterial({
            color: HERO_BRAND,
            transparent: true,
            opacity: 0,
            side: THREE.DoubleSide,
          }),
        );
        r.rotation.x = -Math.PI / 2;
        r.position.y = -0.88;
        root.add(r);
        ripples.push(r);
      }

      scene.add(new THREE.AmbientLight(HERO_DIM, 0.7));
      const light = new THREE.PointLight(HERO_BRAND, 1.6, 12);
      light.position.set(1, 2, 4);
      scene.add(light);

      const ro = bindHeroResize(container, camera, renderer);
      const unbindMouse = bindHeroMouse(container, mouse);
      const clock = new THREE.Clock();

      const animate = () => {
        const t = clock.getElapsedTime();

        root.rotation.y = Math.sin(t * 0.22) * 0.18;
        root.position.y = Math.sin(t * 0.7) * 0.03;

        if (flagPivot) {
          const flagUp = Math.sin(t * 0.7) > 0.3;
          flagPivot.rotation.z = THREE.MathUtils.lerp(flagPivot.rotation.z, flagUp ? -1.2 : 0.15, 0.06);
        }

        atRing.rotation.z = t * 0.35;
        atRing.position.y = 1.65 + Math.sin(t * 0.9) * 0.04;

        const incomingCycle = (t * 0.35) % 1;
        if (incomingCycle < 0.45) {
          incoming.visible = true;
          const p = incomingCycle / 0.45;
          incoming.position.set(0, 2.2 - p * 1.85, 0.95);
          incoming.rotation.x = -0.2 + p * 0.5;
          incoming.rotation.z = Math.sin(p * Math.PI) * 0.15;
          incoming.scale.setScalar(0.85 + p * 0.15);
        } else {
          incoming.visible = false;
        }

        outgoing.forEach((mail, i) => {
          const trigger = Math.sin(t * 0.85 + mail.phase) > 0.88;
          if (trigger && !mail.active) {
            mail.active = true;
            mail.t = 0;
            mail.group.visible = true;
          }

          if (mail.active) {
            mail.t += 0.014;
            const pt = mail.curve.getPoint(Math.min(mail.t, 1));
            const tangent = mail.curve.getTangent(Math.min(mail.t, 1));
            mail.group.position.copy(pt);
            mail.group.lookAt(pt.clone().add(tangent));
            mail.group.rotateX(-Math.PI / 2);

            const trailPts = mail.curve.getPoints(Math.max(2, Math.floor(mail.t * 24)));
            trails[i].geometry.dispose();
            trails[i].geometry = new THREE.BufferGeometry().setFromPoints(trailPts);

            if (mail.t >= 1) {
              mail.active = false;
              mail.group.visible = false;
            }
          }
        });

        ripples.forEach((r, i) => {
          const phase = ((t * 0.4 + i * 0.3) % 1);
          r.scale.setScalar(1 + phase * 1.8);
          (r.material as THREE.MeshBasicMaterial).opacity = (1 - phase) * 0.25;
        });

        light.intensity = 1.2 + Math.sin(t * 1.4) * 0.35;
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

  if (useFallback) return <HeroFallback variant="contact" />;

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[440px] aspect-square mx-auto [&_canvas]:block [&_canvas]:w-full [&_canvas]:h-full"
      aria-hidden
    />
  );
}
