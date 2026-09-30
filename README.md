# Nowcoin Digital — company website

Marketing site for Nowcoin Digital and its product line (Nowcoin Wallet, Card, Exchange, Pay, Vault, Connect API).

```
frontend/   React 19 + Vite + TypeScript, three.js via @react-three/fiber, Framer Motion, Lenis
backend/    NestJS 12 API — site content, live market prices, contact & newsletter leads
```

## Run locally

Requires Node 22.12 or newer (tested on 22.14 and 24; see `.nvmrc`).

```bash
npm run setup   # install root, backend and frontend dependencies
npm run dev     # API on http://localhost:4000 + website on http://localhost:5173
```

Other root scripts: `npm run build`, `npm test`, `npm run lint`, `npm run typecheck`, `npm run check` (all of them,
as CI runs). Each app also works on its own — see `frontend/README.md` and `backend/README.md`.

Configuration lives in `backend/.env` and `frontend/.env` — copy the `.env.example` files. All variables are optional:

| Where    | Variable       | Default                  | Purpose                                                 |
| -------- | -------------- | ------------------------ | ------------------------------------------------------- |
| backend  | `PORT`         | `4000`                   | API port                                                |
| backend  | `CORS_ORIGIN`  | `http://localhost:5173`  | Comma-separated allowed origins                         |
| backend  | `LEADS_DIR`    | `backend/data`           | Where contact/newsletter JSONL goes                     |
| frontend | `VITE_API_URL` | `/api`                   | API base for production builds on a different origin   |
| frontend | `API_URL`      | `http://localhost:4000`  | Dev-server proxy target for `/api`                      |

## API

| Method | Path                   | Notes                                                                 |
| ------ | ---------------------- | --------------------------------------------------------------------- |
| GET    | `/api/products`        | All products                                                          |
| GET    | `/api/products/:slug`  | One product (404 if unknown)                                          |
| GET    | `/api/cards`           | Card tiers                                                            |
| GET    | `/api/home`            | Stats, steps, FAQs, testimonials                                      |
| GET    | `/api/market/tickers`  | CoinGecko prices, cached 60 s; falls back to indicative data offline  |
| POST   | `/api/newsletter`      | `{ email }`                                                           |
| POST   | `/api/contact`         | `{ name, email, company?, topic, message }`                           |
| GET    | `/api/health`          | Liveness                                                              |

POST routes are validated with `class-validator` and rate-limited to 5/min per IP.
Leads are appended to JSONL files — swap `LeadsService` for a database or CRM before launch.

## Where things live

- Brand, navigation, contact emails, social links: `frontend/src/config/site.ts`
- Marketing copy and numbers: `backend/src/content/content.data.ts` (**all figures are placeholders**)
- Light/dark theme: CSS tokens in `frontend/src/styles/global.css`, 3D colours in `frontend/src/theme/theme.ts`
- 3D: `frontend/src/three/` — everything is procedural (canvas-painted textures, generated geometry), so there are no model or image assets
  - `World.tsx` — one fixed full-screen canvas behind every page: starfield + floating objects the camera flies through as you scroll, bloom post-processing, and the home hero (`HeroScene.tsx`)
  - Section scenes mount lazily and pause off-screen (`LazyCanvas.tsx`): card tiers, card anatomy (scroll-driven explode), network globe, security vault, product orbs, CTA coin rain
- Page sections: `frontend/src/sections/`, pages: `frontend/src/pages/`
- Design tokens (colours, fonts, radii): top of `frontend/src/styles/global.css`

## Quality

- TypeScript strict mode in both apps; oxlint; Prettier
- Backend: unit + e2e tests (Vitest, Supertest). Frontend: unit/component tests (Vitest, Testing Library)
- CI (`.github/workflows/ci.yml`) runs lint, typecheck, tests and build for both apps on every push and PR
