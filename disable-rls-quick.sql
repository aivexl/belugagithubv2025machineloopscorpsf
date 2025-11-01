-- Script untuk memperbaiki RLS Policy (Solusi Cepat)
-- Jalankan script ini di Supabase SQL Editor

-- Disable RLS untuk admin panel (solusi cepat)
ALTER TABLE crypto_exchanges DISABLE ROW LEVEL SECURITY;
ALTER TABLE crypto_airdrop DISABLE ROW LEVEL SECURITY;
ALTER TABLE crypto_ico_ido DISABLE ROW LEVEL SECURITY;
ALTER TABLE crypto_fundraising DISABLE ROW LEVEL SECURITY;
ALTER TABLE crypto_glossary DISABLE ROW LEVEL SECURITY;

-- Verifikasi RLS status
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename IN ('crypto_exchanges', 'crypto_airdrop', 'crypto_ico_ido', 'crypto_fundraising', 'crypto_glossary')
ORDER BY tablename;

















