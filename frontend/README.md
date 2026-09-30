# Nowcoin Digital — frontend

React 19 + TypeScript (strict) + Vite. 3D with three.js via React Three Fiber.

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
    layout/     Nav, Footer, ThemeToggle, ErrorBoundary, PageMeta, Preloader, Cursor…
    ui/         Reusable presentational pieces (Reveal, Counter, MagneticButton…)
  sections/     Home-page sections
  pages/        Route components (code-split)
  three/        WebGL scenes; World.tsx is the fixed background canvas
  hooks/ lib/   Small hooks and framework-free utilities
  styles/       Design tokens (global.css) and component styles
```

## Conventions

- **Imports** use the `@/` alias for `src/`.
- **Server state** goes through React Query hooks in `api/queries.ts`; components never call `fetch` directly.
- **Theming**: colours are CSS custom properties in `styles/global.css` (`:root` = dark, `[data-theme='light']`
  overrides). WebGL colours live in `theme/theme.ts` (`scenePalettes`). An inline script in `index.html` applies the
  saved theme before first paint.
- **3D resilience**: every canvas is behind `supportsWebGL()` and an `ErrorBoundary` with a CSS fallback, so browsers
  without WebGL still get a complete page.
- **Motion** respects `prefers-reduced-motion` throughout.

## Environment

See `.env.example`. `VITE_API_URL` is only needed when the API is served from a different origin in production.
