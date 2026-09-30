let cached: boolean | null = null

/**
 * Whether this browser can create a WebGL context. Hardware acceleration may be
 * disabled (some VMs, remote desktops, locked-down browsers) — in that case the
 * site renders CSS fallbacks instead of crashing.
 */
export function supportsWebGL() {
  if (cached !== null) return cached
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    cached = !!gl
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
  } catch {
    cached = false
  }
  return cached
}
