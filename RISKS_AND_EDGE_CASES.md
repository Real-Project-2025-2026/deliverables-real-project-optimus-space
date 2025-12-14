# Risiken & Edge-Cases - Spacefinder MVP

## Übersicht

Dieses Dokument beschreibt bekannte Risiken, Edge-Cases und deren Mitigationsstrategien für die Spacefinder-Plattform.

---

## 1. Doppelbuchungen (Double Booking)

### Risiko
Zwei Mieter könnten gleichzeitig denselben Zeitraum für dieselbe Fläche buchen.

### Aktuelle Mitigation
- **Database Constraint**: `check_booking_availability()` Funktion prüft Überlappungen
- **Unique Index**: Verhindert überlappende `confirmed` Buchungen auf DB-Ebene

```sql
CREATE OR REPLACE FUNCTION check_booking_availability(
  p_space_id UUID,
  p_start_date DATE,
  p_end_date DATE,
  p_exclude_booking_id UUID DEFAULT NULL
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM bookings
    WHERE space_id = p_space_id
      AND status IN ('confirmed', 'pending')
      AND (p_exclude_booking_id IS NULL OR id != p_exclude_booking_id)
      AND start_date < p_end_date
      AND end_date > p_start_date
  );
END;
$$ LANGUAGE plpgsql;
```

### Verbleibende Risiken
| Risiko | Schwere | Wahrscheinlichkeit | Mitigation |
|--------|---------|-------------------|------------|
| Race Condition bei gleichzeitiger Buchung | Mittel | Niedrig | FOR UPDATE SKIP LOCKED bei Booking-Erstellung |
| Pending Bookings blockieren Zeitraum | Niedrig | Mittel | Timeout für Pending-Status (z.B. 15 Min) |

### Empfehlungen für Produktion
1. **Pessimistic Locking**: `SELECT ... FOR UPDATE` bei Verfügbarkeitsprüfung
2. **Transaktions-Isolation**: `SERIALIZABLE` für kritische Buchungstransaktionen
3. **Booking Timeout**: Cronjob der `pending` Buchungen nach 15 Min verfallen lässt

---

## 2. Zeitraum-Validierung

### Risiko
Ungültige Buchungszeiträume könnten zu fehlerhaften Berechnungen oder Vertragsfehlern führen.

### Aktuelle Mitigation
- **Frontend-Validierung**: Min/Max Rental Days Check im BookingService
- **Backend-Validierung**: CHECK Constraint `end_date > start_date`

### Edge-Cases

| Edge-Case | Status | Handling |
|-----------|--------|----------|
| `start_date` in der Vergangenheit | ⚠️ Teilweise | Frontend verhindert, DB erlaubt |
| `end_date` vor `start_date` | ✅ Abgedeckt | DB CHECK Constraint |
| Buchung kürzer als `min_rental_days` | ⚠️ Frontend-only | bookingService.calculateTotal() prüft |
| Buchung länger als `max_rental_days` | ⚠️ Frontend-only | bookingService.calculateTotal() prüft |
| Buchung über Verfügbarkeitslücken | ⚠️ Nicht geprüft | space_availability wird nicht abgeglichen |
| Zeitzonen-Probleme | ❌ Nicht behandelt | Alle Zeiten als lokale Daten behandelt |

### Empfehlungen für Produktion
1. **DB-Level Constraints** für min/max_rental_days
2. **Trigger** für Verfügbarkeitsabgleich mit space_availability
3. **UTC-Normalisierung** für alle Datumswerte

---

## 3. Dummy-Payment Fehlerszenarien

### Risiko
Das simulierte Payment-System deckt nicht alle Fehlerfälle ab, die in Produktion auftreten können.

### Aktuelle Implementierung
```typescript
class DummyPaymentProvider implements PaymentProvider {
  private readonly DELAY_MS = 1500;
  private readonly SUCCESS_RATE = 0.95; // 95% Erfolgsrate
}
```

