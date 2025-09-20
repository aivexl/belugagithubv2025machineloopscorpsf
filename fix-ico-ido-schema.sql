-- Fix ICO/IDO Database Schema
-- Jalankan script ini di Supabase SQL Editor untuk memperbaiki tabel crypto_ico_ido

-- 1. Tambahkan kolom yang hilang di tabel crypto_ico_ido
ALTER TABLE crypto_ico_ido 
ADD COLUMN IF NOT EXISTS current_price VARCHAR(100),
ADD COLUMN IF NOT EXISTS raised_amount VARCHAR(100),
ADD COLUMN IF NOT EXISTS participants VARCHAR(100),
ADD COLUMN IF NOT EXISTS roi VARCHAR(100),
ADD COLUMN IF NOT EXISTS vesting VARCHAR(100),
ADD COLUMN IF NOT EXISTS category VARCHAR(100),
ADD COLUMN IF NOT EXISTS logo TEXT,
ADD COLUMN IF NOT EXISTS type VARCHAR(100),
ADD COLUMN IF NOT EXISTS soft_cap VARCHAR(100),
ADD COLUMN IF NOT EXISTS hard_cap VARCHAR(100),
ADD COLUMN IF NOT EXISTS investors_count INTEGER;

-- 2. Update logo untuk ICO/IDO yang sudah ada dengan logo yang valid
UPDATE crypto_ico_ido 
SET logo = CASE 
  WHEN project ILIKE '%ethena%' THEN 'https://assets.coingecko.com/coins/images/28251/large/ethena.png'
  WHEN project ILIKE '%jupiter%' THEN 'https://assets.coingecko.com/coins/images/34184/large/jupiter.png'
  WHEN project ILIKE '%pyth%' THEN 'https://assets.coingecko.com/coins/images/31924/large/pyth.png'
  WHEN project ILIKE '%celestia%' THEN 'https://assets.coingecko.com/coins/images/31967/large/celestia.jpg'
  WHEN project ILIKE '%sui%' THEN 'https://assets.coingecko.com/coins/images/26375/large/sui.png'
  WHEN project ILIKE '%sei%' THEN 'https://assets.coingecko.com/coins/images/28251/large/sei.png'
  WHEN project ILIKE '%arbitrum%' THEN 'https://assets.coingecko.com/coins/images/16547/large/photo_2023-03-29_21-47-00.jpg'
  WHEN project ILIKE '%optimism%' THEN 'https://assets.coingecko.com/coins/images/25244/large/Optimism.png'
  WHEN project ILIKE '%uniswap%' THEN 'https://assets.coingecko.com/coins/images/12559/large/uniswap-uni.png'
  WHEN project ILIKE '%1inch%' THEN 'https://assets.coingecko.com/coins/images/13469/large/1inch_logo.png'
  WHEN project ILIKE '%dydx%' THEN 'https://assets.coingecko.com/coins/images/17500/large/dydx.png'
  ELSE 'https://ui-avatars.com/api/?name=' || UPPER(LEFT(project, 1)) || '&background=FF6B35&color=fff&size=64&font-size=0.4'
END
WHERE logo IS NULL OR logo = '';

-- 3. Update category untuk ICO/IDO yang sudah ada
UPDATE crypto_ico_ido 
SET category = CASE 
  WHEN project ILIKE '%jupiter%' OR project ILIKE '%uniswap%' OR project ILIKE '%1inch%' THEN 'DeFi'
  WHEN project ILIKE '%pyth%' OR project ILIKE '%celestia%' THEN 'Infrastructure'
  WHEN project ILIKE '%arbitrum%' OR project ILIKE '%optimism%' OR project ILIKE '%sui%' OR project ILIKE '%sei%' THEN 'Layer 2'
  WHEN project ILIKE '%ethena%' THEN 'DeFi'
  ELSE 'DeFi'
END
WHERE category IS NULL;

-- 4. Tambahkan beberapa sample ICO/IDO dengan data lengkap jika belum ada
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM crypto_ico_ido WHERE project = 'Ethena') THEN
    INSERT INTO crypto_ico_ido (
      project, token, network, status, price, current_price, total_supply, raised_amount, 
      participants, roi, vesting, category, start_date, end_date, website_url, logo, description
    ) VALUES (
      'Ethena',
      'ENA',
      'Ethereum',
      'Completed',
      '$0.05',
      '$0.85',
      '15,000,000,000',
      '$14,000,000',
      '50,000+',
      '+1600%',
      '6 months',
      'DeFi',
      '2024-04-02',
      '2024-04-02',
      'https://ethena.fi',
      'https://assets.coingecko.com/coins/images/28251/large/ethena.png',
      'Ethena is a synthetic dollar protocol built on Ethereum'
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM crypto_ico_ido WHERE project = 'Jupiter') THEN
    INSERT INTO crypto_ico_ido (
      project, token, network, status, price, current_price, total_supply, raised_amount, 
      participants, roi, vesting, category, start_date, end_date, website_url, logo, description
    ) VALUES (
      'Jupiter',
      'JUP',
      'Solana',
      'Completed',
      '$0.40',
      '$1.20',
      '10,000,000,000',
      '$4,000,000',
      '25,000+',
      '+200%',
      '12 months',
      'DeFi',
      '2024-01-31',
      '2024-01-31',
      'https://jup.ag',
      'https://assets.coingecko.com/coins/images/34184/large/jupiter.png',
      'Jupiter is a DEX aggregator on Solana that provides the best prices for traders'
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM crypto_ico_ido WHERE project = 'Pyth Network') THEN
    INSERT INTO crypto_ico_ido (
      project, token, network, status, price, current_price, total_supply, raised_amount, 
      participants, roi, vesting, category, start_date, end_date, website_url, logo, description
    ) VALUES (
      'Pyth Network',
      'PYTH',
      'Multi-chain',
      'Completed',
      '$0.20',
      '$0.45',
      '10,000,000,000',
      '$2,000,000',
      '30,000+',
      '+125%',
      '18 months',
      'Infrastructure',
      '2023-11-20',
      '2023-11-20',
      'https://pyth.network',
      'https://assets.coingecko.com/coins/images/31924/large/pyth.png',
      'Pyth Network is a first-party financial oracle network'
    );
  END IF;
END $$;

-- 5. Verifikasi struktur tabel
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'crypto_ico_ido' 
ORDER BY column_name;

-- 6. Verifikasi data
SELECT 
  COUNT(*) as total_ico_ido,
  COUNT(CASE WHEN logo IS NOT NULL AND logo != '' THEN 1 END) as ico_ido_with_logo,
  COUNT(CASE WHEN current_price IS NOT NULL AND current_price != '' THEN 1 END) as ico_ido_with_current_price,
  COUNT(CASE WHEN raised_amount IS NOT NULL AND raised_amount != '' THEN 1 END) as ico_ido_with_raised_amount,
  COUNT(CASE WHEN category IS NOT NULL AND category != '' THEN 1 END) as ico_ido_with_category
FROM crypto_ico_ido;
