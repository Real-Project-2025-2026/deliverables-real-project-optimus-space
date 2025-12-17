# Benutzerrollen

## Übersicht

| Rolle | Beschreibung | Dashboard |
|-------|--------------|-----------|
| **Tenant** (Mieter) | Kann Flächen suchen und buchen | `/dashboard/tenant` |
| **Landlord** (Vermieter) | Kann Flächen anbieten und verwalten | `/dashboard/landlord` |
| **Admin** | Vollzugriff, Plattformverwaltung | `/dashboard/admin` |

## Mieter (Tenant)

### Funktionen
- Flächen durchsuchen und filtern
- Buchungsanfragen stellen
- Buchungen verwalten und stornieren
- Check-in/Check-out Fotos hochladen
- Zahlungen durchführen

### Dashboard
- Aktive Buchungen
- Buchungshistorie
- Ausstehende Zahlungen

## Vermieter (Landlord)

### Funktionen
- Flächen erstellen und bearbeiten
- Bilder hochladen
- Buchungsanfragen annehmen/ablehnen
- Verfügbarkeit verwalten
- Einnahmen einsehen

### Dashboard
- Eigene Flächen
- Eingehende Buchungsanfragen
- Aktive Vermietungen
- Einnahmenübersicht

## Administrator

### Funktionen
- Alle Flächen und Buchungen einsehen
- Leerstandsmeldungen prüfen
- Benutzer verwalten
- Plattform-Statistiken

### Dashboard
- Übersicht aller Aktivitäten
- Leerstandsmeldungen
- Systemstatistiken

## Registrierung

Bei der Registrierung wählt der Benutzer seine Rolle:

- **Als Mieter**: Direkte Registrierung
- **Als Vermieter**: Registrierung über `/landlords` Seite
