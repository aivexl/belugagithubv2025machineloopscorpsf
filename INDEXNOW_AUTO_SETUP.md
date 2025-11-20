# IndexNow Auto-Submission Setup

## Deskripsi

Sistem IndexNow telah dikonfigurasi untuk **otomatis submit URL ke Bing** setiap kali artikel baru dibuat atau diupdate di Sanity CMS.

## Cara Kerja

1. **Artikel dibuat/diupdate di Sanity** → Sanity mengirim webhook ke Next.js
2. **Webhook handler** (`/api/sanity/webhook`) menerima notifikasi
3. **IndexNow submission** otomatis mengirim URL ke Bing IndexNow API
4. **Bing mengindeks** URL baru dalam hitungan menit

## URL yang Otomatis Di-Submit

Saat artikel baru dibuat atau diupdate, sistem akan otomatis submit:

1. ✅ **URL Artikel** - URL artikel itu sendiri
   - Contoh: `https://beluga.id/newsroom/bitcoin-halving-2024`
   - Contoh: `https://beluga.id/academy/apa-itu-blockchain`

2. ✅ **Homepage** - Halaman utama (untuk update latest articles)
   - `https://beluga.id`

3. ✅ **Category Page** - Halaman kategori artikel
   - `https://beluga.id/newsroom` (jika artikel newsroom)
   - `https://beluga.id/academy` (jika artikel academy)

4. ✅ **RSS Feed** - Feed RSS yang relevan
   - `https://beluga.id/feed.xml` (semua feed)
   - `https://beluga.id/feed/newsroom.xml` (jika newsroom)
   - `https://beluga.id/feed/academy.xml` (jika academy)

## Setup Webhook di Sanity

### 1. Buka Sanity Studio

1. Login ke Sanity Studio: `https://beluga.id/studio`
2. Atau akses Sanity Manage: https://www.sanity.io/manage

### 2. Buat Webhook

1. Buka **Settings** → **API** → **Webhooks**
2. Klik **Create webhook**
3. Isi form:
   - **Name**: `IndexNow Auto-Submit`
   - **URL**: `https://beluga.id/api/sanity/webhook`
   - **Dataset**: `production` (atau dataset yang digunakan)
   - **Trigger on**: 
     - ✅ `Create`
     - ✅ `Update`
     - ✅ `Delete` (optional)
   - **Filter**: 
     ```
     _type == "article" && defined(slug.current)
     ```
   - **Projection**: 
     ```json
     {
       "_type": _type,
       "slug": slug,
       "category": category,
       "publishedAt": publishedAt
     }
     ```
   - **HTTP method**: `POST`
   - **API version**: `v2021-06-07` atau versi terbaru
   - **Secret** (optional): Set `SANITY_WEBHOOK_SECRET` di environment variables

### 3. Environment Variables

Pastikan environment variables berikut sudah diset:

```env
# IndexNow Configuration
INDEXNOW_KEY=a9c3f5d1e8b24f27a1c0b6d492ef34ab
NEXT_PUBLIC_SITE_URL=https://beluga.id
# atau
SITE_URL=https://beluga.id

# Sanity Webhook Secret (optional, untuk security)
SANITY_WEBHOOK_SECRET=your-secret-key-here
```

### 4. Verifikasi IndexNow Key

Pastikan file key tersedia di public folder:
- File: `public/a9c3f5d1e8b24f27a1c0b6d492ef34ab.txt`
- Content: `a9c3f5d1e8b24f27a1c0b6d492ef34ab`
- URL: `https://beluga.id/a9c3f5d1e8b24f27a1c0b6d492ef34ab.txt`

## Testing

### 1. Test Webhook Manual

```bash
curl -X POST https://beluga.id/api/sanity/webhook \
  -H "Content-Type: application/json" \
  -H "x-sanity-secret: your-secret" \
  -d '{
    "current": {
      "_type": "article",
      "slug": { "current": "test-article" },
      "category": "newsroom"
    },
    "event": "publish"
  }'
```

### 2. Test IndexNow Submission

```bash
curl -X POST https://beluga.id/api/indexnow \
  -H "Content-Type: application/json" \
  -d '{
    "urls": [
      "https://beluga.id/newsroom/test-article"
    ]
  }'
```

