-- Script untuk memperbaiki Row Level Security Policy (Alternatif Aman)
-- Jalankan script ini di Supabase SQL Editor

-- Opsi 1: Disable RLS untuk admin panel (tidak disarankan untuk production)
-- ALTER TABLE crypto_exchanges DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE crypto_airdrop DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE crypto_ico_ido DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE crypto_fundraising DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE crypto_glossary DISABLE ROW LEVEL SECURITY;

-- Opsi 2: Buat policy yang lebih permisif (disarankan)
-- Drop existing policies yang terlalu ketat
DROP POLICY IF EXISTS "Allow admin full access" ON crypto_exchanges;
DROP POLICY IF EXISTS "Allow admin full access" ON crypto_airdrop;
DROP POLICY IF EXISTS "Allow admin full access" ON crypto_ico_ido;
DROP POLICY IF EXISTS "Allow admin full access" ON crypto_fundraising;
DROP POLICY IF EXISTS "Allow admin full access" ON crypto_glossary;

-- Buat policy yang memungkinkan anon user untuk CRUD operations
CREATE POLICY "Allow anon CRUD" ON crypto_exchanges FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon CRUD" ON crypto_airdrop FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon CRUD" ON crypto_ico_ido FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon CRUD" ON crypto_fundraising FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon CRUD" ON crypto_glossary FOR ALL USING (true) WITH CHECK (true);

-- Opsi 3: Buat policy berdasarkan IP atau domain (untuk production)
-- CREATE POLICY "Allow admin panel access" ON crypto_exchanges FOR ALL 
-- USING (current_setting('request.jwt.claims', true)::json->>'role' = 'anon')
-- WITH CHECK (current_setting('request.jwt.claims', true)::json->>'role' = 'anon');

-- Test policy dengan query sederhana
SELECT 'RLS Policy Test' as test_name, count(*) as exchange_count FROM crypto_exchanges;



















