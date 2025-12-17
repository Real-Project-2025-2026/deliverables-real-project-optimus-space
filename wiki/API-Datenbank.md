# API & Datenbank

## Datenbank-Schema

### Haupttabellen

| Tabelle | Beschreibung |
|---------|--------------|
| `users` | Benutzerprofile |
| `spaces` | Gewerbeflächen |
| `bookings` | Buchungen |
| `space_availability` | Verfügbarkeitsperioden |
| `contracts` | Mietverträge |
| `checkin_photos` | Check-in Fotos |
| `checkout_photos` | Check-out Fotos |
| `damage_reports` | Schadensberichte |

### Spaces Schema

```sql
CREATE TABLE spaces (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  price_per_day DECIMAL NOT NULL,
  size INTEGER NOT NULL,
  category TEXT NOT NULL,
  amenities TEXT[],
  images TEXT[],
  owner_id UUID REFERENCES auth.users,
  owner_name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Bookings Schema

```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY,
  space_id UUID REFERENCES spaces,
  tenant_id UUID REFERENCES auth.users,
  landlord_id UUID REFERENCES auth.users,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_days INTEGER,
  total_price DECIMAL,
  status TEXT DEFAULT 'requested',
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

## API-Endpunkte

Die REST API wird automatisch von PostgREST generiert.

### Spaces

```
GET    /rest/v1/spaces              # Alle Flächen
GET    /rest/v1/spaces?id=eq.{id}   # Einzelne Fläche
POST   /rest/v1/spaces              # Neue Fläche
PATCH  /rest/v1/spaces?id=eq.{id}   # Fläche aktualisieren
DELETE /rest/v1/spaces?id=eq.{id}   # Fläche löschen
```

### Bookings

```
GET    /rest/v1/bookings                      # Alle Buchungen
GET    /rest/v1/bookings?tenant_id=eq.{id}    # Buchungen eines Mieters
POST   /rest/v1/bookings                      # Neue Buchung
PATCH  /rest/v1/bookings?id=eq.{id}           # Status ändern
```

## Offline-Modus

Im Demo-Modus (ohne Supabase) werden Daten in localStorage gespeichert:

| Key | Inhalt |
|-----|--------|
| `spacefindr_user_spaces` | Vom Benutzer erstellte Flächen |
| `spacefindr_user_bookings` | Buchungen |
| `spacefindr_space_images` | Hochgeladene Bilder (Base64) |
