-- 1. Create a SECURITY DEFINER function to bypass RLS when checking roles
CREATE OR REPLACE FUNCTION get_user_role(user_id uuid)
RETURNS text
LANGUAGE sql SECURITY DEFINER SET search_path = public
AS $$
  SELECT role::text FROM profiles WHERE id = user_id;
$$;

-- 2. Drop all policies that cause infinite recursion by querying `profiles` directly
DROP POLICY IF EXISTS "Super Admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can manage sites" ON sites;
DROP POLICY IF EXISTS "Admins can manage enquiries" ON enquiries;
DROP POLICY IF EXISTS "Admins can view staff" ON staff;
DROP POLICY IF EXISTS "Super Admins can manage staff" ON staff;
DROP POLICY IF EXISTS "Super Admins can view audit log" ON audit_log;
DROP POLICY IF EXISTS "Admins can create requests" ON admin_requests;
DROP POLICY IF EXISTS "View requests" ON admin_requests;
DROP POLICY IF EXISTS "Super Admins can update requests" ON admin_requests;

-- 3. Recreate policies using the secure function to prevent infinite recursion
CREATE POLICY "Super Admins can manage all profiles" ON profiles FOR ALL USING (get_user_role(auth.uid()) = 'super_admin');
CREATE POLICY "Admins can manage sites" ON sites FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'super_admin'));
CREATE POLICY "Admins can manage enquiries" ON enquiries FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'super_admin'));
CREATE POLICY "Admins can view staff" ON staff FOR SELECT USING (get_user_role(auth.uid()) IN ('admin', 'super_admin'));
CREATE POLICY "Super Admins can manage staff" ON staff FOR ALL USING (get_user_role(auth.uid()) = 'super_admin');
CREATE POLICY "Super Admins can view audit log" ON audit_log FOR SELECT USING (get_user_role(auth.uid()) = 'super_admin');

CREATE POLICY "Admins can create requests" ON admin_requests FOR INSERT WITH CHECK (
  get_user_role(auth.uid()) IN ('admin', 'super_admin') AND requested_by = auth.uid()
);
CREATE POLICY "View requests" ON admin_requests FOR SELECT USING (
  requested_by = auth.uid() OR get_user_role(auth.uid()) = 'super_admin'
);
CREATE POLICY "Super Admins can update requests" ON admin_requests FOR UPDATE USING (
  get_user_role(auth.uid()) = 'super_admin'
);
