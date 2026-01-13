-- Quick Script: Link existing auth user to admin_users table
-- This assumes you've already created the user via Supabase Dashboard

DO $$
DECLARE
  user_uuid uuid;
BEGIN
  -- Find the user ID from auth.users
  SELECT id INTO user_uuid
  FROM auth.users
  WHERE email = 'superadmin@lovelli.services';

  -- Check if user exists
  IF user_uuid IS NULL THEN
    RAISE EXCEPTION 'User not found in auth.users. Please create the user in Supabase Dashboard first.';
  END IF;

  -- Insert or update in admin_users
  INSERT INTO admin_users (user_id, email, role, is_active, created_at)
  VALUES (
    user_uuid,
    'superadmin@lovelli.services',
    'super_admin',
    true,
    now()
  )
  ON CONFLICT (email) DO UPDATE SET
    role = 'super_admin',
    is_active = true,
    updated_at = now();

  RAISE NOTICE 'Successfully linked super admin account with user ID: %', user_uuid;
END $$;

-- Verify the setup
SELECT
  au.id,
  au.email,
  au.role,
  au.is_active,
  au.created_at,
  u.email_confirmed_at
FROM admin_users au
JOIN auth.users u ON au.user_id = u.id
WHERE au.email = 'superadmin@lovelli.services';