### Simulierte Szenarien
| Szenario | Simuliert | Produktions-Relevanz |
|----------|-----------|---------------------|
| Erfolgreiche Zahlung | ✅ | Hoch |
| Fehlgeschlagene Zahlung (5%) | ✅ | Hoch |
| Netzwerk-Timeout | ❌ | Hoch |
| Payment Provider Down | ❌ | Mittel |
| Doppelte Payment Intents | ❌ | Mittel |
| Teilweise Refunds | ❌ | Mittel |
| Währungsumrechnung | ❌ | Niedrig (nur EUR) |
| 3D Secure / SCA | ❌ | Hoch (EU-Pflicht) |

### Payment Status Flow
```
created → processing → succeeded/failed
                    ↓
              refunded (partial/full)
```

### Verbleibende Risiken
| Risiko | Auswirkung | Mitigation |
|--------|------------|------------|
| Buchung bestätigt, Payment fehlgeschlagen | Hoch | Transaktionale Verknüpfung Booking ↔ Payment |
| Doppelte Zahlungen | Hoch | Idempotency Keys implementieren |
| Deposit-Freigabe ohne Checkout | Mittel | Admin-Override nur nach Review |

### Empfehlungen für Produktion
1. **Idempotency Keys** für alle Payment-Requests
2. **Webhook-Handler** für asynchrone Payment-Events
3. **Reconciliation Job** für Payment/Booking-Abgleich
4. **Stripe/PayPal Integration** mit korrektem Error-Handling

---

## 4. Address-Duplikate bei Vacancy Reports

### Risiko
Dieselbe Leerstandsadresse könnte mehrfach gemeldet werden, was zu doppelter Prämienausschüttung führt.

### Aktuelle Mitigation
```sql
CREATE UNIQUE INDEX idx_vacancy_reports_unique_address
ON vacancy_reports (
  LOWER(TRIM(street_address)),
  LOWER(TRIM(city)),
  zip_code,
  LOWER(TRIM(country))
) WHERE status != 'rejected';
```

### Edge-Cases

| Edge-Case | Handling | Status |
|-----------|----------|--------|
| "Hauptstr. 1" vs "Hauptstraße 1" | ❌ Nicht erkannt | Verschiedene Einträge |
| "1. OG" vs "1.OG" vs "Erdgeschoss" | ❌ Nicht erkannt | Verschiedene Einträge |
| Tippfehler "Berlni" vs "Berlin" | ❌ Nicht erkannt | Verschiedene Einträge |
| Case-Sensitivity | ✅ Abgedeckt | LOWER() |
| Whitespace | ✅ Abgedeckt | TRIM() |
| Rejected dann Re-Submit | ✅ Abgedeckt | WHERE status != 'rejected' |

### Empfehlungen für Produktion
1. **Address Normalization API** (z.B. Google Maps, Nominatim)
2. **Fuzzy Matching** mit Levenshtein-Distanz
3. **Geocoding** und Proximity-Check (z.B. 50m Radius)
4. **Manual Review Queue** für ähnliche Adressen

---

## 5. Sicherheit bei öffentlichen Formularen

### Risiko
Das "Leerstand melden" Formular ist ohne Authentifizierung zugänglich und könnte missbraucht werden.

### Aktuelle Mitigation
- **RLS Policy**: `INSERT` erlaubt für alle, `SELECT/UPDATE/DELETE` nur für Admins
- **Required Fields**: Alle Pflichtfelder werden validiert
- **Terms Acceptance**: Checkbox für Nutzungsbedingungen

### Angriffsvektoren

| Vektor | Risiko | Status | Mitigation |
|--------|--------|--------|------------|
| Spam-Submissions | Hoch | ⚠️ Offen | Rate Limiting, CAPTCHA |
| XSS in Text-Feldern | Mittel | ✅ React | JSX escaped automatisch |
| SQL Injection | Niedrig | ✅ Supabase | Prepared Statements |
| File Upload Attacks | Mittel | ⚠️ Teilweise | Nur Bilder, aber kein Virus-Scan |
| DoS via große Bilder | Mittel | ⚠️ Teilweise | Supabase Storage Limits |
| Fake Reporter Info | Niedrig | ❌ Offen | Keine Email-Verifizierung |
| Prämien-Betrug | Hoch | ⚠️ Teilweise | Admin-Review vor Auszahlung |

