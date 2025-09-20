-- Fix Airdrop Database Schema
-- Jalankan script ini di Supabase SQL Editor untuk memperbaiki tabel crypto_airdrop

-- 1. Tambahkan kolom yang hilang di tabel crypto_airdrop
ALTER TABLE crypto_airdrop 
ADD COLUMN IF NOT EXISTS total_allocation VARCHAR(100),
ADD COLUMN IF NOT EXISTS min_allocation VARCHAR(100),
ADD COLUMN IF NOT EXISTS max_allocation VARCHAR(100),
ADD COLUMN IF NOT EXISTS estimated_value VARCHAR(100),
ADD COLUMN IF NOT EXISTS participants VARCHAR(100),
ADD COLUMN IF NOT EXISTS logo TEXT,
ADD COLUMN IF NOT EXISTS type VARCHAR(100),
ADD COLUMN IF NOT EXISTS category VARCHAR(100);

-- 2. Update logo untuk airdrops yang sudah ada dengan logo yang valid
UPDATE crypto_airdrop 
SET logo = CASE 
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
  ELSE 'https://ui-avatars.com/api/?name=' || UPPER(LEFT(project, 1)) || '&background=9945FF&color=fff&size=64&font-size=0.4'
END
WHERE logo IS NULL OR logo = '';

-- 3. Update type dan category untuk airdrops yang sudah ada
UPDATE crypto_airdrop 
SET type = CASE 
  WHEN project ILIKE '%jupiter%' OR project ILIKE '%uniswap%' OR project ILIKE '%1inch%' THEN 'DeFi'
  WHEN project ILIKE '%pyth%' OR project ILIKE '%celestia%' THEN 'Infrastructure'
  WHEN project ILIKE '%arbitrum%' OR project ILIKE '%optimism%' OR project ILIKE '%sui%' OR project ILIKE '%sei%' THEN 'Layer 2'
  ELSE 'DeFi'
END,
category = CASE 
  WHEN project ILIKE '%jupiter%' THEN 'DEX'
  WHEN project ILIKE '%uniswap%' THEN 'DEX'
  WHEN project ILIKE '%1inch%' THEN 'DEX'
  WHEN project ILIKE '%pyth%' THEN 'Oracle'
  WHEN project ILIKE '%celestia%' THEN 'Data Availability'
  WHEN project ILIKE '%arbitrum%' THEN 'Layer 2'
  WHEN project ILIKE '%optimism%' THEN 'Layer 2'
  WHEN project ILIKE '%sui%' THEN 'Layer 1'
  WHEN project ILIKE '%sei%' THEN 'Layer 1'
  ELSE 'Airdrop'
END
WHERE type IS NULL OR category IS NULL;

-- 4. Tambahkan beberapa sample airdrops dengan data lengkap jika belum ada
INSERT INTO crypto_airdrop (
  project, token, network, status, reward_amount, total_allocation, min_allocation, max_allocation, 
  estimated_value, participants, requirements, start_date, end_date, website_url, logo, 
  type, category, description
) VALUES 
(
  'Jupiter',
  'JUP',
  'Solana',
  'Active',
  '$50 - $500',
  '100,000,000',
  '100',
  '10,000',
  '$50 - $500',
  '50,000+',
  'Hold SOL, Use Jupiter DEX, Complete trading tasks',
  '2024-01-15',
  '2024-02-15',
  'https://jup.ag',
  'https://assets.coingecko.com/coins/images/34184/large/jupiter.png',
  'DeFi',
  'DEX',
  'Jupiter is a DEX aggregator on Solana that provides the best prices for traders'
),
(
  'Pyth Network',
  'PYTH',
  'Multi-chain',
  'Completed',
  '$25 - $250',
  '50,000,000',
  '50',
  '5,000',
  '$25 - $250',
  '30,000+',
  'Use Pyth Oracle, Deploy contracts, Integrate price feeds',
  '2023-11-20',
  '2023-12-20',
  'https://pyth.network',
  'https://assets.coingecko.com/coins/images/31924/large/pyth.png',
  'Infrastructure',
  'Oracle',
  'Pyth Network is a first-party financial oracle network'
),
(
  'Celestia',
  'TIA',
  'Multi-chain',
  'Completed',
  '$100 - $1,000',
  '200,000,000',
  '200',
  '20,000',
  '$100 - $1,000',
  '100,000+',
  'Run Celestia node, Participate in testnet, Deploy rollups',
  '2023-10-31',
  '2023-11-30',
  'https://celestia.org',
  'https://assets.coingecko.com/coins/images/31967/large/celestia.jpg',
  'Infrastructure',
  'Data Availability',
  'Celestia is a modular blockchain network'
)
ON CONFLICT (project) DO NOTHING;

-- 5. Verifikasi struktur tabel
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'crypto_airdrop' 
ORDER BY column_name;

-- 6. Verifikasi data
SELECT 
  COUNT(*) as total_airdrops,
  COUNT(CASE WHEN logo IS NOT NULL AND logo != '' THEN 1 END) as airdrops_with_logo,
  COUNT(CASE WHEN estimated_value IS NOT NULL AND estimated_value != '' THEN 1 END) as airdrops_with_estimated_value,
  COUNT(CASE WHEN total_allocation IS NOT NULL AND total_allocation != '' THEN 1 END) as airdrops_with_allocation
FROM crypto_airdrop;
