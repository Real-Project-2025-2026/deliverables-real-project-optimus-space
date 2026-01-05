# Spacefindr

Plattform zur tageweisen Vermietung von Gewerbeflächen - Büros, Lager, Pop-up Stores, Studios und mehr.

**Live:** [www.spacefindr.de](https://www.spacefindr.de)

![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)
![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwindcss)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)

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
- **Responsive:** Desktop und Mobile optimiert
- **Demo-Modus:** Funktioniert ohne Backend mit Mock-Daten

## Lokale Entwicklung

```bash
# 1. Abhängigkeiten installieren
npm install

# 2. Entwicklungsserver starten (Demo-Modus)
npm run dev
```

App läuft unter **http://localhost:8080**

## Produktion (Docker)

Die Anwendung läuft in Docker auf einem Server und wird über Cloudflare Tunnel öffentlich erreichbar gemacht.

```bash
# Container bauen und starten
docker compose -f docker-compose.local.yml up -d --build

# Cloudflare Tunnel starten (verbindet zu www.spacefindr.de)
cloudflared tunnel run spacefindr
```

| Dienst | URL |
|--------|-----|
| Lokal | http://localhost:8080 |
| Produktion | https://www.spacefindr.de |

### Container stoppen

```bash
docker compose -f docker-compose.local.yml down
```

## Konfiguration

| Datei | Beschreibung |
|-------|--------------|
| `.env` | Umgebungsvariablen (Supabase URLs, Keys) |
| `docker-compose.local.yml` | Docker-Config für Demo-Modus |
| `docker-compose.yml` | Vollständige Supabase-Umgebung |

## Entwicklung

Das Frontend wurde ursprünglich mit [Lovable](https://lovable.dev) erstellt. Backend und Frontend wurden anschließend mit [Claude Code](https://www.claude.com/de-de/product/claude-code) erweitert und angepasst.

## Lizenz

Proprietär - Alle Rechte vorbehalten.
