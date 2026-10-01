import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BrandMark } from '@/components/ui/BrandMark'

/** Floating "Need help?" pill (PeachWeb detail) linking to support. */
export function HelpPill() {
  return (
    <motion.div
      className="help-pill-wrap"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 2, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to="/contact" className="help-pill">
        <span className="help-avatar">
          <BrandMark size={14} />
        </span>
        Need help?
        <MessageCircle size={15} aria-hidden />
      </Link>
    </motion.div>
  )
}
