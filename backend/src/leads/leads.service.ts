import { Injectable, Logger } from '@nestjs/common';
import { appendFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import type { ContactDto, SubscribeDto } from './leads.dto.js';

// Leads are appended as JSON lines. Swap this for a database or CRM
// integration in production.
@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);
  private readonly dir = process.env.LEADS_DIR ?? join(process.cwd(), 'data');

  async subscribe(dto: SubscribeDto) {
    await this.append('subscribers.jsonl', { email: dto.email.toLowerCase() });
    return { ok: true };
  }

  async contact(dto: ContactDto) {
    const { name, email, company, topic, message } = dto;
    await this.append('contacts.jsonl', {
      name,
      email,
      company,
      topic,
      message,
    });
    this.logger.log(`New ${dto.topic} enquiry from ${dto.email}`);
    return { ok: true };
  }

  private async append(file: string, record: Record<string, unknown>) {
    await mkdir(this.dir, { recursive: true });
    const line = JSON.stringify({
      ...record,
      createdAt: new Date().toISOString(),
    });
    await appendFile(join(this.dir, file), line + '\n', 'utf8');
  }
}
