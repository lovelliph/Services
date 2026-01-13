# Applicants Management System - Implementation Tracker

## Project Overview
Complete Applicants management system with public application form and comprehensive admin interface for managing the applicant lifecycle.

---

## 1. Database Schema and Setup ✅ COMPLETED

### Core Tables
- [x] Create `applicants` table with columns:
  - [x] id (uuid, primary key)
  - [x] name (text, not null)
  - [x] email (text, not null, with validation)
  - [x] phone (text)
  - [x] position_applied (text)
  - [x] message (text, cover letter)
  - [x] status (enum: 'new', 'reviewing', 'shortlisted', 'rejected', 'hired', 'archived')
  - [x] created_at (timestamp)
  - [x] updated_at (timestamp)
  - [x] company_name (text, optional)
  - [x] website_url (text, optional)
  - [x] experience_years (integer, optional)
  - [x] location (text, optional)
  - [x] availability (text, optional)
  - [x] ip_address (text, for spam detection)

- [x] Create `application_logs` table for audit trail:
  - [x] id (uuid, primary key)
  - [x] applicant_id (foreign key to applicants)
  - [x] action (text: 'status_change', 'note_added', 'deleted')
  - [x] old_value (text)
  - [x] new_value (text)
  - [x] admin_id (uuid, reference to admin user)
  - [x] created_at (timestamp)

- [x] Create `application_notes` table:
  - [x] id (uuid, primary key)
  - [x] applicant_id (foreign key to applicants)
  - [x] admin_id (uuid, reference to admin user)
  - [x] content (text)
  - [x] created_at (timestamp)
  - [x] updated_at (timestamp)

### Database Optimization
- [x] Create index on `applicants.email` (for duplicate prevention)
- [x] Create index on `applicants.status` (for filtering)
- [x] Create index on `applicants.created_at` (for sorting)
- [x] Create index on `applicants.position_applied` (for filtering)
- [x] Create index on `application_logs.applicant_id` (for queries)
- [x] Create index on `application_notes.applicant_id` (for queries)

### Row Level Security (RLS)
- [x] Enable RLS on `applicants` table
- [x] Create policy: Public INSERT (anyone can apply)
- [x] Create policy: SELECT for authenticated admin users (viewer+ role)
- [x] Create policy: UPDATE for authenticated admin users (editor+ role)
- [x] Create policy: DELETE for authenticated admin users (editor+ role)

- [x] Enable RLS on `application_logs` table
- [x] Create policy: SELECT for authenticated admin users (viewer+ role)
- [x] Create policy: INSERT for authenticated admins

- [x] Enable RLS on `application_notes` table
- [x] Create policy: SELECT for authenticated admin users (viewer+ role)
- [x] Create policy: INSERT for authenticated admin users
- [x] Create policy: UPDATE for note author or admin
- [x] Create policy: DELETE for note author or admin

### Database Migrations
- [x] Comprehensive migration applied: `create_applicants_system`
  - [x] All three tables created with proper structure
  - [x] All indexes created for optimal performance
  - [x] All RLS policies implemented and enabled
  - [x] Automatic triggers for timestamps and audit logging
  - [x] Helper function for rate limiting checks

### Additional Features Implemented
- [x] Email validation constraint on applicants table
- [x] Automatic audit logging for status changes via triggers
- [x] Helper function `check_application_rate_limit()` for spam prevention
- [x] Proper foreign key constraints with CASCADE and SET NULL rules

---

## 2. Public Application Form Page ✅ COMPLETED

### Page Setup
- [x] Create `/src/pages/Apply.tsx` page component
- [x] Add route to `/src/App.tsx`: `<Route path="/apply" element={<PublicLayout><Apply /></PublicLayout>} />`

### Form Layout & Sections
- [x] Create hero section with company info and call-to-action
- [x] Create form with three sections: Personal Info, Professional Background, Message
- [x] Add form title and description

### Form Fields & Validation
- [x] Full Name field (required, text input)
  - [x] Validation: min 2 characters, max 100 characters
  - [x] Error message display

- [x] Email field (required, email input)
  - [x] Validation: email format (regex pattern)
  - [x] Duplicate application check (show warning if already applied)
  - [x] Error message display

