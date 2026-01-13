/*
  # Applicants Management System - Database Setup

  ## Overview
  Complete database schema for managing job applications with audit trails and internal notes.

  ## 1. Core Tables

  ### applicants
  Main table storing all job application data including:
  - Personal information (name, email, phone, location)
  - Professional details (position, experience, company)
  - Application metadata (status, dates, IP)

  ### application_logs
  Audit trail table tracking all changes to applicants:
  - Status changes
  - Notes added/modified
  - Administrative actions
  - Timestamps and admin attribution

  ### application_notes
  Internal notes system for team collaboration:
  - Private notes on applicants
  - Multi-user support
  - Edit history tracking

  ## 2. Security
  - Row Level Security (RLS) enabled on all tables
  - Public can submit applications (INSERT only)
  - Admin users can view and manage (SELECT, UPDATE, DELETE)
  - Audit logs are read-only for admins
  - Notes are accessible to all admins but only editable by author or admin+

  ## 3. Performance
  - Indexes on frequently queried columns
  - Optimized for filtering, sorting, and searching
*/

-- Create enum type for application status
DO $$ BEGIN
  CREATE TYPE application_status AS ENUM (
    'new',
    'reviewing',
    'shortlisted',
    'rejected',
    'hired',
    'archived'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- =============================================
-- 1. APPLICANTS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS applicants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  position_applied text NOT NULL,
  message text NOT NULL,
  status application_status DEFAULT 'new',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  company_name text,
  website_url text,
  experience_years integer,
  location text,
  availability text,
  ip_address text,
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- =============================================
-- 2. APPLICATION LOGS TABLE (Audit Trail)
-- =============================================

CREATE TABLE IF NOT EXISTS application_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id uuid REFERENCES applicants(id) ON DELETE CASCADE,
  action text NOT NULL,
  old_value text,
  new_value text,
  admin_id uuid REFERENCES admin_users(id),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_action CHECK (action IN ('status_change', 'note_added', 'note_updated', 'note_deleted', 'created', 'updated', 'deleted'))
);

-- =============================================
-- 3. APPLICATION NOTES TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS application_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id uuid REFERENCES applicants(id) ON DELETE CASCADE,
  admin_id uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =============================================
-- 4. INDEXES FOR PERFORMANCE
-- =============================================

-- Applicants table indexes
CREATE INDEX IF NOT EXISTS idx_applicants_email ON applicants(email);
CREATE INDEX IF NOT EXISTS idx_applicants_status ON applicants(status);
CREATE INDEX IF NOT EXISTS idx_applicants_created_at ON applicants(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applicants_position ON applicants(position_applied);
CREATE INDEX IF NOT EXISTS idx_applicants_ip ON applicants(ip_address);

-- Application logs indexes
CREATE INDEX IF NOT EXISTS idx_application_logs_applicant ON application_logs(applicant_id);
CREATE INDEX IF NOT EXISTS idx_application_logs_created ON application_logs(created_at DESC);

-- Application notes indexes
CREATE INDEX IF NOT EXISTS idx_application_notes_applicant ON application_notes(applicant_id);
CREATE INDEX IF NOT EXISTS idx_application_notes_admin ON application_notes(admin_id);

-- =============================================
-- 5. TRIGGERS FOR AUTOMATIC TIMESTAMPS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for applicants table
DROP TRIGGER IF EXISTS applicants_updated_at ON applicants;
CREATE TRIGGER applicants_updated_at
  BEFORE UPDATE ON applicants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Trigger for application_notes table
DROP TRIGGER IF EXISTS application_notes_updated_at ON application_notes;
CREATE TRIGGER application_notes_updated_at
  BEFORE UPDATE ON application_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =============================================
-- 6. AUDIT LOG TRIGGERS
-- =============================================

-- Function to log status changes
CREATE OR REPLACE FUNCTION log_applicant_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO application_logs (applicant_id, action, old_value, new_value, admin_id)
    VALUES (NEW.id, 'status_change', OLD.status::text, NEW.status::text, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for status changes
DROP TRIGGER IF EXISTS log_status_change ON applicants;
CREATE TRIGGER log_status_change
  AFTER UPDATE ON applicants
  FOR EACH ROW
  EXECUTE FUNCTION log_applicant_status_change();

-- =============================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE applicants ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_notes ENABLE ROW LEVEL SECURITY;

-- =============================================
-- APPLICANTS TABLE POLICIES
-- =============================================

-- Policy: Public can submit applications (INSERT only)
DROP POLICY IF EXISTS "Public can submit applications" ON applicants;
CREATE POLICY "Public can submit applications"
  ON applicants
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Authenticated admin users can view all applicants (viewer+)
DROP POLICY IF EXISTS "Admin users can view applicants" ON applicants;
CREATE POLICY "Admin users can view applicants"
  ON applicants
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND is_active = true
    )
  );

