-- Fix Fundraising Database Schema
-- Jalankan script ini di Supabase SQL Editor untuk memperbaiki tabel crypto_fundraising

-- 1. Tambahkan kolom yang hilang di tabel crypto_fundraising
ALTER TABLE crypto_fundraising 
ADD COLUMN IF NOT EXISTS investors TEXT,
ADD COLUMN IF NOT EXISTS valuation VARCHAR(100),
ADD COLUMN IF NOT EXISTS round VARCHAR(100),
ADD COLUMN IF NOT EXISTS use_case TEXT,
ADD COLUMN IF NOT EXISTS logo TEXT,
ADD COLUMN IF NOT EXISTS type VARCHAR(100);

-- 2. Update logo untuk fundraising yang sudah ada dengan logo yang valid
UPDATE crypto_fundraising 
SET logo = CASE 
  WHEN project ILIKE '%monad%' THEN 'https://assets.coingecko.com/coins/images/34184/large/monad.png'
  WHEN project ILIKE '%berachain%' THEN 'https://assets.coingecko.com/coins/images/28251/large/berachain.png'
  WHEN project ILIKE '%eigenlayer%' THEN 'https://assets.coingecko.com/coins/images/31924/large/eigenlayer.png'
  WHEN project ILIKE '%layerzero%' THEN 'https://assets.coingecko.com/coins/images/31967/large/layerzero.jpg'
  WHEN project ILIKE '%celestia%' THEN 'https://assets.coingecko.com/coins/images/26375/large/celestia.png'
  WHEN project ILIKE '%polygon%' THEN 'https://assets.coingecko.com/coins/images/28251/large/polygon.png'
  WHEN project ILIKE '%arbitrum%' THEN 'https://assets.coingecko.com/coins/images/16547/large/photo_2023-03-29_21-47-00.jpg'
  WHEN project ILIKE '%optimism%' THEN 'https://assets.coingecko.com/coins/images/25244/large/Optimism.png'
  WHEN project ILIKE '%solana%' THEN 'https://assets.coingecko.com/coins/images/12559/large/solana.png'
  WHEN project ILIKE '%ethereum%' THEN 'https://assets.coingecko.com/coins/images/13469/large/ethereum.png'
  ELSE 'https://ui-avatars.com/api/?name=' || UPPER(LEFT(project, 1)) || '&background=8B5CF6&color=fff&size=64&font-size=0.4'
END
WHERE logo IS NULL OR logo = '';

-- 3. Update round untuk fundraising yang sudah ada
UPDATE crypto_fundraising 
SET round = CASE 
  WHEN raised_amount::numeric > 100000000 THEN 'Series C'
  WHEN raised_amount::numeric > 50000000 THEN 'Series B'
  WHEN raised_amount::numeric > 10000000 THEN 'Series A'
  ELSE 'Seed'
END
WHERE round IS NULL AND raised_amount IS NOT NULL;

-- 4. Tambahkan beberapa sample fundraising dengan data lengkap jika belum ada
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM crypto_fundraising WHERE project = 'Monad') THEN
    INSERT INTO crypto_fundraising (
      project, category, status, raised_amount, valuation, investors, round, 
      start_date, website_url, logo, description, use_case
    ) VALUES (
      'Monad',
      'Infrastructure',
      'Completed',
      '$225,000,000',
      '$3,000,000,000',
      'Paradigm, Electric Capital, Coinbase Ventures',
      'Series A',
      '2024-04-15',
      'https://monad.xyz',
      'https://assets.coingecko.com/coins/images/34184/large/monad.png',
      'Monad is a high-performance EVM-compatible blockchain',
      'EVM scaling solution with parallel execution'
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM crypto_fundraising WHERE project = 'Berachain') THEN
    INSERT INTO crypto_fundraising (
      project, category, status, raised_amount, valuation, investors, round, 
      start_date, website_url, logo, description, use_case
    ) VALUES (
      'Berachain',
      'DeFi',
      'Completed',
      '$100,000,000',
      '$1,500,000,000',
      'Polychain Capital, Brevan Howard, Framework Ventures',
      'Series A',
      '2024-03-20',
      'https://berachain.com',
      'https://assets.coingecko.com/coins/images/28251/large/berachain.png',
      'Berachain is a high-performance EVM-compatible L1 blockchain',
      'DeFi-focused blockchain with native yield'
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM crypto_fundraising WHERE project = 'EigenLayer') THEN
    INSERT INTO crypto_fundraising (
      project, category, status, raised_amount, valuation, investors, round, 
      start_date, website_url, logo, description, use_case
    ) VALUES (
      'EigenLayer',
      'Infrastructure',
      'Completed',
      '$50,000,000',
      '$1,000,000,000',
      'Andreessen Horowitz, Coinbase Ventures, Polychain Capital',
      'Series A',
      '2023-12-10',
      'https://eigenlayer.xyz',
      'https://assets.coingecko.com/coins/images/31924/large/eigenlayer.png',
      'EigenLayer is a restaking protocol for Ethereum',
      'Restaking infrastructure for Ethereum validators'
    );
  END IF;
END $$;

-- 5. Verifikasi struktur tabel
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'crypto_fundraising' 
ORDER BY column_name;

-- 6. Verifikasi data
SELECT 
  COUNT(*) as total_fundraising,
  COUNT(CASE WHEN logo IS NOT NULL AND logo != '' THEN 1 END) as fundraising_with_logo,
  COUNT(CASE WHEN investors IS NOT NULL AND investors != '' THEN 1 END) as fundraising_with_investors,
  COUNT(CASE WHEN valuation IS NOT NULL AND valuation != '' THEN 1 END) as fundraising_with_valuation,
  COUNT(CASE WHEN round IS NOT NULL AND round != '' THEN 1 END) as fundraising_with_round
FROM crypto_fundraising;
