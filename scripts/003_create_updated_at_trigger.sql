-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for clients table
DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for user_memberships table
DROP TRIGGER IF EXISTS update_user_memberships_updated_at ON user_memberships;
CREATE TRIGGER update_user_memberships_updated_at
  BEFORE UPDATE ON user_memberships
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
