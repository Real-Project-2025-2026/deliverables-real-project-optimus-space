# Spacefinder

A Vite + React application for listing and discovering commercial spaces for daily rental. The UI is built with TypeScript, Tailwind CSS, and shadcn components, while Supabase (self-hosted via Docker) powers authentication, storage, and database access.

## Stack
- React 18 + Vite + TypeScript
- Tailwind CSS with shadcn/ui
- Supabase (Postgres, GoTrue, Realtime, Storage)
- Docker & Docker Compose for the full local stack

## Prerequisites
- Node.js 20+ and npm
- Docker 20.10+ with Compose v2
- Copy `.env.example` to `.env` and adjust secrets if needed (default values cover local use).

## Local Development
```sh
npm install
npm run dev
```
The dev server runs on `http://localhost:5173` and uses the env vars from `.env` via Vite.

## Production Build
```sh
npm run build
npm run preview
```
`npm run build` creates the production bundle under `dist/`; `npm run preview` serves it locally for smoke tests.

## Docker Workflow
For a full Supabase-backed stack (frontend, API gateway, Postgres, auth, storage, studio, etc.) follow `DOCKER_SETUP.md`.

Quick reference:
```sh
cp .env.example .env
# build static frontend image
docker compose build app
# start every service (app + Supabase services)
docker compose up -d
# view status / logs
docker compose ps
docker compose logs -f
```
The frontend is available on `http://localhost:3002`, Kong API gateway on `http://localhost:8000`, and Supabase Studio on `http://localhost:3001` once containers are running.

## Environment Variables
Key variables consumed by the stack:
- `VITE_SUPABASE_URL` – Base URL for Supabase (defaults to the local Kong gateway).
- `VITE_SUPABASE_ANON_KEY` – Supabase anon key exposed to the frontend.
- `POSTGRES_PASSWORD`, `JWT_SECRET`, `ANON_KEY`, `SERVICE_ROLE_KEY`, `SECRET_KEY_BASE` – backend secrets used by Compose services.

Never deploy with the sample keys from `.env.example`; regenerate secure values before hosting publicly.

## Troubleshooting
- Ensure Docker ports `3002`, `8000`, `3001`, `5432`, and `9000` are free.
- If the database container fails on first boot, remove volumes with `docker compose down -v` and start again so the init scripts can run cleanly.
- Use `docker compose logs <service>` for detailed diagnostics of individual services.
- Some services may show as "unhealthy" in Docker but still function correctly - test by accessing the URLs directly.
