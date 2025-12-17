# Spacefindr

Plattform zur tageweisen Vermietung von Gewerbeflächen.

![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)
![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwindcss)

## Schnellstart

```bash
# Repository klonen
git clone https://github.com/luca4protection/rentaroom-daily.git
cd rentaroom-daily

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten (Port 8080)
npm run dev
```

Die App läuft unter **http://localhost:8080** im Demo-Modus mit Beispieldaten.

## Deployment

### Cloudflare Pages

1. Repository mit Cloudflare Pages verbinden
2. Build-Einstellungen:
   - Build command: `npm run build`
   - Build output: `dist`
   - Node.js Version: `20`

### Docker (lokal)

```bash
docker compose -f docker-compose.local.yml up -d
```

App läuft unter **http://localhost:8080**

## Technologien

- **Frontend:** React, TypeScript, Tailwind CSS, shadcn/ui
- **State:** TanStack Query
- **Karten:** Leaflet / OpenStreetMap
- **Backend:** Supabase (optional, läuft auch im Offline-Demo-Modus)

## Dokumentation

Ausführliche Dokumentation im [Wiki](https://github.com/luca4protection/rentaroom-daily/wiki):

- [Features](https://github.com/luca4protection/rentaroom-daily/wiki/Features)
- [Architektur](https://github.com/luca4protection/rentaroom-daily/wiki/Architektur)
- [Docker Setup](https://github.com/luca4protection/rentaroom-daily/wiki/Docker-Setup)
- [API & Datenbank](https://github.com/luca4protection/rentaroom-daily/wiki/API-Datenbank)

## Lizenz

Proprietär - Alle Rechte vorbehalten.
