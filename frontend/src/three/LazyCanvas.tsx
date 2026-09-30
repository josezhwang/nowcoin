import { Canvas, type CanvasProps } from '@react-three/fiber'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ErrorBoundary } from '@/components/layout/ErrorBoundary'
import { GlowFallback } from '@/components/ui/CardFallback'
import { isSoftwareRenderer, supportsWebGL } from '@/lib/webgl'

interface Props extends CanvasProps {
  className?: string
  /** Shown when WebGL is unavailable or the scene throws. */
  fallback?: ReactNode
}

/**
 * Mounts the WebGL canvas only once it nears the viewport, pauses its render
 * loop off-screen, and degrades to `fallback` instead of crashing the page.
 */
export function LazyCanvas({ className, fallback = <GlowFallback />, ...props }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const webgl = supportsWebGL()
  const soft = webgl && isSoftwareRenderer()

  useEffect(() => {
    const el = ref.current
    if (!el || !webgl) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        setVisible(entry.isIntersecting)
        if (entry.isIntersecting) setMounted(true)
      },
      { rootMargin: '200px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [webgl])

  return (
    <div ref={ref} className={className}>
      {!webgl
        ? fallback
        : mounted && (
            <ErrorBoundary name="LazyCanvas" fallback={fallback}>
              <Canvas
                dpr={soft ? 1 : [1, 1.75]}
                gl={{ antialias: !soft, alpha: true, powerPreference: 'high-performance' }}
                frameloop={visible ? 'always' : 'never'}
                {...props}
              />
            </ErrorBoundary>
          )}
    </div>
  )
}
