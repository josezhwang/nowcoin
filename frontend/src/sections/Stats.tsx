import { Counter } from '../components/Counter'
import { Reveal } from '../components/Reveal'
import type { Stat } from '../lib/types'

export function Stats({ stats }: { stats: Stat[] }) {
  return (
    <section className="stats container">
      {stats.map((s, i) => (
        <Reveal key={s.label} delay={i * 0.08} className="stat">
          <div className="stat-value">
            <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals} />
          </div>
          <div className="stat-label">{s.label}</div>
        </Reveal>
      ))}
    </section>
  )
}
