import { BrandMark } from '@/components/ui/BrandMark'
import { CARD_H, CARD_W, CHIP, COIL, LEADS, coilPath } from './cardGeometry'

// The printed / machined surfaces of each card layer. Plain markup + CSS
// (see card.css), drawn once; everything that moves is a transform.

const chipBox = {
  left: CHIP.x,
  top: CHIP.y,
  width: CHIP.w,
  height: CHIP.h,
}

function Contactless({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      {[3, 5.2, 7.4, 9.6].map((h, i) => (
        <path key={h} d={`M${5 + i * 4} ${12 - h} q${h * 0.62} ${h} 0 ${h * 2}`} />
      ))}
    </svg>
  )
}

/** The gold EMV contact plate: eight pads around a centre island. */
export function ChipPlate() {
  return (
    <div className="cx-chip" style={chipBox}>
      <svg viewBox="0 0 54 42" aria-hidden>
        <defs>
          <linearGradient id="cx-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff1c4" />
            <stop offset="0.38" stopColor="#d9b25e" />
            <stop offset="0.62" stopColor="#f6deA0" />
            <stop offset="1" stopColor="#a87c32" />
          </linearGradient>
          <linearGradient id="cx-gold-shine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.55" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="0.5" y="0.5" width="53" height="41" rx="7" fill="url(#cx-gold)" stroke="#8a6224" strokeOpacity="0.5" />
        <g fill="none" stroke="#7a5418" strokeOpacity="0.65" strokeWidth="1.1" strokeLinecap="round">
          <path d="M1 14 H17 M1 28 H17 M37 14 H53 M37 28 H53 M27 1 V10 M27 32 V41" />
          <rect x="17" y="10" width="20" height="22" rx="4" />
          <path d="M17 21 H8 M37 21 H46" />
        </g>
        <rect x="2" y="2" width="50" height="14" rx="6" fill="url(#cx-gold-shine)" opacity="0.6" />
      </svg>
    </div>
  )
}

export function FaceSurface({ name }: { name: string }) {
  return (
    <div className="cx-surface cx-face">
      <span className="cx-brush" />
      <span className="cx-holo">
        <i />
      </span>
      <svg className="cx-watermark" viewBox="0 0 24 24" aria-hidden>
        <path d="M6.5 18V6l11 12V6" />
      </svg>
      <span className="cx-grain" />

      <span className="cx-logo">
        <BrandMark size={20} /> Nowcoin
      </span>
      <span className="cx-tier">{name}</span>
      <span className="cx-pocket" style={chipBox} />
      <Contactless className="cx-contactless" />
      <span className="cx-number">4291&ensp;••••&ensp;••••&ensp;2049</span>
      <span className="cx-holder">Satoshi Nakamoto</span>
      <span className="cx-valid">
        <small>
          VALID
          <br />
          THRU
        </small>
        09/31
      </span>
      <span className="cx-network">
        <b>DEBIT</b>
      </span>
      <span className="cx-glare" />
    </div>
  )
}

const COIL_D = coilPath(COIL.turns, COIL.inset, COIL.gap, COIL.r)

export function AntennaSurface() {
  const { crossing } = LEADS
  return (
    <div className="cx-surface cx-antenna">
      <svg viewBox={`0 0 ${CARD_W} ${CARD_H}`} aria-hidden>
        <defs>
          <linearGradient id="cx-copper" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffc89a" />
            <stop offset="0.5" stopColor="#d9783f" />
            <stop offset="1" stopColor="#ffb27a" />
          </linearGradient>
        </defs>
        <path d={COIL_D} className="cx-coil" />
        <path d={LEADS.inner} className="cx-coil" />
        <path d={LEADS.bridge} className="cx-coil is-bridge" />
        <rect
          {...{ x: crossing.x, y: crossing.y, width: crossing.w, height: crossing.h }}
          rx="2"
          className="cx-insulator"
        />
        <rect x={CHIP.x - 3} y={CHIP.y - 3} width={CHIP.w + 6} height={CHIP.h + 6} rx="8" className="cx-landing" />
        <rect x={CHIP.x - 6} y={CHIP.y + 7} width="8" height="10" rx="1.5" className="cx-pad" />
        <rect x={CHIP.x + CHIP.w - 2} y={CHIP.y + CHIP.h - 17} width="8" height="10" rx="1.5" className="cx-pad" />
        {/* Current pulses travelling the coil (only animated in the exploded view). */}
        <path d={COIL_D} pathLength={1} className="cx-current" />
        <path d={COIL_D} pathLength={1} className="cx-current is-late" />
      </svg>
      <span className="cx-film-mark">NFC · 13.56 MHz</span>
    </div>
  )
}

export function CoreSurface({ metal }: { metal: boolean }) {
  return (
    <div className={`cx-surface cx-core${metal ? ' is-metal' : ''}`}>
      <span className="cx-brush" />
      <span className="cx-core-sheen" />
      <span className="cx-pocket is-milled" style={chipBox} />
      {metal && <span className="cx-slit" style={{ top: CHIP.y + CHIP.h / 2 - 1, width: CHIP.x }} />}
      <span className="cx-etch">{metal ? 'NOWCOIN · 316L STAINLESS · 18 G' : 'NOWCOIN · rPC CORE · 0.4 MM'}</span>
      <span className="cx-serial">SN 0192-4471-08</span>
    </div>
  )
}

export function BackSurface({ className = '' }: { className?: string }) {
  return (
    <div className={`cx-surface cx-back ${className}`}>
      <span className="cx-grain" />
      <span className="cx-stripe" />
      <span className="cx-sign">
        <span className="cx-sign-strip">AUTHORISED SIGNATURE</span>
        <span className="cx-cvv">731</span>
      </span>
      <span className="cx-hologram">
        <BrandMark size={22} />
      </span>
      <span className="cx-fine">
        Issued by Nowcoin Digital. Use of this card is subject to the cardholder agreement.
        <br />
        24/7 support · nowcoin.digital/help
      </span>
      <span className="cx-back-logo">
        <BrandMark size={14} /> NOWCOIN
      </span>
    </div>
  )
}
