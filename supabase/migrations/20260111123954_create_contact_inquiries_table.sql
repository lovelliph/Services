/*
  # Create Contact Inquiries Table

  ## Overview
  This migration sets up the database structure for storing contact form submissions from the BPO Solutions website.

  ## Tables Created
  1. **contact_inquiries**
     - `id` (uuid, primary key) - Unique identifier for each inquiry
     - `name` (text, required) - Full name of the person submitting the inquiry
     - `email` (text, required) - Email address for follow-up
     - `company` (text, optional) - Company name if applicable
     - `phone` (text, optional) - Phone number for contact
     - `service` (text, required) - The service they're interested in
     - `message` (text, required) - Detailed message about their needs
     - `created_at` (timestamptz) - Timestamp when the inquiry was submitted

  ## Security
  - Row Level Security (RLS) is enabled on the contact_inquiries table
  - **Public Insert Policy**: Allows anonymous users to submit contact forms (public-facing form)
  - **Authenticated Read Policy**: Only authenticated users (admins) can view inquiries

  ## Performance
  - Index on `email` for faster lookups by email address
  - Index on `created_at` (descending) for efficient chronological queries

  ## Notes
  - Uses `gen_random_uuid()` for automatic ID generation
  - Timestamps default to current time for automatic tracking
  - All policies are restrictive by default for security
*/

-- Create contact inquiries table
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text DEFAULT '',
  phone text DEFAULT '',
  service text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert contact inquiries (for the public contact form)
CREATE POLICY "Allow public to submit contact forms"
  ON contact_inquiries
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only authenticated users can read inquiries (for admin dashboard)
CREATE POLICY "Allow authenticated users to view inquiries"
  ON contact_inquiries
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_email 
  ON contact_inquiries(email);

CREATE INDEX IF NOT EXISTS idx_contact_inquiries_created_at 
  ON contact_inquiries(created_at DESC);