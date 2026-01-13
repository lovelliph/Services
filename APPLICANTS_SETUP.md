# Applicants Management System - Database Setup Complete

## What Was Completed

**Section 1: Database Schema and Setup** - ✅ FULLY COMPLETED

All database tables, indexes, security policies, triggers, and helper functions have been successfully created in your Supabase database.

---

## Database Tables Created

### 1. `applicants` Table
Main table for storing job application data.

**Columns:**
- `id` - UUID primary key
- `name` - Applicant's full name (required)
- `email` - Email address with validation regex (required)
- `phone` - Phone number (optional)
- `position_applied` - Position title (required)
- `message` - Cover letter/message (required)
- `status` - Application status enum: 'new', 'reviewing', 'shortlisted', 'rejected', 'hired', 'archived'
- `created_at` - Timestamp (auto)
- `updated_at` - Timestamp (auto-updates on change)
- `company_name` - Current employer (optional)
- `website_url` - Portfolio/website link (optional)
- `experience_years` - Years of experience (optional)
- `location` - Applicant location (optional)
- `availability` - When they can start (optional)
- `ip_address` - For rate limiting and spam prevention (optional)

**Features:**
- Email format validation constraint
- Automatic timestamp updates
- Status tracking with enum type
- Full RLS enabled

---

### 2. `application_logs` Table
Audit trail for all changes to applicants.

**Columns:**
- `id` - UUID primary key
- `applicant_id` - Foreign key to applicants
- `action` - Type of action: 'status_change', 'note_added', 'note_updated', 'note_deleted', 'created', 'updated', 'deleted'
- `old_value` - Previous value (for status changes)
- `new_value` - New value (for status changes)
- `admin_id` - Foreign key to admin_users (who made the change)
- `created_at` - Timestamp

**Features:**
- Automatically logs status changes via trigger
- Immutable audit trail
- Tracks which admin made changes
- Full RLS enabled

---

### 3. `application_notes` Table
Internal notes for team collaboration on applicants.

**Columns:**
- `id` - UUID primary key
- `applicant_id` - Foreign key to applicants
- `admin_id` - Foreign key to admin_users (note author)
- `content` - Note text (required)
- `created_at` - Timestamp
- `updated_at` - Timestamp (auto-updates)

**Features:**
- Authors can edit their own notes
- Admins+ can edit all notes
- Full RLS enabled
- Automatic timestamp updates

---

## Performance Indexes Created

All tables have been optimized with indexes on frequently queried columns:

- `idx_applicants_email` - Fast duplicate checking
- `idx_applicants_status` - Efficient filtering by status
- `idx_applicants_created_at` - Fast date sorting
- `idx_applicants_position` - Position filtering
- `idx_applicants_ip` - Rate limit checks
- `idx_application_logs_applicant` - Fast log lookups
- `idx_application_logs_created` - Log date sorting
- `idx_application_notes_applicant` - Fast note lookups
- `idx_application_notes_admin` - Admin's notes lookup

---

## Row Level Security (RLS) Policies

### Applicants Table
✅ **Public INSERT** - Anyone can submit applications (anonymous users)
✅ **Admin SELECT** - All authenticated admin users (viewer+) can view applicants
✅ **Editor UPDATE** - Editor+ admins can update applicant information
✅ **Editor DELETE** - Editor+ admins can delete applicants

### Application Logs Table
✅ **Admin SELECT** - All authenticated admin users can view logs
✅ **Admin INSERT** - System can create logs (via triggers)

### Application Notes Table
✅ **Admin SELECT** - All authenticated admin users can view notes
✅ **Admin INSERT** - All authenticated admin users can create notes
✅ **Author/Admin UPDATE** - Note author or admin+ can edit notes
✅ **Author/Admin DELETE** - Note author or admin+ can delete notes

---

## Automatic Triggers Implemented

### 1. Timestamp Triggers
- **applicants_updated_at** - Auto-updates `updated_at` on record changes
- **application_notes_updated_at** - Auto-updates `updated_at` on note changes

### 2. Audit Triggers
- **log_status_change** - Automatically logs status changes to `application_logs` table
  - Captures old status, new status, timestamp, and which admin made the change
  - Runs automatically on every UPDATE to applicants table

---

## Helper Functions

### `check_application_rate_limit(p_ip_address text)`
Returns `boolean`

