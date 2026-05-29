import * as THREE from 'three';

export const HERO_BRAND = 0xff6600;
export const HERO_BRAND_LIGHT = 0xff8533;

export type HeroMouse = { x: number; y: number };

export function createHeroRenderer(container: HTMLDivElement) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 50);
  camera.position.set(0, 0, 5.2);
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

  return { scene, camera, renderer };
}

export function bindHeroResize(
  container: HTMLDivElement,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
) {
  const resize = () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (width <= 0 || height <= 0) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  return ro;
}

export function bindHeroMouse(container: HTMLDivElement, mouse: HeroMouse) {
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
  return () => {
    container.removeEventListener('mousemove', onMove);
    container.removeEventListener('mouseleave', onLeave);
  };
}

export function applyCameraParallax(
  camera: THREE.PerspectiveCamera,
  mouse: HeroMouse,
  current: THREE.Vector3,
  target: THREE.Vector3,
  baseZ = 5.2,
  strength = 0.35,
) {
  target.set(mouse.x * strength, -mouse.y * (strength * 0.7), baseZ);
  current.lerp(target, 0.04);
  camera.position.copy(current);
  camera.lookAt(0, 0, 0);
}

export function starField(count: number, spread: number) {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * spread;
    pos[i * 3 + 1] = (Math.random() - 0.5) * spread;
    pos[i * 3 + 2] = (Math.random() - 0.5) * spread;
  }
  return new THREE.Points(
    new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(pos, 3)),
    new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.02,
      transparent: true,
      opacity: 0.35,
      sizeAttenuation: true,
      depthWrite: false,
    }),
  );
}
