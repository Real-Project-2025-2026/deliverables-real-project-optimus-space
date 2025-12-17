# Troubleshooting

## Häufige Probleme

### Ports bereits belegt

```bash
# Windows
netstat -ano | findstr "8080 8000 3001 5432"

# Linux/Mac
netstat -tuln | grep -E '8080|8000|3001|5432'
```

### Docker startet nicht

```bash
# Prüfen ob Docker läuft
docker ps

# Docker Desktop starten (Windows/Mac)
# Oder: systemctl start docker (Linux)
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

### Frontend zeigt keine Daten

Im Offline-Modus werden Mock-Daten verwendet. Prüfen:

1. Browser-Konsole auf Fehler prüfen (F12)
2. localStorage löschen für Neustart:
   - F12 → Application → Local Storage → Clear

### Bilder werden nicht angezeigt

- Bilder müssen in `src/assets/` liegen
- Oder als Base64 im localStorage gespeichert sein

### Buchungen verschwinden

Buchungen werden im localStorage gespeichert. Bei Browser-Bereinigung gehen sie verloren.

## Logs prüfen

```bash
# Alle Docker-Logs
docker compose logs -f

# Nur Frontend
docker compose logs -f app

# Nur Datenbank
docker compose logs -f db
```

## Neustart

```bash
# Sanfter Neustart
docker compose restart

# Kompletter Neustart
docker compose down
docker compose up -d

# Kompletter Neustart mit Neubau
docker compose down
docker compose build --no-cache
docker compose up -d
```

## Support

Bei weiteren Problemen: Issue auf GitHub erstellen.
