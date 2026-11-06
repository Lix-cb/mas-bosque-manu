# Más Bosque Manu · Administración

Admin web panel. Vite · React · React Router · TypeScript.

**Screens:** A01–A09 from our Stage 2 Figma design, plus the incident detail page and a
not-found page.

> Screens and navigation only, with sample data. No backend, no real sign-in and no
> database.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
```

Any username and password open the demo session.

## Check

```bash
npm run check      # tsc -b, ESLint and the render smoke test
npm run build      # production build
npm run smoke      # renders the 12 routes with react-dom/server
```

## Structure

```text
src/
├── navigation/     app-routes.tsx: route tree, LoginGate and RequireDemoSession
├── pages/          One page per screen (A01–A09) + shared page styles
├── components/     AdminShell, UI kit, incident chart, schematic map (+ CSS Modules)
├── constants/      incident-status.ts (labels, open statuses, tag tones)
├── data/           fixtures.ts (mock data)
├── types/          models.ts
├── context/        demo-context.ts (context + types), demo-provider.tsx
├── hooks/          use-demo.ts
└── index.css       Design tokens as CSS custom properties
scripts/
└── render-smoke.mjs
```

The demo scenarios are in the **Configuración** section.

Project documentation: [`../../README.md`](../../README.md).
