-- Database Schema Update untuk Crypto Admin Panel
-- Jalankan script ini di Supabase SQL Editor untuk memperbaiki kolom yang hilang

-- Update crypto_exchanges table dengan kolom yang diperlukan
ALTER TABLE crypto_exchanges 
ADD COLUMN IF NOT EXISTS region VARCHAR(100),
ADD COLUMN IF NOT EXISTS founded_year INTEGER,
ADD COLUMN IF NOT EXISTS trading_volume VARCHAR(100),
ADD COLUMN IF NOT EXISTS features TEXT,
ADD COLUMN IF NOT EXISTS fees VARCHAR(100),
ADD COLUMN IF NOT EXISTS supported_coins INTEGER,
ADD COLUMN IF NOT EXISTS kyc_required BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS fiat_support BOOLEAN DEFAULT false;

-- Update crypto_airdrop table dengan kolom yang diperlukan
ALTER TABLE crypto_airdrop 
ADD COLUMN IF NOT EXISTS requirements TEXT,
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS end_date DATE,
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS description TEXT;

-- Update crypto_ico_ido table dengan kolom yang diperlukan
ALTER TABLE crypto_ico_ido 
ADD COLUMN IF NOT EXISTS price VARCHAR(100),
ADD COLUMN IF NOT EXISTS total_supply VARCHAR(100),
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS end_date DATE,
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS description TEXT;

-- Update crypto_fundraising table dengan kolom yang diperlukan
ALTER TABLE crypto_fundraising 
ADD COLUMN IF NOT EXISTS raised_amount VARCHAR(100),
ADD COLUMN IF NOT EXISTS target_amount VARCHAR(100),
ADD COLUMN IF NOT EXISTS investors_count INTEGER,
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS end_date DATE,
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS description TEXT;

-- Update crypto_glossary table dengan kolom yang diperlukan
ALTER TABLE crypto_glossary 
ADD COLUMN IF NOT EXISTS examples TEXT;

-- Verifikasi struktur tabel
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name IN ('crypto_exchanges', 'crypto_airdrop', 'crypto_ico_ido', 'crypto_fundraising', 'crypto_glossary')
ORDER BY table_name, ordinal_position;











