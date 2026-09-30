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

let software: boolean | null = null

/**
 * True when WebGL runs on a CPU rasteriser (SwiftShader, llvmpipe — common on
 * VPS desktops, VMs and GPU-less machines). Scenes then render at 1× without
 * antialiasing to keep the page responsive.
 */
export function isSoftwareRenderer() {
  if (software !== null) return software
  software = false
  try {
    const gl = document.createElement('canvas').getContext('webgl')
    const info = gl?.getExtension('WEBGL_debug_renderer_info')
    const renderer = info && gl ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : ''
    software = /swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer)
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
  } catch {
    /* keep default */
  }
  return software
}
