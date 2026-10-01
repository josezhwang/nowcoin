# Nowcoin Digital — frontend

React 19 + TypeScript (strict) + Vite. All 3D is CSS 3D, SVG and canvas 2D — no WebGL, so it renders on any machine.

## Scripts

| Command             | What it does                               |
| ------------------- | ------------------------------------------ |
| `npm run dev`       | Dev server; proxies `/api` to the backend  |
| `npm run build`     | Typecheck + production build to `dist/`    |
| `npm test`          | Unit/component tests (Vitest + RTL, jsdom) |
| `npm run lint`      | oxlint                                     |
| `npm run typecheck` | `tsc -b`                                   |
| `npm run format`    | Prettier                                   |

## Structure

```
src/
  app/          App shell, providers (React Query, theme, motion), lazy routes
  api/          fetch client (ApiError), React Query hooks, API types
  config/       site.ts — brand, nav, footer, contact details (single source of truth)
  theme/        ThemeProvider, tokens for 3D scenes, useTheme
  components/
    layout/     Nav, Footer, ThemeToggle, ErrorBoundary, PageMeta, HelpPill…
    ui/         Reusable presentational pieces (Reveal, Counter, ImageSlot, DotSphere…)
    vault/      Hero vault: isometric slab, well and rising cubes (SVG + CSS)
    card/       Nowcoin Card: layered CSS-3D card with an exploded view
  sections/     Home-page sections
  pages/        Route components
  hooks/ lib/   Small hooks and framework-free utilities
  styles/       Design tokens (tokens.css) and component styles
```

## Conventions

- **Imports** use the `@/` alias for `src/`.
- **Server state** goes through React Query hooks in `api/queries.ts`; components never call `fetch` directly.
- **Theming**: colours are CSS custom properties in `styles/tokens.css` (`:root` = dark, `[data-theme='light']`
  overrides). An inline script in `index.html` applies the
  saved theme before first paint.
- **3D resilience**: every canvas is behind `supportsWebGL()` and an `ErrorBoundary` with a CSS fallback, so browsers
  without WebGL still get a complete page.
- **Motion** respects `prefers-reduced-motion` throughout.

## Environment

See `.env.example`. `VITE_API_URL` is only needed when the API is served from a different origin in production.