- [x] Phone field (required, tel input)
  - [x] Validation: phone number format
  - [x] Optional formatting (auto-format as user types)
  - [x] Error message display

- [x] Position Applied dropdown (required)
  - [x] Fetch available positions from database or hardcode options
  - [x] Display position list with descriptions
  - [x] Error message display

- [x] Years of Experience field (optional, number input)
  - [x] Min: 0, Max: 100
  - [x] Show in Professional Background section

- [x] Company Name field (optional, text input)
  - [x] Max 100 characters
  - [x] Show in Professional Background section

- [x] Website/Portfolio URL field (optional, url input)
  - [x] Validation: valid URL format
  - [x] Error message display
  - [x] Clickable link preview
  - [x] Show in Professional Background section

- [x] Message/Cover Letter field (required, textarea)
  - [x] Validation: min 50 characters, max 2000 characters
  - [x] Character counter showing current/max
  - [x] Error message display

- [x] Honeypot field (hidden, for bot detection)
  - [x] Hidden input with tabindex="-1"
  - [x] Check if filled before submitting

### Form Functionality
- [x] Real-time field validation (debounced)
- [x] Required field indicators with asterisks
- [x] Inline error messages below each field
- [x] Submit button with loading state
- [x] Disabled submit button during submission
- [x] Loading spinner in/on submit button
- [x] Form submission handler with error handling
- [x] Capture IP address before submission
- [x] Rate limiting check (max 5 per IP per day)
- [x] Server-side validation in Supabase

### Form Success/Error States
- [x] Success modal/page after submission
- [x] Thank you message with company response time estimate
- [x] Clear next steps information
- [x] "Back to home" button with delay
- [x] Error toast notifications on failure
- [x] Retry mechanism for failed submissions
- [x] Redirect to home after 3 seconds on success

### Form Styling & Responsiveness
- [x] Beautiful form styling matching site design
- [x] Responsive layout (mobile, tablet, desktop)
- [x] Input focus states with visual feedback
- [x] Hover effects on interactive elements
- [x] Proper spacing and typography
- [x] Accessible form labels and error messages
- [x] Touch-friendly button sizes for mobile

### Features Implemented
- **Comprehensive Form Validation**: Real-time, debounced validation with clear error messages
- **Duplicate Detection**: Automatically checks if email has been used before and shows friendly warning
- **Rate Limiting**: IP-based rate limiting (5 applications per 24 hours) to prevent spam
- **Bot Protection**: Hidden honeypot field to catch automated submissions
- **Character Counter**: Live character count for message field with visual feedback
- **URL Preview**: Clickable link preview for portfolio/website URLs
- **Success Flow**: Beautiful success page with clear next steps and auto-redirect
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Responsive Design**: Mobile-first design with touch-friendly inputs
- **Accessibility**: Proper labels, ARIA attributes, and semantic HTML

### Files Created
- `src/pages/Apply.tsx` - Complete application form page with all features
- Route added to `src/App.tsx`

### Route Access
- **Public URL**: `/apply`
- **No authentication required** - Anyone can submit applications

---

## 3. Admin Applicants List Page

### Page Setup
- [ ] Create `/src/pages/admin/Applicants.tsx` page component
- [ ] Add route to `/src/App.tsx`: `<Route path="/admin/applicants" element={<ProtectedRoute><AdminLayout><Applicants /></AdminLayout></ProtectedRoute>} />`

### Page Header
- [ ] Page title: "Applicants"
- [ ] Page description: "Manage job applications"
- [ ] Add button: Link to view statistics (optional)

### Summary Stats Section
- [ ] Display in cards/boxes at top:
  - [ ] Total Applications (count)
  - [ ] New (count, blue badge)
  - [ ] Reviewing (count, orange badge)
  - [ ] Shortlisted (count, green badge)
  - [ ] Rejected (count, red badge)
  - [ ] Hired (count, purple badge)
- [ ] Auto-update counts when status changes
- [ ] Click stat to filter by that status

