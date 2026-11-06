// Render smoke test for the admin panel.
//
// Renders every route with `react-dom/server` through Vite's SSR pipeline, so the
// real components run (CSS modules included). It catches runtime errors that `tsc`
// and ESLint cannot see, such as a misused hook or a component that throws on mount.
// It does not replace a visual check in the browser.
//
// Usage: npm run smoke

import { fileURLToPath } from 'node:url';

import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('..', import.meta.url));

const ROUTES = [
  '/',
  '/panel',
  '/incidentes',
  '/incidentes/MBM-0248',
  '/incidentes/NO-EXISTE',
  '/rescatistas',
  '/mapas',
  '/contenido',
  '/reportes',
  '/configuracion',
  '/error',
  '/ruta-inexistente',
];

const vite = await createServer({
  root,
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});

let failures = 0;

try {
  const load = (path) => vite.ssrLoadModule(path);

  const { DemoProvider } = await load('/src/context/demo-provider.tsx');
  const { AdminShell } = await load('/src/components/admin-shell.tsx');
  const { LoginPage } = await load('/src/pages/login.tsx');
  const { DashboardPage } = await load('/src/pages/dashboard.tsx');
  const { IncidentsPage } = await load('/src/pages/incidents.tsx');
  const { IncidentDetailPage } = await load('/src/pages/incident-detail.tsx');
  const { RescuersPage } = await load('/src/pages/rescuers.tsx');
  const { LocationsPage } = await load('/src/pages/locations.tsx');
  const { ContentPage } = await load('/src/pages/content.tsx');
  const { ReportsPage } = await load('/src/pages/reports.tsx');
  const { SettingsPage } = await load('/src/pages/settings.tsx');
  const { ErrorPage, NotFoundPage } = await load('/src/pages/error.tsx');

  const h = createElement;

  // The shell is mounted without the demo session guard so every page renders
  // in a single pass.
  const tree = (path) =>
    h(
      DemoProvider,
      null,
      h(
        MemoryRouter,
        { initialEntries: [path] },
        h(
          Routes,
          null,
          h(Route, { path: '/', element: h(LoginPage) }),
          h(
            Route,
            { element: h(AdminShell) },
            h(Route, { path: '/panel', element: h(DashboardPage) }),
            h(Route, { path: '/incidentes', element: h(IncidentsPage) }),
            h(Route, { path: '/incidentes/:id', element: h(IncidentDetailPage) }),
            h(Route, { path: '/rescatistas', element: h(RescuersPage) }),
            h(Route, { path: '/mapas', element: h(LocationsPage) }),
            h(Route, { path: '/contenido', element: h(ContentPage) }),
            h(Route, { path: '/reportes', element: h(ReportsPage) }),
            h(Route, { path: '/configuracion', element: h(SettingsPage) }),
            h(Route, { path: '/error', element: h(ErrorPage) }),
            h(Route, { path: '*', element: h(NotFoundPage) }),
          ),
        ),
      ),
    );

  for (const path of ROUTES) {
    try {
      const html = renderToString(tree(path));
      if (html.length < 200) {
        throw new Error(`suspiciously short output (${html.length} bytes)`);
      }
      console.log(`PASS  ${path.padEnd(26)} ${html.length} bytes`);
    } catch (error) {
      failures += 1;
      console.log(`FAIL  ${path.padEnd(26)} ${error.message}`);
    }
  }
} finally {
  await vite.close();
}

console.log(
  failures === 0
    ? `\nAll admin routes render (${ROUTES.length}/${ROUTES.length}).`
    : `\n${failures} route(s) failed.`,
);

process.exit(failures === 0 ? 0 : 1);
