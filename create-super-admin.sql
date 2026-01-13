/*
  Create Super Admin Account
  Email: superadmin@lovelli.services
  Password: Qasd159123@
*/

-- Step 1: Create the auth user
-- Note: You need to run this in the Supabase Dashboard SQL Editor
-- The password will be hashed automatically by Supabase

-- First, we'll use Supabase's built-in function to create a user
-- This requires admin privileges in Supabase

DO $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Create the user in auth.users
  -- Note: This is a simplified version. You may need to use the Supabase Dashboard's
  -- "Add User" button for production use

  -- Insert into auth.users (this requires proper permissions)
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'superadmin@lovelli.services',
    crypt('Qasd159123@', gen_salt('bf')), -- Password hashing
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    now(),
    now(),
    '',
    '',
    '',
    ''
  )
  ON CONFLICT (email) DO NOTHING
  RETURNING id INTO new_user_id;

  -- If user was created, insert into admin_users
  IF new_user_id IS NOT NULL THEN
    INSERT INTO admin_users (user_id, email, role, is_active, created_at)
    VALUES (
      new_user_id,
      'superadmin@lovelli.services',
      'super_admin',
      true,
      now()
    );

    RAISE NOTICE 'Super admin account created successfully with ID: %', new_user_id;
  ELSE
    -- User already exists, try to link to admin_users
    SELECT id INTO new_user_id FROM auth.users WHERE email = 'superadmin@lovelli.services';

    INSERT INTO admin_users (user_id, email, role, is_active, created_at)
    VALUES (
      new_user_id,
      'superadmin@lovelli.services',
      'super_admin',
      true,
      now()
    )
    ON CONFLICT (email) DO UPDATE SET
      role = 'super_admin',
      is_active = true,
      updated_at = now();

    RAISE NOTICE 'Admin user linked/updated for existing user ID: %', new_user_id;
  END IF;
END $$;

-- Verify the account was created
SELECT
  au.id,
  au.email,
  au.role,
  au.is_active,
  au.created_at,
  u.email as auth_email,
  u.email_confirmed_at
FROM admin_users au
JOIN auth.users u ON au.user_id = u.id
WHERE au.email = 'superadmin@lovelli.services';