### Search & Filter Section
- [ ] Search input field
  - [ ] Placeholder: "Search by name, email, phone..."
  - [ ] Search across: name, email, phone, position
  - [ ] Debounced search (300ms delay)
  - [ ] Clear search button (X icon)

- [ ] Status filter dropdown
  - [ ] Options: All Statuses, New, Reviewing, Shortlisted, Rejected, Hired, Archived
  - [ ] Multi-select capability (optional)
  - [ ] Clear filter button

- [ ] Position filter dropdown
  - [ ] Dynamic list from database
  - [ ] Options: All Positions, [list of positions]
  - [ ] Clear filter button

- [ ] Date range picker (optional but nice)
  - [ ] From date and To date inputs
  - [ ] Preset options: Last 7 days, Last 30 days, Last 3 months
  - [ ] Clear dates button

- [ ] Filter summary display
  - [ ] Show active filters
  - [ ] "Clear all filters" button

### Table Display
- [ ] Responsive table with columns:
  - [ ] Checkbox (for multi-select)
  - [ ] Applicant Name (with optional avatar)
  - [ ] Email
  - [ ] Phone
  - [ ] Position Applied
  - [ ] Status (color-coded badge)
  - [ ] Application Date
  - [ ] Actions (Edit, Delete icons)

- [ ] Table sorting
  - [ ] Click column header to sort
  - [ ] Sort indicators (up/down arrows)
  - [ ] Default sort: Created date (newest first)
  - [ ] Sortable columns: Name, Email, Date, Status

- [ ] Pagination
  - [ ] Page size selector: 10, 25, 50, 100 items
  - [ ] Previous/Next buttons
  - [ ] Current page indicator
  - [ ] Total count display: "Showing X-Y of Z"
  - [ ] Jump to page input (optional)

- [ ] Table interactions
  - [ ] Hover row to highlight
  - [ ] Click row to view details
  - [ ] Checkbox to select individual rows
  - [ ] Select all checkbox in header
  - [ ] Deselect all checkbox when all selected

### Row Actions
- [ ] Edit icon (pencil): Opens detail page
- [ ] Delete icon (trash): Opens delete confirmation modal

### Bulk Actions Bar
- [ ] Shows only when rows are selected
- [ ] Display count: "X applicants selected"
- [ ] Bulk Status Change dropdown
  - [ ] Options: All statuses
  - [ ] Shows confirmation modal
  - [ ] Updates all selected applicants

- [ ] Bulk Delete button
  - [ ] Red styling
  - [ ] Shows confirmation modal with count
  - [ ] Confirmation required

- [ ] Export Selected button (optional)
  - [ ] Exports selected to CSV
  - [ ] Or exports all visible

### Mobile Responsiveness
- [ ] Table converts to cards on mobile
- [ ] Card layout shows: Name, Email, Position, Status, Date, Actions
- [ ] Filters collapse into accordion or dropdown
- [ ] Full functionality maintained on mobile

### Loading & Empty States
- [ ] Loading skeleton while fetching data
- [ ] Skeleton rows (5-10 placeholder rows)
- [ ] Empty state message: "No applicants yet"
- [ ] Empty state CTA: "Share apply link" or "Refresh"
- [ ] Error state with retry button

### Copy/Share Functionality
- [ ] Copy apply link button in empty state
- [ ] Show link: `/apply` URL
- [ ] Confirmation toast: "Link copied to clipboard"

---

## 4. Admin Applicant Detail Page

### Page Setup
- [ ] Create `/src/pages/admin/ApplicantDetail.tsx` page component
- [ ] Add route to `/src/App.tsx`: `<Route path="/admin/applicants/:id" element={<ProtectedRoute><AdminLayout><ApplicantDetail /></AdminLayout></ProtectedRoute>} />`
- [ ] Add back button and breadcrumb navigation

### Header Section
- [ ] Breadcrumb: Admin > Applicants > [Name]
- [ ] Back button (arrow + "Back to Applicants")
- [ ] Applicant name as main heading
- [ ] Application date badge

### Left Column - Applicant Information
- [ ] Section: Personal Information
  - [ ] Name with icon
  - [ ] Email (clickable mailto link)
  - [ ] Phone (clickable tel link)
  - [ ] Location (if provided)
  - [ ] Website/Portfolio link (clickable, opens in new tab)

