import Anthropic from '@anthropic-ai/sdk';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { fallbackAnswer } from './chat.fallback.js';
import type { ChatMessageDto } from './chat.dto.js';
import { SYSTEM_PROMPT } from './chat.knowledge.js';

export interface ChatReply {
  reply: string;
  /** `ai` when Claude answered, `faq` when the keyword fallback did. */
  source: 'ai' | 'faq';
}

const MODEL = 'claude-opus-5-5';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  // Claude answers only when a key is configured; otherwise every reply comes
  // from the keyword fallback, so the chat works out of the box.
  private readonly client = process.env.ANTHROPIC_API_KEY
    ? new Anthropic({ timeout: 30_000, maxRetries: 1 })
    : null;

  async reply(messages: ChatMessageDto[]): Promise<ChatReply> {
    const question = messages.at(-1);
    if (question?.role !== 'user')
      throw new BadRequestException('The last message must be from the user');

    if (this.client) {
      const answer = await this.askClaude(this.client, messages);
      if (answer) return { reply: answer, source: 'ai' };
    }
    return { reply: fallbackAnswer(question.content), source: 'faq' };
  }

  /** Claude's answer, or null when it is unavailable so the caller falls back. */
  private async askClaude(
    client: Anthropic,
    messages: ChatMessageDto[],
  ): Promise<string | null> {
    // The API needs the conversation to open with the visitor; the panel's
    // greeting is UI-only.
    const start = messages.findIndex((m) => m.role === 'user');
    try {
      const response = await client.beta.messages.create({
        model: MODEL,
        max_tokens: 4096,
        output_config: { effort: 'low' },
        // If a safety classifier declines the request, retry it on a fallback model.
        betas: ['server-side-fallback-2026-07-01'],
        fallbacks: 'default',
        // The company knowledge is identical on every request, so cache it.
        system: [
          {
            type: 'text',
            text: SYSTEM_PROMPT,
            cache_control: { type: 'ephemeral' },
          },
        ],
        messages: messages
          .slice(start)
          .map((m) => ({ role: m.role, content: m.content })),
      });

      if (response.stop_reason === 'refusal') return null;
      const text = response.content
        .flatMap((block) => (block.type === 'text' ? [block.text] : []))
        .join('')
        .trim();
      return text || null;
    } catch (error) {
      if (error instanceof Anthropic.AuthenticationError) {
        this.logger.error('Claude rejected ANTHROPIC_API_KEY; using fallback');
      } else if (error instanceof Anthropic.RateLimitError) {
        this.logger.warn('Claude rate limit reached; using fallback');
      } else if (error instanceof Anthropic.APIError) {
        this.logger.warn(
          `Claude API error ${error.status ?? '(no status)'}: ${error.message}; using fallback`,
        );
      } else {
        throw error;
      }
      return null;
    }
  }
}
