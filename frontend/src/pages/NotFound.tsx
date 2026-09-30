import { MagneticButton } from '../components/MagneticButton'

export function NotFound() {
  return (
    <section className="not-found container">
      <span className="eyebrow">Error 404</span>
      <h1 className="gradient-text">Lost in the mempool.</h1>
      <p>The page you are looking for doesn't exist or has moved.</p>
      <MagneticButton to="/">Back to home</MagneticButton>
    </section>
  )
}
