-- Script untuk memperbaiki Row Level Security Policy
-- Jalankan script ini di Supabase SQL Editor

-- Drop existing policies yang terlalu ketat
DROP POLICY IF EXISTS "Allow admin full access" ON crypto_exchanges;
DROP POLICY IF EXISTS "Allow admin full access" ON crypto_airdrop;
DROP POLICY IF EXISTS "Allow admin full access" ON crypto_ico_ido;
DROP POLICY IF EXISTS "Allow admin full access" ON crypto_fundraising;
DROP POLICY IF EXISTS "Allow admin full access" ON crypto_glossary;

-- Buat policy yang lebih permisif untuk admin panel
-- Policy untuk INSERT (tambah data)
CREATE POLICY "Allow public insert" ON crypto_exchanges FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON crypto_airdrop FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON crypto_ico_ido FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON crypto_fundraising FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON crypto_glossary FOR INSERT WITH CHECK (true);

-- Policy untuk UPDATE (edit data)
CREATE POLICY "Allow public update" ON crypto_exchanges FOR UPDATE USING (true);
CREATE POLICY "Allow public update" ON crypto_airdrop FOR UPDATE USING (true);
CREATE POLICY "Allow public update" ON crypto_ico_ido FOR UPDATE USING (true);
CREATE POLICY "Allow public update" ON crypto_fundraising FOR UPDATE USING (true);
CREATE POLICY "Allow public update" ON crypto_glossary FOR UPDATE USING (true);

-- Policy untuk DELETE (hapus data)
CREATE POLICY "Allow public delete" ON crypto_exchanges FOR DELETE USING (true);
CREATE POLICY "Allow public delete" ON crypto_airdrop FOR DELETE USING (true);
CREATE POLICY "Allow public delete" ON crypto_ico_ido FOR DELETE USING (true);
CREATE POLICY "Allow public delete" ON crypto_fundraising FOR DELETE USING (true);
CREATE POLICY "Allow public delete" ON crypto_glossary FOR DELETE USING (true);

-- Verifikasi policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename IN ('crypto_exchanges', 'crypto_airdrop', 'crypto_ico_ido', 'crypto_fundraising', 'crypto_glossary')
ORDER BY tablename, policyname;




