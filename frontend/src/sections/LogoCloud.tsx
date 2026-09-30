import { ImageSlot } from '@/components/ui/ImageSlot'
import { images } from '@/config/images'

export function LogoCloud() {
  return (
    <section className="logo-cloud" aria-label="Partners">
      <div className="container">
        <p className="logo-cloud-label">Trusted by fintechs, exchanges and merchants worldwide</p>
        <ul className="logo-grid">
          {images.partners.map((logo) => (
            <li key={logo.src}>
              <ImageSlot image={logo} fit="contain" radius="10px" compact />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
