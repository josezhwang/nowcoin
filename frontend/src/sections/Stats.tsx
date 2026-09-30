import { Counter } from '@/components/ui/Counter'
import { Reveal } from '@/components/ui/Reveal'
import type { Stat } from '@/api/types'

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
