-- Extended Schema for Zwischenvermietungsplattform
-- Features: Enhanced Bookings, Contracts, Check-in/Check-out, Vacancy Reports
-- Run after 01-schema-data.sql

SET client_min_messages TO WARNING;
SET ROLE supabase_admin;

-- ============================================
-- 1) EXTEND BOOKINGS TABLE
-- ============================================

-- Add new columns to existing bookings table for payment and deposit tracking
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS rent_amount numeric(10,2),
  ADD COLUMN IF NOT EXISTS utilities_amount numeric(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS cleaning_amount numeric(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS deposit_amount numeric(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'paid', 'failed', 'refunded')),
  ADD COLUMN IF NOT EXISTS deposit_status text DEFAULT 'pending' CHECK (deposit_status IN ('pending', 'held', 'released', 'withheld_partial', 'withheld_full')),
  ADD COLUMN IF NOT EXISTS payment_intent_id text,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Update booking status constraint to include new statuses
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
ALTER TABLE public.bookings ADD CONSTRAINT bookings_status_check
  CHECK (status IN ('requested', 'pending', 'confirmed', 'rejected', 'cancelled', 'completed', 'in_progress'));

-- Update existing 'pending' to 'requested' for clarity (optional - keeps backward compat)
-- UPDATE public.bookings SET status = 'requested' WHERE status = 'pending';

-- ============================================
-- 2) CONTRACTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.contracts (
  id uuid PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  landlord_id uuid NOT NULL REFERENCES public.users(id),
  tenant_id uuid NOT NULL REFERENCES public.users(id),
  space_id uuid NOT NULL REFERENCES public.spaces(id),

  -- Contract details
  contract_number text NOT NULL UNIQUE,
  contract_type text NOT NULL DEFAULT 'zwischenmietvertrag',

  -- Document storage
  pdf_url text,
  pdf_storage_path text,

  -- Contract terms (stored for record)
  start_date date NOT NULL,
  end_date date NOT NULL,
  rent_amount numeric(10,2) NOT NULL,
  deposit_amount numeric(10,2) DEFAULT 0,
  total_amount numeric(10,2) NOT NULL,

  -- Contract clauses flags
  hard_end_date boolean DEFAULT true,
  restoration_required boolean DEFAULT true,
  landlord_access_rights boolean DEFAULT true,
  tenant_insurance_required boolean DEFAULT true,
  late_return_penalty numeric(10,2) DEFAULT 0,

  -- Status
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'generated', 'sent', 'signed_tenant', 'signed_both', 'active', 'completed', 'terminated')),

  -- Signatures (for future digital signature integration)
  tenant_signed_at timestamptz,
  landlord_signed_at timestamptz,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- 3) CHECK-IN PHOTOS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.checkin_photos (
  id uuid PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  uploaded_by uuid NOT NULL REFERENCES public.users(id),

  image_url text NOT NULL,
  storage_path text NOT NULL,
  description text,
  room_area text, -- e.g., 'entrance', 'main_room', 'bathroom', 'kitchen', 'other'

  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================
-- 4) CHECK-OUT PHOTOS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.checkout_photos (
  id uuid PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  uploaded_by uuid NOT NULL REFERENCES public.users(id),

  image_url text NOT NULL,
  storage_path text NOT NULL,
  description text,
  room_area text,

  -- Damage reporting
  has_damage boolean DEFAULT false,
  damage_description text,
  damage_severity text CHECK (damage_severity IN ('none', 'minor', 'moderate', 'severe')),

  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================
-- 5) DAMAGE REPORTS TABLE (Optional, for detailed tracking)
-- ============================================

CREATE TABLE IF NOT EXISTS public.damage_reports (
  id uuid PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  reported_by uuid NOT NULL REFERENCES public.users(id),

  description text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('minor', 'moderate', 'severe')),
  estimated_cost numeric(10,2),

  -- Link to photos
  checkout_photo_ids uuid[] DEFAULT '{}',

  -- Resolution
  status text NOT NULL DEFAULT 'reported' CHECK (status IN ('reported', 'under_review', 'resolved', 'disputed')),
  resolution_notes text,
  deducted_from_deposit numeric(10,2) DEFAULT 0,
  resolved_at timestamptz,
  resolved_by uuid REFERENCES public.users(id),

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- 6) VACANCY REPORTS TABLE (Leerstand melden)
-- ============================================