Checks if an IP address has exceeded the rate limit.
- **Limit:** 5 applications per IP per 24 hours
- **Use:** Call this before accepting new applications to prevent spam
- **Returns:** `true` if under limit, `false` if rate limit exceeded

**Usage:**
```sql
SELECT check_application_rate_limit('192.168.1.1');
```

---

## Security Features

1. **Data Integrity**
   - Email validation regex prevents invalid emails
   - Foreign key constraints ensure referential integrity
   - NOT NULL constraints on critical fields

2. **Access Control**
   - Public can only INSERT applications (can't read/modify)
   - Admins must be authenticated and active
   - Role-based permissions (viewer, editor, admin, super_admin)
   - Notes are protected - only author or admin+ can modify

3. **Audit Trail**
   - All status changes are automatically logged
   - Logs are immutable (read-only for admins)
   - Admin attribution for all changes

4. **Spam Prevention**
   - Rate limiting function (5 per IP per day)
   - IP address tracking
   - Email validation

---

## Database Schema Diagram

```
┌─────────────────────┐
│   admin_users       │
│  (existing table)   │
└──────────┬──────────┘
           │
           │ references
           │
┌──────────▼──────────┐        ┌─────────────────────┐
│    applicants       │◄───────│  application_logs   │
│                     │        │  (audit trail)      │
│  - id               │        │  - applicant_id     │
│  - name             │        │  - action           │
│  - email            │        │  - old_value        │
│  - phone            │        │  - new_value        │
│  - position_applied │        │  - admin_id         │
│  - message          │        │  - created_at       │
│  - status           │        └─────────────────────┘
│  - company_name     │
│  - experience_years │        ┌─────────────────────┐
│  - location         │◄───────│ application_notes   │
│  - ip_address       │        │  (internal notes)   │
│  - timestamps       │        │  - applicant_id     │
└─────────────────────┘        │  - admin_id         │
                               │  - content          │
                               │  - timestamps       │
                               └─────────────────────┘
```

---

## Testing the Database

You can verify the setup is working by running these SQL queries in Supabase:

### 1. Check Tables Exist
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('applicants', 'application_logs', 'application_notes');
```

### 2. Check Indexes
```sql
SELECT indexname
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('applicants', 'application_logs', 'application_notes');
```

### 3. Check RLS Policies
```sql
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('applicants', 'application_logs', 'application_notes');
```

### 4. Test Rate Limiting Function
```sql
SELECT check_application_rate_limit('127.0.0.1');
-- Should return: true (no applications from this IP yet)
```

---

## Next Steps

Now that the database is set up, you can proceed to:

1. **Section 2: Public Application Form Page**
   - Create `/src/pages/Apply.tsx`
   - Build the public-facing application form
   - Implement client-side validation
   - Add form submission logic

2. **Section 3: Admin Applicants List Page**
   - Create admin list view
   - Add search and filtering
   - Implement bulk operations

3. **Section 4: Admin Applicant Detail Page**
   - Build detailed view
   - Add notes interface
   - Show activity timeline

---

## Migration Details

**Migration Name:** `create_applicants_system`
**Status:** ✅ Successfully Applied
**Date:** 2026-01-12

The migration includes:
- 3 core tables
- 1 enum type (application_status)
- 9 performance indexes
- 11 RLS policies
- 3 triggers
- 1 helper function
- Complete security setup

---

## Support & Troubleshooting

### Common Issues

**Issue:** Can't submit applications from public form
**Solution:** Ensure RLS policy "Public can submit applications" is enabled and allows anonymous INSERT

**Issue:** Admins can't view applicants
**Solution:** Verify admin user exists in `admin_users` table with `is_active = true`

**Issue:** Status changes not being logged
**Solution:** Check that trigger `log_status_change` is enabled on applicants table

**Issue:** Rate limiting not working
**Solution:** Ensure IP address is being captured and passed to `check_application_rate_limit()`

---

## Security Checklist

- [x] RLS enabled on all tables
- [x] Public can only INSERT (not SELECT/UPDATE/DELETE)
- [x] Admins must be authenticated and active
- [x] Role-based access control implemented
- [x] Email validation in place
- [x] Rate limiting function created
- [x] Audit trail automatic and immutable
- [x] Foreign keys with proper CASCADE rules
- [x] No sensitive data exposed to public

---

**Database setup is complete and production-ready!**

You can now proceed with building the frontend application form and admin interfaces.
