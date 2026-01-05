# Spacefindr

Plattform zur tageweisen Vermietung von Gewerbeflächen.

**Live:** [www.spacefindr.de](https://www.spacefindr.de)

## Tech Stack

| Frontend | Backend | Infrastruktur |
|----------|---------|---------------|
| React 18 + TypeScript | Supabase (PostgreSQL) | Docker |
| Vite | Supabase Auth | Cloudflare Tunnel |
| Tailwind CSS + shadcn/ui | Supabase Storage | Nginx |
| TanStack Query | Edge Functions | |
| Leaflet Maps | | |

## Features

- **Mieter:** Flächen suchen, filtern, buchen, stornieren
- **Vermieter:** Flächen erstellen & verwalten, Buchungen einsehen
- **Interaktive Karte:** OpenStreetMap-Integration
- **Demo-Modus:** Funktioniert ohne Backend mit Mock-Daten

## Quick Start

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsserver (Demo-Modus)
npm run dev
```

## Deployment

Die Anwendung läuft in Docker und wird über Cloudflare Tunnel gehostet:

```bash
# Container starten
docker compose -f docker-compose.local.yml up -d --build

# Cloudflare Tunnel starten
cloudflared tunnel run spacefindr
```

## Entwicklung

Das Frontend wurde ursprünglich mit [Lovable](https://lovable.dev) erstellt. Backend und Frontend wurden anschließend mit [Claude Code](https://claude.ai/claude-code) erweitert und angepasst.

## Lizenz

Proprietär - Alle Rechte vorbehalten.
