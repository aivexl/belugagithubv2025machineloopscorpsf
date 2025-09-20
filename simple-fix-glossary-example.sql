-- Simple Fix for crypto_glossary example column
-- Jalankan script ini di Supabase SQL Editor

-- Tambahkan kolom example
ALTER TABLE crypto_glossary ADD COLUMN example TEXT;

-- Verifikasi kolom sudah ada
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'crypto_glossary' AND column_name = 'example';
