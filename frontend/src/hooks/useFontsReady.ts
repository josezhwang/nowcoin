import { useEffect, useState } from 'react'

/** True once the display fonts used in canvas textures have loaded. */
export function useFontsReady() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let alive = true
    Promise.all([document.fonts.load('600 64px Unbounded'), document.fonts.load('500 32px "JetBrains Mono"')])
      .catch(() => undefined)
      .finally(() => alive && setReady(true))
    return () => {
      alive = false
    }
  }, [])
  return ready
}
