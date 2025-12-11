# Production Deployment Guide für Spacefinder

Dieses Dokument beschreibt, wie Spacefinder für 50+ gleichzeitige Nutzer auf Desktop und Mobilgeräten deployed werden kann.

## Aktuelle Architektur

Die Anwendung besteht aus:
- **Frontend**: React + Vite, serviert via Nginx
- **Backend**: Supabase (selbst-gehostet)
  - PostgreSQL Datenbank
  - GoTrue (Authentication)
  - PostgREST (REST API)
  - Realtime (WebSocket)
  - Storage (File Storage)
  - Kong (API Gateway)

## Performance-Anforderungen für 50 Nutzer

### ✅ Was die aktuelle Setup KANN:
- **50 gleichzeitige Nutzer** sind für die aktuelle Architektur **machbar**
- PostgreSQL kann 100-200 simultane Verbindungen handhaben
- Nginx ist für tausende Requests optimiert
- Supabase ist produktionsreif

### ⚠️ Was optimiert werden MUSS:

## 1. Database Connection Pooling

PostgreSQL braucht Connection Pooling für viele gleichzeitige Verbindungen:

```yaml
# In docker-compose.prod.yml
db:
  command: >
    postgres
    -c max_connections=200
    -c shared_buffers=256MB
    -c effective_cache_size=1GB
    -c maintenance_work_mem=64MB
    -c checkpoint_completion_target=0.9
    -c wal_buffers=16MB
    -c default_statistics_target=100
```

## 2. Resource Limits

Aktuell keine Resource Limits gesetzt. Für Production:

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M

  db:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

## 3. Frontend Optimierung

### Aktueller Bundle: 720 KB (213 KB gzipped)
Das ist für 50 Nutzer OK, aber kann optimiert werden:

1. **Code Splitting** implementieren:
```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/*'],
          'supabase': ['@supabase/supabase-js'],
        }
      }
    }
  }
})
```

2. **Image Optimization**: ImgProxy ist bereits konfiguriert ✅

3. **Lazy Loading** für Routes implementieren

## 4. Caching-Strategie

### Nginx Caching
```nginx
# nginx.conf optimiert für Production
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Browser Caching
Bereits in index.html via Meta-Tags ✅

## 5. HTTPS/SSL

**WICHTIG**: Production MUSS HTTPS haben!

### Option A: Reverse Proxy (Empfohlen)
```yaml
services:
  traefik:
    image: traefik:v2.11
    command:
      - "--providers.docker=true"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.httpchallenge=true"
      - "--certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web"
      - "--certificatesresolvers.letsencrypt.acme.email=admin@spacefinder.de"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock:ro"
      - "./letsencrypt:/letsencrypt"
```

### Option B: Cloudflare (Einfachste Lösung)
- Domain zu Cloudflare hinzufügen
- SSL/TLS auf "Full" setzen
- Automatisches HTTPS ✅

## 6. Mobile Optimierung

### Bereits implementiert ✅
- Responsive Design mit Tailwind
- Mobile-First Ansatz
- Touch-optimierte UI-Komponenten
- Viewport Meta-Tag korrekt gesetzt

### Zusätzlich empfohlen:
```html
<!-- index.html -->
<meta name="theme-color" content="#4F46E5">
<link rel="manifest" href="/manifest.json">
<link rel="apple-touch-icon" href="/icon-192.png">
```

## 7. Monitoring & Logging

### Empfohlene Tools:
```yaml
services:
  # Prometheus für Metriken
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus

  # Grafana für Dashboards
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3030:3000"
    volumes:
      - grafana_data:/var/lib/grafana
```

## 8. Backup-Strategie

**KRITISCH**: Regelmäßige Backups der Datenbank!

```bash
#!/bin/bash
# backup.sh
docker exec spacefinder-db pg_dump -U postgres postgres > "backup_$(date +%Y%m%d_%H%M%S).sql"
# Upload zu S3/Cloud Storage
```

Automatisierung via Cron:
```cron
0 2 * * * /path/to/backup.sh
```

## 9. Skalierungs-Optionen

### Für > 100 Nutzer:
1. **Horizontal Scaling des Frontends**:
```yaml
app:
  deploy:
    replicas: 3