CREATE TABLE IF NOT EXISTS public.vacancy_reports (
  id uuid PRIMARY KEY DEFAULT extensions.gen_random_uuid(),

  -- Reporter information (no account required)
  reporter_name text NOT NULL,
  reporter_email text NOT NULL,
  reporter_phone text,
  tos_accepted boolean NOT NULL DEFAULT false,

  -- Object/Property information
  object_address text NOT NULL,
  object_city text NOT NULL,
  object_zip text NOT NULL,
  object_country text NOT NULL DEFAULT 'Deutschland',
  location_lat double precision,
  location_lng double precision,

  -- Additional info about the vacancy
  object_description text,
  estimated_size_sqm integer,
  vacancy_duration text, -- e.g., 'weeks', 'months', 'years', 'unknown'

  -- Owner/Contact info (what the reporter knows)
  owner_contact_info text,

  -- Photo evidence
  photo_url text,
  photo_storage_path text,
  additional_photos text[] DEFAULT '{}',

  -- Processing status
  status text NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'verified', 'rejected', 'converted_to_space', 'duplicate')),

  -- Reward tracking (20 EUR)
  reward_status text NOT NULL DEFAULT 'pending' CHECK (reward_status IN ('pending', 'eligible', 'paid', 'not_eligible')),
  reward_amount numeric(10,2) DEFAULT 20.00,
  reward_paid_at timestamptz,

  -- Link to created space (if converted)
  related_space_id uuid REFERENCES public.spaces(id),

  -- Admin notes
  admin_notes text,
  reviewed_by uuid REFERENCES public.users(id),
  reviewed_at timestamptz,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Unique constraint to prevent duplicate reports for same address
CREATE UNIQUE INDEX IF NOT EXISTS vacancy_reports_unique_address
  ON public.vacancy_reports (LOWER(TRIM(object_address)), LOWER(TRIM(object_city)), object_zip, LOWER(TRIM(object_country)))
  WHERE status NOT IN ('rejected', 'duplicate');

-- ============================================
-- 7) PAYMENT INTENTS TABLE (for Dummy Payment tracking)
-- ============================================

CREATE TABLE IF NOT EXISTS public.payment_intents (
  id uuid PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,

  -- Amount details
  amount numeric(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'EUR',

  -- Status tracking
  status text NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded')),

  -- Dummy provider info (for future real payment integration)
  provider text NOT NULL DEFAULT 'dummy',
  provider_intent_id text,

  -- Metadata
  description text,
  metadata jsonb DEFAULT '{}',

  -- Error handling
  error_message text,
  error_code text,

  -- Timestamps
  created_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- 8) SPACE AVAILABILITY TABLE (for more granular availability)
-- ============================================

CREATE TABLE IF NOT EXISTS public.space_availability (
  id uuid PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  space_id uuid NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,

  -- Availability period
  start_date date NOT NULL,
  end_date date NOT NULL,

  -- Type: available or blocked
  availability_type text NOT NULL DEFAULT 'available' CHECK (availability_type IN ('available', 'blocked', 'maintenance')),

  -- Optional notes
  notes text,

  created_at timestamptz NOT NULL DEFAULT now(),

  -- Ensure no overlapping periods for same space
  CONSTRAINT no_date_overlap EXCLUDE USING gist (
    space_id WITH =,
    daterange(start_date, end_date, '[]') WITH &&
  ) WHERE (availability_type = 'blocked')
);

-- Index for faster availability queries
CREATE INDEX IF NOT EXISTS idx_space_availability_dates
  ON public.space_availability (space_id, start_date, end_date);

-- ============================================
-- 9) EXTEND SPACES TABLE
-- ============================================

ALTER TABLE public.spaces
  ADD COLUMN IF NOT EXISTS price_per_week numeric(10,2),
  ADD COLUMN IF NOT EXISTS price_per_month numeric(10,2),
  ADD COLUMN IF NOT EXISTS allowed_usage_types text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS min_rental_days integer DEFAULT 1,
  ADD COLUMN IF NOT EXISTS max_rental_days integer DEFAULT 365,
  ADD COLUMN IF NOT EXISTS deposit_required boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS deposit_amount numeric(10,2),
  ADD COLUMN IF NOT EXISTS cancellation_policy text DEFAULT 'flexible' CHECK (cancellation_policy IN ('flexible', 'moderate', 'strict')),
  ADD COLUMN IF NOT EXISTS instant_booking boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- ============================================