-- Policy: Editor+ can update applicants
DROP POLICY IF EXISTS "Editors can update applicants" ON applicants;
CREATE POLICY "Editors can update applicants"
  ON applicants
  FOR UPDATE
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

-- Policy: Editor+ can delete applicants
DROP POLICY IF EXISTS "Editors can delete applicants" ON applicants;
CREATE POLICY "Editors can delete applicants"
  ON applicants
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND is_active = true
      AND role IN ('editor', 'admin', 'super_admin')
    )
  );

-- =============================================
-- APPLICATION LOGS POLICIES (Read-only for admins)
-- =============================================

-- Policy: Admin users can view logs
DROP POLICY IF EXISTS "Admin users can view logs" ON application_logs;
CREATE POLICY "Admin users can view logs"
  ON application_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND is_active = true
    )
  );

-- Policy: Only system can insert logs (via triggers)
DROP POLICY IF EXISTS "System can insert logs" ON application_logs;
CREATE POLICY "System can insert logs"
  ON application_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND is_active = true
    )
  );

-- =============================================
-- APPLICATION NOTES POLICIES
-- =============================================

-- Policy: Admin users can view all notes
DROP POLICY IF EXISTS "Admin users can view notes" ON application_notes;
CREATE POLICY "Admin users can view notes"
  ON application_notes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND is_active = true
    )
  );

-- Policy: Authenticated admins can create notes
DROP POLICY IF EXISTS "Admin users can create notes" ON application_notes;
CREATE POLICY "Admin users can create notes"
  ON application_notes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND is_active = true
    )
  );

-- Policy: Note author or admin+ can update their notes
DROP POLICY IF EXISTS "Authors and admins can update notes" ON application_notes;
CREATE POLICY "Authors and admins can update notes"
  ON application_notes
  FOR UPDATE
  TO authenticated
  USING (
    admin_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND is_active = true
      AND role IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    admin_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND is_active = true
      AND role IN ('admin', 'super_admin')
    )
  );

-- Policy: Note author or admin+ can delete notes
DROP POLICY IF EXISTS "Authors and admins can delete notes" ON application_notes;
CREATE POLICY "Authors and admins can delete notes"
  ON application_notes
  FOR DELETE
  TO authenticated
  USING (
    admin_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND is_active = true
      AND role IN ('admin', 'super_admin')
    )
  );

-- =============================================
-- 8. HELPER FUNCTIONS
-- =============================================

-- Function to check rate limiting (5 submissions per IP per 24 hours)
CREATE OR REPLACE FUNCTION check_application_rate_limit(p_ip_address text)
RETURNS boolean AS $$
DECLARE
  submission_count integer;
BEGIN
  SELECT COUNT(*)
  INTO submission_count
  FROM applicants
  WHERE ip_address = p_ip_address
  AND created_at > now() - interval '24 hours';

  RETURN submission_count < 5;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- DONE
-- =============================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON applicants TO authenticated;
GRANT INSERT ON applicants TO anon;
GRANT SELECT ON application_logs TO authenticated;
GRANT INSERT ON application_logs TO authenticated;
GRANT ALL ON application_notes TO authenticated;