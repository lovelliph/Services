# Super Admin Account Setup

## Account Details
- **Email**: superadmin@lovelli.services
- **Password**: Qasd159123@
- **Role**: super_admin

---

## Method 1: Using Supabase Dashboard (Recommended)

### Step 1: Create Auth User
1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Navigate to **Authentication** > **Users** in the sidebar
4. Click **"Add user"** button (top right)
5. Choose **"Create new user"**
6. Enter the following:
   - **Email**: `superadmin@lovelli.services`
   - **Password**: `Qasd159123@`
   - **Auto Confirm User**: ✅ (Check this box to skip email confirmation)
7. Click **"Create user"**
8. After creation, **copy the User UID** (you'll need this for Step 2)

### Step 2: Link to Admin Users Table
1. Go to **SQL Editor** in your Supabase Dashboard
2. Click **"New query"**
3. Paste the following SQL (replace `USER_UID_HERE` with the UID you copied):

```sql
INSERT INTO admin_users (user_id, email, role, is_active, created_at)
VALUES (
  'USER_UID_HERE', -- Replace this with the actual UUID
  'superadmin@lovelli.services',
  'super_admin',
  true,
  now()
);
```

4. Click **"Run"** to execute
5. You should see: "Success. No rows returned"

### Step 3: Verify Setup
Run this query to verify everything is set up correctly:

```sql
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
```

You should see one row with:
- email: superadmin@lovelli.services
- role: super_admin
- is_active: true

---

## Method 2: SQL Only (Alternative)

If you have admin access to the auth schema, you can try running the SQL script:

1. Go to **SQL Editor** in Supabase Dashboard
2. Open the file: `create-super-admin.sql`
3. Click **"Run"**

**Note**: This method might fail if you don't have sufficient permissions to directly modify the `auth.users` table. If it fails, use Method 1 instead.

---

## Testing the Account

1. Navigate to: `http://localhost:5173/admin/login` (or your production URL)
2. Enter credentials:
   - **Email**: superadmin@lovelli.services
   - **Password**: Qasd159123@
3. Click **"Sign in"**
4. You should be redirected to `/admin` dashboard
5. Verify you can see the **Settings** menu item (only visible to super_admins)

---

## Permissions Granted

As a **super_admin**, this account has access to:

- ✅ Dashboard - View statistics and activity
- ✅ Services - Full CRUD operations
- ✅ Blogs - Full CRUD operations
- ✅ Projects - Full CRUD operations
- ✅ Inquiries - View and manage contact inquiries
- ✅ Settings - System configuration (super_admin only)
- ✅ User Management - Create and manage other admin users

---

## Security Recommendations

1. **Change Password After First Login**
   - Use the "Forgot Password" feature to set a new password
   - Or update in Supabase Dashboard

2. **Enable MFA (Multi-Factor Authentication)**
   - Go to Supabase Dashboard > Authentication > Policies
   - Enable MFA for additional security

3. **Store Credentials Securely**
   - Use a password manager
   - Never commit credentials to version control

4. **Monitor Access**
   - Regularly review admin user list
   - Check activity logs for suspicious behavior

---

## Troubleshooting

### Issue: "Invalid login credentials"
**Solution**:
- Verify the user was created in Authentication > Users
- Check that email confirmation is enabled (or user is auto-confirmed)
- Verify password is correct (case-sensitive)

### Issue: "Access Denied" after login
**Solution**:
- Verify the user exists in the `admin_users` table
- Check that `is_active = true`
- Verify `role = 'super_admin'`
- Run the verification query from Step 3

### Issue: Redirected to login after signing in
**Solution**:
- Clear browser cache and cookies
- Check browser console for errors
- Verify RLS policies are correctly set up (run `admin-users-setup.sql`)

### Issue: Can't see Settings menu
**Solution**:
- Verify role is exactly `'super_admin'` (not `'Super Admin'` or `'superadmin'`)
- Sign out and sign in again to refresh permissions

---

## Quick SQL Reference

### View All Admin Users
```sql
SELECT id, email, role, is_active, created_at
FROM admin_users
ORDER BY created_at DESC;
```

### Update User Role
```sql
UPDATE admin_users
SET role = 'super_admin'
WHERE email = 'superadmin@lovelli.services';
```

### Deactivate User
```sql
UPDATE admin_users
SET is_active = false
WHERE email = 'superadmin@lovelli.services';
```

### Reactivate User
```sql
UPDATE admin_users
SET is_active = true
WHERE email = 'superadmin@lovelli.services';
```

---

**Setup Complete!** You can now log in with your super admin account.
