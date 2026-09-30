import { useSyncExternalStore } from 'react'

// Tracks whether the preloader has finished so hero animations wait for it.
let done = false
const listeners = new Set<() => void>()

export function finishIntro() {
  if (done) return
  done = true
  listeners.forEach((l) => l())
}

export function useIntroDone() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => done,
  )
}