### 3. Check IndexNow Status

Buka: `https://beluga.id/api/indexnow/check?submit=1&url=https://beluga.id`

## Event yang Di-Trigger

Webhook akan submit ke IndexNow saat:

- ✅ **Create** - Artikel baru dibuat
- ✅ **Publish** - Artikel dipublish
- ✅ **Update** - Artikel diupdate
- ✅ **Draft.Publish** - Draft dipublish

Webhook akan **skip** saat:

- ❌ **Delete** - Artikel dihapus (tidak perlu submit)
- ❌ **Unpublish** - Artikel di-unpublish (tidak perlu submit)
- ❌ Event lain yang tidak relevan

## Monitoring

### 1. Check Webhook Logs

Webhook akan return JSON response:
```json
{
  "ok": true,
  "status": 200,
  "submitted": 5,
  "urls": [
    "https://beluga.id/newsroom/article-slug",
    "https://beluga.id",
    "https://beluga.id/newsroom",
    "https://beluga.id/feed.xml",
    "https://beluga.id/feed/newsroom.xml"
  ],
  "articleUrl": "https://beluga.id/newsroom/article-slug",
  "event": "publish",
  "operation": "publish"
}
```

### 2. Check Vercel Logs

Jika deploy di Vercel, cek logs di:
- Vercel Dashboard → Project → Functions → `/api/sanity/webhook`

### 3. Check IndexNow Status

Gunakan endpoint check:
```
GET https://beluga.id/api/indexnow/check
```

## Troubleshooting

### Webhook tidak ter-trigger

1. **Cek webhook configuration di Sanity**
   - Pastikan URL benar: `https://beluga.id/api/sanity/webhook`
   - Pastikan filter benar: `_type == "article"`
   - Pastikan trigger events sudah dicentang

2. **Cek environment variables**
   - Pastikan `SANITY_WEBHOOK_SECRET` (jika digunakan) sama di Sanity dan Next.js

3. **Cek network**
   - Pastikan Sanity bisa reach webhook URL
   - Cek firewall atau CORS issues

### IndexNow submission gagal

1. **Cek IndexNow key**
   - Pastikan file key ada di `public/a9c3f5d1e8b24f27a1c0b6d492ef34ab.txt`
   - Pastikan content file sama dengan key
   - Test: `https://beluga.id/a9c3f5d1e8b24f27a1c0b6d492ef34ab.txt`

2. **Cek environment variables**
   - Pastikan `INDEXNOW_KEY` sudah diset
   - Pastikan `NEXT_PUBLIC_SITE_URL` atau `SITE_URL` sudah diset

3. **Cek response**
   - Status 200 = success
   - Status 400 = bad request (cek payload)
   - Status 401 = unauthorized (cek key)

### Artikel tidak terindeks

1. **Tunggu beberapa menit** - IndexNow biasanya memproses dalam 1-5 menit
2. **Cek di Bing Webmaster Tools** - Lihat apakah URL sudah terindeks
3. **Submit manual** - Gunakan endpoint `/api/indexnow` untuk submit manual

## Manfaat

✅ **Instant Indexing** - Artikel terindeks dalam hitungan menit, bukan hari
✅ **Automatic** - Tidak perlu submit manual setiap kali buat artikel
✅ **Comprehensive** - Submit artikel + homepage + category + RSS feed
✅ **SEO Boost** - Konten baru lebih cepat muncul di search results
✅ **Better Visibility** - Lebih banyak traffic dari search engine

## Catatan Penting

1. **Rate Limiting**: IndexNow tidak memiliki rate limit yang ketat, tapi jangan spam
2. **Duplicate URLs**: Sistem otomatis filter duplicate URLs
3. **Error Handling**: Jika submission gagal, webhook tetap return success untuk Sanity (untuk avoid retry loop)
4. **Security**: Gunakan `SANITY_WEBHOOK_SECRET` untuk production

## Support

Jika ada masalah:
1. Check logs di Vercel/Server
2. Test webhook manual dengan curl
3. Check IndexNow status dengan `/api/indexnow/check`
4. Verify webhook configuration di Sanity







