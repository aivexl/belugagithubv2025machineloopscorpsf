-- Fix Glossary Database Schema
-- Jalankan script ini di Supabase SQL Editor untuk memperbaiki tabel crypto_glossary

-- 1. Tambahkan kolom yang hilang di tabel crypto_glossary
ALTER TABLE crypto_glossary 
ADD COLUMN IF NOT EXISTS example TEXT,
ADD COLUMN IF NOT EXISTS definition TEXT,
ADD COLUMN IF NOT EXISTS term VARCHAR(255),
ADD COLUMN IF NOT EXISTS category VARCHAR(100),
ADD COLUMN IF NOT EXISTS related_terms TEXT,
ADD COLUMN IF NOT EXISTS logo TEXT,
ADD COLUMN IF NOT EXISTS difficulty_level VARCHAR(50),
ADD COLUMN IF NOT EXISTS related_projects TEXT;

-- 2. Update logo untuk glossary yang sudah ada dengan logo yang valid
UPDATE crypto_glossary 
SET logo = CASE 
  WHEN term ILIKE '%defi%' THEN 'https://assets.coingecko.com/coins/images/34184/large/defi.png'
  WHEN term ILIKE '%nft%' THEN 'https://assets.coingecko.com/coins/images/28251/large/nft.png'
  WHEN term ILIKE '%dao%' THEN 'https://assets.coingecko.com/coins/images/31924/large/dao.png'
  WHEN term ILIKE '%web3%' THEN 'https://assets.coingecko.com/coins/images/31967/large/web3.jpg'
  WHEN term ILIKE '%blockchain%' THEN 'https://assets.coingecko.com/coins/images/26375/large/blockchain.png'
  WHEN term ILIKE '%cryptocurrency%' THEN 'https://assets.coingecko.com/coins/images/28251/large/crypto.png'
  WHEN term ILIKE '%smart contract%' THEN 'https://assets.coingecko.com/coins/images/16547/large/smart-contract.jpg'
  WHEN term ILIKE '%consensus%' THEN 'https://assets.coingecko.com/coins/images/25244/large/consensus.png'
  WHEN term ILIKE '%mining%' THEN 'https://assets.coingecko.com/coins/images/12559/large/mining.png'
  WHEN term ILIKE '%staking%' THEN 'https://assets.coingecko.com/coins/images/13469/large/staking.png'
  ELSE 'https://ui-avatars.com/api/?name=' || UPPER(LEFT(term, 1)) || '&background=10B981&color=fff&size=64&font-size=0.4'
END
WHERE logo IS NULL OR logo = '';

-- 3. Update category untuk glossary yang sudah ada
UPDATE crypto_glossary 
SET category = CASE 
  WHEN term ILIKE '%defi%' OR term ILIKE '%yield%' OR term ILIKE '%liquidity%' THEN 'Protocol'
  WHEN term ILIKE '%token%' OR term ILIKE '%coin%' OR term ILIKE '%cryptocurrency%' THEN 'Token'
  WHEN term ILIKE '%strategy%' OR term ILIKE '%trading%' OR term ILIKE '%investment%' THEN 'Strategy'
  WHEN term ILIKE '%blockchain%' OR term ILIKE '%smart contract%' OR term ILIKE '%consensus%' THEN 'Technology'
  WHEN term ILIKE '%dao%' OR term ILIKE '%organization%' OR term ILIKE '%governance%' THEN 'Organization'
  ELSE 'Technology'
END
WHERE category IS NULL;

-- 4. Tambahkan beberapa sample glossary dengan data lengkap jika belum ada
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM crypto_glossary WHERE term = 'DeFi') THEN
    INSERT INTO crypto_glossary (
      term, category, definition, example, related_terms, logo, difficulty_level
    ) VALUES (
      'DeFi',
      'Protocol',
      'Decentralized Finance - Financial services built on blockchain technology without traditional intermediaries',
      'Uniswap allows users to swap tokens directly without a centralized exchange',
      'AMM, Yield Farming, Liquidity, DEX',
      'https://assets.coingecko.com/coins/images/34184/large/defi.png',
      'Intermediate'
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM crypto_glossary WHERE term = 'NFT') THEN
    INSERT INTO crypto_glossary (
      term, category, definition, example, related_terms, logo, difficulty_level
    ) VALUES (
      'NFT',
      'Token',
      'Non-Fungible Token - Unique digital assets that represent ownership of specific items',
      'CryptoPunks are famous NFTs representing unique pixel art characters',
      'Digital Art, Collectibles, Ownership, Blockchain',
      'https://assets.coingecko.com/coins/images/28251/large/nft.png',
      'Beginner'
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM crypto_glossary WHERE term = 'DAO') THEN
    INSERT INTO crypto_glossary (
      term, category, definition, example, related_terms, logo, difficulty_level
    ) VALUES (
      'DAO',
      'Organization',
      'Decentralized Autonomous Organization - Community-governed organizations with no central authority',
      'MakerDAO governs the DAI stablecoin through community voting',
      'Governance, Voting, Decentralization, Community',
      'https://assets.coingecko.com/coins/images/31924/large/dao.png',
      'Intermediate'
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM crypto_glossary WHERE term = 'Smart Contract') THEN
    INSERT INTO crypto_glossary (
      term, category, definition, example, related_terms, logo, difficulty_level
    ) VALUES (
      'Smart Contract',
      'Technology',
      'Self-executing contracts with terms directly written into code',
      'Ethereum smart contracts automatically execute when conditions are met',
      'Blockchain, Code, Automation, Ethereum',
      'https://assets.coingecko.com/coins/images/16547/large/smart-contract.jpg',
      'Advanced'
    );
  END IF;
END $$;

-- 5. Verifikasi struktur tabel
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'crypto_glossary' 
ORDER BY column_name;

-- 6. Verifikasi data
SELECT 
  COUNT(*) as total_glossary,
  COUNT(CASE WHEN logo IS NOT NULL AND logo != '' THEN 1 END) as glossary_with_logo,
  COUNT(CASE WHEN example IS NOT NULL AND example != '' THEN 1 END) as glossary_with_example,
  COUNT(CASE WHEN definition IS NOT NULL AND definition != '' THEN 1 END) as glossary_with_definition,
  COUNT(CASE WHEN category IS NOT NULL AND category != '' THEN 1 END) as glossary_with_category
FROM crypto_glossary;
