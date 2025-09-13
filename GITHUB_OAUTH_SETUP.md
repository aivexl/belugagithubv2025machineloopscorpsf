# GitHub OAuth Setup untuk Sanity Studio

## Langkah-langkah Setup GitHub OAuth

### 1. Buat GitHub OAuth App

1. Pergi ke [GitHub Developer Settings](https://github.com/settings/applications/new)
2. Isi form dengan detail berikut:
   - **Application name**: `Beluga Crypto CMS`
   - **Homepage URL**: `http://localhost:3000` (untuk development)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/github/callback`
3. Klik "Register application"
4. Catat **Client ID** dan **Client Secret**

### 2. Setup Environment Variables

Buat file `.env.local` di root project dengan isi:

```bash
# GitHub OAuth Configuration
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_string_here

# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=qaofdbqx
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-07-22
SANITY_AUTH_TOKEN=your_sanity_auth_token_here
```

### 3. Generate NEXTAUTH_SECRET

Jalankan command berikut untuk generate secret:

```bash
openssl rand -base64 32
```

### 4. Setup Sanity Auth Token

1. Pergi ke [Sanity Management Console](https://sanity.io/manage)
2. Pilih project `qaofdbqx`
3. Pergi ke **API** → **Tokens**
4. Klik **Add API token**
5. Beri nama: `Studio Auth Token`
6. Set permissions: **Editor**
7. Copy token dan masukkan ke `SANITY_AUTH_TOKEN`

### 5. Test Setup

1. Restart development server:
   ```bash
   npm run dev
   ```

2. Buka `http://localhost:3000/studio`
3. Klik "Login with GitHub"
4. Authorize aplikasi
5. Anda akan diarahkan kembali ke studio

## Troubleshooting

### Error: "Missing authorization code"
- Pastikan callback URL di GitHub OAuth app sudah benar
- Pastikan `GITHUB_CLIENT_ID` dan `GITHUB_CLIENT_SECRET` sudah benar

### Error: "Authentication failed"
- Pastikan `SANITY_AUTH_TOKEN` sudah benar
- Pastikan token memiliki permission **Editor**

### Studio berkedip tanpa henti
- Pastikan semua environment variables sudah diisi
- Restart development server
- Clear browser cache dan cookies

## Production Setup

Untuk production, update:
- **Homepage URL**: `https://your-domain.com`
- **Authorization callback URL**: `https://your-domain.com/api/auth/github/callback`
- **NEXTAUTH_URL**: `https://your-domain.com`
