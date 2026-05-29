/** Cached WebGL capability — avoids repeated context creation in Chrome. */
export type WebGLMode = 'three' | 'cobe' | 'none';

let cachedMode: WebGLMode | null = null;

const RENDERER_ATTRS: WebGLContextAttributes = {
  alpha: true,
  antialias: false,
  depth: true,
  stencil: false,
  failIfMajorPerformanceCaveat: false,
  powerPreference: 'default',
  preserveDrawingBuffer: false,
};

function createContext(canvas: HTMLCanvasElement): WebGLRenderingContext | null {
  return (
    canvas.getContext('webgl2', RENDERER_ATTRS) ||
    canvas.getContext('webgl', RENDERER_ATTRS) ||
    canvas.getContext('experimental-webgl', RENDERER_ATTRS)
  ) as WebGLRenderingContext | null;
}

/** Probe without leaving a live context (releases immediately). */
export function probeWebGL(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl = createContext(canvas);
    if (!gl) return false;
    const ext = gl.getExtension('WEBGL_lose_context');
    ext?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/**
 * Pick renderer: Three.js globe first, then Cobe, then static SVG.
 * Result is cached for the page lifetime.
 */
export function getWebGLMode(): WebGLMode {
  if (cachedMode !== null) return cachedMode;
  if (!probeWebGL()) {
    cachedMode = 'none';
    return cachedMode;
  }
  // Both use WebGL; prefer Three when available. Cobe is lighter if Three fails at runtime.
  cachedMode = 'three';
  return cachedMode;
}

/** Call when Three.js fails at runtime so we can retry with Cobe. */
export function markThreeWebGLFailed(): void {
  if (cachedMode === 'three') cachedMode = probeWebGL() ? 'cobe' : 'none';
}

export function resetWebGLCache(): void {
  cachedMode = null;
}
