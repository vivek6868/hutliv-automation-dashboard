-- Create clients table for storing business information
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  business_type TEXT,
  phone_number TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'India',
  whatsapp_number TEXT NOT NULL,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on business_name for faster searches
CREATE INDEX IF NOT EXISTS idx_clients_business_name ON clients(business_name);

-- Create index on whatsapp_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_clients_whatsapp_number ON clients(whatsapp_number);

-- Add RLS (Row Level Security) policies
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read clients they are members of
CREATE POLICY "Users can read their own clients"
  ON clients
  FOR SELECT
  USING (
    id IN (
      SELECT client_id FROM user_memberships
      WHERE user_id = auth.uid()
    )
  );

-- Policy: Users can insert clients (will be linked via user_memberships)
CREATE POLICY "Users can insert clients"
  ON clients
  FOR INSERT
  WITH CHECK (true);

-- Policy: Users can update clients they are members of
CREATE POLICY "Users can update their own clients"
  ON clients
  FOR UPDATE
  USING (
    id IN (
      SELECT client_id FROM user_memberships
      WHERE user_id = auth.uid()
    )
  );
