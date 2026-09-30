import { useState } from 'react'
import { MagneticButton } from '../components/MagneticButton'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'

type Token = [cls: string, text: string]

// Pre-tokenised snippets keep the bundle free of a syntax highlighter.
const SNIPPETS: Record<string, Token[]> = {
  TypeScript: [
    ['k', 'import'], ['', ' { Nowcoin } '], ['k', 'from'], ['s', " '@nowcoin/sdk'"], ['', '\n\n'],
    ['k', 'const'], ['', ' nowcoin = '], ['k', 'new'], ['f', ' Nowcoin'], ['', '({ apiKey: process.env.'], ['v', 'NOWCOIN_KEY'], ['', ' })\n\n'],
    ['c', '// Create a non-custodial wallet on sign-up\n'],
    ['k', 'const'], ['', ' wallet = '], ['k', 'await'], ['', ' nowcoin.wallets.'], ['f', 'create'], ['', '({ userId: '], ['s', "'usr_8f2k'"], ['', ' })\n\n'],
    ['c', '// Issue a virtual card funded from that wallet\n'],
    ['k', 'const'], ['', ' card = '], ['k', 'await'], ['', ' nowcoin.cards.'], ['f', 'issue'], ['', '({\n  walletId: wallet.id,\n  currency: '], ['s', "'EUR'"], ['', ',\n  type: '], ['s', "'virtual'"], ['', ',\n})'],
  ],
  Python: [
    ['k', 'from'], ['', ' nowcoin '], ['k', 'import'], ['', ' Nowcoin\n\n'],
    ['', 'nowcoin = '], ['f', 'Nowcoin'], ['', '(api_key=os.environ['], ['s', '"NOWCOIN_KEY"'], ['', '])\n\n'],
    ['c', '# Create a non-custodial wallet on sign-up\n'],
    ['', 'wallet = nowcoin.wallets.'], ['f', 'create'], ['', '(user_id='], ['s', '"usr_8f2k"'], ['', ')\n\n'],
    ['c', '# Issue a virtual card funded from that wallet\n'],
    ['', 'card = nowcoin.cards.'], ['f', 'issue'], ['', '(\n    wallet_id=wallet.id,\n    currency='], ['s', '"EUR"'], ['', ',\n    type='], ['s', '"virtual"'], ['', ',\n)'],
  ],
  cURL: [
    ['f', 'curl'], ['', ' https://api.nowcoin.digital/v1/cards \\\n  -H '], ['s', '"Authorization: Bearer $NOWCOIN_KEY"'], ['', ' \\\n  -d '],
    ['s', "'{\n    \"walletId\": \"wal_3k9x\",\n    \"currency\": \"EUR\",\n    \"type\": \"virtual\"\n  }'"],
  ],
}

const SDKS = ['TypeScript', 'Python', 'Go', 'Java', 'Swift', 'Kotlin', 'REST', 'WebSocket', 'Webhooks']

export function Developers() {
  const [lang, setLang] = useState<keyof typeof SNIPPETS>('TypeScript')

  return (
    <section className="section developers" id="developers">
      <div className="container dev-grid">
        <div>
          <SectionHeading
            eyebrow="Nowcoin Connect API"
            title={
              <>
                Ship crypto features <span className="gradient-text">in an afternoon.</span>
              </>
            }
            body="The same infrastructure that powers our apps, exposed as clean, versioned APIs. Embed wallets, issue cards and move stablecoins with a few lines of code."
          />
          <div className="sdk-chips">
            {SDKS.map((s) => (
              <span key={s} className="chip">
                {s}
              </span>
            ))}
          </div>
          <div className="dev-actions">
            <MagneticButton to="/products/api">
              Read the docs <span className="arrow">→</span>
            </MagneticButton>
            <MagneticButton to="/contact" variant="ghost">
              Get sandbox keys
            </MagneticButton>
          </div>
        </div>

        <Reveal className="code-window glass">
          <div className="code-bar">
            <span className="dots" aria-hidden>
              <i />
              <i />
              <i />
            </span>
            <div className="code-tabs" role="tablist">
              {Object.keys(SNIPPETS).map((l) => (
                <button key={l} role="tab" aria-selected={l === lang} className={l === lang ? 'active' : ''} onClick={() => setLang(l)}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <pre className="code-body">
            <code>
              {SNIPPETS[lang].map(([cls, text], i) => (
                <span key={i} className={cls ? `tk-${cls}` : undefined}>
                  {text}
                </span>
              ))}
            </code>
          </pre>
          <div className="code-foot">
            <span className="live-dot" /> 201 Created · 84 ms
          </div>
        </Reveal>
      </div>
    </section>
  )
}
