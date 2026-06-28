-- Create Request Status ENUM
CREATE TYPE request_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- Create Requests Table
CREATE TABLE admin_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  action_type TEXT NOT NULL, -- e.g., 'ADD_SITE', 'UPDATE_STATUS', 'DELETE_SITE'
  entity_id NUMERIC, -- site id if applicable
  payload JSONB, -- The data needed to execute the action
  requested_by UUID REFERENCES auth.users(id) NOT NULL,
  status request_status DEFAULT 'PENDING'::request_status NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE admin_requests ENABLE ROW LEVEL SECURITY;

-- Policies for admin_requests
-- Admins can insert their own requests
CREATE POLICY "Admins can create requests" ON admin_requests FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  AND requested_by = auth.uid()
);

-- Admins can view their own requests, Super Admins can view all
CREATE POLICY "View requests" ON admin_requests FOR SELECT USING (
  requested_by = auth.uid() OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
);

-- Only Super Admins can update requests (approve/reject)
CREATE POLICY "Super Admins can update requests" ON admin_requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
);
