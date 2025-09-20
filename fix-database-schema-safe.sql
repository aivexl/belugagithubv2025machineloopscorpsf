-- Fix Database Schema (Safe Version)
-- Jalankan script ini di Supabase SQL Editor untuk memperbaiki semua tabel

-- 1. Fix crypto_exchanges table
ALTER TABLE crypto_exchanges 
ADD COLUMN IF NOT EXISTS logo TEXT,
ADD COLUMN IF NOT EXISTS founded DATE,
ADD COLUMN IF NOT EXISTS region VARCHAR(100),
ADD COLUMN IF NOT EXISTS founded_year INTEGER,
ADD COLUMN IF NOT EXISTS trading_volume VARCHAR(100),
ADD COLUMN IF NOT EXISTS features TEXT,
ADD COLUMN IF NOT EXISTS fees VARCHAR(100),
ADD COLUMN IF NOT EXISTS supported_coins INTEGER,
ADD COLUMN IF NOT EXISTS kyc_required BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS fiat_support BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS pairs VARCHAR(100);

-- 2. Fix crypto_airdrop table
ALTER TABLE crypto_airdrop 
ADD COLUMN IF NOT EXISTS total_allocation VARCHAR(100),
ADD COLUMN IF NOT EXISTS min_allocation VARCHAR(100),
ADD COLUMN IF NOT EXISTS max_allocation VARCHAR(100),
ADD COLUMN IF NOT EXISTS estimated_value VARCHAR(100),
ADD COLUMN IF NOT EXISTS participants VARCHAR(100),
ADD COLUMN IF NOT EXISTS logo TEXT,
ADD COLUMN IF NOT EXISTS type VARCHAR(100),
ADD COLUMN IF NOT EXISTS category VARCHAR(100);

-- 3. Fix crypto_ico_ido table
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

-- 4. Fix crypto_fundraising table
ALTER TABLE crypto_fundraising 
ADD COLUMN IF NOT EXISTS logo TEXT,
ADD COLUMN IF NOT EXISTS investors_count INTEGER,
ADD COLUMN IF NOT EXISTS investors TEXT,
ADD COLUMN IF NOT EXISTS valuation VARCHAR(100),
ADD COLUMN IF NOT EXISTS round VARCHAR(100),
ADD COLUMN IF NOT EXISTS use_case TEXT,
ADD COLUMN IF NOT EXISTS type VARCHAR(100);

-- 5. Fix crypto_glossary table
ALTER TABLE crypto_glossary 
ADD COLUMN IF NOT EXISTS logo TEXT,
ADD COLUMN IF NOT EXISTS difficulty_level VARCHAR(50),
ADD COLUMN IF NOT EXISTS related_projects TEXT,
ADD COLUMN IF NOT EXISTS example TEXT,
ADD COLUMN IF NOT EXISTS definition TEXT,
ADD COLUMN IF NOT EXISTS term VARCHAR(255),
ADD COLUMN IF NOT EXISTS category VARCHAR(100),
ADD COLUMN IF NOT EXISTS related_terms TEXT;

-- 6. Update logos for all tables
-- Exchanges
UPDATE crypto_exchanges 
SET logo = CASE 
  WHEN name ILIKE '%binance%' THEN 'https://ui-avatars.com/api/?name=B&background=F7931A&color=fff&size=64&font-size=0.4'
  WHEN name ILIKE '%coinbase%' THEN 'https://ui-avatars.com/api/?name=C&background=0052FF&color=fff&size=64&font-size=0.4'
  WHEN name ILIKE '%uniswap%' THEN 'https://ui-avatars.com/api/?name=U&background=FF007A&color=fff&size=64&font-size=0.4'
  WHEN name ILIKE '%kraken%' THEN 'https://ui-avatars.com/api/?name=K&background=4C4C4C&color=fff&size=64&font-size=0.4'
  WHEN name ILIKE '%huobi%' THEN 'https://ui-avatars.com/api/?name=H&background=0198E1&color=fff&size=64&font-size=0.4'
  WHEN name ILIKE '%okx%' THEN 'https://ui-avatars.com/api/?name=O&background=000000&color=fff&size=64&font-size=0.4'
  WHEN name ILIKE '%bybit%' THEN 'https://ui-avatars.com/api/?name=B&background=FF6B35&color=fff&size=64&font-size=0.4'
  WHEN name ILIKE '%kucoin%' THEN 'https://ui-avatars.com/api/?name=K&background=00D4FF&color=fff&size=64&font-size=0.4'
  WHEN name ILIKE '%gate%' THEN 'https://ui-avatars.com/api/?name=G&background=00BFA5&color=fff&size=64&font-size=0.4'
  WHEN name ILIKE '%mexc%' THEN 'https://ui-avatars.com/api/?name=M&background=00C896&color=fff&size=64&font-size=0.4'
  ELSE 'https://ui-avatars.com/api/?name=' || UPPER(LEFT(name, 1)) || '&background=F7931A&color=fff&size=64&font-size=0.4'
