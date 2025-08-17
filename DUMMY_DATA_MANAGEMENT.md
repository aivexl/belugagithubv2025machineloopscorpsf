# Dummy Data Management Guide

## 📁 File Location
Semua data dummy tersimpan di: `src/data/dummyData.js`

## 🗂️ Data Categories

### 1. **Exchanges** (Pertukaran)
- **File**: `dummyExchanges` array
- **Properties**: id, name, logo, type, tradingVolume, pairs, status, website, description
- **Example**:
```javascript
{
  id: 1,
  name: 'Binance',
  logo: 'https://ui-avatars.com/api/?name=B&background=F7931A&color=fff&size=64&font-size=0.4',
  type: 'Centralized',
  tradingVolume: '$15.2B',
  pairs: '1500+',
  status: 'Active',
  website: 'https://binance.com',
  description: 'World\'s largest cryptocurrency exchange by trading volume'
}
```

### 2. **Airdrops** (Distribusi Token Gratis)
- **File**: `dummyAirdrops` array
- **Properties**: id, project, token, network, status, startDate, endDate, totalAllocation, minAllocation, maxAllocation, requirements, estimatedValue, participants, website, type, category, logo
- **Example**:
```javascript
{
  id: 1,
  project: 'Jupiter',
  token: 'JUP',
  network: 'Solana',
  status: 'Active',
  startDate: '2024-01-15',
  endDate: '2024-02-15',
  totalAllocation: '100,000,000',
  minAllocation: '100',
  maxAllocation: '10,000',
  requirements: 'Hold SOL, Use Jupiter DEX',
  estimatedValue: '$50 - $500',
  participants: '50,000+',
  website: 'https://jup.ag',
  type: 'DeFi',
  category: 'DEX',
  logo: 'https://ui-avatars.com/api/?name=J&background=9945FF&color=fff&size=64&font-size=0.4'
}
```

### 3. **Fundraising** (Pendanaan)
- **File**: `dummyFundraising` array
- **Properties**: id, project, logo, type, amount, investors, date, status, description, website
- **Example**:
```javascript
{
  id: 1,
  project: 'EigenLayer',
  logo: 'https://ui-avatars.com/api/?name=E&background=4ECDC4&color=fff&size=64&font-size=0.4',
  type: 'Series A',
  amount: '$50M',
  investors: 'Paradigm, a16z, Polychain',
  date: '2023-12-15',
  status: 'Completed',
  description: 'Restaking protocol for Ethereum',
  website: 'https://eigenlayer.xyz'
}
```

### 4. **ICO/IDO** (Initial Coin/Token Offering)
- **File**: `dummyICOIDO` array
- **Properties**: id, project, token, network, type, price, hardCap, softCap, startDate, endDate, status, description, website, logo
- **Example**:
```javascript
{
  id: 1,
  project: 'Arbitrum',
  token: 'ARB',
  network: 'Ethereum',
  type: 'IDO',
  price: '$0.10',
  hardCap: '$50M',
  softCap: '$25M',
  startDate: '2023-03-23',
  endDate: '2023-03-25',
  status: 'Completed',
  description: 'Ethereum L2 scaling solution',
  website: 'https://arbitrum.io',
  logo: 'https://ui-avatars.com/api/?name=A&background=28A0F0&color=fff&size=64&font-size=0.4'
}
```

## 🔧 Cara Mengupdate Data

### **Menambah Data Baru**
1. Buka file `src/data/dummyData.js`
2. Cari array yang sesuai (misal: `dummyExchanges`)
3. Tambahkan object baru dengan ID yang unik
4. Pastikan semua properties terisi dengan benar

### **Mengupdate Data Existing**
1. Buka file `src/data/dummyData.js`
2. Cari object yang ingin diupdate berdasarkan ID
3. Ubah properties yang diperlukan
4. Simpan file

### **Menghapus Data**
1. Buka file `src/data/dummyData.js`
2. Cari object yang ingin dihapus berdasarkan ID
3. Hapus seluruh object tersebut
4. Pastikan ID tidak ada yang duplikat

## 🌐 API Endpoints

### **Get All Data by Type**
```
GET /api/dummy-data?type=exchanges
GET /api/dummy-data?type=airdrops
GET /api/dummy-data?type=fundraising
GET /api/dummy-data?type=ico
```

### **Get Specific Item by ID**
```
GET /api/dummy-data?type=exchanges&id=1
GET /api/dummy-data?type=airdrops&id=2
```

### **Search Data**
```
GET /api/dummy-data?type=exchanges&search=binance
GET /api/dummy-data?type=airdrops&search=solana
```

## 🎨 Logo Generation

### **Menggunakan UI Avatars**
- **Format**: `https://ui-avatars.com/api/?name=[LETTER]&background=[COLOR]&color=fff&size=64&font-size=0.4`
- **Colors Available**: 
  - Red: `FF6B6B`, `E74C3C`
  - Blue: `3498DB`, `74B9FF`, `28A0F0`
  - Green: `2ECC71`, `00B894`, `16A085`
  - Purple: `9B59B6`, `8E44AD`, `A29BFE`
  - Orange: `F39C12`, `E67E22`
  - Yellow: `F7DC6F`, `F8C471`

### **Custom Logo**
Jika ingin menggunakan logo custom:
1. Upload logo ke folder `public/images/`
2. Update property `logo` dengan path: `/images/[filename]`

## 📊 Data Validation

### **Required Properties**
- **id**: Harus unik dan berupa number
- **name/project**: Nama project/exchange
- **logo**: URL logo yang valid
- **status**: Active, Completed, Upcoming, atau status lainnya
- **website**: URL website yang valid

### **Optional Properties**
- **description**: Deskripsi project
- **type**: Kategori project
- **category**: Sub-kategori project

## 🚀 Tips Penggunaan

1. **Backup Data**: Selalu backup file sebelum melakukan perubahan besar
2. **ID Management**: Pastikan ID selalu unik dan berurutan
3. **Data Consistency**: Gunakan format yang konsisten untuk dates, amounts, dan status
4. **Logo Colors**: Variasikan warna logo agar tidak monoton
5. **Regular Updates**: Update data secara berkala untuk menjaga relevansi

## 🔍 Testing

Setelah mengupdate data, test dengan:
```bash
# Test exchanges
curl "http://localhost:3001/api/dummy-data?type=exchanges"

# Test airdrops
curl "http://localhost:3001/api/dummy-data?type=airdrops"

# Test fundraising
curl "http://localhost:3001/api/dummy-data?type=fundraising"

# Test ICO/IDO
curl "http://localhost:3001/api/dummy-data?type=ico"
```

## 📝 Notes

- Data ini bersifat **dummy** dan dapat diupdate manual
- Untuk production, pertimbangkan menggunakan database
- Semua data menggunakan logo placeholder dari UI Avatars
- API mendukung search dan filtering berdasarkan ID
- Data dapat diupdate tanpa restart server (hot reload)
