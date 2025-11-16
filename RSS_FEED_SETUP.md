# RSS Feed Setup - Beluga

## Deskripsi

RSS feed telah dibuat untuk memungkinkan pengguna berlangganan artikel terbaru dari Beluga. RSS feed ini juga membantu dengan SEO dan AdSense approval.

## Endpoint RSS Feed

### 1. Feed Utama (Semua Artikel)
- **URL**: `https://beluga.id/feed.xml` atau `https://beluga.id/rss.xml`
- **Deskripsi**: Menampilkan semua artikel terbaru dari Newsroom dan Academy (maksimal 50 artikel terbaru)
- **Format**: RSS 2.0

### 2. Feed Newsroom
- **URL**: `https://beluga.id/feed/newsroom.xml`
- **Deskripsi**: Hanya artikel dari kategori Newsroom
- **Format**: RSS 2.0

### 3. Feed Academy
- **URL**: `https://beluga.id/feed/academy.xml`
- **Deskripsi**: Hanya artikel dari kategori Academy
- **Format**: RSS 2.0

## Fitur RSS Feed

✅ **RSS 2.0 Compliant** - Mengikuti standar RSS 2.0
✅ **Auto-discovery** - Link RSS otomatis ditambahkan di `<head>` untuk auto-discovery
✅ **Caching** - Menggunakan cache untuk performa (1 jam cache, 24 jam stale-while-revalidate)
✅ **Image Enclosure** - Setiap item memiliki gambar yang di-enclose
✅ **Metadata Lengkap** - Setiap item memiliki title, description, author, category, dan pubDate
✅ **XML Escaping** - Semua karakter khusus di-escape dengan benar
✅ **Sorted by Date** - Artikel diurutkan dari terbaru ke terlama
✅ **Limited Items** - Maksimal 50 artikel per feed untuk performa

## Struktur RSS Feed

Setiap RSS feed berisi:
- **Channel Info**: Title, description, link, language, lastBuildDate
- **Channel Image**: Logo Beluga
- **Items**: 
  - Title
  - Link (URL artikel)
  - GUID (unique identifier)
  - Description (excerpt atau konten yang di-extract)
  - PubDate (format RFC 822)
  - Author
  - Category
  - Enclosure (gambar artikel)

## Cara Menggunakan

### Untuk Pengguna

1. **Copy RSS Feed URL**:
   - Semua artikel: `https://beluga.id/feed.xml`
   - Newsroom saja: `https://beluga.id/feed/newsroom.xml`
   - Academy saja: `https://beluga.id/feed/academy.xml`

2. **Tambahkan ke RSS Reader**:
   - Feedly: https://feedly.com
   - Inoreader: https://www.inoreader.com
   - Google Reader alternatives
   - Atau aplikasi RSS reader lainnya

3. **Atau gunakan browser**:
   - Banyak browser modern mendukung RSS feed
   - Klik link RSS di browser untuk subscribe

### Untuk Developer

RSS feed di-generate secara dinamis dari Sanity CMS. Setiap request akan:
1. Fetch artikel terbaru dari Sanity
2. Sort berdasarkan publishedAt (newest first)
3. Limit ke 50 artikel terbaru
4. Generate XML RSS format
5. Return dengan proper headers

## File yang Dibuat

1. `src/app/feed.xml/route.ts` - Main RSS feed (semua artikel)
2. `src/app/rss.xml/route.ts` - Redirect ke feed.xml (untuk kompatibilitas)
3. `src/app/feed/newsroom.xml/route.ts` - RSS feed untuk Newsroom
4. `src/app/feed/academy.xml/route.ts` - RSS feed untuk Academy

## Auto-Discovery

Link RSS feed otomatis ditambahkan di `<head>` section melalui `src/app/layout.tsx`:
- Browser akan otomatis mendeteksi RSS feed
- RSS readers dapat auto-discover feed
- Meningkatkan SEO dan discoverability

## Testing

Setelah deploy, test RSS feed dengan:

1. **Browser**: Buka `https://beluga.id/feed.xml` di browser
2. **RSS Validator**: 
   - https://validator.w3.org/feed/
   - https://www.feedvalidator.org/
3. **RSS Reader**: Coba subscribe di Feedly atau RSS reader lainnya

## Manfaat untuk SEO & AdSense

✅ **Content Syndication** - RSS feed memungkinkan konten di-syndicate ke platform lain
✅ **Better Indexing** - Search engine dapat lebih mudah mengindeks konten baru
✅ **User Engagement** - Pengguna dapat subscribe dan kembali ke situs
✅ **Professional Standard** - RSS feed menunjukkan situs yang profesional dan well-maintained
✅ **AdSense Approval** - RSS feed adalah salah satu indikator situs berkualitas

## Maintenance

RSS feed akan otomatis update setiap kali ada artikel baru yang dipublish di Sanity. Tidak perlu maintenance manual.

## Cache Strategy

- **s-maxage**: 3600 detik (1 jam) - Cache di CDN/edge
- **stale-while-revalidate**: 86400 detik (24 jam) - Serve stale content sambil revalidate di background

Ini memastikan:
- RSS feed cepat di-load
- Konten tetap fresh (update setiap jam)
- Tidak membebani server dengan request berlebihan

## Troubleshooting

### RSS Feed tidak muncul
- Pastikan artikel sudah dipublish di Sanity
- Pastikan artikel memiliki `publishedAt` field
- Check console untuk error

### RSS Feed kosong
- Pastikan ada artikel yang sudah dipublish
- Check query di Sanity
- Pastikan `getAllArticles()` atau `getArticlesByCategory()` return data

### Format XML tidak valid
- Pastikan semua karakter di-escape dengan benar
- Check `escapeXml()` function
- Validate dengan RSS validator

## Catatan

- RSS feed hanya menampilkan artikel yang sudah dipublish (memiliki `publishedAt`)
- Maksimal 50 artikel per feed untuk performa
- Artikel diurutkan dari terbaru ke terlama
- Description diambil dari `excerpt` atau di-extract dari `content` (maksimal 500 karakter)