- [ ] Section: Professional Information
  - [ ] Position Applied
  - [ ] Years of Experience (if provided)
  - [ ] Company Name (if provided)
  - [ ] Availability (if provided)

- [ ] Section: Application Details
  - [ ] Application Date (formatted)
  - [ ] Application Status (with color badge)
  - [ ] IP Address (for internal use)

- [ ] Section: Cover Letter/Message
  - [ ] Full message text displayed
  - [ ] Formatted with proper line breaks
  - [ ] Word count

### Right Column - Actions & Management
- [ ] Status Management
  - [ ] Current status display with color badge
  - [ ] Dropdown to change status
  - [ ] Options: New, Reviewing, Shortlisted, Rejected, Hired, Archived
  - [ ] Confirmation modal before changing
  - [ ] Shows: Previous status, New status, Current date/time
  - [ ] Submit button to confirm

- [ ] Action Buttons
  - [ ] "Send Email" button
    - [ ] Dropdown with templates: Interview Request, Rejection, Offer Letter
    - [ ] Opens compose modal
  - [ ] "Add Note" button
    - [ ] Opens note input modal
  - [ ] "Archive" button
    - [ ] Archive instead of delete (soft delete)
  - [ ] "Delete" button
    - [ ] Red styling
    - [ ] Confirmation modal required
    - [ ] Permanent delete

### Timeline/Activity Section
- [ ] Section: Activity Timeline
  - [ ] Display all status changes with:
    - [ ] Status change badge
    - [ ] Admin who changed it
    - [ ] Date and time
    - [ ] Icon indicating type of change
  - [ ] Display all notes with:
    - [ ] Note content
    - [ ] Admin who wrote it
    - [ ] Date and time
  - [ ] Timeline sorted by date (newest first)
  - [ ] Expandable/collapsible entries

### Notes Section
- [ ] Section: Internal Notes
  - [ ] Display all existing notes in chronological order
  - [ ] Each note shows:
    - [ ] Author name
    - [ ] Date/time
    - [ ] Note content
    - [ ] Edit button (if author or admin)
    - [ ] Delete button (if author or admin)

  - [ ] Add New Note section
    - [ ] Textarea for new note
    - [ ] Character count
    - [ ] Submit button
    - [ ] Cancel button
    - [ ] Success notification on submit

### Email Interface (Optional)
- [ ] Email Templates dropdown
  - [ ] "Request for Interview"
  - [ ] "Thank You (Rejection)"
  - [ ] "Congratulations Offer"
  - [ ] Custom email

- [ ] Email Compose Modal
  - [ ] Pre-filled with template
  - [ ] Subject line editable
  - [ ] Body text editable
  - [ ] Preview button
  - [ ] Send button
  - [ ] Cancel button

### Responsive Design
- [ ] Desktop: Two-column layout (info left, actions right)
- [ ] Tablet: Stacked layout with sidebar
- [ ] Mobile: Single column, collapsible sections

### Loading & Error States
- [ ] Loading spinner while fetching applicant data
- [ ] Error message if applicant not found
- [ ] Error message if not authorized to view
- [ ] Retry button on error

---

## 5. Admin Navigation Integration

### AdminLayout.tsx Updates
- [ ] Add Applicants to navigation array
  - [ ] Icon: Mail or Users icon from lucide-react
  - [ ] Name: "Applicants"
  - [ ] Href: "/admin/applicants"
  - [ ] Position: After "Inquiries", before "Settings"

- [ ] Update isActive function
  - [ ] Correctly highlight when on `/admin/applicants` or `/admin/applicants/:id`

### Sidebar Menu
- [ ] Applicants menu item appears in sidebar
- [ ] Active state styling applied correctly
- [ ] Icon displays correctly
- [ ] Link works properly
- [ ] Responsive on mobile (visible in hamburger menu)

---

## 6. Form Validation and Error Handling

