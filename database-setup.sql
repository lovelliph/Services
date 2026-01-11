/*
  # Database Setup for BPO Solutions Website

  Run this SQL in your Supabase SQL Editor to set up the contact inquiries table.

  ## What this creates:
  - A table to store contact form submissions
  - Security policies to allow public form submissions
  - Indexes for faster queries
*/

-- Create contact inquiries table
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  phone text,
  service text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert contact inquiries (for the public contact form)
CREATE POLICY "Allow public inserts"
  ON contact_inquiries
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only authenticated users can read inquiries (for admin dashboard)
CREATE POLICY "Allow authenticated reads"
  ON contact_inquiries
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_email ON contact_inquiries(email);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_created_at ON contact_inquiries(created_at DESC);
