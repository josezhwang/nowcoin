import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

// Load backend/.env when present; real environment variables still take precedence.
try {
  process.loadEnvFile();
} catch {
  // No .env file — rely on the process environment.
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  // Only needed when the frontend calls the API directly (VITE_API_URL); through the
  // /api proxy requests are same-origin. CORS_ORIGIN=* allows every origin.
  const corsOrigin =
    process.env.CORS_ORIGIN ??
    'http://localhost:5173,http://localhost:5174,http://localhost:5180';
  app.enableCors({
    origin:
      corsOrigin.trim() === '*'
        ? true
        : corsOrigin.split(',').map((origin) => origin.trim()),
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // Loopback by default: the browser reaches the API through the web server's /api
  // proxy, so it never needs to be exposed. Set HOST=0.0.0.0 to serve it directly.
  await app.listen(process.env.PORT ?? 4000, process.env.HOST ?? '127.0.0.1');
}
await bootstrap();