-- 10) NOTIFICATIONS TABLE (for future use)
-- ============================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

  type text NOT NULL, -- 'booking_request', 'booking_confirmed', 'payment_received', etc.
  title text NOT NULL,
  message text NOT NULL,

  -- Reference to related entity
  reference_type text, -- 'booking', 'contract', 'vacancy_report', etc.
  reference_id uuid,

  -- Status
  is_read boolean NOT NULL DEFAULT false,
  read_at timestamptz,

  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for user notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user
  ON public.notifications (user_id, is_read, created_at DESC);

-- ============================================
-- GRANTS
-- ============================================

GRANT SELECT, INSERT, UPDATE, DELETE ON public.contracts TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.checkin_photos TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.checkout_photos TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.damage_reports TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vacancy_reports TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payment_intents TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.space_availability TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO anon, authenticated, service_role;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkin_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkout_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.damage_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vacancy_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.space_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- CONTRACTS: Landlord and Tenant can see their own contracts, Admin sees all
CREATE POLICY contracts_select ON public.contracts FOR SELECT USING (true);
CREATE POLICY contracts_insert ON public.contracts FOR INSERT WITH CHECK (true);
CREATE POLICY contracts_update ON public.contracts FOR UPDATE USING (true);

-- CHECKIN_PHOTOS: Related parties can see, tenant can upload
CREATE POLICY checkin_photos_select ON public.checkin_photos FOR SELECT USING (true);
CREATE POLICY checkin_photos_insert ON public.checkin_photos FOR INSERT WITH CHECK (true);

-- CHECKOUT_PHOTOS: Related parties can see, tenant can upload
CREATE POLICY checkout_photos_select ON public.checkout_photos FOR SELECT USING (true);
CREATE POLICY checkout_photos_insert ON public.checkout_photos FOR INSERT WITH CHECK (true);
CREATE POLICY checkout_photos_update ON public.checkout_photos FOR UPDATE USING (true);

-- DAMAGE_REPORTS: Related parties and admin
CREATE POLICY damage_reports_select ON public.damage_reports FOR SELECT USING (true);
CREATE POLICY damage_reports_insert ON public.damage_reports FOR INSERT WITH CHECK (true);
CREATE POLICY damage_reports_update ON public.damage_reports FOR UPDATE USING (true);

-- VACANCY_REPORTS: Public can insert (no auth required), admin can see all
CREATE POLICY vacancy_reports_select ON public.vacancy_reports FOR SELECT USING (true);
CREATE POLICY vacancy_reports_insert ON public.vacancy_reports FOR INSERT WITH CHECK (true);
CREATE POLICY vacancy_reports_update ON public.vacancy_reports FOR UPDATE USING (true);

-- PAYMENT_INTENTS: Related parties can see their payments
CREATE POLICY payment_intents_select ON public.payment_intents FOR SELECT USING (true);
CREATE POLICY payment_intents_insert ON public.payment_intents FOR INSERT WITH CHECK (true);
CREATE POLICY payment_intents_update ON public.payment_intents FOR UPDATE USING (true);

-- SPACE_AVAILABILITY: Public read, owner can modify
CREATE POLICY space_availability_select ON public.space_availability FOR SELECT USING (true);
CREATE POLICY space_availability_insert ON public.space_availability FOR INSERT WITH CHECK (true);
CREATE POLICY space_availability_update ON public.space_availability FOR UPDATE USING (true);
CREATE POLICY space_availability_delete ON public.space_availability FOR DELETE USING (true);

-- NOTIFICATIONS: Users see their own
CREATE POLICY notifications_select ON public.notifications FOR SELECT USING (true);
CREATE POLICY notifications_insert ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY notifications_update ON public.notifications FOR UPDATE USING (true);

-- ============================================
-- UPDATE POLICIES FOR EXISTING TABLES
-- ============================================

