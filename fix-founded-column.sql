-- Fix founded column untuk crypto_exchanges table
-- Jalankan script ini di Supabase SQL Editor

-- Tambahkan kolom founded sebagai DATE (sesuai dengan form input type="date")
ALTER TABLE crypto_exchanges 
ADD COLUMN IF NOT EXISTS founded DATE;

-- Update kolom founded_year jika ada data yang perlu dipindahkan
-- (Opsional: jika ada data di founded_year yang perlu dipindahkan ke founded)
-- UPDATE crypto_exchanges 
-- SET founded = TO_DATE(founded_year::text, 'YYYY') 
-- WHERE founded_year IS NOT NULL AND founded IS NULL;

-- Verifikasi struktur tabel
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'crypto_exchanges' 
AND column_name IN ('founded', 'founded_year', 'region', 'trading_volume', 'features')
ORDER BY column_name;




