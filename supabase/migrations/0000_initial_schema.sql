-- Create ENUM types
CREATE TYPE user_role AS ENUM ('public', 'admin', 'super_admin');
CREATE TYPE site_status AS ENUM ('Available', 'Blocked', 'Booked');
CREATE TYPE enquiry_status AS ENUM ('New', 'Contacted', 'Converted', 'Lost');
CREATE TYPE pay_type AS ENUM ('Hourly', 'Salaried');

-- PROFILES (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role user_role DEFAULT 'public'::user_role NOT NULL,
  name TEXT,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- SITES (Master inventory)
CREATE TABLE sites (
  site_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  city TEXT NOT NULL,
  area TEXT NOT NULL,
  name TEXT NOT NULL,
  lat NUMERIC,
  lng NUMERIC,
  size TEXT,
  type TEXT,
  lit_type TEXT,
  status site_status DEFAULT 'Available'::site_status NOT NULL,
  photos TEXT[],
  landlord TEXT,
  rent NUMERIC,
  insurance TEXT,
  internal_rate NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ENQUIRIES
CREATE TABLE enquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  site_refs UUID[],
  status enquiry_status DEFAULT 'New'::enquiry_status NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- STAFF
CREATE TABLE staff (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  department TEXT,
  contact TEXT,
  pay_type pay_type,
  salary NUMERIC,
  bank_details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- AUDIT LOG
CREATE TABLE audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  actor_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  before_data JSONB,
  after_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- POLICIES

-- Profiles: Users can read their own profile, Admins and Super Admins can read all profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Super Admins can manage all profiles" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
);

-- Sites: Public can read all, Admins/Super Admins can manage all
CREATE POLICY "Public can view sites" ON sites FOR SELECT USING (true);
CREATE POLICY "Admins can manage sites" ON sites FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Enquiries: Public can insert, Admins/Super Admins can manage all
CREATE POLICY "Public can insert enquiries" ON enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage enquiries" ON enquiries FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Staff: Admins can read basic info, Super Admins can manage all (including sensitive info).
-- We'll just restrict INSERT/UPDATE/DELETE to Super Admins for now.
CREATE POLICY "Admins can view staff" ON staff FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);
CREATE POLICY "Super Admins can manage staff" ON staff FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
);

-- Audit Log: Only Super Admins can view
CREATE POLICY "Super Admins can view audit log" ON audit_log FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
);
