-- Quick Fix for crypto_glossary table
-- Jalankan script ini di Supabase SQL Editor

-- 1. Tambahkan kolom example jika belum ada
ALTER TABLE crypto_glossary 
ADD COLUMN IF NOT EXISTS example TEXT;

-- 2. Tambahkan kolom lainnya yang mungkin hilang
ALTER TABLE crypto_glossary 
ADD COLUMN IF NOT EXISTS definition TEXT,
ADD COLUMN IF NOT EXISTS term VARCHAR(255),
ADD COLUMN IF NOT EXISTS category VARCHAR(100),
ADD COLUMN IF NOT EXISTS related_terms TEXT,
ADD COLUMN IF NOT EXISTS logo TEXT;

-- 3. Verifikasi kolom sudah ada
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'crypto_glossary' 
ORDER BY column_name;

-- 4. Test insert untuk memastikan kolom bekerja
INSERT INTO crypto_glossary (term, category, definition, example, related_terms)
VALUES ('Test Term', 'Technology', 'Test definition', 'Test example', 'Test related terms')
ON CONFLICT (term) DO NOTHING;

-- 5. Hapus test data
DELETE FROM crypto_glossary WHERE term = 'Test Term';

-- 6. Verifikasi struktur tabel final
SELECT 
  COUNT(*) as total_rows,
  COUNT(CASE WHEN example IS NOT NULL THEN 1 END) as rows_with_example,
  COUNT(CASE WHEN definition IS NOT NULL THEN 1 END) as rows_with_definition
FROM crypto_glossary;
