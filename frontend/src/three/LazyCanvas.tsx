import { Canvas, type CanvasProps } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'

/**
 * Mounts the WebGL canvas only once it nears the viewport, and pauses its
 * render loop whenever it scrolls out of view.
 */
export function LazyCanvas({ className, cursor, ...props }: CanvasProps & { className?: string; cursor?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting)
        if (entry.isIntersecting) setMounted(true)
      },
      { rootMargin: '200px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={className} data-cursor={cursor}>
      {mounted && (
        <Canvas
          dpr={[1, 1.75]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          frameloop={visible ? 'always' : 'never'}
          {...props}
        />
      )}
    </div>
  )
}
