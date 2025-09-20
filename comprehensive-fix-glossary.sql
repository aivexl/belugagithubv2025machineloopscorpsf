-- Comprehensive Fix for crypto_glossary table
-- Jalankan script ini di Supabase SQL Editor untuk memastikan semua kolom ada

-- 1. Buat tabel crypto_glossary jika belum ada
CREATE TABLE IF NOT EXISTS crypto_glossary (
  id SERIAL PRIMARY KEY,
  term VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  definition TEXT,
  example TEXT,
  related_terms TEXT,
  logo TEXT,
  difficulty_level VARCHAR(50),
  related_projects TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tambahkan kolom yang mungkin hilang
ALTER TABLE crypto_glossary 
ADD COLUMN IF NOT EXISTS term VARCHAR(255),
ADD COLUMN IF NOT EXISTS category VARCHAR(100),
ADD COLUMN IF NOT EXISTS definition TEXT,
ADD COLUMN IF NOT EXISTS example TEXT,
ADD COLUMN IF NOT EXISTS related_terms TEXT,
ADD COLUMN IF NOT EXISTS logo TEXT,
ADD COLUMN IF NOT EXISTS difficulty_level VARCHAR(50),
ADD COLUMN IF NOT EXISTS related_projects TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 3. Buat index untuk term jika belum ada
CREATE INDEX IF NOT EXISTS idx_crypto_glossary_term ON crypto_glossary(term);

-- 4. Buat unique constraint untuk term jika belum ada
ALTER TABLE crypto_glossary 
ADD CONSTRAINT IF NOT EXISTS unique_term UNIQUE (term);

-- 5. Test insert untuk memastikan semua kolom bekerja
DO $$
BEGIN
  -- Test insert dengan semua field
  INSERT INTO crypto_glossary (
    term, category, definition, example, related_terms, logo, difficulty_level
  ) VALUES (
    'Test DeFi', 
    'Protocol', 
    'Test definition for DeFi', 
    'Test example for DeFi', 
    'Test related terms',
    'https://ui-avatars.com/api/?name=D&background=10B981&color=fff&size=64&font-size=0.4',
    'Beginner'
  ) ON CONFLICT (term) DO NOTHING;
  
  -- Hapus test data
  DELETE FROM crypto_glossary WHERE term = 'Test DeFi';
END $$;

-- 6. Verifikasi struktur tabel
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'crypto_glossary' 
ORDER BY column_name;

-- 7. Verifikasi data
SELECT 
  COUNT(*) as total_glossary_entries,
  COUNT(CASE WHEN example IS NOT NULL AND example != '' THEN 1 END) as entries_with_example,
  COUNT(CASE WHEN definition IS NOT NULL AND definition != '' THEN 1 END) as entries_with_definition,
  COUNT(CASE WHEN category IS NOT NULL AND category != '' THEN 1 END) as entries_with_category
FROM crypto_glossary;
