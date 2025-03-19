/*
  # Create Subscribers Table

  1. New Tables
    - `subscribers`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `created_at` (timestamp with time zone)
      - `status` (text) - For tracking subscription status

  2. Security
    - Enable RLS on subscribers table
    - Add policy for inserting new subscribers
*/

-- Create subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'pending'
);

-- Enable Row Level Security
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous users to insert
CREATE POLICY "Allow anonymous insert" ON subscribers
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy to allow service role to read all subscribers
CREATE POLICY "Allow service role to read all subscribers" ON subscribers
  FOR SELECT
  TO service_role
  USING (true);