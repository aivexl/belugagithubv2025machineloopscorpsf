# New Pages Guide - ICO/IDO & Fundraising

## 🚀 **Halaman Baru yang Telah Dibuat**

### 1. **ICO/IDO Page** (`/ico-ido`)
- **File**: `src/app/ico-ido/page.jsx`
- **Component**: `src/components/IcoIdoClient.jsx`
- **Data Source**: `/api/dummy-data?type=ico`

### 2. **Fundraising Page** (`/fundraising`)
- **File**: `src/app/fundraising/page.jsx`
- **Component**: `src/components/FundraisingClient.jsx`
- **Data Source**: `/api/dummy-data?type=fundraising`

## 📊 **Kolom dan Informasi yang Ditampilkan**

### **ICO/IDO Page - Kolom Khusus:**
- **Project Name** - Nama project
- **Token Symbol** - Simbol token (ARB, OP, MATIC, dll)
- **Network** - Blockchain network (Ethereum, Solana, dll)
- **Type** - Jenis offering (ICO, IDO, IEO)
- **Status** - Status project (Active, Upcoming, Completed)
- **Token Price** - Harga token per unit
- **Hard Cap** - Target maksimal fundraising
- **Soft Cap** - Target minimal fundraising
- **Start Date** - Tanggal mulai
- **End Date** - Tanggal berakhir
- **Description** - Deskripsi project
- **Website** - Link ke website project

### **Fundraising Page - Kolom Khusus:**
- **Project Name** - Nama project
- **Funding Type** - Jenis funding round (Seed, Series A, B, C, dll)
- **Status** - Status funding (Active, Completed, Upcoming)
- **Amount Raised** - Jumlah dana yang berhasil dikumpulkan
- **Date** - Tanggal funding round
- **Investors** - Daftar investor yang berpartisipasi
- **Description** - Deskripsi project dan funding
- **Website** - Link ke website project

## 🔍 **Fitur yang Tersedia**

### **Search & Filter:**
- **Search Bar** - Cari berdasarkan nama project, token, network, atau description
- **Status Filter** - Filter berdasarkan status (All, Active, Upcoming, Completed)
- **Network Filter** - Filter berdasarkan blockchain network (ICO/IDO only)
- **Type Filter** - Filter berdasarkan jenis funding/offering
- **Advanced Filters** - Panel filter tambahan yang bisa di-toggle

### **UI Components:**
- **Responsive Grid** - Layout yang responsive (1-3 kolom)
- **Status Badges** - Badge berwarna untuk status
- **Logo Display** - Logo project dengan fallback ke inisial
- **Hover Effects** - Efek hover pada cards
- **Loading States** - Loading spinner saat fetch data
- **Empty States** - Pesan ketika tidak ada data

## 🌐 **URL Routes**

```
/ico-ido          → ICO/IDO Projects Page
/fundraising      → Fundraising Projects Page
```

## 📱 **Responsive Design**

- **Mobile**: 1 kolom
- **Tablet**: 2 kolom  
- **Desktop**: 3 kolom
- **Filter**: Collapsible pada mobile

## 🎨 **Design System**

### **Colors:**
- **Background**: `bg-gray-900` (dark theme)
- **Cards**: `bg-gray-800` dengan border `border-gray-700`
- **Primary**: `bg-blue-600` untuk buttons dan accents
- **Status Colors**:
  - Active: `bg-green-600`
  - Upcoming: `bg-yellow-600`
  - Completed: `bg-gray-600`

### **Typography:**
- **Headers**: `text-lg font-bold text-white`
- **Body**: `text-gray-300`
- **Captions**: `text-gray-400 text-xs`

## 🔧 **Technical Implementation**

### **State Management:**
- `loading` - Loading state
- `searchQuery` - Search input value
- `activeStatus` - Selected status filter
- `selectedNetwork` - Selected network filter (ICO/IDO)
- `selectedType` - Selected type filter
- `showFilters` - Toggle advanced filters

### **Data Fetching:**
- Menggunakan `useEffect` untuk fetch data saat component mount
- Fetch dari `/api/dummy-data` dengan parameter type
- Error handling untuk failed requests
- Loading states untuk UX yang smooth

### **Filtering Logic:**
- Real-time filtering berdasarkan search query
- Multiple filter combinations (status + network + type)
- Case-insensitive search
- Dynamic result count display

## 📊 **Data Structure**

### **ICO/IDO Data:**
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
  logo: 'https://ui-avatars.com/api/...'
}
```

### **Fundraising Data:**
```javascript
{
  id: 1,
  project: 'EigenLayer',
  logo: 'https://ui-avatars.com/api/...',
  type: 'Series A',
  amount: '$50M',
  investors: 'Paradigm, a16z, Polychain',
  date: '2023-12-15',
  status: 'Completed',
  description: 'Restaking protocol for Ethereum',
  website: 'https://eigenlayer.xyz'
}
```

## 🚀 **Cara Menggunakan**

### **Untuk User:**
1. **Buka halaman** `/ico-ido` atau `/fundraising`
2. **Gunakan search bar** untuk mencari project tertentu
3. **Filter berdasarkan status** (All, Active, Upcoming, Completed)
4. **Gunakan advanced filters** untuk filtering yang lebih spesifik
5. **Klik "Visit Project"** untuk membuka website project

### **Untuk Developer:**
1. **Update data** di `src/data/dummyData.js`
2. **Modify components** di `src/components/IcoIdoClient.jsx` atau `FundraisingClient.jsx`
3. **Add new routes** jika diperlukan
4. **Customize styling** menggunakan Tailwind CSS classes

## 🔄 **Update Data**

Data dapat diupdate dengan cara yang sama seperti halaman airdrop:
1. Edit file `src/data/dummyData.js`
2. Update array `dummyICOIDO` atau `dummyFundraising`
3. Data akan langsung tersedia di halaman tanpa restart server

## 📝 **Notes**

- **Consistent Design**: Kedua halaman menggunakan design system yang sama dengan airdrop page
- **Reusable Components**: Banyak komponen yang bisa di-reuse
- **Performance**: Lazy loading dan efficient filtering
- **Accessibility**: Proper ARIA labels dan keyboard navigation
- **SEO**: Metadata yang sesuai untuk setiap halaman

## 🎯 **Next Steps**

1. **Add more data** ke dummy data arrays
2. **Implement real-time updates** jika diperlukan
3. **Add pagination** untuk data yang banyak
4. **Add sorting options** (by date, amount, etc.)
5. **Add export functionality** (CSV, PDF)
6. **Add bookmark/favorite** feature
7. **Add notifications** untuk project baru
