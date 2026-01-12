/*
  # Create CMS Collections for Blogs, Projects, and Services

  1. New Tables
    - `blogs`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `slug` (text, unique)
      - `content` (text, the full blog post)
      - `excerpt` (text, short summary)
      - `featured_image` (text, image URL)
      - `author` (text)
      - `published_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `projects`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `slug` (text, unique)
      - `description` (text)
      - `image` (text, image URL)
      - `category` (text)
      - `featured` (boolean, for homepage showcase)
      - `client` (text)
      - `link` (text, project link)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `services`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `slug` (text, unique)
      - `description` (text)
      - `image` (text, image URL)
      - `order` (integer, for display ordering)
      - `features` (text[], array of feature descriptions)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add public SELECT policies (blogs and projects publicly readable after publishing)
    - Add authenticated admin policies (for future admin interface)
*/

CREATE TABLE IF NOT EXISTS blogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text,
  featured_image text,
  author text DEFAULT 'Lovelli',
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image text,
  category text,
  featured boolean DEFAULT false,
  client text,
  link text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image text,
  "order" integer,
  features text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Blogs are publicly readable"
  ON blogs FOR SELECT
  USING (published_at <= now());

CREATE POLICY "Projects are publicly readable"
  ON projects FOR SELECT
  USING (true);

CREATE POLICY "Services are publicly readable"
  ON services FOR SELECT
  USING (true);
