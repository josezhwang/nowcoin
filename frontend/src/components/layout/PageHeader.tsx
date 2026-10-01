import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { BrandMark } from '@/components/ui/BrandMark'
import { HeroBackdrop } from '@/components/ui/HeroBackdrop'
import { CharReveal } from '@/components/ui/TextReveal'

interface Props {
  eyebrow: string
  title: ReactNode
  lead?: ReactNode
  children?: ReactNode
}

const EASE = [0.22, 1, 0.36, 1] as const

/** Centred header for inner pages, on a compact version of the hero backdrop. */
export function PageHeader({ eyebrow, title, lead, children }: Props) {
  return (
    <section className="page-header">
      <HeroBackdrop compact />
      <div className="container page-header-inner">
        <motion.span
          className="chip-label"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <BrandMark /> {eyebrow}
        </motion.span>
        <h1 className="tone">
          <CharReveal delay={0.1}>{title}</CharReveal>
        </h1>
        {lead && (
          <motion.p
            className="lead"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
          >
            {lead}
          </motion.p>
        )}
        {children && (
          <motion.div
            className="page-header-extra"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: EASE }}
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  )
}
