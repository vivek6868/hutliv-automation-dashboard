-- Create user_memberships table for linking users to clients
CREATE TABLE IF NOT EXISTS user_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, client_id)
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_memberships_user_id ON user_memberships(user_id);

-- Create index on client_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_memberships_client_id ON user_memberships(client_id);

-- Add RLS (Row Level Security) policies
ALTER TABLE user_memberships ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own memberships
CREATE POLICY "Users can read their own memberships"
  ON user_memberships
  FOR SELECT
  USING (user_id = auth.uid());

-- Policy: Users can insert their own memberships
CREATE POLICY "Users can insert their own memberships"
  ON user_memberships
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Policy: Owners can update memberships for their clients
CREATE POLICY "Owners can update memberships"
  ON user_memberships
  FOR UPDATE
  USING (
    client_id IN (
      SELECT client_id FROM user_memberships
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );

-- Policy: Owners can delete memberships for their clients
CREATE POLICY "Owners can delete memberships"
  ON user_memberships
  FOR DELETE
  USING (
    client_id IN (
      SELECT client_id FROM user_memberships
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );
