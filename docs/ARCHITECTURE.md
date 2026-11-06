# Architecture — Más Bosque Manu

Stage 3 covers the **screens and navigation** only. There is no backend or storage yet:
every screen reads fictional sample data from `src/data/`. The backend services we plan
to add later are named in [section 6](#6-planned-backend-services).

## 1. Overview

```mermaid
flowchart LR
    subgraph Visitor["apps/visitor · Expo"]
        V["Screens V01–V14"] --> VD[("Sample data")]
    end
    subgraph Rescuer["apps/rescuer · Expo"]
        R["Screens R01–R09"] --> RD[("Sample data")]
    end
    subgraph Admin["apps/admin · Vite"]
        A["Pages A01–A09"] --> AD[("Sample data")]
    end
```

The three apps are independent: each one has its own dependencies, its own sample data
and runs on its own. They do not talk to each other.

## 2. Component structure

Both mobile apps are organized the same way. Arrows mean "uses".

```mermaid
flowchart TB
    subgraph Nav["src/app · navigation (Expo Router)"]
        LAY["_layout.tsx<br/>Stack and Tabs"]
        ROUTE["Route files<br/>point to a screen"]
    end
    SCR["src/screens<br/>screen components"]
    CMP["src/components<br/>reusable UI"]
    HK["src/hooks<br/>useDemo()"]
    CTX["src/context<br/>DemoProvider"]
    DATA["src/data<br/>sample data"]
    CONST["src/constants<br/>theme"]
    TYPES["src/types<br/>types"]

    LAY --> CTX
    ROUTE --> SCR
    SCR --> CMP
    SCR --> HK --> CTX --> DATA
    SCR --> CONST
    CMP --> CONST
    DATA --> TYPES
```

- **Route files are one line.** `src/app/sos/estado.tsx` only contains
  `export { default } from '@/screens/sos/emergency-status-screen';`. The navigation tree
  stays easy to read, and screens can be renamed without changing the URL.
- **Screens** build the UI from **components** and read sample data through
  `useDemo()`.
- **Components** only receive props and use the theme from `src/constants/`.

The admin panel follows the same idea with web names: `src/navigation/` holds the
React Router routes, `src/pages/` the screens, and `src/index.css` the theme colors.

## 3. Navigation

### Visitor

```mermaid
flowchart TD
    ROOT["Root Stack"]
    ROOT --> V01["/ · V01 Welcome"]
    ROOT --> V02["/permisos · V02 Permissions"]
    ROOT --> V03["/preparacion · V03 Incomplete setup"]
    ROOT --> TABS["(tabs) · Bottom tabs"]
    TABS --> V04["inicio · V04 Home"]
    TABS --> V11["mapa · V11 Offline map"]
    TABS --> V13["consejos · V13 Safety tips"]
    ROOT --> SOS["sos/ · SOS screens"]
    SOS --> V05["confirmar · V05"]
    SOS --> V06["detalles · V06"]
    SOS --> V07["referencia · V07"]
    SOS --> V08["estado · V08"]
    SOS --> V09["error · V09"]
    SOS --> V10["recibida · V10"]
    ROOT --> V12["kit/[id] · V12 Medical kit"]
    ROOT --> V14["mapa-descarga · V14 Map download"]
```

Main path between screens:

```mermaid
flowchart LR
    V01[V01 Welcome] --> V02[V02 Permissions] --> V04[V04 Home]
    V02 -.-> V03[V03 Incomplete setup] -.-> V04
    V04 -->|SOS| V05[V05 Confirm] --> V06[V06 Details] --> V08[V08 Status]
    V06 -.-> V07[V07 Location] -.-> V06
    V08 -.-> V09[V09 Error]
    V08 -.-> V10[V10 Received]
    V04 --> V11[V11 Map] --> V12[V12 Medical kit]
    V11 -.-> V14[V14 Download]
    V04 --> V13[V13 Tips]
```

### Rescuer

```mermaid
flowchart TD
    ROOT["Root Stack"]
    ROOT --> R01["/ · R01 Sign in"]
    ROOT --> TABS["(tabs) · Bottom tabs"]
    TABS --> R02["alertas · R02 Alerts / R09 No alerts"]
    TABS --> MAP["mapa · Incident map"]
    TABS --> CASES["casos · Cases"]
    TABS --> PROF["perfil · Profile"]
    ROOT --> INC["incidente/[id]/"]
    INC --> R03["index · R03 Detail"]
    INC --> R04["mapa · R04 Map"]
    INC --> R05["estado · R05 Update status"]
    INC --> R06["seguimiento · R06 Follow-up"]
    INC --> R07["cierre · R07 Close"]
    ROOT --> R08["sin-conexion · R08 Offline"]
```

Main path from the design: `R01 → R02 → R03 → R04` and `R03 → R05 → R06 → R07`.
Until the user signs in on R01, only the sign-in screen is available.

### Admin

```mermaid
flowchart TD
    BR["BrowserRouter"] --> A01["/ · A01 Sign in"]
    BR --> SH["AdminShell<br/>sidebar + top bar"]
    SH --> A02["/panel · A02 Dashboard"]
    SH --> A03["/incidentes · A03 Incidents"]
    SH --> A03D["/incidentes/:id · Incident detail"]
    SH --> A04["/rescatistas · A04 Teams"]
    SH --> A05["/mapas · A05 Map points"]
    SH --> A06["/contenido · A06 Content"]
    SH --> A07["/reportes · A07 Reports"]
    SH --> A08["/configuracion · A08 Settings"]
    SH --> A09["/error · A09 Error"]
```

The sidebar links every section with every other one (`A02 ↔ A03 … A08`).

## 4. Screen state

Each app has one React Context (`src/context/`) that keeps, in memory, the sample data
and which version of each screen to show. It is only there to move between the
designed screens: nothing is saved, and reloading the app resets it.

## 5. Dependencies added to the templates

| Package | App | Used for |
|---|---|---|
| `react-native-svg` | visitor, rescuer | Map drawings and illustrations |
| `@expo/vector-icons` | visitor, rescuer | Icons |
| `react-router-dom` | admin | Routes |
| `lucide-react` | admin | Icons |

## 6. Planned backend services

These are the backend services we plan to use, taken from our Stage 2 design. **None of
them is built in this stage**, and their technologies have not been chosen yet.

```mermaid
flowchart LR
    subgraph Apps["Apps in this repository"]
        V["Visitante"]
        R["Rescatista"]
        A["Administrador"]
    end

    subgraph Backend["Planned backend services (not built yet)"]
        LOCAL["Device services<br/>GPS · permissions · storage"]
        GEO["Offline maps and<br/>safety content"]
        ADP["Communication adapter"]
        API["Incident API"]
        AUTH["Authentication and<br/>authorization"]
        DISP["Notification and dispatch"]
        DB[("Database")]
    end

    V --> LOCAL
    GEO -. "downloaded before the visit" .-> V
    V -- "SOS request" --> ADP --> API
    R --> API
    A --> API
    R -.-> AUTH
    A -.-> AUTH
    API --> DB
    API --> DISP -.-> R
```

| Service | What it will do | Used by |
|---|---|---|
| Device services | GPS, location permission and local storage on the phone | Visitor |
| Offline maps and safety content | Maps and tips downloaded before entering the forest | Visitor |
| Communication adapter | Sends the SOS over the available channel and reports the result (BLE, Wi-Fi or LoRaWAN, to be decided) | Visitor |
| Incident API | Receives SOS requests and keeps their status and history | All three apps |
| Notification and dispatch | Notifies rescuers about confirmed incidents | Rescuer, admin |
| Authentication and authorization | Sign-in and roles for staff; visitors never need an account | Rescuer, admin |
| Database | Incidents, accounts and content; only the API reads it | Incident API |
