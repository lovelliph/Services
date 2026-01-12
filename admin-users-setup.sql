/*
  # Admin Users Table Setup

  Run this SQL in your Supabase SQL Editor to create the admin_users table
  and set up proper authentication for the admin panel.
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'viewer' CHECK (role IN ('viewer', 'editor', 'admin', 'super_admin')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES admin_users(id),
  updated_by uuid REFERENCES admin_users(id)
);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);

-- Policy: Users can read their own admin data
CREATE POLICY "Admin users can read own data"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Active admin/super_admin users can read all admin users
CREATE POLICY "Admins can read all admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND is_active = true
      AND role IN ('admin', 'super_admin')
    )
  );

-- Policy: Super admins can insert new admin users
CREATE POLICY "Super admins can create admin users"
  ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND is_active = true
      AND role = 'super_admin'
    )
  );

-- Policy: Super admins can update admin users
CREATE POLICY "Super admins can update admin users"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND is_active = true
      AND role = 'super_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND is_active = true
      AND role = 'super_admin'
    )
  );

-- Policy: Super admins can delete admin users (but not themselves)
CREATE POLICY "Super admins can delete admin users"
  ON admin_users
  FOR DELETE
  TO authenticated
  USING (
    auth.uid() != user_id AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND is_active = true
      AND role = 'super_admin'
    )
  );

-- Add policies for CMS management
CREATE POLICY "Admins can manage blogs"
  ON blogs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND is_active = true
      AND role IN ('editor', 'admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND is_active = true
      AND role IN ('editor', 'admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can manage projects"
  ON projects
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND is_active = true
      AND role IN ('editor', 'admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND is_active = true
      AND role IN ('editor', 'admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can manage services"
  ON services
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND is_active = true
      AND role IN ('editor', 'admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND is_active = true
      AND role IN ('editor', 'admin', 'super_admin')
    )
  );

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_admin_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically update updated_at
CREATE TRIGGER admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_users_updated_at();

-- IMPORTANT: After running this migration, create your first admin user:
-- 1. Sign up a user through Supabase Auth (or via SQL)
-- 2. Then run:
--    INSERT INTO admin_users (user_id, email, role, is_active, created_at)
--    VALUES ('[USER_ID_FROM_AUTH_USERS]', 'admin@example.com', 'super_admin', true, now());
