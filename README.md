# Spacefindr

Plattform zur tageweisen Vermietung von Gewerbeflächen - Büros, Lager, Pop-up Stores, Studios und mehr.

![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)
![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwindcss)

## Tech Stack

| Bereich | Technologie |
|---------|-------------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, shadcn/ui, Radix UI |
| State | TanStack Query (React Query) |
| Routing | React Router v6 |
| Karten | Leaflet, OpenStreetMap |
| Animationen | Framer Motion |
| Backend | Supabase (PostgreSQL, Auth, Storage) |

## Projektstruktur

```
src/
├── components/       # React-Komponenten
│   ├── layout/       # Header, Footer, ScrollToTop
│   ├── spaces/       # SpaceCard, SearchFilters, Map
│   └── ui/           # shadcn/ui Komponenten
├── pages/            # Seiten
│   ├── dashboard/    # Tenant, Landlord, Admin
│   └── legal/        # Impressum, Datenschutz, AGB
├── lib/              # API, Services, Supabase Client
├── contexts/         # Auth Context
├── hooks/            # Custom Hooks
├── types/            # TypeScript Definitionen
└── data/             # Mock-Daten für Demo-Modus
```

## Schnellstart

```bash
# Repository klonen
git clone https://github.com/luca4protection/rentaroom-daily.git
cd rentaroom-daily

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev
```

App läuft unter **http://localhost:8080** im Demo-Modus.

## Deployment

### Cloudflare Pages

| Einstellung | Wert |
|-------------|------|
| Build command | `npm run build` |
| Build output | `dist` |
| Node.js | `20` |

### Docker

```bash
docker compose -f docker-compose.local.yml up -d
```

## Features

- **Mieter:** Flächen suchen, filtern, buchen, stornieren
- **Vermieter:** Flächen erstellen, Buchungen verwalten
- **Karte:** Interaktive OpenStreetMap-Ansicht
- **Responsive:** Desktop und Mobile
- **Offline-Modus:** Funktioniert ohne Backend mit Demo-Daten

## Dokumentation

Weitere Details im [Wiki](https://github.com/luca4protection/rentaroom-daily/wiki).

## Lizenz

Proprietär - Alle Rechte vorbehalten.
