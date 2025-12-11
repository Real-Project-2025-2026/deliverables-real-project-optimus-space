-- Supabase Initial Schema Setup

-- Create roles
CREATE ROLE anon NOLOGIN NOINHERIT;
CREATE ROLE authenticated NOLOGIN NOINHERIT;
CREATE ROLE service_role NOLOGIN NOINHERIT BYPASSRLS;
CREATE ROLE authenticator NOINHERIT LOGIN PASSWORD 'your-super-secret-password';
CREATE ROLE supabase_auth_admin NOINHERIT CREATEROLE CREATEDB LOGIN PASSWORD 'your-super-secret-password';
CREATE ROLE supabase_storage_admin NOINHERIT CREATEROLE CREATEDB LOGIN PASSWORD 'your-super-secret-password';
CREATE ROLE supabase_admin NOINHERIT CREATEROLE CREATEDB LOGIN PASSWORD 'your-super-secret-password';

-- Grant roles
GRANT anon TO authenticator;
GRANT authenticated TO authenticator;
GRANT service_role TO authenticator;
GRANT supabase_auth_admin TO postgres;
GRANT supabase_storage_admin TO postgres;

-- Create schemas
CREATE SCHEMA IF NOT EXISTS auth AUTHORIZATION supabase_auth_admin;
CREATE SCHEMA IF NOT EXISTS storage AUTHORIZATION supabase_storage_admin;
CREATE SCHEMA IF NOT EXISTS extensions;
CREATE SCHEMA IF NOT EXISTS _realtime;

-- Grant schema access
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON SCHEMA public TO supabase_auth_admin, supabase_storage_admin, supabase_admin;
GRANT USAGE ON SCHEMA auth TO anon, authenticated, service_role, supabase_auth_admin;
GRANT USAGE ON SCHEMA storage TO anon, authenticated, service_role, supabase_storage_admin;
GRANT USAGE ON SCHEMA extensions TO anon, authenticated, service_role;

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Default privileges
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- Auth schema setup (minimal - GoTrue will create the rest)
ALTER SCHEMA auth OWNER TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin, postgres;
GRANT ALL ON ALL TABLES IN SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON ALL SEQUENCES IN SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA auth TO supabase_auth_admin;

-- Storage schema setup
ALTER SCHEMA storage OWNER TO supabase_storage_admin;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin, postgres;
GRANT ALL ON ALL TABLES IN SCHEMA storage TO supabase_storage_admin;
GRANT ALL ON ALL SEQUENCES IN SCHEMA storage TO supabase_storage_admin;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA storage TO supabase_storage_admin;

-- Grant superuser to storage admin for migrations
ALTER ROLE supabase_storage_admin WITH SUPERUSER;

-- Workaround for GoTrue migration bug (uuid = text comparison)
-- Mark the problematic migration as complete to skip it
INSERT INTO auth.schema_migrations (version) VALUES ('20221208132122') ON CONFLICT DO NOTHING;
