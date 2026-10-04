import {
  fallbackAnswer,
  GREETING_REPLY,
  THANKS_REPLY,
  UNKNOWN_REPLY,
} from './chat.fallback.js';

describe('fallbackAnswer', () => {
  it.each([
    ['How safe is my crypto?', 'cold storage'],
    ['What card tiers do you have?', 'Singularity'],
    ['Who is the CEO?', 'Elena Marsh'],
    ['When was the company founded?', '2019'],
    ['Are you hiring?', 'Compliance Lead'],
    ['Can I accept crypto in my shop?', 'Nowcoin Pay'],
    ['Tell me about the vault', '/products/custody'],
    ['My card was declined', '/contact'],
    ['What will bitcoin be worth tomorrow?', 'investment advice'],
  ])('answers "%s" from the site content', (question, expected) => {
    expect(fallbackAnswer(question)).toContain(expected);
  });

  it('greets, thanks and admits what it does not know', () => {
    expect(fallbackAnswer('Hello!')).toBe(GREETING_REPLY);
    expect(fallbackAnswer('thanks')).toBe(THANKS_REPLY);
    expect(fallbackAnswer('asdf qwerty')).toBe(UNKNOWN_REPLY);
  });
});
