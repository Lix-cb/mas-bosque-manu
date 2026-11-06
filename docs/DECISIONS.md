# Architecture decisions — Más Bosque Manu

Decisions we made while building the Stage 3 skeleton (screens and navigation).

| # | Decision |
|---|---|
| [ADR-001](#adr-001--three-apps-in-one-repository) | Three apps in one repository |
| [ADR-002](#adr-002--expo-router-for-mobile-navigation) | Expo Router for mobile navigation |
| [ADR-003](#adr-003--folder-structure) | Folder structure |
| [ADR-004](#adr-004--vite-and-react-router-for-the-admin-panel) | Vite and React Router for the admin panel |
| [ADR-005](#adr-005--sample-data-instead-of-storage) | Sample data instead of storage |
| [ADR-006](#adr-006--system-font-instead-of-inter) | System font instead of Inter |
| [ADR-007](#adr-007--a-menu-to-see-every-screen-state) | A menu to see every screen state |
| [ADR-008](#adr-008--tabs-without-a-figma-frame) | Tabs without a Figma frame |

---

### ADR-001 · Three apps in one repository

Visitors, rescuers and administrators use different devices and see different screens,
so each role has its own app: two Expo apps (`apps/visitor`, `apps/rescuer`) and one
web app (`apps/admin`). They share one repository but each has its own `package.json`
and runs on its own. We did not add monorepo tools (Turborepo, Nx, workspaces) because
there is no shared code that needs them yet.

### ADR-002 · Expo Router for mobile navigation

**Options:** Expo Router or React Navigation configured by hand.

**We chose Expo Router** because:

- The navigation is the folder `src/app/`. Each file is a route, so the structure of
  the code matches the navigation map from Stage 2 and is easy to follow.
- Routes are typed: linking to a screen that does not exist is a compile error.
- It runs on top of React Navigation, so we still get native stacks and bottom tabs.
- It is Expo's default for new projects and works with Expo Go.

With React Navigation by hand we would have to declare every screen in a navigator
again, and the links would not be type-checked.

**Consequence:** every file inside `src/app/` becomes a route, so screen components live
in `src/screens/` (ADR-003).

### ADR-003 · Folder structure

We used the folders from class, adapted to Expo Router:

| Folder | Contents |
|---|---|
| `src/app/` | Navigation: `_layout.tsx` files and one small file per route (works as `/navigation`) |
| `src/screens/` | Screen components grouped by feature (`sos/`, `map/`, `incident/`…) |
| `src/components/` | Reusable components |
| `src/constants/` | Colors, spacing and font sizes |
| `src/data/` | Sample data |
| `src/types/` | TypeScript types |
| `src/context/` | Shared screen state |
| `src/hooks/` | `useDemo()` |

A route file only points to its screen:

```tsx
// V08 · Emergency status
export { default } from '@/screens/sos/emergency-status-screen';
```

Route paths are in Spanish because they are the app's URLs (`/sos/estado`); screen files
have descriptive English names.

### ADR-004 · Vite and React Router for the admin panel

The admin panel was designed for desktop (sidebar, tables, charts), so it is a web app
built with React and Vite. React Router handles the routes and the shared layout
(sidebar + top bar) in `src/navigation/app-routes.tsx`.

### ADR-005 · Sample data instead of storage

This stage has no backend or storage. Each app keeps its sample data in `src/data/`
and uses one React Context to switch between screen versions. Nothing is saved and
reloading resets the app. Storage and backend services will be decided in a later stage.

### ADR-006 · System font instead of Inter

The design uses Inter. To avoid bundling a font file, the apps use the system font
(`sans-serif` on Android, `System` on iOS) with the same sizes and weights as the
design. Inter can be added later with `expo-font`.

### ADR-007 · A menu to see every screen state

Many screens have several designed versions (no GPS, no connection, empty list, error…).
To show them without editing code:

- **Visitor:** tapping the amber "Prototipo académico" strip, which is already in the
  design, opens a menu of states.
- **Rescuer:** the options are in the *Perfil* tab.
- **Admin:** the options are in *Configuración*.

This way we did not add new buttons to the designed screens.

### ADR-008 · Tabs without a Figma frame

The rescuer bottom bar in our design has four tabs (Alertas, Mapa, Casos, Perfil), but
we only designed screens for the first two. We built *Casos* (a search over the sample
incidents) and *Perfil* (profile and the state menu from ADR-007) with the same style,
so no tab is empty.
