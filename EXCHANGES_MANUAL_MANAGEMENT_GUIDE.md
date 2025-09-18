# Panduan Pengelolaan Manual Data Exchanges

## Overview
Sistem ini menyediakan cara mudah untuk mengelola data exchanges cryptocurrency secara manual melalui interface admin yang user-friendly.

## Struktur Data Exchange

Setiap exchange memiliki struktur data berikut:

```javascript
{
  id: number,                    // ID unik (auto-generated)
  name: string,                  // Nama exchange (required)
  country: string,               // Negara asal (required)
  region: string,                // Region (required)
  founded: string,               // Tanggal didirikan (required, format: YYYY-MM-DD)
  website: string,               // URL website (required)
  type: string,                  // 'Centralized' atau 'Decentralized' (required)
  status: string,                // 'Active', 'Inactive', atau 'Suspended' (required)
  description: string,           // Deskripsi exchange (optional)
  logo: string,                  // URL logo (optional)
  tradingVolume: string,        // Volume trading (optional, format: $1.5B)
  pairs: string,                 // Jumlah trading pairs (optional, format: 200+)
  features: string[]             // Array fitur-fitur (optional)
}
```

## Cara Menggunakan Interface Admin

### 1. Akses Admin Panel
- Buka halaman: `/admin/exchanges`
- Interface admin akan menampilkan semua exchanges yang ada

### 2. Menambah Exchange Baru
1. Klik tombol "Add Exchange"
2. Isi form dengan data yang diperlukan:
   - **Name**: Nama exchange (wajib)
   - **Country**: Negara asal (wajib)
   - **Region**: Pilih dari dropdown (wajib)
   - **Founded Date**: Tanggal didirikan (wajib)
   - **Website**: URL website (wajib)
   - **Type**: Centralized atau Decentralized (wajib)
   - **Status**: Active, Inactive, atau Suspended (wajib)
   - **Logo URL**: URL logo exchange (opsional)
   - **Trading Volume**: Volume trading (opsional)
   - **Trading Pairs**: Jumlah trading pairs (opsional)
   - **Description**: Deskripsi exchange (opsional)
   - **Features**: Fitur-fitur exchange, pisahkan dengan koma (opsional)
3. Klik "Save" untuk menyimpan

### 3. Mengedit Exchange
1. Klik ikon edit (pensil) pada exchange yang ingin diedit
2. Ubah data yang diperlukan
3. Klik "Save" untuk menyimpan perubahan

### 4. Menghapus Exchange
1. Klik ikon delete (tong sampah) pada exchange yang ingin dihapus
2. Konfirmasi penghapusan

### 5. Filter dan Pencarian
- **Search**: Ketik nama exchange atau negara untuk mencari
- **Filter**: Filter berdasarkan tipe (All, Centralized, Decentralized)

## Pengelolaan Manual File Data

### Lokasi File Data
Data exchanges disimpan di: `src/data/exchangesData.js`

### Menambah Data Secara Langsung
Anda dapat menambah data exchange langsung ke file `exchangesData.js`:

```javascript
// Tambahkan ke array exchangesData
{
  id: 31, // ID berikutnya
  name: 'Exchange Name',
  country: 'Country',
  region: 'Region',
  founded: '2024-01-01',
  website: 'https://example.com',
  type: 'Centralized',
  status: 'Active',
  description: 'Exchange description',
  logo: 'https://example.com/logo.png',
  tradingVolume: '$100M',
  pairs: '50+',
  features: ['Spot Trading', 'Futures', 'Staking']
}
```

### Helper Functions
File data menyediakan helper functions:

```javascript
// Ambil exchange berdasarkan ID
const exchange = getExchangeById(1);

// Ambil exchanges berdasarkan tipe
const centralizedExchanges = getExchangesByType('Centralized');

// Ambil exchanges berdasarkan region
const asianExchanges = getExchangesByRegion('Asia');

// Cari exchanges
const searchResults = searchExchanges('binance');

// Tambah exchange baru
const newExchange = addExchange({
  name: 'New Exchange',
  country: 'Singapore',
  // ... data lainnya
});

// Update exchange
const updatedExchange = updateExchange(1, {
  tradingVolume: '$2B'
});

// Hapus exchange
const deletedExchange = deleteExchange(1);
```

## Validasi Data

### Field Wajib
- `name`: Nama exchange
- `country`: Negara asal
- `region`: Region (North America, South America, Europe, Asia, Africa, Oceania, Caribbean)
- `founded`: Tanggal didirikan (format: YYYY-MM-DD)
- `website`: URL website (harus valid URL)
- `type`: 'Centralized' atau 'Decentralized'
- `status`: 'Active', 'Inactive', atau 'Suspended'

### Format Data
- **Founded Date**: Format ISO (YYYY-MM-DD)
- **Website**: Harus dimulai dengan http:// atau https://
- **Trading Volume**: Format seperti $1.5B, $500M, dll
- **Trading Pairs**: Format seperti 200+, 50+, dll
- **Features**: Array string, pisahkan dengan koma

## Tips Pengelolaan

### 1. Konsistensi Data
- Gunakan format yang konsisten untuk volume trading
- Pastikan URL website valid dan dapat diakses
- Gunakan nama region yang sudah ada atau tambahkan ke dropdown

### 2. Logo Exchange
- Gunakan URL logo yang stabil dan dapat diakses
- Format yang disarankan: PNG atau SVG
- Ukuran yang disarankan: 64x64 pixels atau lebih besar

### 3. Features Exchange
- Gunakan nama fitur yang umum dan mudah dipahami
- Contoh: 'Spot Trading', 'Futures', 'Margin Trading', 'Staking', 'Lending', 'NFT Marketplace', 'DeFi', 'AMM', 'Yield Farming'

### 4. Backup Data
- Selalu backup file `exchangesData.js` sebelum melakukan perubahan besar
- Pertimbangkan untuk menggunakan version control (Git)

## Troubleshooting

### Error: Exchange tidak muncul
- Pastikan data sudah disimpan dengan benar
- Cek console browser untuk error JavaScript
- Pastikan semua field wajib sudah diisi

### Error: Logo tidak muncul
- Pastikan URL logo valid dan dapat diakses
- Cek apakah ada CORS issue
- Gunakan fallback logo default

### Error: Form tidak bisa disimpan
- Pastikan semua field wajib sudah diisi
- Cek format tanggal (YYYY-MM-DD)
- Pastikan URL website valid

## Contoh Data Exchange Lengkap

```javascript
{
  id: 1,
  name: 'Binance',
  country: 'Malta',
  region: 'Europe',
  founded: '2017-07-14',
  website: 'https://www.binance.com',
  type: 'Centralized',
  status: 'Active',
  description: 'World\'s largest cryptocurrency exchange by trading volume',
  logo: 'https://ui-avatars.com/api/?name=B&background=F7931A&color=fff&size=64&font-size=0.4',
  tradingVolume: '$15.2B',
  pairs: '1500+',
  features: ['Spot Trading', 'Futures', 'Options', 'Staking', 'NFT Marketplace']
}
```

## Update dan Maintenance

### Regular Updates
- Update volume trading secara berkala
- Update status exchange jika ada perubahan
- Tambah exchange baru yang relevan
- Hapus exchange yang sudah tidak aktif

### Monitoring
- Monitor website exchange untuk perubahan
- Cek apakah logo masih dapat diakses
- Update deskripsi jika ada perubahan signifikan

Dengan sistem ini, Anda dapat dengan mudah mengelola data exchanges secara manual melalui interface yang user-friendly atau langsung mengedit file data.
