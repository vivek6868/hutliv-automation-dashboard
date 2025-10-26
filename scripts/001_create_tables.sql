-- Create clients table for business profiles
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
  whatsapp_number TEXT,
  website TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_memberships table to link users to businesses
CREATE TABLE IF NOT EXISTS user_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'owner',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, client_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_memberships_user_id ON user_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_user_memberships_client_id ON user_memberships(client_id);

-- Enable Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_memberships ENABLE ROW LEVEL SECURITY;

-- RLS Policies for clients table
CREATE POLICY "Users can view their own clients"
  ON clients FOR SELECT
  USING (
    id IN (
      SELECT client_id FROM user_memberships WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own clients"
  ON clients FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own clients"
  ON clients FOR UPDATE
  USING (
    id IN (
      SELECT client_id FROM user_memberships WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for user_memberships table
CREATE POLICY "Users can view their own memberships"
  ON user_memberships FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own memberships"
  ON user_memberships FOR INSERT
  WITH CHECK (user_id = auth.uid());
