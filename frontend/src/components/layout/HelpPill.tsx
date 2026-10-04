import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { BrandMark } from '@/components/ui/BrandMark'
import { ChatPanel } from './ChatPanel'

/** Floating "Need help?" pill (PeachWeb detail) that opens the help chat. */
export function HelpPill() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <motion.div
      className="help-pill-wrap"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 2, ease: [0.22, 1, 0.36, 1] }}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            className="chat-panel-wrap"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <ChatPanel onClose={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
      <button type="button" className="help-pill" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span className="help-avatar">
          <BrandMark size={14} />
        </span>
        {open ? 'Close chat' : 'Need help?'}
        {open ? <X size={15} aria-hidden /> : <MessageCircle size={15} aria-hidden />}
      </button>
    </motion.div>
  )
}