END
WHERE logo IS NULL OR logo = '';

-- Airdrops
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

-- ICO/IDO
UPDATE crypto_ico_ido 
SET logo = 'https://ui-avatars.com/api/?name=' || UPPER(LEFT(project, 1)) || '&background=FF6B35&color=fff&size=64&font-size=0.4'
WHERE logo IS NULL OR logo = '';

-- Fundraising
UPDATE crypto_fundraising 
SET logo = 'https://ui-avatars.com/api/?name=' || UPPER(LEFT(project, 1)) || '&background=00D4FF&color=fff&size=64&font-size=0.4'
WHERE logo IS NULL OR logo = '';

-- Glossary
UPDATE crypto_glossary 
SET logo = 'https://ui-avatars.com/api/?name=' || UPPER(LEFT(term, 1)) || '&background=1E40AF&color=fff&size=64&font-size=0.4'
WHERE logo IS NULL OR logo = '';

-- 7. Insert sample data only if tables are empty
-- Sample Exchanges
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM crypto_exchanges WHERE name = 'Binance') THEN
    INSERT INTO crypto_exchanges (
      name, country, region, founded, website_url, type, status, description, logo, trading_volume, pairs, features
    ) VALUES (
      'Binance',
      'Malta',
      'Europe',
      '2017-07-14',
      'https://www.binance.com',
      'Centralized',
      'Active',
      'World''s largest cryptocurrency exchange by trading volume',
      'https://ui-avatars.com/api/?name=B&background=F7931A&color=fff&size=64&font-size=0.4',
      '$15.2B',
      '1500+',
      'Spot Trading,Futures,Options,Staking,NFT Marketplace'
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM crypto_exchanges WHERE name = 'Coinbase') THEN
    INSERT INTO crypto_exchanges (
      name, country, region, founded, website_url, type, status, description, logo, trading_volume, pairs, features
    ) VALUES (
      'Coinbase',
      'United States',
      'North America',
      '2012-06-20',
      'https://www.coinbase.com',
      'Centralized',
      'Active',
      'Leading cryptocurrency exchange with user-friendly interface',
      'https://ui-avatars.com/api/?name=C&background=0052FF&color=fff&size=64&font-size=0.4',
      '$2.8B',
      '200+',
      'Spot Trading,Advanced Trading,Staking,Earn Programs'
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM crypto_exchanges WHERE name = 'Uniswap') THEN
    INSERT INTO crypto_exchanges (
      name, country, region, founded, website_url, type, status, description, logo, trading_volume, pairs, features
    ) VALUES (
      'Uniswap',
      'United States',
      'North America',
      '2018-11-02',
      'https://app.uniswap.org',
      'Decentralized',
      'Active',
      'Leading decentralized exchange protocol on Ethereum',
      'https://ui-avatars.com/api/?name=U&background=FF007A&color=fff&size=64&font-size=0.4',
      '$500M',
      '1000+',
      'AMM,Liquidity Mining,Governance Token,Multi-Chain'
    );
  END IF;
END $$;

-- Sample Airdrops
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM crypto_airdrop WHERE project = 'Jupiter') THEN
    INSERT INTO crypto_airdrop (
      project, token, network, status, reward_amount, total_allocation, min_allocation, max_allocation, 
      estimated_value, participants, requirements, start_date, end_date, website_url, logo, 
      type, category, description
    ) VALUES (
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
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM crypto_airdrop WHERE project = 'Pyth Network') THEN
    INSERT INTO crypto_airdrop (
      project, token, network, status, reward_amount, total_allocation, min_allocation, max_allocation, 
      estimated_value, participants, requirements, start_date, end_date, website_url, logo, 
      type, category, description
    ) VALUES (
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
    );
  END IF;
END $$;

-- 8. Final verification
SELECT 
  'crypto_exchanges' as table_name,
  COUNT(*) as total_records,
  COUNT(CASE WHEN logo IS NOT NULL AND logo != '' THEN 1 END) as records_with_logo
FROM crypto_exchanges
UNION ALL
SELECT 
  'crypto_airdrop' as table_name,
  COUNT(*) as total_records,
  COUNT(CASE WHEN logo IS NOT NULL AND logo != '' THEN 1 END) as records_with_logo
FROM crypto_airdrop
UNION ALL
SELECT 
  'crypto_ico_ido' as table_name,
  COUNT(*) as total_records,
  COUNT(CASE WHEN logo IS NOT NULL AND logo != '' THEN 1 END) as records_with_logo
FROM crypto_ico_ido
UNION ALL
SELECT 
  'crypto_fundraising' as table_name,
  COUNT(*) as total_records,
  COUNT(CASE WHEN logo IS NOT NULL AND logo != '' THEN 1 END) as records_with_logo
FROM crypto_fundraising
UNION ALL
SELECT 
  'crypto_glossary' as table_name,
  COUNT(*) as total_records,
  COUNT(CASE WHEN logo IS NOT NULL AND logo != '' THEN 1 END) as records_with_logo
FROM crypto_glossary;