### Empfehlungen für Produktion
1. **Rate Limiting**: Max 5 Reports pro IP/Stunde
2. **CAPTCHA**: reCAPTCHA v3 oder hCaptcha
3. **Email-Verifizierung**: OTP vor Submission
4. **File Validation**: Magic Bytes Check, Max Size, Virus Scan
5. **IP Logging**: Für Abuse-Tracking
6. **Honeypot Fields**: Unsichtbare Felder für Bot-Detection

---

## 6. Weitere Edge-Cases

### 6.1 Vertragsgenierung

| Edge-Case | Risiko | Status |
|-----------|--------|--------|
| PDF-Generierung fehlgeschlagen | Mittel | ⚠️ Keine Retry-Logik |
| Vertrag ohne gültige Buchung | Niedrig | ✅ FK Constraint |
| Fehlende Landlord/Tenant Daten | Mittel | ⚠️ Nullable in Template |

### 6.2 Check-in/Check-out

| Edge-Case | Risiko | Status |
|-----------|--------|--------|
| Check-in vor Buchungsstart | Niedrig | ⚠️ Keine Validierung |
| Check-out nach Buchungsende | Mittel | ⚠️ Keine Validierung |
| Fehlende Check-in Fotos bei Checkout | Mittel | ⚠️ Kein Vergleichs-Workflow |
| Schadensmeldung ohne Fotos | Niedrig | ✅ Erlaubt, Text-only möglich |

### 6.3 Rollen & Berechtigungen

| Edge-Case | Risiko | Status |
|-----------|--------|--------|
| User ändert eigene Rolle | Hoch | ✅ RLS verhindert |
| Landlord greift auf fremde Spaces zu | Hoch | ✅ RLS: owner_id = auth.uid() |
| Tenant sieht fremde Buchungen | Hoch | ✅ RLS: tenant_id = auth.uid() |
| Admin ohne admin-Rolle | Hoch | ⚠️ Frontend-Check, RLS permissiv |

### 6.4 Deposit-Handling

| Edge-Case | Risiko | Status |
|-----------|--------|--------|
| Deposit freigegeben vor Checkout | Mittel | ⚠️ Nur Admin-Review |
| Teilweise Deposit-Einbehaltung | Mittel | ❌ Nicht implementiert |
| Deposit-Streitfall | Hoch | ❌ Kein Dispute-Workflow |

---

## 7. Priorisierte Maßnahmen für MVP → Produktion

### Kritisch (vor Go-Live)
1. ❗ Rate Limiting für öffentliche Endpunkte
2. ❗ CAPTCHA für Vacancy Reports
3. ❗ Pessimistic Locking für Buchungen
4. ❗ Admin-Rolle RLS Hardening

### Hoch (Phase 1)
1. Payment Provider Integration (Stripe)
2. Email-Verifizierung für Reporter
3. Address Normalization
4. Booking Timeout für Pending-Status

### Mittel (Phase 2)
1. Geocoding für Vacancy Reports
2. Check-in/Check-out Zeitvalidierung
3. Partial Refunds
4. Dispute Resolution Workflow

### Niedrig (Backlog)
1. Fuzzy Address Matching
2. Timezone Handling
3. Multi-Currency Support
4. Audit Logging

---

## 8. Monitoring & Alerting Empfehlungen

```yaml
Alerts:
  - name: "High Failed Payment Rate"
    condition: failed_payments / total_payments > 0.1
    severity: critical

  - name: "Duplicate Booking Attempt"
    condition: constraint_violation.booking_overlap > 0
    severity: warning

  - name: "Vacancy Report Spam"
    condition: vacancy_reports.per_ip.per_hour > 3
    severity: warning

  - name: "Contract Generation Failed"
    condition: contract.status = 'draft' AND age > 1h
    severity: medium
```

---

## Änderungshistorie

| Datum | Version | Änderung |
|-------|---------|----------|
| 2025-12-11 | 1.0 | Initiale Dokumentation |

