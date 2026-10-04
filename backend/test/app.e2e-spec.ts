import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';

describe('API (e2e)', () => {
  let app: INestApplication<App>;
  let leadsDir: string;

  beforeEach(async () => {
    leadsDir = await mkdtemp(join(tmpdir(), 'leads-'));
    process.env.LEADS_DIR = leadsDir;
    // Keep the chat on its offline fallback so tests never call Claude.
    delete process.env.ANTHROPIC_API_KEY;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    await rm(leadsDir, { recursive: true, force: true });
  });

  it('GET /api/products lists products', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/products')
      .expect(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('slug');
  });

  it('GET /api/products/:slug 404s for unknown slugs', () => {
    return request(app.getHttpServer()).get('/api/products/nope').expect(404);
  });

  it('GET /api/team lists team members', async () => {
    const res = await request(app.getHttpServer()).get('/api/team').expect(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('slug');
    expect(res.body[0]).toHaveProperty('role');
  });

  it('GET /api/products includes highlights', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/products')
      .expect(200);
    for (const p of res.body) expect(p.highlights.length).toBeGreaterThan(0);
  });

  it('GET /api/home returns sections', async () => {
    const res = await request(app.getHttpServer()).get('/api/home').expect(200);
    expect(res.body).toHaveProperty('stats');
    expect(res.body).toHaveProperty('faqs');
  });

  it('POST /api/newsletter validates email', async () => {
    await request(app.getHttpServer())
      .post('/api/newsletter')
      .send({ email: 'not-an-email' })
      .expect(400);
    await request(app.getHttpServer())
      .post('/api/newsletter')
      .send({ email: 'hello@example.com' })
      .expect(201, { ok: true });
  });

  it('POST /api/contact accepts a valid enquiry', () => {
    return request(app.getHttpServer())
      .post('/api/contact')
      .send({
        name: 'Ada',
        email: 'ada@example.com',
        topic: 'sales',
        message: 'Tell me about Nowcoin Pay',
      })
      .expect(201, { ok: true });
  });

  it('POST /api/chat answers from the fallback without an API key', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/chat')
      .send({
        messages: [
          { role: 'assistant', content: 'Hi! How can I help?' },
          { role: 'user', content: 'What card tiers do you have?' },
        ],
      })
      .expect(200);
    expect(res.body.source).toBe('faq');
    expect(res.body.reply).toContain('Obsidian');
  });

  it('POST /api/chat validates the conversation', async () => {
    const chat = (body: unknown) =>
      request(app.getHttpServer())
        .post('/api/chat')
        .send(body as object);
    await chat({ messages: [] }).expect(400);
    await chat({ messages: [{ role: 'system', content: 'hi' }] }).expect(400);
    await chat({ messages: [{ role: 'user', content: '   ' }] }).expect(400);
    await chat({
      messages: [{ role: 'assistant', content: 'Hi! How can I help?' }],
    }).expect(400);
  });
});
