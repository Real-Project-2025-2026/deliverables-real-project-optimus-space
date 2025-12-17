# Docker Setup

## Voraussetzungen

- Docker 20.10+
- Docker Compose v2
- Node.js 20+ (für lokale Entwicklung)

## Lokaler Start (nur Frontend)

```bash
# Einfacher Start auf Port 8080
docker compose -f docker-compose.local.yml up -d
```

## Vollständiges Setup mit Supabase

### 1. Umgebungsvariablen

```bash
cp .env.example .env
```

Bearbeite `.env`:

```env
POSTGRES_PASSWORD=sicheres-passwort
JWT_SECRET=mindestens-32-zeichen-lang
ANON_KEY=dein-anon-key
SERVICE_ROLE_KEY=dein-service-key
```

### 2. Services starten

```bash
# Abhängigkeiten installieren
npm install

# Docker-Images bauen
docker compose build app

# Alle Services starten
docker compose up -d

# Status prüfen
docker compose ps
```

### 3. Verfügbare Services

| Service | URL | Beschreibung |
|---------|-----|--------------|
| Frontend | http://localhost:8080 | Web-App |
| API Gateway | http://localhost:8000 | REST API |
| Supabase Studio | http://localhost:3001 | Admin-UI |
| PostgreSQL | localhost:5432 | Datenbank |

## Befehle

```bash
# Logs anzeigen
docker compose logs -f

# Einzelnen Service neu starten
docker compose restart app

# Alles stoppen
docker compose down

# Alles stoppen + Daten löschen
docker compose down -v

# Neu bauen nach Änderungen
docker compose build app --no-cache
docker compose up -d
```

## Produktions-Deployment

Für Produktion verwende `docker-compose.prod.yml`:

```bash
docker compose -f docker-compose.prod.yml up -d
```

Diese Konfiguration enthält:
- Ressourcen-Limits
- Health-Checks
- Optimierte PostgreSQL-Einstellungen
- Rate-Limiting
