# Más Bosque Manu · Rescatista

Rescuer mobile app. Expo Router · React Native · TypeScript.

**Screens:** R01–R09 from our Stage 2 Figma design, plus the Casos and Perfil tabs.

> Screens and navigation only, with sample data. No real alerts, no backend.

## Run

```bash
npm install
npx expo start --port 8082 --android   # port 8082 so it can run next to the visitor app
```

Any username and password open the demo session.

## Check

```bash
npm run typecheck
npx eslint .
npx expo export --platform android
```

## Structure

```text
src/
├── app/            Navigation (Expo Router): protected root stack, (tabs), incidente/[id]/…
├── screens/        auth/, alerts/, incident/, map/, cases/, profile/, sync/
├── components/     Operations header, UI kit, incident card, cycle, timeline, map, tab bar
├── constants/      theme.ts (design tokens), incident-status.ts (labels and order)
├── data/           fixtures.ts (mock incidents, teams and profile)
├── types/          models.ts
├── context/        demo-context.tsx (DemoProvider with the offline queue)
└── hooks/          use-demo.ts
```

The demo scenarios are in the **Perfil** tab.

Project documentation: [`../../README.md`](../../README.md).
