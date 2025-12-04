# Docker Setup Guide

This guide explains how to run the spacefindr application locally using Docker and Docker Compose.

## Prerequisites

- Docker (v20.10 or higher)
- Docker Compose (v2.0 or higher)
- 8GB+ RAM recommended
- Ports 3000, 8000, 3001, 5432, and 9000 available

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/luca4protection/rentaroom-daily.git
   cd rentaroom-daily
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```
   
   The `.env.example` file contains default Supabase demo keys that work for local development. You can use them as-is or generate your own keys.

3. **Build the application**
   ```bash
   docker compose build app
   ```

4. **Start all services**
   ```bash
   docker compose up -d
   ```

5. **Verify services are running**
   ```bash
   docker compose ps
   ```

## Accessing the Application

Once all services are running, you can access:

- **Main App**: http://localhost:3000
- **Supabase API Gateway**: http://localhost:8000
- **Supabase Studio** (Database Admin UI): http://localhost:3001
- **Inbucket** (Email Testing): http://localhost:9000

## Services Overview

The Docker Compose stack includes:

- **app**: React frontend (Vite) served via Nginx
- **db**: PostgreSQL database (Supabase Postgres)
- **kong**: API Gateway for Supabase services
- **auth**: GoTrue authentication service
- **rest**: PostgREST API
- **realtime**: Supabase Realtime for live updates
- **storage**: Supabase Storage for file uploads
- **meta**: Postgres metadata service for Studio
- **studio**: Supabase Studio admin interface
- **imgproxy**: Image transformation service
- **inbucket**: Email testing service

## Common Commands

### View logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f app
docker compose logs -f auth
```

### Stop services
```bash
docker compose down
```

### Stop services and remove volumes (clean slate)
```bash
docker compose down -v
```

### Restart a specific service
```bash
docker compose restart app
```

## Troubleshooting

### Services not starting
- Check if ports are already in use: `netstat -tuln | grep -E '3000|8000|3001|5432|9000'`
- Ensure you have enough disk space and memory
- Check logs: `docker compose logs`

### Database permission errors
The init script should automatically set up the necessary permissions. If you encounter issues:
1. Stop all services: `docker compose down -v`
2. Start again: `docker compose up -d`

### npm install fails in Docker
The Dockerfile includes a workaround for npm bugs in containers by copying `node_modules` from the host. If you encounter issues:
1. Install dependencies locally first: `npm install`
2. Rebuild the image: `docker compose build app --no-cache`

## Environment Variables

Key environment variables in `.env`:

- `POSTGRES_PASSWORD`: PostgreSQL password
- `JWT_SECRET`: Secret for JWT tokens (min 32 chars)
- `ANON_KEY`: Supabase anonymous key
- `SERVICE_ROLE_KEY`: Supabase service role key
- `SECRET_KEY_BASE`: Secret for realtime service

The default values in `.env.example` are Supabase demo keys suitable for local development only. **Never use these in production!**

## Development Workflow

1. Make changes to your code
2. Rebuild the app container: `docker compose build app`
3. Restart the app: `docker compose restart app`
4. View changes at http://localhost:3000

## Production Deployment

⚠️ **Important**: Before deploying to production:

1. Generate secure keys:
   ```bash
   # JWT Secret
   openssl rand -base64 32
   
   # Service keys - use Supabase CLI or online JWT generators
   ```

2. Update all secrets in `.env`
3. Use proper SSL/TLS certificates
4. Configure proper domain names
5. Set up backups for PostgreSQL volumes
6. Review security settings in `docker-compose.yml`

## Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ├─────► http://localhost:3000 (React App)
       │
       ├─────► http://localhost:8000 (Kong API Gateway)
       │               │
       │               ├─► PostgREST (REST API)
       │               ├─► GoTrue (Auth)
       │               ├─► Realtime
       │               └─► Storage
       │
       └─────► http://localhost:3001 (Supabase Studio)
                       │
                       └─► PostgreSQL
```

## Additional Resources

- [Supabase Self-Hosting Guide](https://supabase.com/docs/guides/self-hosting)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
