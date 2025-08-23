-- NextAuth.js Database Schema for Supabase
-- Run this in your Supabase SQL Editor to set up the required tables

-- Create next_auth schema
CREATE SCHEMA IF NOT EXISTS next_auth;

-- Create accounts table
CREATE TABLE next_auth.accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sessions table  
CREATE TABLE next_auth.sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_token TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create users table (enhanced for credentials authentication)
CREATE TABLE next_auth.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  full_name TEXT,
  email TEXT UNIQUE NOT NULL,
  email_verified TIMESTAMPTZ,
  image TEXT,
  avatar_url TEXT,
  password_hash TEXT, -- For credentials authentication
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add separate public users table for additional user data
CREATE TABLE IF NOT EXISTS public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  full_name TEXT,
  email TEXT UNIQUE NOT NULL,
  email_verified TIMESTAMPTZ,
  image TEXT,
  avatar_url TEXT,
  password_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create verification_tokens table
CREATE TABLE next_auth.verification_tokens (
  identifier TEXT,
  token TEXT UNIQUE NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (identifier, token)
);

-- Add foreign key constraints
ALTER TABLE next_auth.accounts 
ADD CONSTRAINT fk_accounts_user_id 
FOREIGN KEY (user_id) REFERENCES next_auth.users(id) ON DELETE CASCADE;

ALTER TABLE next_auth.sessions 
ADD CONSTRAINT fk_sessions_user_id 
FOREIGN KEY (user_id) REFERENCES next_auth.users(id) ON DELETE CASCADE;

-- Create indexes for performance
CREATE INDEX idx_accounts_user_id ON next_auth.accounts(user_id);
CREATE INDEX idx_sessions_user_id ON next_auth.sessions(user_id);
CREATE INDEX idx_sessions_expires ON next_auth.sessions(expires);
CREATE INDEX idx_verification_tokens_expires ON next_auth.verification_tokens(expires);

-- Set up Row Level Security (RLS)
ALTER TABLE next_auth.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE next_auth.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE next_auth.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE next_auth.verification_tokens ENABLE ROW LEVEL SECURITY;

-- Create policies for NextAuth service role access
-- Note: These policies allow full access to NextAuth service role
-- Adjust according to your security requirements

CREATE POLICY "NextAuth can manage accounts" ON next_auth.accounts
FOR ALL USING (true);

CREATE POLICY "NextAuth can manage sessions" ON next_auth.sessions  
FOR ALL USING (true);

CREATE POLICY "NextAuth can manage users" ON next_auth.users
FOR ALL USING (true);

CREATE POLICY "NextAuth can manage verification tokens" ON next_auth.verification_tokens
FOR ALL USING (true);

-- Grant permissions to authenticated users to read their own data
CREATE POLICY "Users can read own account" ON next_auth.accounts
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can read own sessions" ON next_auth.sessions
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can read own user data" ON next_auth.users
FOR SELECT USING (id = auth.uid());

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION next_auth.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_accounts_updated_at 
BEFORE UPDATE ON next_auth.accounts
FOR EACH ROW EXECUTE FUNCTION next_auth.update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at
BEFORE UPDATE ON next_auth.sessions  
FOR EACH ROW EXECUTE FUNCTION next_auth.update_updated_at_column();

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON next_auth.users
FOR EACH ROW EXECUTE FUNCTION next_auth.update_updated_at_column();

-- Success message
SELECT 'NextAuth.js database schema created successfully!' as message;
