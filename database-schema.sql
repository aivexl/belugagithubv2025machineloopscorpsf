-- Database Schema untuk Crypto Admin Panel
-- Jalankan script ini di Supabase SQL Editor

-- Tabel untuk Exchanges
CREATE TABLE IF NOT EXISTS crypto_exchanges (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  country VARCHAR(100),
  type VARCHAR(50),
  status VARCHAR(50),
  logo_url TEXT,
  website_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel untuk Airdrop
CREATE TABLE IF NOT EXISTS crypto_airdrop (
  id SERIAL PRIMARY KEY,
  project VARCHAR(255) NOT NULL,
  token VARCHAR(100),
  network VARCHAR(100),
  status VARCHAR(50),
  reward_amount VARCHAR(100),
  requirements TEXT,
  start_date DATE,
  end_date DATE,
  website_url TEXT,
  logo_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel untuk ICO/IDO
CREATE TABLE IF NOT EXISTS crypto_ico_ido (
  id SERIAL PRIMARY KEY,
  project VARCHAR(255) NOT NULL,
  token VARCHAR(100),
  network VARCHAR(100),
  status VARCHAR(50),
  price VARCHAR(100),
  total_supply VARCHAR(100),
  start_date DATE,
  end_date DATE,
  website_url TEXT,
  logo_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel untuk Fundraising
CREATE TABLE IF NOT EXISTS crypto_fundraising (
  id SERIAL PRIMARY KEY,
  project VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  status VARCHAR(50),
  raised_amount VARCHAR(100),
  target_amount VARCHAR(100),
  investors_count INTEGER,
  start_date DATE,
  end_date DATE,
  website_url TEXT,
  logo_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel untuk Glossary
CREATE TABLE IF NOT EXISTS crypto_glossary (
  id SERIAL PRIMARY KEY,
  term VARCHAR(255) NOT NULL,
  definition TEXT NOT NULL,
  category VARCHAR(100),
  examples TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE crypto_exchanges ENABLE ROW LEVEL SECURITY;
ALTER TABLE crypto_airdrop ENABLE ROW LEVEL SECURITY;
ALTER TABLE crypto_ico_ido ENABLE ROW LEVEL SECURITY;
ALTER TABLE crypto_fundraising ENABLE ROW LEVEL SECURITY;
ALTER TABLE crypto_glossary ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (untuk menghindari error duplicate)
DROP POLICY IF EXISTS "Allow public read access" ON crypto_exchanges;
DROP POLICY IF EXISTS "Allow public read access" ON crypto_airdrop;
DROP POLICY IF EXISTS "Allow public read access" ON crypto_ico_ido;
DROP POLICY IF EXISTS "Allow public read access" ON crypto_fundraising;
DROP POLICY IF EXISTS "Allow public read access" ON crypto_glossary;

DROP POLICY IF EXISTS "Allow admin full access" ON crypto_exchanges;
DROP POLICY IF EXISTS "Allow admin full access" ON crypto_airdrop;
DROP POLICY IF EXISTS "Allow admin full access" ON crypto_ico_ido;
DROP POLICY IF EXISTS "Allow admin full access" ON crypto_fundraising;
DROP POLICY IF EXISTS "Allow admin full access" ON crypto_glossary;

-- Policy untuk read access (public)
CREATE POLICY "Allow public read access" ON crypto_exchanges FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON crypto_airdrop FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON crypto_ico_ido FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON crypto_fundraising FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON crypto_glossary FOR SELECT USING (true);

-- Policy untuk admin access (insert, update, delete)
CREATE POLICY "Allow admin full access" ON crypto_exchanges FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin full access" ON crypto_airdrop FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin full access" ON crypto_ico_ido FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin full access" ON crypto_fundraising FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin full access" ON crypto_glossary FOR ALL USING (auth.role() = 'authenticated');

-- Insert default data untuk testing (hanya jika belum ada)
INSERT INTO crypto_exchanges (name, country, type, status, logo_url, website_url, description) 
SELECT 'Binance', 'Malta', 'Centralized', 'Active', 'https://example.com/binance.png', 'https://binance.com', 'World''s largest cryptocurrency exchange'
WHERE NOT EXISTS (SELECT 1 FROM crypto_exchanges WHERE name = 'Binance');

INSERT INTO crypto_exchanges (name, country, type, status, logo_url, website_url, description) 
SELECT 'Uniswap', 'Global', 'Decentralized', 'Active', 'https://example.com/uniswap.png', 'https://uniswap.org', 'Decentralized exchange protocol'
WHERE NOT EXISTS (SELECT 1 FROM crypto_exchanges WHERE name = 'Uniswap');

INSERT INTO crypto_exchanges (name, country, type, status, logo_url, website_url, description) 
SELECT 'Coinbase', 'USA', 'Centralized', 'Active', 'https://example.com/coinbase.png', 'https://coinbase.com', 'Leading cryptocurrency exchange'
WHERE NOT EXISTS (SELECT 1 FROM crypto_exchanges WHERE name = 'Coinbase');

INSERT INTO crypto_airdrop (project, token, network, status, reward_amount, requirements, start_date, end_date, website_url, logo_url, description) 
SELECT 'Ethereum Name Service', 'ENS', 'Ethereum', 'Completed', '100 ENS', 'Hold .eth domain', '2021-11-01', '2021-11-08', 'https://ens.domains', 'https://example.com/ens.png', 'Decentralized naming system'
WHERE NOT EXISTS (SELECT 1 FROM crypto_airdrop WHERE project = 'Ethereum Name Service');

INSERT INTO crypto_airdrop (project, token, network, status, reward_amount, requirements, start_date, end_date, website_url, logo_url, description) 
SELECT 'Arbitrum', 'ARB', 'Arbitrum', 'Completed', '1000 ARB', 'Use Arbitrum network', '2023-03-23', '2023-04-06', 'https://arbitrum.io', 'https://example.com/arbitrum.png', 'Layer 2 scaling solution'
WHERE NOT EXISTS (SELECT 1 FROM crypto_airdrop WHERE project = 'Arbitrum');

INSERT INTO crypto_ico_ido (project, token, network, status, price, total_supply, start_date, end_date, website_url, logo_url, description) 
SELECT 'Chainlink', 'LINK', 'Ethereum', 'Completed', '$0.11', '1B LINK', '2017-09-01', '2017-09-15', 'https://chain.link', 'https://example.com/chainlink.png', 'Decentralized oracle network'
WHERE NOT EXISTS (SELECT 1 FROM crypto_ico_ido WHERE project = 'Chainlink');

INSERT INTO crypto_ico_ido (project, token, network, status, price, total_supply, start_date, end_date, website_url, logo_url, description) 
SELECT 'Polygon', 'MATIC', 'Polygon', 'Completed', '$0.00263', '10B MATIC', '2019-04-01', '2019-05-01', 'https://polygon.technology', 'https://example.com/polygon.png', 'Ethereum scaling solution'
WHERE NOT EXISTS (SELECT 1 FROM crypto_ico_ido WHERE project = 'Polygon');

INSERT INTO crypto_fundraising (project, category, status, raised_amount, target_amount, investors_count, start_date, end_date, website_url, logo_url, description) 
SELECT 'Ethereum Foundation', 'Protocol', 'Completed', '$18.4M', '$18.4M', 10000, '2014-07-01', '2014-09-02', 'https://ethereum.org', 'https://example.com/ethereum.png', 'Smart contract platform'
WHERE NOT EXISTS (SELECT 1 FROM crypto_fundraising WHERE project = 'Ethereum Foundation');

INSERT INTO crypto_fundraising (project, category, status, raised_amount, target_amount, investors_count, start_date, end_date, website_url, logo_url, description) 
SELECT 'Solana Foundation', 'Protocol', 'Completed', '$20M', '$20M', 5000, '2018-03-01', '2018-04-01', 'https://solana.com', 'https://example.com/solana.png', 'High-performance blockchain'
WHERE NOT EXISTS (SELECT 1 FROM crypto_fundraising WHERE project = 'Solana Foundation');

INSERT INTO crypto_glossary (term, definition, category, examples) 
SELECT 'DeFi', 'Decentralized Finance - Financial services built on blockchain without intermediaries', 'Protocol', 'Uniswap, Compound, Aave'
WHERE NOT EXISTS (SELECT 1 FROM crypto_glossary WHERE term = 'DeFi');

INSERT INTO crypto_glossary (term, definition, category, examples) 
SELECT 'NFT', 'Non-Fungible Token - Unique digital asset representing ownership', 'Token', 'CryptoPunks, Bored Ape Yacht Club'
WHERE NOT EXISTS (SELECT 1 FROM crypto_glossary WHERE term = 'NFT');

INSERT INTO crypto_glossary (term, definition, category, examples) 
SELECT 'Smart Contract', 'Self-executing contract with terms directly written into code', 'Technology', 'Ethereum smart contracts, Solana programs'
WHERE NOT EXISTS (SELECT 1 FROM crypto_glossary WHERE term = 'Smart Contract');

INSERT INTO crypto_glossary (term, definition, category, examples) 
SELECT 'DAO', 'Decentralized Autonomous Organization - Community-governed organization', 'Organization', 'MakerDAO, Uniswap DAO'
WHERE NOT EXISTS (SELECT 1 FROM crypto_glossary WHERE term = 'DAO');

INSERT INTO crypto_glossary (term, definition, category, examples) 
SELECT 'Yield Farming', 'Earning rewards by providing liquidity to DeFi protocols', 'Strategy', 'Compound, Aave, Yearn Finance'
WHERE NOT EXISTS (SELECT 1 FROM crypto_glossary WHERE term = 'Yield Farming');
