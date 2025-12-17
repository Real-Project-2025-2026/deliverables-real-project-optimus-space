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

## Voraussetzungen

- **Node.js 20+** - [nodejs.org](https://nodejs.org/)
- **Docker Desktop** - [docker.com](https://www.docker.com/products/docker-desktop/) (für Deployment)
- **Cloudflared** - [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/) (optional, für öffentlichen Zugang)

## Installation

```bash
# 1. Repository klonen
git clone https://github.com/luca4protection/rentaroom-daily.git
cd rentaroom-daily

# 2. Abhängigkeiten installieren
npm install
```

## Lokale Entwicklung (Demo-Modus)

```bash
# Entwicklungsserver starten
npm run dev
```

App läuft unter **http://localhost:8080** mit Mock-Daten.

## Produktions-Deployment mit Docker

### 1. Docker Desktop starten

Stelle sicher, dass Docker Desktop läuft.

### 2. Demo-Modus konfigurieren

In `.env` muss für Demo-Modus stehen:
```
VITE_SUPABASE_URL=http://localhost:8000
```

### 3. Container bauen und starten

```bash
docker compose -f docker-compose.local.yml up -d --build
```

App läuft unter **http://localhost:8080**.

### Container stoppen

```bash
docker compose -f docker-compose.local.yml down
```

## Cloudflare Tunnel (öffentlicher Zugang)

### 1. Cloudflared installieren und einloggen

```bash
# Bei Cloudflare anmelden (Browser öffnet sich)
cloudflared tunnel login
```

### 2. Tunnel erstellen

```bash
cloudflared tunnel create spacefindr-demo
```

### 3. Tunnel-Config erstellen

Erstelle `~/.cloudflared/config.yml`:

```yaml
tunnel: <TUNNEL-ID>
credentials-file: ~/.cloudflared/<TUNNEL-ID>.json

ingress:
  - hostname: demo.spacefindr.de
    service: http://localhost:8080
  - service: http_status:404
```

### 4. DNS-Eintrag setzen

```bash
cloudflared tunnel route dns spacefindr-demo demo.spacefindr.de
```

Falls der Eintrag existiert:
```bash
cloudflared tunnel route dns --overwrite-dns spacefindr-demo demo.spacefindr.de
```

### 5. Tunnel starten

```bash
cloudflared tunnel run spacefindr-demo
```

Die App ist jetzt unter **https://demo.spacefindr.de** erreichbar.

## Vollständiger Start-Befehl

Nach Ersteinrichtung reichen diese Befehle:

```bash
# Docker Container starten
docker compose -f docker-compose.local.yml up -d

# Cloudflare Tunnel starten
cloudflared tunnel run spacefindr-demo
```

## Features

- **Mieter:** Flächen suchen, filtern, buchen, stornieren
- **Vermieter:** Flächen erstellen, Buchungen verwalten
- **Karte:** Interaktive OpenStreetMap-Ansicht
- **Responsive:** Desktop und Mobile
- **Demo-Modus:** Funktioniert ohne Backend mit Mock-Daten

## Konfiguration

| Datei | Beschreibung |
|-------|--------------|
| `.env` | Umgebungsvariablen (Supabase URLs, Keys) |
| `docker-compose.local.yml` | Docker-Config für Demo-Modus |
| `docker-compose.yml` | Vollständige Supabase-Umgebung |
| `~/.cloudflared/config.yml` | Cloudflare Tunnel-Config |

## Lizenz

Proprietär - Alle Rechte vorbehalten.
