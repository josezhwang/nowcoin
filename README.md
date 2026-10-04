# Nowcoin Digital — company website

Marketing site for Nowcoin Digital and its product line (Nowcoin Wallet, Card, Exchange, Pay, Vault, Connect API).

```
frontend/   React 19 + Vite + TypeScript, CSS 3D / SVG / canvas, Framer Motion, Lenis
backend/    NestJS 12 API — site content, live market prices, contact & newsletter leads
```

## Run locally

Requires Node 22.12 or newer (tested on 22.14 and 24; see `.nvmrc`).

```bash
npm run setup   # install root, backend and frontend dependencies
npm run dev     # API on http://localhost:4000 + website on http://localhost:5173
```

### Share it with someone

`npm run share` builds both apps and serves the site on port **5174**, reachable from other devices (the API stays
private behind it, so there is no CORS to configure — leave `VITE_API_URL` unset). Any address or host name works:
an IP, a tunnel (Cloudflare, ngrok, Tailscale) or a dynamic-DNS name. Use `npm run share`, not `npm run dev` — the dev
server only listens on this computer.

- **Same Wi-Fi/LAN:** open `http://<your-computer's-IP>:5174` (Windows: `ipconfig` → IPv4 Address). Allow Node.js
  through the firewall when asked.
- **Over the internet from a home PC:** routers block incoming connections, so use a free Cloudflare quick tunnel:
  install [`cloudflared`](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/),
  run `cloudflared tunnel --url http://localhost:5174` alongside `npm run share`, and send the
  `https://….trycloudflare.com` link it prints.
- **On a server with a public IP:** open the port in its firewall (e.g. `sudo ufw allow 5174/tcp`) and share
  `http://<server-ip>:5174`.

The site is only reachable while `npm run share` (and the tunnel) keep running.

Other root scripts: `npm run build`, `npm test`, `npm run lint`, `npm run typecheck`, `npm run check` (all of them,
as CI runs). Each app also works on its own — see `frontend/README.md` and `backend/README.md`.

Configuration lives in `backend/.env` and `frontend/.env` — copy the `.env.example` files. All variables are optional:

| Where    | Variable            | Default                    | Purpose                                                  |
| -------- | ------------------- | -------------------------- | -------------------------------------------------------- |
| backend  | `PORT`              | `4000`                     | API port                                                 |
| backend  | `HOST`              | `127.0.0.1`                | Interface the API binds to (private behind `/api` proxy) |
| backend  | `CORS_ORIGIN`       | `localhost:5173,5174,5180` | Comma-separated allowed origins, or `*` for any          |
| backend  | `LEADS_DIR`         | `backend/data`             | Where contact/newsletter JSONL goes                      |
| backend  | `ANTHROPIC_API_KEY` | _(unset)_                  | Lets Claude answer the help chat (see below)             |
| frontend | `VITE_API_URL`      | `/api`                     | API base for production builds on a different origin     |
| frontend | `API_URL`           | `http://127.0.0.1:4000`    | Dev/preview proxy target for `/api`                      |

## API

| Method | Path                  | Notes                                                                 |
| ------ | --------------------- | --------------------------------------------------------------------- |
| GET    | `/api/products`       | All products                                                          |
| GET    | `/api/products/:slug` | One product (404 if unknown)                                          |
| GET    | `/api/cards`          | Card tiers                                                            |
| GET    | `/api/home`           | Stats, steps, FAQs, testimonials                                      |
| GET    | `/api/team`           | Team members (portraits come from `/images/team/<slug>.jpg`)          |
| GET    | `/api/market/tickers` | CoinGecko prices, cached 60 s; falls back to indicative data offline  |
| POST   | `/api/newsletter`     | `{ email }`                                                           |
| POST   | `/api/contact`        | `{ name, email, company?, topic, message }`                           |
| POST   | `/api/chat`           | `{ messages: [{ role, content }] }` → `{ reply, source }` (help chat) |
| GET    | `/api/health`         | Liveness                                                              |

POST routes are validated with `class-validator` and rate-limited per IP (5/min for leads, 20/min for chat).
Leads are appended to JSONL files — swap `LeadsService` for a database or CRM before launch.

## Help chat

The "Need help?" button opens a chat that answers questions about the company. Its knowledge is built from the
site content in `backend/src/content/content.data.ts`, so editing that file updates the bot too.

- **With Claude:** put an API key from [platform.claude.com](https://platform.claude.com/settings/keys) in
  `backend/.env` as `ANTHROPIC_API_KEY=...` and restart. Claude Opus 5.5 answers any wording, follows up on earlier
  questions and replies in the visitor's language. It only answers from the site content, and points to `/contact`
  for anything else or for account problems. Each question is a paid API call; the company knowledge is prompt-cached
  to keep that cheap.
- **Without a key** (or if Claude is unreachable), the chat answers from built-in keyword matching over the FAQs,
  products, card tiers and team. It handles common questions but not unusual wording.

## Where things live

- Brand, navigation, contact emails, social links: `frontend/src/config/site.ts`
- **Images**: every slot is listed in `frontend/public/images/README.md` (paths + sizes); drop files there, no code changes
- Marketing copy and numbers: `backend/src/content/content.data.ts` (**all figures are placeholders**)
- Light/dark theme: CSS tokens in `frontend/src/styles/tokens.css`
- 3D without WebGL: the hero vault (`frontend/src/components/vault/`), the layered Nowcoin Card with its exploded view (`frontend/src/components/card/`) and the dotted planet (`frontend/src/components/ui/DotSphere.tsx`, real Natural Earth land mask in `lib/landMask.ts`)
- Page sections: `frontend/src/sections/`, pages: `frontend/src/pages/`
- Design tokens (colours, fonts, radii): `frontend/src/styles/tokens.css`

## Quality

- TypeScript strict mode in both apps; oxlint; Prettier
- Backend: unit + e2e tests (Vitest, Supertest). Frontend: unit/component tests (Vitest, Testing Library)
- CI (`.github/workflows/ci.yml`) runs lint, typecheck, tests and build for both apps on every push and PR
