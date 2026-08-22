-- Migration: 0003_site_bookings.sql
-- Table definition for site multi-bookings (up to 3 simultaneous bookings with 5-day hold and automated confirmation)

CREATE TABLE IF NOT EXISTS site_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id UUID REFERENCES sites(site_id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  booking_period TEXT,
  booked_by_staff_id UUID REFERENCES profiles(id),
  booked_by_staff_name TEXT NOT NULL,
  status TEXT DEFAULT 'ACTIVE' NOT NULL, -- 'ACTIVE', 'RELEASED', 'EXPIRED', 'CONFIRMED'
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  extended_count INTEGER DEFAULT 0 NOT NULL,
  confirmation_token TEXT UNIQUE,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for quick lookup of active bookings per site
CREATE INDEX IF NOT EXISTS idx_site_bookings_site_id ON site_bookings(site_id);
CREATE INDEX IF NOT EXISTS idx_site_bookings_status ON site_bookings(status);
CREATE INDEX IF NOT EXISTS idx_site_bookings_token ON site_bookings(confirmation_token);

-- Row Level Security
ALTER TABLE site_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view confirmed bookings" ON site_bookings FOR SELECT USING (true);
CREATE POLICY "Admins can manage site_bookings" ON site_bookings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'backoffice', 'marketing', 'execution_head'))
);