### Client-Side Validation
- [ ] Email format validation (regex)
- [ ] Phone format validation (optional auto-format)
- [ ] URL format validation (for portfolio)
- [ ] Min/max character length checks
- [ ] Required field checks
- [ ] Real-time validation (debounced 300ms)
- [ ] Error messages display inline

### Duplicate Application Handling
- [ ] Check email against existing applicants
- [ ] Show warning: "You've already applied on [date]. Thank you!"
- [ ] Allow reapplication (optional - disable button if recent)
- [ ] Show previous application date

### Rate Limiting
- [ ] Check 1 submission per email per day
- [ ] Or check 5 submissions per IP per 24 hours
- [ ] Return appropriate error message
- [ ] Show retry time estimate

### Server-Side Validation (Supabase)
- [ ] Validate all inputs on insert
- [ ] Check unique email constraint
- [ ] Sanitize text inputs
- [ ] Validate URLs
- [ ] Check rate limiting rules

### Error Handling
- [ ] Network errors: Show message + Retry button
- [ ] Validation errors: Show specific error message
- [ ] Rate limit errors: Show message + time remaining
- [ ] Server errors: Show generic message + Retry button
- [ ] Timeout handling: Auto-retry or show error

---

## 7. Data Management and Admin Features

### Delete Operations
- [ ] Single delete with confirmation modal
  - [ ] Shows applicant name
  - [ ] "This action cannot be undone" warning
  - [ ] Cancel and Delete buttons

- [ ] Bulk delete with confirmation modal
  - [ ] Shows count: "Delete X applicants?"
  - [ ] "This action cannot be undone" warning
  - [ ] Cancel and Delete All buttons
  - [ ] Disable button if no items selected

### Soft Delete (Archive)
- [ ] Archive button on detail page
- [ ] Archived status prevents showing in list (unless filter applied)
- [ ] Can restore archived applicants (optional)
- [ ] Keep archived data in database

### Status Management
- [ ] Update status from detail page
- [ ] Update status from bulk actions
- [ ] Confirmation modal before change
- [ ] Log status change in audit trail
- [ ] Notify admin of change success

### Notes and Comments
- [ ] Add note to applicant
- [ ] Edit own notes
- [ ] Delete own notes
- [ ] Admin can delete any note
- [ ] Timestamp on each note
- [ ] Author name displayed

### Activity Log Viewing
- [ ] View complete activity history
- [ ] See status changes with dates/times
- [ ] See note additions with content preview
- [ ] See admin actions with names
- [ ] Filter activity by type (optional)

### CSV Export
- [ ] Export selected applicants to CSV
  - [ ] Columns: Name, Email, Phone, Position, Status, Date, Company, Website
  - [ ] Filename: `applicants-[date].csv`
  - [ ] Proper CSV formatting

- [ ] Export all applicants to CSV
  - [ ] Option in bulk actions (if no selection)
  - [ ] Same columns as above
  - [ ] Filename: `applicants-all-[date].csv`

- [ ] Export current filtered view
  - [ ] Respects search and filters
  - [ ] Shows only visible results

---

## 8. User Experience and Interface Polish

### Loading States
- [ ] List page: Skeleton rows while loading
- [ ] Detail page: Spinner while loading data
- [ ] Form submission: Disabled button with spinner
- [ ] Table sorting/filtering: Loading indicator

### Empty States
- [ ] No applicants: "No applicants yet. Share the apply link"
- [ ] Search/filter results: "No results match your filters"
- [ ] Empty notes section: "No notes yet. Add one to get started"
- [ ] Each empty state has helpful CTA

### Toast Notifications
- [ ] Success: Status updated, Note added, Deleted, Exported
- [ ] Error: Failed to update, Failed to delete, Network error
- [ ] Info: Copied to clipboard, Too many applications (rate limit)
- [ ] Auto-dismiss after 3-4 seconds
- [ ] Position: Top-right or bottom-right
- [ ] Smooth animations

### Confirmation Modals
- [ ] Delete confirmation: Name/count, warning, buttons
- [ ] Status change confirmation: Old status, new status, date
- [ ] Bulk delete confirmation: Count, warning, buttons
- [ ] Email send confirmation: Preview, send button