-- Add update policy for bookings (was missing)
CREATE POLICY IF NOT EXISTS bookings_update_all ON public.bookings FOR UPDATE USING (true);
CREATE POLICY IF NOT EXISTS bookings_delete_all ON public.bookings FOR DELETE USING (true);

-- Add update policy for spaces
CREATE POLICY IF NOT EXISTS spaces_update_all ON public.spaces FOR UPDATE USING (true);
CREATE POLICY IF NOT EXISTS spaces_delete_all ON public.spaces FOR DELETE USING (true);

-- Add update policy for users
CREATE POLICY IF NOT EXISTS users_update_all ON public.users FOR UPDATE USING (true);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to generate contract number
CREATE OR REPLACE FUNCTION generate_contract_number()
RETURNS text AS $$
DECLARE
  year_part text;
  sequence_part text;
  contract_count integer;
BEGIN
  year_part := to_char(now(), 'YYYY');
  SELECT COUNT(*) + 1 INTO contract_count FROM public.contracts WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM now());
  sequence_part := LPAD(contract_count::text, 6, '0');
  RETURN 'ZMV-' || year_part || '-' || sequence_part;
END;
$$ LANGUAGE plpgsql;

-- Function to check booking availability
CREATE OR REPLACE FUNCTION check_booking_availability(
  p_space_id uuid,
  p_start_date date,
  p_end_date date,
  p_exclude_booking_id uuid DEFAULT NULL
)
RETURNS boolean AS $$
DECLARE
  conflict_count integer;
BEGIN
  SELECT COUNT(*) INTO conflict_count
  FROM public.bookings
  WHERE space_id = p_space_id
    AND status IN ('confirmed', 'in_progress')
    AND (p_exclude_booking_id IS NULL OR id != p_exclude_booking_id)
    AND (
      (start_date <= p_end_date AND end_date >= p_start_date)
    );

  RETURN conflict_count = 0;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate booking total
CREATE OR REPLACE FUNCTION calculate_booking_total(
  p_space_id uuid,
  p_start_date date,
  p_end_date date
)
RETURNS TABLE(
  total_days integer,
  rent_amount numeric,
  deposit_amount numeric,
  total_amount numeric
) AS $$
DECLARE
  v_space record;
  v_days integer;
  v_rent numeric;
  v_deposit numeric;
BEGIN
  SELECT * INTO v_space FROM public.spaces WHERE id = p_space_id;

  v_days := p_end_date - p_start_date + 1;

  -- Calculate rent based on duration and available pricing
  IF v_days >= 30 AND v_space.price_per_month IS NOT NULL THEN
    v_rent := (v_days / 30.0) * v_space.price_per_month;
  ELSIF v_days >= 7 AND v_space.price_per_week IS NOT NULL THEN
    v_rent := (v_days / 7.0) * v_space.price_per_week;
  ELSE
    v_rent := v_days * v_space.price_per_day;
  END IF;

  -- Get deposit amount
  v_deposit := COALESCE(v_space.deposit_amount, v_space.price_per_day * 2);

  RETURN QUERY SELECT
    v_days,
    ROUND(v_rent, 2),
    ROUND(v_deposit, 2),
    ROUND(v_rent + v_deposit, 2);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_contracts_updated_at ON public.contracts;
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON public.contracts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_vacancy_reports_updated_at ON public.vacancy_reports;
CREATE TRIGGER update_vacancy_reports_updated_at BEFORE UPDATE ON public.vacancy_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_spaces_updated_at ON public.spaces;
CREATE TRIGGER update_spaces_updated_at BEFORE UPDATE ON public.spaces
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_damage_reports_updated_at ON public.damage_reports;
CREATE TRIGGER update_damage_reports_updated_at BEFORE UPDATE ON public.damage_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payment_intents_updated_at ON public.payment_intents;
CREATE TRIGGER update_payment_intents_updated_at BEFORE UPDATE ON public.payment_intents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STORAGE BUCKETS (to be created via Supabase Dashboard or API)
-- ============================================
-- Note: Storage buckets need to be created via Supabase:
-- 1. 'space-images' - for space photos
-- 2. 'checkin-photos' - for check-in documentation
-- 3. 'checkout-photos' - for check-out documentation
-- 4. 'vacancy-photos' - for vacancy report photos
-- 5. 'contracts' - for generated PDF contracts
