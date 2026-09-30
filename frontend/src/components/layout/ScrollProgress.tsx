import { motion, useScroll } from 'framer-motion'

/** Thin gradient bar along the top of the viewport showing reading progress. */
export function ScrollProgress() {
  // Lenis already smooths the scroll position, so no extra spring is needed.
  const { scrollYProgress } = useScroll()
  return <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} aria-hidden />
}
