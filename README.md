# Spacefinder

Eine moderne Plattform zur tageweisen Vermietung von Gewerbeflächen. Finden und buchen Sie Büros, Lager, Pop-up Stores, Event-Locations und mehr – flexibel und unkompliziert.

![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)
![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-Self--Hosted-3FCF8E?logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwindcss)

---

## Inhaltsverzeichnis

- [Features](#features)
- [Technologie-Stack](#technologie-stack)
- [Schnellstart](#schnellstart)
  - [Voraussetzungen](#voraussetzungen)
  - [Lokale Entwicklung (ohne Docker)](#lokale-entwicklung-ohne-docker)
  - [Vollständiges Setup mit Docker](#vollständiges-setup-mit-docker)
- [Projektstruktur](#projektstruktur)
- [Umgebungsvariablen](#umgebungsvariablen)
- [Architektur](#architektur)
- [Verfügbare Scripts](#verfügbare-scripts)
- [Benutzerrollen](#benutzerrollen)
- [API & Datenbank](#api--datenbank)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Lizenz](#lizenz)

---

## Features

### Für Mieter
- **Flächensuche** mit interaktiver Kartenansicht (Leaflet/OpenStreetMap)
- **Filter** nach Stadt, Kategorie, Preis, Größe und Ausstattung
- **Verschiedene Ansichten**: Split-View, Listenansicht, Vollbild-Karte
- **Buchungsanfragen** mit Nachrichtenfunktion
- **Dashboard** zur Verwaltung aktiver Buchungen

### Für Vermieter
- **Flächen inserieren** mit Bildern, Beschreibung und Ausstattungsmerkmalen
- **Buchungsmanagement** (Anfragen annehmen/ablehnen)
- **Verfügbarkeitskalender**
- **Einnahmenübersicht**

### Für Administratoren
- **Leerstandsmeldungen** prüfen und verwalten
- **Nutzerverwaltung**
- **Plattform-Statistiken**

### Allgemein
- **Authentifizierung** via Supabase (E-Mail/Passwort)
- **Responsive Design** für Desktop und Mobile
- **Vertragsmanagement** mit PDF-Generierung
- **Check-in/Check-out** mit Fotodokumentation
- **Schadensberichte** mit Kautionsabwicklung
- **Benachrichtigungssystem**

---

## Technologie-Stack

| Bereich | Technologie |
|---------|-------------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, shadcn/ui, Radix UI |
| **State Management** | TanStack Query (React Query) |
| **Routing** | React Router v6 |
| **Karten** | Leaflet, OpenStreetMap |
| **Animationen** | Framer Motion |
| **Backend** | Supabase (Self-Hosted) |
| **Datenbank** | PostgreSQL 15 |
| **Auth** | Supabase GoTrue |
| **API** | PostgREST (Auto-generierte REST API) |
| **Realtime** | Supabase Realtime (WebSockets) |
| **Storage** | Supabase Storage + ImgProxy |
| **API Gateway** | Kong |
| **Container** | Docker, Docker Compose |

---

## Schnellstart

### Voraussetzungen

- **Node.js** 20+ und npm
- **Docker** 20.10+ und Docker Compose v2 (für Backend)
- **Git**

### Lokale Entwicklung (ohne Docker)

Für schnelle Frontend-Entwicklung mit Mock-Daten:

```bash
# 1. Repository klonen
git clone https://github.com/luca4protection/rentaroom-daily.git
cd rentaroom-daily

# 2. Abhängigkeiten installieren
npm install

# 3. Entwicklungsserver starten
npm run dev
```

Die Anwendung läuft unter **http://localhost:5173** mit Mock-Daten.

### Vollständiges Setup mit Docker

Für das vollständige Backend mit Supabase:

```bash
# 1. Repository klonen
git clone https://github.com/luca4protection/rentaroom-daily.git
cd rentaroom-daily

# 2. Umgebungsvariablen konfigurieren
cp .env.example .env

# 3. Abhängigkeiten installieren (für Docker-Build benötigt)
npm install

# 4. Docker-Images bauen
docker compose build app

# 5. Alle Services starten
docker compose up -d

# 6. Status prüfen
docker compose ps
```

#### Verfügbare Endpunkte

| Service | URL | Beschreibung |
|---------|-----|--------------|
| **Frontend** | http://localhost:3002 | Spacefinder Web-App |
| **API Gateway** | http://localhost:8000 | Supabase REST API |
| **Supabase Studio** | http://localhost:3001 | Datenbank-Admin-UI |
| **Inbucket** | http://localhost:9000 | E-Mail-Testing |
| **PostgreSQL** | localhost:5432 | Datenbank (direkt) |

#### Services stoppen

```bash
# Services beenden
docker compose down

# Services beenden und Volumes löschen (Neustart)
docker compose down -v
```

---

## Projektstruktur

```
spacefinder/
├── src/
│   ├── components/           # React-Komponenten
│   │   ├── layout/           # Header, Footer
│   │   ├── spaces/           # Space-Cards, Filter, Karte
│   │   └── ui/               # shadcn/ui Komponenten
│   ├── pages/                # Seiten-Komponenten
│   │   ├── dashboard/        # Tenant, Landlord, Admin Dashboards
│   │   └── legal/            # Impressum, Datenschutz, AGB
│   ├── lib/                  # Utilities und Services
│   │   ├── api.ts            # API-Funktionen
│   │   ├── supabase.ts       # Supabase-Client
│   │   └── services/         # Payment-Service, etc.
│   ├── hooks/                # Custom React Hooks
│   ├── types/                # TypeScript-Typdefinitionen
│   ├── data/                 # Mock-Daten
│   ├── App.tsx               # Haupt-App mit Routing
│   └── main.tsx              # Entry Point
├── supabase/
│   ├── init/                 # SQL-Initialisierungsskripte
│   │   ├── 00-initial-schema.sql
│   │   ├── 01-schema-data.sql
│   │   └── 02-extended-schema.sql
│   ├── functions/            # Supabase Edge Functions
│   └── kong.yml              # API Gateway Konfiguration
├── public/                   # Statische Assets
├── docker-compose.yml        # Docker-Konfiguration
├── Dockerfile                # Frontend-Build
├── nginx.conf                # Nginx-Konfiguration
├── vite.config.ts            # Vite-Konfiguration
├── tailwind.config.ts        # Tailwind-Konfiguration
└── package.json
```

---

## Umgebungsvariablen

Erstelle eine `.env`-Datei basierend auf `.env.example`:

```env
# Datenbank
POSTGRES_PASSWORD=your-super-secret-password

# JWT (mindestens 32 Zeichen)
JWT_SECRET=your-super-secret-jwt-token-with-at-least-32-characters

# Supabase Keys
ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

# Realtime
SECRET_KEY_BASE=UpNVntn3cDxHJpq99YMc1T1AQgQpc8kfYTuRgBiYa15BLrx8etQoXz3gZv1/u2oq

# Frontend (Vite)
VITE_SUPABASE_URL=http://localhost:8000
VITE_SUPABASE_ANON_KEY=${ANON_KEY}
```

> **Wichtig:** Die Beispiel-Keys in `.env.example` sind nur für lokale Entwicklung geeignet. Für Production müssen sichere Keys generiert werden.

---

## Architektur

```
┌──────────────────────────────────────────────────────────────────┐
│                           Browser                                 │
└──────────────────────────────┬───────────────────────────────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
          ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   Frontend      │  │  Kong Gateway   │  │ Supabase Studio │
│ (React + Vite)  │  │   (Port 8000)   │  │   (Port 3001)   │
│   Port 3002     │  └────────┬────────┘  └────────┬────────┘
└─────────────────┘           │                    │
                              │                    │
          ┌───────────────────┼────────────────────┤
          │                   │                    │
          ▼                   ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   PostgREST     │  │    GoTrue       │  │    Realtime     │
│   (REST API)    │  │ (Auth Service)  │  │   (WebSocket)   │
└────────┬────────┘  └────────┬────────┘  └────────┬────────┘
         │                    │                    │
         └────────────────────┼────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │   (Port 5432)   │
                    └─────────────────┘
```

---

## Verfügbare Scripts

| Befehl | Beschreibung |
|--------|--------------|
| `npm run dev` | Startet den Vite-Entwicklungsserver (Port 5173) |
| `npm run build` | Erstellt einen Production-Build in `dist/` |
| `npm run build:dev` | Erstellt einen Development-Build |
| `npm run preview` | Startet einen lokalen Server für den Build |
| `npm run lint` | Führt ESLint aus |

---

## Benutzerrollen

| Rolle | Beschreibung | Dashboard |
|-------|--------------|-----------|
| **Tenant** (Mieter) | Kann Flächen suchen und buchen | `/dashboard/tenant` |
| **Landlord** (Vermieter) | Kann Flächen anbieten und verwalten | `/dashboard/landlord` |
| **Admin** | Vollzugriff, Leerstandsprüfung | `/dashboard/admin` |

### Demo-Benutzer (automatisch angelegt)

| E-Mail | Rolle |
|--------|-------|
| max@example.com | Tenant |
| anna@example.com | Landlord |
| thomas@example.com | Landlord |
| sophie@example.com | Landlord |
| admin@spaceshare.de | Admin |

---

## API & Datenbank

### Haupttabellen

| Tabelle | Beschreibung |
|---------|--------------|
| `users` | Benutzerprofile |
| `spaces` | Gewerbeflächen |
| `bookings` | Buchungen |

### Kategorien

- `office` – Büroflächen
- `warehouse` – Lagerhallen
- `popup` – Pop-up Stores
- `event` – Event-Locations
- `retail` – Einzelhandelsflächen
- `studio` – Fotostudios

### Ausstattungsmerkmale

`wifi`, `electricity`, `water`, `parking`, `heating`, `ac`, `security`, `accessible`

---

## Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Docker Production

Siehe [PRODUCTION.md](PRODUCTION.md) für detaillierte Anweisungen zur Produktionsbereitstellung.

**Quick Reference:**
```bash
# Build und Start
docker compose build app
docker compose up -d

# Logs prüfen
docker compose logs -f

# Rebuild nach Änderungen
docker compose build app --no-cache
docker compose restart app
```

---

## Troubleshooting

### Ports bereits belegt

```bash
# Windows: Ports prüfen
netstat -ano | findstr "3002 8000 3001 5432 9000"

# Linux/Mac: Ports prüfen
netstat -tuln | grep -E '3002|8000|3001|5432|9000'
```

### Datenbank-Fehler beim ersten Start

```bash
# Volumes löschen und neu starten
docker compose down -v
docker compose up -d
```

### npm install schlägt im Docker fehl

```bash
# Lokal installieren, dann bauen
npm install
docker compose build app --no-cache
```

### Services zeigen "unhealthy" Status

Dies ist oft ein bekanntes Docker-Health-Check-Problem. Testen Sie die URLs direkt:
- http://localhost:3002 (Frontend)
- http://localhost:8000 (API)
- http://localhost:3001 (Studio)

### Frontend zeigt "Lade Flächen..."

Im Offline-Modus (ohne Supabase) werden automatisch Mock-Daten verwendet. Mit Docker sollten echte Daten aus der Datenbank geladen werden.

---

## Weiterführende Dokumentation

- [DOCKER_SETUP.md](DOCKER_SETUP.md) – Detaillierte Docker-Anleitung
- [PRODUCTION.md](PRODUCTION.md) – Produktionsbereitstellung für 50+ Nutzer
- [RISKS_AND_EDGE_CASES.md](RISKS_AND_EDGE_CASES.md) – Bekannte Risiken und Grenzfälle

---

## Lizenz

Dieses Projekt ist proprietär. Alle Rechte vorbehalten.

---

Entwickelt mit React, Supabase und viel Kaffee.
