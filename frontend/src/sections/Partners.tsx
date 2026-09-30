import { Marquee } from '../components/Marquee'

// Placeholder partner wordmarks — swap for real logos.
const PARTNERS = ['Lumen Labs', 'Kinetik', 'Stackpay', 'Orbital', 'Meridian', 'Halcyon', 'Parallax', 'Northwind']

export function Partners() {
  return (
    <div className="partners">
      <p className="partners-label">Powering payments for teams at</p>
      <Marquee duration={35}>
        {PARTNERS.map((p) => (
          <span key={p} className="partner">
            {p}
          </span>
        ))}
      </Marquee>
    </div>
  )
}
