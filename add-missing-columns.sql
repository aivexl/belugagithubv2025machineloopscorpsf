-- Script untuk menambahkan kolom yang hilang ke database
-- Jalankan script ini di Supabase SQL Editor

-- Tambahkan kolom yang hilang ke crypto_exchanges
ALTER TABLE crypto_exchanges 
ADD COLUMN IF NOT EXISTS region VARCHAR(100),
ADD COLUMN IF NOT EXISTS founded_year INTEGER,
ADD COLUMN IF NOT EXISTS trading_volume VARCHAR(100),
ADD COLUMN IF NOT EXISTS features TEXT,
ADD COLUMN IF NOT EXISTS fees VARCHAR(100),
ADD COLUMN IF NOT EXISTS supported_coins INTEGER,
ADD COLUMN IF NOT EXISTS kyc_required BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS fiat_support BOOLEAN DEFAULT false;

-- Tambahkan kolom yang hilang ke crypto_airdrop
ALTER TABLE crypto_airdrop 
ADD COLUMN IF NOT EXISTS requirements TEXT,
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS end_date DATE,
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS description TEXT;

-- Tambahkan kolom yang hilang ke crypto_ico_ido
ALTER TABLE crypto_ico_ido 
ADD COLUMN IF NOT EXISTS price VARCHAR(100),
ADD COLUMN IF NOT EXISTS total_supply VARCHAR(100),
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS end_date DATE,
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS description TEXT;

-- Tambahkan kolom yang hilang ke crypto_fundraising
ALTER TABLE crypto_fundraising 
ADD COLUMN IF NOT EXISTS raised_amount VARCHAR(100),
ADD COLUMN IF NOT EXISTS target_amount VARCHAR(100),
ADD COLUMN IF NOT EXISTS investors_count INTEGER,
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS end_date DATE,
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS description TEXT;

-- Tambahkan kolom yang hilang ke crypto_glossary
ALTER TABLE crypto_glossary 
ADD COLUMN IF NOT EXISTS examples TEXT;





























