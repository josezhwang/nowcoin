// Keyword answers for the help chat when Claude is not configured or not reachable.
// Each entry is scored by the rarer words it shares with the question (TF-IDF style),
// so "card" alone finds the card, while "crypto" (everywhere) barely counts.
import {
  CARD_TIERS,
  COMPANY,
  FAQS,
  PRODUCTS,
  STATS,
  STEPS,
  TEAM,
} from '../content/content.data.js';

interface Entry {
  answer: string;
  terms: Set<string>;
}

const STOPWORDS = new Set(
  'a an and are can could do does for from get have how i in is it me my of on or our please tell the to what when where which who why with you your about any there this that be will would'.split(
    ' ',
  ),
);

/** Lower-case words without stopwords, with a light plural/verb stem. */
export function terms(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9€$%]+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w))
    .map((w) => (w.length > 4 ? w.replace(/(es|s)$/, '') : w));
}

const entry = (keywords: string, answer: string): Entry => ({
  answer,
  terms: new Set(terms(`${keywords} ${answer}`)),
});

const leaders = TEAM.filter((m) => m.department === 'Leadership');

const ENTRIES: Entry[] = [
  ...FAQS.map((f) => entry(f.question, f.answer)),
  ...PRODUCTS.map((p) =>
    entry(
      `${p.name} ${p.slug} ${p.category} ${p.tagline} ${p.features.map((f) => f.title).join(' ')}`,
      `${p.name}: ${p.description} ${p.metrics.map((m) => `${m.label}: ${m.value}`).join(', ')}. More at /products/${p.slug}.`,
    ),
  ),
  entry(
    'card tiers tier plan plans cashback cash back stake metal fee price cost compare',
    `The Nowcoin Card comes in four tiers, all with no monthly fee:\n${CARD_TIERS.map(
      (t) =>
        `- ${t.name}: ${t.cashback} back, ${t.stake === 'No stake' ? 'no stake' : `${t.stake} stake`}`,
    ).join('\n')}\nDetails at /products/card.`,
  ),
  entry(
    'team founder founders ceo cto leadership leader management people run who staff',
    `Nowcoin Digital is led by ${leaders.map((m) => `${m.name} (${m.role})`).join(', ')}. Meet everyone at /team.`,
  ),
  entry(
    'start started begin sign signup register open create account join onboarding',
    `Getting started takes three steps:\n${STEPS.map((s, i) => `${i + 1}. ${s.title}: ${s.body}`).join('\n')}`,
  ),
  entry(
    'company about mission customers big size founded history story year',
    `Nowcoin Digital builds the wallet, card, exchange and payment infrastructure for the on-chain economy. Founded in ${COMPANY.timeline[0].year}, our mission is to ${COMPANY.mission.charAt(0).toLowerCase()}${COMPANY.mission.slice(1)} Today: ${STATS.map(
      (s) =>
        `${s.prefix ?? ''}${s.value}${s.suffix ?? ''} ${s.label.toLowerCase()}`,
    ).join(', ')}. More at /company.`,
  ),
  entry(
    'values principles believe culture transparent transparency',
    `Our values:\n${COMPANY.values.map((v) => `- ${v}`).join('\n')}`,
  ),
  entry(
    'contact support help need human agent email phone talk sales press partnership problem issue payment declined failed lost stolen blocked refund',
    'You can reach our team through the contact form at /contact. Pick sales, partnership, support or press and we will get back to you.',
  ),
  entry(
    'price prices bitcoin btc ethereum eth predict prediction forecast tomorrow invest investment advice worth rise fall',
    "I can't give price predictions or investment advice. You can see live market prices on our homepage.",
  ),
  entry(
    'job jobs career careers hiring work vacancy position role opening',
    `Open roles:\n${COMPANY.openings.map((o) => `- ${o}`).join('\n')}\nSee /company#careers.`,
  ),
];

const DF = new Map<string, number>();
for (const e of ENTRIES)
  for (const t of e.terms) DF.set(t, (DF.get(t) ?? 0) + 1);
const idf = (t: string) => Math.log(1 + ENTRIES.length / (DF.get(t) ?? 1));

const GREETINGS = new Set(terms('hi hello hey hallo hola yo morning evening'));
const THANKS = new Set(terms('thanks thank cheers great ok okay bye goodbye'));

export const GREETING_REPLY =
  'Hi! I can answer questions about Nowcoin Digital: our Wallet, Card, Exchange, Pay, Vault and Connect API, card tiers, security and the team. What would you like to know?';

export const THANKS_REPLY =
  "You're welcome! Ask me anything else about Nowcoin Digital any time.";

export const UNKNOWN_REPLY =
  "Sorry, I don't have an answer for that. Try asking about our products, card tiers, security or getting started, or reach the team at /contact.";

/** Best keyword answer for a visitor question. */
export function fallbackAnswer(question: string): string {
  const words = terms(question);
  if (words.every((w) => GREETINGS.has(w))) return GREETING_REPLY;
  if (words.every((w) => THANKS.has(w) || GREETINGS.has(w)))
    return THANKS_REPLY;

  let best: Entry | undefined;
  let bestScore = 0;
  for (const e of ENTRIES) {
    let score = 0;
    for (const w of new Set(words)) if (e.terms.has(w)) score += idf(w);
    if (score > bestScore) {
      best = e;
      bestScore = score;
    }
  }
  return best && bestScore >= 1.5 ? best.answer : UNKNOWN_REPLY;
}
