# Más Bosque Manu · Visitante

Visitor mobile app. Expo Router · React Native · TypeScript.

**Screens:** V01–V14 from our Stage 2 Figma design, plus their alternative versions.

> Screens and navigation only, with sample data. It does not send real alerts, does
> not read GPS and has no backend.

## Run

```bash
npm install
npx expo start --android
```

## Check

```bash
npm run typecheck
npx eslint .
npx expo export --platform android
```

## Structure

```text
src/
├── app/            Navigation (Expo Router): root stack, (tabs), sos/, kit/[id]…
├── screens/        onboarding/, home/, sos/, map/, tips/, demo/
├── components/     Buttons, cards, notices, fields, schematic map, tab bar…
├── constants/      theme.ts (design tokens), reference-categories.ts
├── data/           fixtures.ts (mock data), alert-stages.ts (copy per alert stage)
├── types/          models.ts
├── context/        demo-context.tsx (DemoProvider)
└── hooks/          use-demo.ts
```

The demo scenarios open from the **amber strip** at the top of every screen.

Project documentation: [`../../README.md`](../../README.md).
