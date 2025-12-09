-- Business domain schema for spaces & bookings
-- Run after roles/schemas are created
SET client_min_messages TO WARNING;
SET ROLE supabase_admin;

-- Users (lightweight profile table, not auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  email text NOT NULL UNIQUE,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('tenant','landlord','admin')),
  avatar text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Spaces available for daily rent
CREATE TABLE IF NOT EXISTS public.spaces (
  id uuid PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  postal_code text NOT NULL,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  price_per_day numeric(10,2) NOT NULL,
  size integer NOT NULL,
  category text NOT NULL CHECK (category IN ('office','warehouse','popup','event','retail','studio')),
  amenities text[] NOT NULL DEFAULT '{}',
  images text[] NOT NULL DEFAULT ARRAY['/placeholder.svg'],
  owner_id uuid NOT NULL REFERENCES public.users(id),
  owner_name text NOT NULL,
  rating numeric(3,2),
  review_count integer,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Bookings for spaces
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  space_id uuid NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
  space_name text NOT NULL,
  space_image text NOT NULL DEFAULT '/placeholder.svg',
  tenant_id uuid NOT NULL REFERENCES public.users(id),
  tenant_name text NOT NULL,
  landlord_id uuid NOT NULL REFERENCES public.users(id),
  landlord_name text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  total_days integer NOT NULL,
  total_price numeric(10,2) NOT NULL,
  status text NOT NULL CHECK (status IN ('pending','confirmed','rejected','cancelled','completed')),
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.spaces TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO anon, authenticated, service_role;

-- Enable Row Level Security and open read access for demo
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY users_select_all ON public.users FOR SELECT USING (true);
CREATE POLICY spaces_select_all ON public.spaces FOR SELECT USING (true);
CREATE POLICY bookings_select_all ON public.bookings FOR SELECT USING (true);

-- Allow inserts without auth for demo usage
CREATE POLICY users_insert_all ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY spaces_insert_all ON public.spaces FOR INSERT WITH CHECK (true);
CREATE POLICY bookings_insert_all ON public.bookings FOR INSERT WITH CHECK (true);

-- Seed demo data if tables are empty
INSERT INTO public.users (id, email, name, role, created_at)
SELECT * FROM (
  VALUES
    ('11111111-1111-1111-1111-111111111111'::uuid, 'max@example.com', 'Max Mustermann', 'tenant', now() - interval '300 days'),
    ('22222222-2222-2222-2222-222222222222'::uuid, 'anna@example.com', 'Anna Schmidt', 'landlord', now() - interval '400 days'),
    ('33333333-3333-3333-3333-333333333333'::uuid, 'thomas@example.com', 'Thomas Müller', 'landlord', now() - interval '200 days'),
    ('44444444-4444-4444-4444-444444444444'::uuid, 'sophie@example.com', 'Sophie Braun', 'landlord', now() - interval '250 days'),
    ('55555555-5555-5555-5555-555555555555'::uuid, 'admin@spaceshare.de', 'Admin User', 'admin', now() - interval '500 days')
) AS seed(id,email,name,role,created_at)
WHERE NOT EXISTS (SELECT 1 FROM public.users);

INSERT INTO public.spaces (id, title, description, address, city, postal_code, latitude, longitude, price_per_day, size, category, amenities, images, owner_id, owner_name, rating, review_count, is_active, created_at)
SELECT * FROM (
  VALUES
    ('aaaa1111-1111-1111-1111-111111111111'::uuid, 'Modernes Loft-Büro im Kreativviertel', 'Helles, offenes Loft mit industriellem Charme. Perfekt für kreative Teams, Workshops oder temporäre Projektarbeit. Hohe Decken und große Fenster sorgen für optimale Lichtverhältnisse.', 'Kreuzberger Straße 45', 'Berlin', '10961', 52.4934, 13.4234, 180.00, 120, 'office', ARRAY['wifi','electricity','heating','accessible'], ARRAY['/placeholder.svg'], '22222222-2222-2222-2222-222222222222'::uuid, 'Anna Schmidt', 4.8, 24, true, now() - interval '90 days'),
    ('bbbb2222-2222-2222-2222-222222222222'::uuid, 'Pop-up Store in Top-Lage', 'Hochfrequentierte Einzelhandelsfläche in der Fußgängerzone. Ideal für Pop-up Shops, Produktlaunches oder saisonale Verkäufe. Schaufenster zur Hauptstraße.', 'Königsallee 12', 'Düsseldorf', '40212', 51.2277, 6.7735, 350.00, 85, 'popup', ARRAY['wifi','electricity','ac','security'], ARRAY['/placeholder.svg'], '33333333-3333-3333-3333-333333333333'::uuid, 'Thomas Müller', 4.9, 18, true, now() - interval '60 days'),
    ('cccc3333-3333-3333-3333-333333333333'::uuid, 'Industrielle Lagerhalle mit Büro', 'Große Lagerfläche mit separatem Bürobereich. Ideale Deckenhöhe für Hochregale. Rampe für LKW-Anlieferung vorhanden.', 'Industriepark 7', 'Hamburg', '21079', 53.4614, 9.9688, 220.00, 450, 'warehouse', ARRAY['electricity','water','parking','security'], ARRAY['/placeholder.svg'], '55555555-5555-5555-5555-555555555555'::uuid, 'Admin User', 4.6, 12, true, now() - interval '120 days'),
    ('dddd4444-4444-4444-4444-444444444444'::uuid, 'Event-Location mit Terrasse', 'Stilvolle Veranstaltungsfläche mit großer Sonnenterrasse. Perfekt für Firmenfeiern, Produktpräsentationen oder private Events. Catering-Küche vorhanden.', 'Uferpromenade 23', 'München', '80538', 48.1351, 11.5820, 890.00, 280, 'event', ARRAY['wifi','electricity','water','ac','parking','accessible'], ARRAY['/placeholder.svg'], '44444444-4444-4444-4444-444444444444'::uuid, 'Sophie Braun', 4.95, 42, true, now() - interval '180 days'),
    ('eeee5555-5555-5555-5555-555555555555'::uuid, 'Kompakter Showroom', 'Eleganter Ausstellungsraum im Erdgeschoss. Große Schaufensterfläche, minimalistische Einrichtung. Ideal für Kunstausstellungen oder Produktpräsentationen.', 'Goethestraße 8', 'Frankfurt', '60313', 50.1109, 8.6821, 275.00, 95, 'retail', ARRAY['wifi','electricity','ac','accessible'], ARRAY['/placeholder.svg'], '22222222-2222-2222-2222-222222222222'::uuid, 'Anna Schmidt', 4.7, 15, true, now() - interval '30 days'),
    ('ffff6666-6666-6666-6666-666666666666'::uuid, 'Fotostudio mit Equipment', 'Professionelles Fotostudio mit kompletter Grundausstattung. Hohlkehle, Blitzanlage und Requisiten inklusive. Ideale Bedingungen für Shootings.', 'Medienallee 15', 'Köln', '50668', 50.9375, 6.9603, 320.00, 150, 'studio', ARRAY['wifi','electricity','ac','parking'], ARRAY['/placeholder.svg'], '22222222-2222-2222-2222-222222222222'::uuid, 'Anna Schmidt', 4.85, 31, true, now() - interval '75 days')
) AS seed(id,title,description,address,city,postal_code,latitude,longitude,price_per_day,size,category,amenities,images,owner_id,owner_name,rating,review_count,is_active,created_at)
WHERE NOT EXISTS (SELECT 1 FROM public.spaces);

INSERT INTO public.bookings (id, space_id, space_name, space_image, tenant_id, tenant_name, landlord_id, landlord_name, start_date, end_date, total_days, total_price, status, message, created_at)
SELECT * FROM (
  VALUES
    ('99991111-1111-1111-1111-111111111111'::uuid, 'aaaa1111-1111-1111-1111-111111111111'::uuid, 'Modernes Loft-Büro im Kreativviertel', '/placeholder.svg', '11111111-1111-1111-1111-111111111111'::uuid, 'Max Mustermann', '22222222-2222-2222-2222-222222222222'::uuid, 'Anna Schmidt', current_date + 1, current_date + 3, 3, 540.00, 'confirmed', 'Wir benötigen den Raum für ein dreitägiges Team-Workshop.', now() - interval '10 days'),
    ('99992222-2222-2222-2222-222222222222'::uuid, 'bbbb2222-2222-2222-2222-222222222222'::uuid, 'Pop-up Store in Top-Lage', '/placeholder.svg', '11111111-1111-1111-1111-111111111111'::uuid, 'Max Mustermann', '33333333-3333-3333-3333-333333333333'::uuid, 'Thomas Müller', current_date + 10, current_date + 14, 5, 1750.00, 'pending', 'Weihnachts-Pop-up für unsere neue Kollektion.', now() - interval '5 days'),
    ('99993333-3333-3333-3333-333333333333'::uuid, 'dddd4444-4444-4444-4444-444444444444'::uuid, 'Event-Location mit Terrasse', '/placeholder.svg', '11111111-1111-1111-1111-111111111111'::uuid, 'Max Mustermann', '44444444-4444-4444-4444-444444444444'::uuid, 'Sophie Braun', current_date + 6, current_date + 6, 1, 890.00, 'confirmed', 'Jahresabschlussfeier mit ca. 80 Personen.', now() - interval '20 days'),
    ('99994444-4444-4444-4444-444444444444'::uuid, 'cccc3333-3333-3333-3333-333333333333'::uuid, 'Industrielle Lagerhalle mit Büro', '/placeholder.svg', '55555555-5555-5555-5555-555555555555'::uuid, 'Admin User', '55555555-5555-5555-5555-555555555555'::uuid, 'Admin User', current_date - 30, current_date + 0, 30, 6600.00, 'completed', null, now() - interval '40 days')
) AS seed(id,space_id,space_name,space_image,tenant_id,tenant_name,landlord_id,landlord_name,start_date,end_date,total_days,total_price,status,message,created_at)
WHERE NOT EXISTS (SELECT 1 FROM public.bookings);
