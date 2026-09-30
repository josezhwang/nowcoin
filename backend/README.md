# Nowcoin Digital — backend

NestJS 12 API (ESM, strict TypeScript) serving site content, live market prices and lead capture.

| Command              | What it does                         |
| -------------------- | ------------------------------------ |
| `npm run start:dev`  | Watch mode on `PORT` (default 4000)  |
| `npm run build`      | Compile to `dist/`                   |
| `npm run start:prod` | Run the compiled build               |
| `npm test`           | Unit tests (Vitest)                  |
| `npm run test:e2e`   | HTTP tests against the full app      |
| `npm run lint`       | oxlint (type-aware)                  |
| `npm run typecheck`  | `tsc --noEmit`                       |

Modules live in `src/`: `content` (products, card tiers, home copy), `market` (CoinGecko proxy with 60 s cache
and offline fallback), `leads` (validated, rate-limited contact/newsletter endpoints) and `health`.

Configuration: see `.env.example`. Endpoint reference: see the root README.
