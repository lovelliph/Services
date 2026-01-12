/*
  # Add Service Detail Fields

  1. Changes to `services` table
    - Add `long_description` (text) for detailed service descriptions on detail pages
    - Add `benefits` (text[]) for array of benefit descriptions

  2. Notes
    - These fields enhance the service detail pages with more comprehensive information
    - Existing services will have NULL values for these fields by default
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'long_description'
  ) THEN
    ALTER TABLE services ADD COLUMN long_description text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'benefits'
  ) THEN
    ALTER TABLE services ADD COLUMN benefits text[] DEFAULT '{}';
  END IF;
END $$;