# + Load Balancer (Traefik/Nginx)
```

2. **Managed Supabase** statt Self-Hosting
   - Automatische Skalierung
   - Managed Backups
   - CDN included
   - Ab €25/Monat

3. **CDN für Static Assets**
   - Cloudflare (kostenlos)
   - AWS CloudFront
   - Vercel Edge Network

### Für > 500 Nutzer:
- Read Replicas für PostgreSQL
- Redis Caching Layer
- Separate Storage Service (S3/R2)
- Message Queue (RabbitMQ/Redis)

## 10. Deployment-Checklist

### Vor dem Go-Live:
- [ ] HTTPS aktiviert (Let's Encrypt oder Cloudflare)
- [ ] Domain konfiguriert (DNS A/CNAME Records)
- [ ] Environment Variables in .env gesichert
- [ ] Backup-Strategie implementiert
- [ ] Monitoring aufgesetzt (Uptime Robot/Pingdom minimum)
- [ ] Error Tracking (Sentry empfohlen)
- [ ] Rate Limiting in Kong aktiviert
- [ ] CORS richtig konfiguriert
- [ ] Security Headers gesetzt
- [ ] Performance Tests durchgeführt (k6/Artillery)

### Nach dem Go-Live:
- [ ] Monitoring Dashboard täglich prüfen
- [ ] Logs regelmäßig analysieren
- [ ] Backups testen (Recovery-Test!)
- [ ] Performance Metrics tracken
- [ ] User Feedback sammeln

## Empfohlener Deployment-Host

### Für 50 Nutzer:
**Hetzner Cloud** (Cost-effective für Europa):
- CX31 Server (2 vCPU, 8GB RAM): ~€10/Monat
- Ausreichend für 50-100 gleichzeitige Nutzer
- NVMe SSD für schnelle DB-Performance

**Alternative**:
- DigitalOcean Droplet ($24/Monat)
- AWS Lightsail ($20/Monat)
- Render.com (Managed, ab $25/Monat)

### Managed Alternative:
**Vercel (Frontend) + Supabase Cloud (Backend)**:
- Einfachstes Setup
- Automatische Skalierung
- ~€50/Monat für 50 Nutzer
- Zero DevOps

## Performance-Ziele

Für optimale User Experience bei 50 Nutzern:

| Metrik | Ziel | Kritisch |
|--------|------|----------|
| First Contentful Paint | < 1.5s | < 3s |
| Time to Interactive | < 3s | < 5s |
| API Response Time (p95) | < 200ms | < 500ms |
| Database Query Time | < 50ms | < 200ms |
| Uptime | > 99.5% | > 99% |

## Kosten-Schätzung (50 Nutzer)

### Self-Hosted (Hetzner):
- Server: €10/Monat
- Domain: €1/Monat
- Backups: €3/Monat
- **Total: ~€15/Monat**

### Managed (Vercel + Supabase):
- Vercel Pro: $20/Monat
- Supabase Pro: $25/Monat
- **Total: ~€42/Monat**

## Fazit

✅ **Die aktuelle Architektur ist grundsätzlich bereit für 50 Nutzer**

🔧 **Aber folgendes MUSS vor Production gemacht werden:**
1. HTTPS/SSL aktivieren (KRITISCH)
2. Backups einrichten (KRITISCH)
3. Resource Limits setzen
4. Monitoring aufsetzen
5. Performance-Tests durchführen

⚡ **Nice-to-have für optimale Performance:**
- CDN für Static Assets
- Code Splitting
- Redis Caching
- Rate Limiting

📈 **Skalierung > 100 Nutzer:**
- Horizontal Scaling (Load Balancer + Multi-Instance)
- Oder: Migration zu Managed Services (Vercel + Supabase Cloud)
