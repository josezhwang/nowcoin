// What the help chat knows about the company. Built from the same content the
// website serves, so the bot never drifts from what visitors see on the pages.
import {
  CARD_TIERS,
  COMPANY,
  FAQS,
  PRODUCTS,
  STATS,
  STEPS,
  TEAM,
} from '../content/content.data.js';

const statValue = (s: (typeof STATS)[number]) =>
  `${s.prefix ?? ''}${s.value.toFixed(s.decimals ?? 0)}${s.suffix ?? ''}`;

export function buildKnowledge(): string {
  const products = PRODUCTS.map((p) =>
    [
      `### ${p.name} (${p.category}) — page: /products/${p.slug}`,
      `${p.tagline} ${p.description}`,
      ...p.features.map((f) => `- ${f.title}: ${f.body}`),
      ...p.highlights.map((h) => `- ${h}`),
      `Key numbers: ${p.metrics.map((m) => `${m.label} ${m.value}`).join(', ')}`,
    ].join('\n'),
  );

  const tiers = CARD_TIERS.map(
    (t) =>
      `- ${t.name}: ${t.cashback} back, stake ${t.stake}, monthly fee ${t.monthlyFee}, ${t.material} card. Perks: ${t.perks.join('; ')}.`,
  );

  return [
    '## Company',
    'Nowcoin Digital builds the wallet, card, exchange and payment infrastructure for the on-chain economy.',
    `Mission: ${COMPANY.mission}`,
    `Key figures: ${STATS.map((s) => `${s.label}: ${statValue(s)}`).join('; ')}.`,
    'Values:',
    COMPANY.values.map((v) => `- ${v}`).join('\n'),
    'History:',
    COMPANY.timeline.map((t) => `- ${t.year}: ${t.text}`).join('\n'),
    'Open roles (listed at /company#careers):',
    COMPANY.openings.map((o) => `- ${o}`).join('\n'),
    '',
    '## Website pages',
    '- /products — all products',
    '- /products/<slug> — one product (slugs: ' +
      PRODUCTS.map((p) => p.slug).join(', ') +
      ')',
    '- /team — the team',
    '- /company — about the company and careers',
    '- /contact — contact form for sales, partnerships, support and press',
    '',
    '## Products',
    products.join('\n\n'),
    '',
    '## Nowcoin Card tiers (all metal tiers need a stake)',
    tiers.join('\n'),
    '',
    '## Getting started',
    STEPS.map((s, i) => `${i + 1}. ${s.title}: ${s.body}`).join('\n'),
    '',
    '## Frequently asked questions',
    FAQS.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n'),
    '',
    '## Team',
    TEAM.map((m) => `- ${m.name}, ${m.role} (${m.department}): ${m.bio}`).join(
      '\n',
    ),
  ].join('\n');
}

export const SYSTEM_PROMPT = `You are the help assistant on the Nowcoin Digital website. Visitors open you from the "Need help?" button to ask about the company and its products.

Answer only from the company information below. If it does not cover the question, say you don't have that information and suggest the contact form at /contact. Never invent prices, fees, dates, licences or features.

You cannot see or change anyone's account. For account, payment or card problems, point the visitor to /contact. Never ask for passwords, seed phrases, card numbers or other secrets. Do not give investment, tax or legal advice or predict prices.

Keep answers short: one to four sentences, or a short list with "- " bullets when comparing several things. Write plain text without Markdown headings, bold or tables. When a page would help, mention its path, such as /products/card. Reply in the language the visitor writes in.

<company_information>
${buildKnowledge()}
</company_information>`;