### Visual Feedback
- [ ] Hover states on buttons and rows
- [ ] Active state on selected checkboxes
- [ ] Loading spinners during requests
- [ ] Smooth transitions and animations
- [ ] Color-coded status badges with consistent palette

### Status Badge Colors
- [ ] New: Blue (#3B82F6)
- [ ] Reviewing: Orange (#F59E0B)
- [ ] Shortlisted: Green (#10B981)
- [ ] Rejected: Red (#EF4444)
- [ ] Hired: Purple (#8B5CF6)
- [ ] Archived: Gray (#6B7280)

### Responsive Interactions
- [ ] Touch-friendly button sizes (min 44x44px)
- [ ] Proper spacing on mobile
- [ ] Collapsible sections on small screens
- [ ] Horizontal scroll for table on mobile (or convert to cards)
- [ ] Full functionality on all device sizes

---

## 9. Advanced Features (Optional)

### Email Integration
- [ ] Email templates for common responses
- [ ] Pre-filled subject lines
- [ ] Applicant merge tags in email ({{name}}, {{position}})
- [ ] Email preview before sending
- [ ] Track email sent in audit log
- [ ] (Optional) Track email opens with external service

### Kanban/Pipeline View
- [ ] Visual columns for each status
- [ ] Drag applicants between statuses
- [ ] Drag updates status automatically
- [ ] Card shows name, email, position
- [ ] Click card to open detail view
- [ ] Responsive drag-and-drop on mobile

### Reports and Analytics
- [ ] Applications by position chart
- [ ] Status distribution pie chart
- [ ] Time to hire metrics
- [ ] Applications over time line chart
- [ ] Export reports as PDF (optional)

### Saved Filters
- [ ] Save filter combinations with name
- [ ] Recall saved filters from dropdown
- [ ] Manage saved filters (edit, delete)
- [ ] Default filters (optional)

### Search Enhancements
- [ ] Autocomplete suggestions
- [ ] Search history (recent searches)
- [ ] Advanced search operators (optional)

### Notes with @Mentions
- [ ] Type @ to mention team members
- [ ] Dropdown list of available admins
- [ ] Notify mentioned admins by email
- [ ] Highlight mentions in notes

### Follow-up Reminders
- [ ] Set reminder date on applicant
- [ ] Notification when reminder is due
- [ ] Snooze reminder functionality
- [ ] View upcoming reminders

---

## 10. Database Queries and Performance

### Query Optimization
- [ ] Paginated queries (avoid loading all at once)
- [ ] Database-side sorting (not client-side)
- [ ] Database-side filtering
- [ ] Indexed columns used in WHERE clauses
- [ ] Proper use of SELECT to fetch only needed columns

### Caching Strategies
- [ ] Cache summary stats (total, by status)
- [ ] Invalidate cache on new application
- [ ] Invalidate cache on status change
- [ ] Cache position list (changes infrequently)

### Rate Limiting
- [ ] 5 submissions per IP per 24 hours (on public form)
- [ ] Check on server-side (in Supabase or edge function)
- [ ] Store rate limit attempts in database or cache
- [ ] Return clear error message when limit reached

### Data Management
- [ ] Archive old rejected/hired applicants periodically
- [ ] Keep recent data in active table
- [ ] Maintain archive table for historical data
- [ ] Document archive/cleanup process

---

## 11. Security Considerations

### Input Validation
- [ ] Validate all inputs on client-side
- [ ] Validate all inputs on server-side
- [ ] Sanitize text fields to prevent XSS
- [ ] Validate URLs properly
- [ ] Reject malformed data

### Authentication & Authorization
- [ ] Require authentication for admin pages
- [ ] Check role-based access control
- [ ] Only viewer+ can view applicants
- [ ] Only editor+ can modify applicants
- [ ] Only super_admin+ can delete applicants (optional)

### Row Level Security (RLS)
- [ ] Public can INSERT to applicants (with rate limiting)
- [ ] Public CANNOT SELECT applicants
- [ ] Admin viewers can SELECT applicants
- [ ] Admin editors can UPDATE applicants
- [ ] Admin editors can DELETE applicants
- [ ] Cannot bypass RLS with direct API calls

### Audit Trail
- [ ] Log all status changes
- [ ] Log all admin actions (create, update, delete)
- [ ] Store who performed action (admin user)
- [ ] Store when action was performed
- [ ] Store what changed (old value, new value)
- [ ] Keep immutable audit log

### Data Protection
- [ ] Hash emails for duplicate detection (optional)
- [ ] Store IP addresses (for fraud detection)
- [ ] Secure form submission over HTTPS only
- [ ] No sensitive data in URLs (use POST instead of GET)
- [ ] CSRF protection on forms

---

## 12. Email and Notification System

### Confirmation Emails
- [ ] Send to applicant after submission: "We received your application"
- [ ] Include: Application date, Position, Next steps
- [ ] Unsubscribe link in footer

### Admin Notifications
- [ ] Email to admin on new application
- [ ] Include: Applicant name, email, position
- [ ] Link to view in admin panel
- [ ] Can toggle notifications on/off

### Standardized Templates
- [ ] Interview Request email
  - [ ] Subject: Interview Request - [Position]
  - [ ] Body: Personalized message with interview details
  - [ ] CTA: Accept/Decline buttons or link

- [ ] Rejection email
  - [ ] Subject: Thank You for Applying
  - [ ] Body: Professional rejection message
  - [ ] Encourage future applications

- [ ] Offer Letter email
  - [ ] Subject: Job Offer - [Position]
  - [ ] Body: Offer details and next steps
  - [ ] CTA: Accept offer with deadline

### Email Customization
- [ ] Preview before sending
- [ ] Edit subject and body
- [ ] Add merge tags: {{name}}, {{position}}, {{date}}
- [ ] Save custom templates (optional)

---

## 13. Responsive Design Strategy

### Desktop (lg, ≥1024px)
- [ ] Full table view with all columns visible
- [ ] Filters visible in header
- [ ] Two-column detail page (info left, actions right)
- [ ] Full sidebar navigation visible

### Tablet (md, 768px - 1023px)
- [ ] Condensed table (hide non-essential columns)
- [ ] Filters in dropdown/sidebar
- [ ] Single column detail view with sidebar
- [ ] Collapsible sidebar navigation

### Mobile (sm, <768px)
- [ ] Card-based table layout (each applicant is a card)
- [ ] Filters in collapsible accordion
- [ ] Single column detail view
- [ ] Hamburger menu for navigation
- [ ] Full-width buttons and inputs

### Touch-Friendly
- [ ] Minimum button size: 44x44px
- [ ] Minimum input size: 44px height
- [ ] Proper spacing between interactive elements
- [ ] Large touch targets for critical actions

### Mobile Navigation
- [ ] Hamburger menu for small screens
- [ ] Smooth open/close animation
- [ ] Tap anywhere to close menu
- [ ] Active page highlighted

---

## 14. Performance Optimizations

### Code Splitting
- [ ] Lazy load Apply page
- [ ] Lazy load admin applicants pages
- [ ] Code split form and detail components

### Component Optimization
- [ ] Use React.memo for table rows
- [ ] Use React.memo for table cells
- [ ] Memoize callback functions
- [ ] Avoid unnecessary re-renders

### Data Fetching
- [ ] Debounce search input (300ms)
- [ ] Lazy load applicant list (pagination)
- [ ] Cache position list
- [ ] Don't refetch unnecessary data

### Bundle Size
- [ ] Only import what's needed from lucide-react
- [ ] Minimize CSS (Tailwind purges unused)
- [ ] No unnecessary dependencies

### Image Optimization
- [ ] Lazy load avatars (if used)
- [ ] Compress images
- [ ] Use appropriate formats (WebP with fallback)

---

## 15. Testing and Validation Data

### Form Testing
- [ ] Test all validation rules
- [ ] Test with valid data → Success
- [ ] Test with invalid email → Error
- [ ] Test with short name → Error
- [ ] Test duplicate application → Warning
- [ ] Test rate limiting
- [ ] Test honeypot (bot prevention)

### Admin List Testing
- [ ] Test search functionality
- [ ] Test filters individually
- [ ] Test combined filters
- [ ] Test sorting by each column
- [ ] Test pagination
- [ ] Test bulk operations (select, delete, status change)
- [ ] Test export functionality

### Admin Detail Testing
- [ ] Test loading applicant data
- [ ] Test status change workflow
- [ ] Test adding notes
- [ ] Test viewing activity log
- [ ] Test email template selection
- [ ] Test delete operation

### Mobile Testing
- [ ] Test form on mobile devices
- [ ] Test admin list on tablet/mobile
- [ ] Test detail page on mobile
- [ ] Test touch interactions
- [ ] Test responsive breakpoints

### Seed Data
- [ ] Create test applicants in each status
- [ ] Create test applicants for each position
- [ ] Create old and recent applications
- [ ] Create applicants with full info and minimal info

### Role-Based Access Testing
- [ ] Test viewer can view but not modify
- [ ] Test editor can create and modify
- [ ] Test unauthenticated cannot access admin
- [ ] Test deleted accounts lose access

---

## 16. Deployment Checklist

### Before Production
- [ ] All tests passing
- [ ] No console errors or warnings
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] RLS policies enabled
- [ ] Rate limiting configured
- [ ] Email templates configured (if using)
- [ ] Error logging configured

### Production Deployment
- [ ] Build passes: `npm run build`
- [ ] No type errors: `npm run typecheck`
- [ ] No linting errors: `npm run lint`
- [ ] Deploy to Netlify or hosting platform
- [ ] Verify all routes work
- [ ] Verify email sending works
- [ ] Verify rate limiting works
- [ ] Monitor error logs

### Post-Deployment
- [ ] Share apply link with team
- [ ] Test form submission in production
- [ ] Test admin pages in production
- [ ] Monitor for errors
- [ ] Check database for new applications
- [ ] Set up email notifications

---

## Summary Statistics

| Category | Total Tasks | Completed | In Progress | Remaining |
|----------|-------------|-----------|-------------|-----------|
| Database Setup | 17 | 0 | 0 | 17 |
| Public Form | 30 | 0 | 0 | 30 |
| Admin List | 30 | 0 | 0 | 30 |
| Admin Detail | 27 | 0 | 0 | 27 |
| Navigation | 7 | 0 | 0 | 7 |
| Validation | 15 | 0 | 0 | 15 |
| Data Management | 15 | 0 | 0 | 15 |
| UX Polish | 17 | 0 | 0 | 17 |
| Advanced Features | 17 | 0 | 0 | 17 |
| Performance | 11 | 0 | 0 | 11 |
| Security | 16 | 0 | 0 | 16 |
| Email System | 14 | 0 | 0 | 14 |
| Responsive Design | 15 | 0 | 0 | 15 |
| Optimization | 8 | 0 | 0 | 8 |
| Testing | 20 | 0 | 0 | 20 |
| Deployment | 17 | 0 | 0 | 17 |
| **TOTALS** | **322** | **0** | **0** | **322** |

---

## Priority Tiers

### Tier 1: Essential (MVP)
- [ ] Database tables and RLS setup
- [ ] Public application form
- [ ] Admin applicants list page
- [ ] Admin applicant detail page
- [ ] Navigation integration
- [ ] Basic form validation
- [ ] Status management

### Tier 2: Important
- [ ] Search and filtering
- [ ] Bulk operations
- [ ] Export to CSV
- [ ] Activity logging
- [ ] Notes system
- [ ] Email notifications
- [ ] Mobile responsiveness

### Tier 3: Enhancement
- [ ] Kanban view
- [ ] Reports/Analytics
- [ ] Saved filters
- [ ] Follow-up reminders
- [ ] @mentions in notes
- [ ] Advanced features

---

## Next Steps

1. Start with **Tier 1 (Database Setup)** - Create migrations and RLS policies
2. Build **Public Form** - Get the application form working end-to-end
3. Build **Admin List** - Create the core admin interface
4. Build **Admin Detail** - Add applicant detail and management features
5. **Polish & Test** - Responsive design, error handling, edge cases
6. **Deploy & Monitor** - Get to production and gather feedback

---

Last Updated: 2025-01-12
Status: Not Started
