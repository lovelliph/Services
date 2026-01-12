# Admin Panel Setup Guide

## Phase 1: Authentication and Access Control - COMPLETED

This guide will help you set up and configure the admin authentication system for your BPO Solutions website.

## 1. Database Setup

### Step 1: Run the SQL Migration

1. Open your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `admin-users-setup.sql`
4. Run the SQL script

This will create:
- `admin_users` table with proper structure
- Row Level Security (RLS) policies
- Indexes for performance
- Triggers for automatic timestamp updates
- Admin policies for blogs, projects, and services management

### Step 2: Create Your First Admin User

After running the migration, you need to create your first admin user:

#### Option A: Using Supabase Dashboard (Recommended)

1. Go to Authentication > Users in your Supabase dashboard
2. Click "Add user" and create a new user with email/password
3. Copy the user's UUID from the users table
4. Go to SQL Editor and run:

```sql
INSERT INTO admin_users (user_id, email, role, is_active)
VALUES (
  'PASTE_USER_UUID_HERE',
  'your-email@example.com',
  'super_admin',
  true
);
```

#### Option B: Using SQL Only

```sql
-- First, create the auth user (note: this requires proper password hashing)
-- It's better to use the Supabase Dashboard for this

-- Then, link them to admin_users
INSERT INTO admin_users (user_id, email, role, is_active)
SELECT
  id,
  email,
  'super_admin',
  true
FROM auth.users
WHERE email = 'your-email@example.com';
```

## 2. Admin Roles

The system supports four role levels:

1. **viewer** - Can view all content but cannot make changes
2. **editor** - Can create, edit, and delete blogs, projects, and services
3. **admin** - All editor permissions plus access to settings
4. **super_admin** - Full access including user management

## 3. Accessing the Admin Panel

### Login Page
- URL: `/admin/login`
- Use the email and password you created in Step 2

### Dashboard
- URL: `/admin`
- Only accessible after successful authentication
- Displays quick stats and recent activity

## 4. Features Implemented

### Authentication
- ✅ Email/password login
- ✅ Session management with persistent state
- ✅ Protected routes with automatic redirect
- ✅ Password reset functionality
- ✅ Role-based access control

### Security
- ✅ Row Level Security (RLS) on all tables
- ✅ Secure authentication with Supabase Auth
- ✅ Protected API routes
- ✅ Role hierarchy enforcement
- ✅ Active user validation

### UI Components
- ✅ Responsive admin layout with sidebar
- ✅ Login page with error handling
- ✅ Forgot password page
- ✅ Protected route wrapper
- ✅ Admin dashboard with stats
- ✅ Mobile-friendly navigation

## 5. Testing the Authentication Flow

### Test 1: Unauthorized Access
1. Open `/admin` in an incognito window
2. You should be redirected to `/admin/login`
3. ✅ Test passes if redirect happens

### Test 2: Login Flow
1. Go to `/admin/login`
2. Enter your admin credentials
3. Click "Sign in"
4. You should be redirected to `/admin` dashboard
5. ✅ Test passes if you see the dashboard

### Test 3: Session Persistence
1. After logging in, refresh the page
2. You should remain logged in
3. ✅ Test passes if no redirect to login

### Test 4: Logout
1. While logged in, click "Sign Out" in the sidebar
2. You should be redirected to `/admin/login`
3. ✅ Test passes if logout works and session clears

### Test 5: Password Reset
1. Go to `/admin/forgot-password`
2. Enter your email address
3. Check your email for the reset link
4. ✅ Test passes if email is received

## 6. Environment Variables

Make sure your `.env` file has the correct Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 7. Troubleshooting

### Issue: Cannot log in
- Verify the user exists in `auth.users` table
- Verify the user has a corresponding entry in `admin_users` table
- Check that `is_active = true` in `admin_users`
- Verify the password is correct

### Issue: Redirected to login after signing in
- Check that `admin_users` table has an entry for your user
- Verify RLS policies are correctly set up
- Check browser console for errors

### Issue: "Access Denied" message
- Verify your user's role in the `admin_users` table
- Check if the page requires a specific role
- Confirm `is_active = true` for your user

### Issue: Password reset email not received
- Check spam/junk folder
- Verify email configuration in Supabase settings
- Check Supabase Auth logs for errors

## 8. Next Steps

Now that Phase 1 is complete, you can proceed to:

- **Phase 2**: Admin Layout and Navigation (basic structure already in place)
- **Phase 3**: Services Management CRUD
- **Phase 4**: Blog Management CRUD
- **Phase 5**: Projects Management CRUD
- **Phase 6**: Contact Inquiries Management
- **Phase 7**: User & Admin Management

## 9. File Structure

```
src/
├── contexts/
│   └── AuthContext.tsx          # Authentication state management
├── components/
│   └── admin/
│       ├── AdminLayout.tsx      # Admin panel layout with sidebar
│       └── ProtectedRoute.tsx   # Route protection wrapper
├── pages/
│   └── admin/
│       ├── Login.tsx            # Admin login page
│       ├── ForgotPassword.tsx   # Password reset page
│       └── Dashboard.tsx        # Admin dashboard home
└── App.tsx                      # Updated with admin routes

Database:
├── admin-users-setup.sql        # Complete database setup
└── admin_users table            # User roles and permissions
```

## 10. Security Best Practices

1. Always use strong passwords for admin accounts
2. Regularly review active admin users
3. Deactivate accounts for users who no longer need access
4. Monitor authentication logs in Supabase
5. Use the super_admin role sparingly
6. Enable MFA in Supabase for additional security

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Review Supabase logs in the dashboard
3. Verify all SQL migrations ran successfully
4. Ensure environment variables are correctly set
