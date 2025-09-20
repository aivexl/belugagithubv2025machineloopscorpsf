-- Complete Fix untuk crypto_exchanges table
-- Jalankan script ini di Supabase SQL Editor

-- 1. Tambahkan semua kolom yang diperlukan
ALTER TABLE crypto_exchanges 
ADD COLUMN IF NOT EXISTS founded DATE,
ADD COLUMN IF NOT EXISTS region VARCHAR(100),
ADD COLUMN IF NOT EXISTS founded_year INTEGER,
ADD COLUMN IF NOT EXISTS trading_volume VARCHAR(100),
ADD COLUMN IF NOT EXISTS features TEXT,
ADD COLUMN IF NOT EXISTS fees VARCHAR(100),
ADD COLUMN IF NOT EXISTS supported_coins INTEGER,
ADD COLUMN IF NOT EXISTS kyc_required BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS fiat_support BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS tradingVolume VARCHAR(100),
ADD COLUMN IF NOT EXISTS pairs VARCHAR(100);

-- 2. Update nama kolom yang mungkin berbeda (tanpa IF EXISTS)
-- Cek dulu apakah kolom ada sebelum rename
DO $$
BEGIN
    -- Rename website_url ke website jika ada
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'crypto_exchanges' AND column_name = 'website_url') THEN
        ALTER TABLE crypto_exchanges RENAME COLUMN website_url TO website;
    END IF;
    
    -- Rename logo_url ke logo jika ada
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'crypto_exchanges' AND column_name = 'logo_url') THEN
        ALTER TABLE crypto_exchanges RENAME COLUMN logo_url TO logo;
    END IF;
END $$;

-- 3. Verifikasi struktur tabel
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'crypto_exchanges' 
ORDER BY column_name;
