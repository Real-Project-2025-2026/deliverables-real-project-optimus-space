# Architektur

## Technologie-Stack

| Bereich | Technologie |
|---------|-------------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, shadcn/ui, Radix UI |
| **State** | TanStack Query (React Query) |
| **Routing** | React Router v6 |
| **Karten** | Leaflet, OpenStreetMap |
| **Animationen** | Framer Motion |
| **Backend** | Supabase (Self-Hosted) |
| **Datenbank** | PostgreSQL 15 |
| **Auth** | Supabase GoTrue |
| **API** | PostgREST |
| **Container** | Docker, Docker Compose |

## Systemübersicht

```
┌─────────────────────────────────────────────────┐
│                    Browser                       │
└─────────────────────┬───────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
┌───────────┐  ┌───────────┐  ┌───────────┐
│  Frontend │  │   Kong    │  │  Studio   │
│ Port 8080 │  │ Port 8000 │  │ Port 3001 │
└───────────┘  └─────┬─────┘  └─────┬─────┘
                     │              │
       ┌─────────────┼──────────────┤
       │             │              │
       ▼             ▼              ▼
┌───────────┐  ┌───────────┐  ┌───────────┐
│ PostgREST │  │  GoTrue   │  │ Realtime  │
│ (REST API)│  │  (Auth)   │  │(WebSocket)│
└─────┬─────┘  └─────┬─────┘  └─────┬─────┘
      │              │              │
      └──────────────┼──────────────┘
                     │
                     ▼
              ┌───────────┐
              │ PostgreSQL│
              │ Port 5432 │
              └───────────┘
```

## Projektstruktur

```
spacefindr/
├── src/
│   ├── components/       # React-Komponenten
│   │   ├── layout/       # Header, Footer
│   │   ├── spaces/       # Space-Cards, Filter
│   │   └── ui/           # shadcn/ui
│   ├── pages/            # Seiten
│   │   ├── dashboard/    # Dashboards
│   │   └── legal/        # Rechtliches
│   ├── lib/              # Services, API
│   ├── contexts/         # React Contexts
│   ├── hooks/            # Custom Hooks
│   ├── types/            # TypeScript Types
│   └── data/             # Mock-Daten
├── supabase/
│   ├── init/             # SQL-Scripts
│   ├── functions/        # Edge Functions
│   └── kong.yml          # API Gateway
├── public/               # Statische Assets
├── docker-compose.yml    # Docker Config
└── vite.config.ts        # Vite Config
```
