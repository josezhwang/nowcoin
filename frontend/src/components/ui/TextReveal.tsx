import { useInView } from 'framer-motion'
import {
  Children,
  cloneElement,
  isValidElement,
  useRef,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react'

type WithChildren = ReactElement<{ children?: ReactNode }>

/** Plain-text version of a node tree, for screen readers (<br> becomes a space). */
function toText(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(toText).join('')
  if (isValidElement(node)) {
    const el = node as WithChildren
    return el.type === 'br' ? ' ' : toText(el.props.children)
  }
  return ''
}

type Unit = 'char' | 'word'

/**
 * Wraps every word (and, for `char`, every character) of the text inside a node
 * tree in spans carrying an incrementing `--i`, preserving <em>, <strong>, <br>…
 * Words stay unbreakable; the spaces between them remain real text so lines wrap.
 */
function split(node: ReactNode, unit: Unit, counter: { n: number }): ReactNode {
  return Children.map(node, (child) => {
    if (typeof child === 'string' || typeof child === 'number') {
      return String(child)
        .split(/(\s+)/)
        .map((part, i) => {
          if (!part) return null
          if (/^\s+$/.test(part)) return part
          if (unit === 'word') {
            return (
              <span className="w" key={i}>
                <span className="wi" style={{ '--i': counter.n++ } as CSSProperties}>
                  {part}
                </span>
              </span>
            )
          }
          return (
            <span className="w" key={i}>
              {Array.from(part).map((c, j) => (
                <span className="ch" key={j} style={{ '--i': counter.n++ } as CSSProperties}>
                  {c}
                </span>
              ))}
            </span>
          )
        })
    }
    if (isValidElement(child)) {
      const el = child as WithChildren
      if (el.props.children == null) return el
      return cloneElement(el, undefined, split(el.props.children, unit, counter))
    }
    return child
  })
}

interface Props {
  children: ReactNode
  className?: string
  /** Seconds before the first unit animates. */
  delay?: number
}

/**
 * Letter-by-letter "typing" reveal (blur → sharp) the first time the text scrolls
 * into view. Screen readers get the plain text once.
 */
export function CharReveal({ children, className = '', delay = 0 }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const counter = { n: 0 }
  const content = split(children, 'char', counter)
  return (
    <span
      ref={ref}
      className={`cr${inView ? ' is-in' : ''} ${className}`.trim()}
      style={{ '--cr-delay': `${delay}s` } as CSSProperties}
    >
      <span className="sr-only">{toText(children)}</span>
      <span aria-hidden>{content}</span>
    </span>
  )
}

/** Words rise one after another from behind a baseline mask, on mount (for heroes). */
export function WordRise({ children, className = '', delay = 0 }: Props) {
  const counter = { n: 0 }
  const content = split(children, 'word', counter)
  return (
    <span className={`wr ${className}`.trim()} style={{ '--wr-delay': `${delay}s` } as CSSProperties}>
      <span className="sr-only">{toText(children)}</span>
      <span aria-hidden>{content}</span>
    </span>
  )
}
