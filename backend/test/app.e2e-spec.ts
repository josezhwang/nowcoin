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

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    await rm(leadsDir, { recursive: true, force: true });
  });

  it('GET /api/products lists products', async () => {
    const res = await request(app.getHttpServer()).get('/api/products').expect(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('slug');
  });

  it('GET /api/products/:slug 404s for unknown slugs', () => {
    return request(app.getHttpServer()).get('/api/products/nope').expect(404);
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
});
