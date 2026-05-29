export function canUseWebGL(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const opts: WebGLContextAttributes = {
      failIfMajorPerformanceCaveat: false,
      antialias: false,
      alpha: true,
    };
    const gl = (
      canvas.getContext('webgl2', opts) ||
      canvas.getContext('webgl', opts) ||
      canvas.getContext('experimental-webgl', opts)
    ) as WebGLRenderingContext | null;
    if (gl) {
      const ext = gl.getExtension('WEBGL_lose_context');
      ext?.loseContext();
    }
    return !!gl;
  } catch {
    return false;
  }
}
