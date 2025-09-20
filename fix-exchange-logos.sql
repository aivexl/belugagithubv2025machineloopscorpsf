-- Fix Exchange Logos Script
-- Jalankan script ini di Supabase SQL Editor untuk memperbaiki logo exchange

-- 1. Tambahkan kolom logo jika belum ada
ALTER TABLE crypto_exchanges 
ADD COLUMN IF NOT EXISTS logo TEXT;

-- 2. Update logo untuk exchanges yang sudah ada dengan logo yang valid
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

-- 3. Verifikasi hasil update
SELECT 
  id,
  name,
  logo,
  CASE 
    WHEN logo IS NOT NULL AND logo != '' THEN 'HAS LOGO'
    ELSE 'NO LOGO'
  END as logo_status
FROM crypto_exchanges 
ORDER BY name;

-- 4. Tambahkan beberapa sample exchanges dengan logo yang valid jika belum ada
INSERT INTO crypto_exchanges (
  name, country, region, founded, website_url, type, status, description, logo, trading_volume, pairs, features
) VALUES 
(
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
),
(
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
),
(
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
)
ON CONFLICT (name) DO NOTHING;

-- 5. Final verification
SELECT 
  COUNT(*) as total_exchanges,
  COUNT(CASE WHEN logo IS NOT NULL AND logo != '' THEN 1 END) as exchanges_with_logo,
  COUNT(CASE WHEN logo IS NULL OR logo = '' THEN 1 END) as exchanges_without_logo
FROM crypto_exchanges;
