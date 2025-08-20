# 🚀 **PRODUCTION ENVIRONMENT SETUP - AUTENTIKASI**

## **🔐 LANGKAH 1: Buat File .env.local**

Buat file baru bernama `.env.local` di root project dan copy-paste kode berikut:

```env
# =============================================================================
# ENTERPRISE AUTHENTICATION SYSTEM - PRODUCTION CONFIGURATION
# =============================================================================

# SUPABASE CONFIGURATION (Primary Authentication Service)
# Dapatkan dari: https://supabase.com/dashboard/project/[YOUR_PROJECT_ID]/settings/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# CRITICAL: PRODUCTION DOMAIN CONFIGURATION
NEXT_PUBLIC_PRODUCTION_DOMAIN=https://belugagithubv2025machineloopscorpsf-gold.vercel.app
NEXT_PUBLIC_DEVELOPMENT_DOMAIN=http://localhost:3000

# AUTHENTICATION SECURITY SETTINGS
AUTH_SESSION_REFRESH_THRESHOLD=300000
AUTH_MAX_LOGIN_ATTEMPTS=5
AUTH_LOCKOUT_DURATION=600000
AUTH_PASSWORD_MIN_LENGTH=8
AUTH_RATE_LIMIT_WINDOW=900000
AUTH_MAX_REQUESTS_PER_WINDOW=10

# GOOGLE OAUTH CONFIGURATION (Optional)
# Dapatkan dari: https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=your_google_oauth_client_id_here
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret_here

# SECURITY HEADERS & CORS
NEXT_PUBLIC_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,https://belugagithubv2025machineloopscorpsf-gold.vercel.app
CORS_MAX_AGE=86400

# ENVIRONMENT IDENTIFICATION
NODE_ENV=production
NEXT_PUBLIC_APP_ENV=production

# MONITORING & ANALYTICS (Optional)
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_ga_measurement_id_here

# PERFORMANCE OPTIMIZATION
NEXT_PUBLIC_ENABLE_SERVICE_WORKER=true
NEXT_PUBLIC_ENABLE_PWA=true
NEXT_PUBLIC_ENABLE_OFFLINE_MODE=true

# FEATURE FLAGS
NEXT_PUBLIC_ENABLE_BIOMETRIC_AUTH=false
NEXT_PUBLIC_ENABLE_2FA=false
NEXT_PUBLIC_ENABLE_SOCIAL_LOGIN=true

# DEVELOPMENT TOOLS
NEXT_PUBLIC_ENABLE_DEBUG_MODE=false
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=true
```

## **🌐 LANGKAH 2: Setup Supabase Project**

### **2.1 Buat Project Supabase**
1. Buka [https://supabase.com](https://supabase.com)
2. Sign up/Login dengan akun Anda
3. Klik "New Project"
4. Pilih organization
5. Masukkan detail project:
   - **Name**: `beluga-crypto-enterprise`
   - **Database Password**: Generate password kuat (16+ karakter)
   - **Region**: Pilih yang terdekat (e.g., `Southeast Asia (Singapore)` untuk Indonesia)
6. Klik "Create new project"

### **2.2 Dapatkan API Credentials**
1. Di dashboard Supabase, buka **Settings > API**
2. Copy nilai berikut:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon/Public Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **Service Role Key** (jaga kerahasiaan): `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### **2.3 Konfigurasi Authentication Settings**
1. Buka **Authentication > Settings**
2. Di "Site URL", tambahkan:
   - Development: `http://localhost:3000`
   - Production: `https://belugagithubv2025machineloopscorpsf-gold.vercel.app`
3. Di "Redirect URLs", tambahkan:
   - `http://localhost:3000/auth/callback`
   - `https://belugagithubv2025machineloopscorpsf-gold.vercel.app/auth/callback`
   - `http://localhost:3000/auth/reset-password`
   - `https://belugagithubv2025machineloopscorpsf-gold.vercel.app/auth/reset-password`

### **2.4 Enable OAuth Providers**
1. Buka **Authentication > Providers**
2. **Google OAuth**:
   - Enable Google provider
   - Buat OAuth credentials di [Google Cloud Console](https://console.cloud.google.com/)
   - Tambahkan Client ID dan Client Secret
3. **Email Provider**:
   - Enable email confirmations
   - Customize email templates untuk branding

## **🔑 LANGKAH 3: Setup Google OAuth (Optional)**

### **3.1 Buat Google OAuth Credentials**
1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih yang ada
3. Enable Google+ API
4. Buka **APIs & Services > Credentials**
5. Klik "Create Credentials" > "OAuth 2.0 Client IDs"
6. Pilih "Web application"
7. Tambahkan Authorized redirect URIs:
   - `https://belugagithubv2025machineloopscorpsf-gold.vercel.app/auth/callback`
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3001/auth/callback`
8. Copy Client ID dan Client Secret

## **🚀 LANGKAH 4: Konfigurasi Vercel Production**

### **4.1 Environment Variables di Vercel**
1. Buka [Vercel Dashboard](https://vercel.com/dashboard)
2. Pilih project Beluga
3. Buka **Settings > Environment Variables**
4. Tambahkan semua environment variables dari `.env.local`
5. **CRITICAL**: Set `NODE_ENV=production`

### **4.2 Domain Configuration**
1. Di Vercel dashboard, buka **Settings > Domains**
2. Pastikan domain `belugagithubv2025machineloopscorpsf-gold.vercel.app` sudah terkonfigurasi
3. Verifikasi SSL certificate sudah aktif

## **✅ LANGKAH 5: Test Production Authentication**

### **5.1 Deploy ke Production**
```bash
git add .
git commit -m "Configure production authentication"
git push origin main
```

### **5.2 Test Authentication Flow**
1. Buka production URL: `https://belugagithubv2025machineloopscorpsf-gold.vercel.app`
2. Test sign up dengan email baru
3. Test login dengan akun yang sudah ada
4. Test Google OAuth (jika dikonfigurasi)
5. Test password reset

### **5.3 Verifikasi di Supabase Dashboard**
1. Buka **Authentication > Users**
2. Pastikan user baru muncul
3. Check **Authentication > Logs** untuk aktivitas login

## **🔒 SECURITY CHECKLIST**

- [ ] Environment variables tidak di-commit ke git
- [ ] Supabase service role key tidak exposed ke client
- [ ] CORS origins sudah dikonfigurasi dengan benar
- [ ] SSL certificates aktif di production
- [ ] Rate limiting sudah dikonfigurasi
- [ ] Account lockout sudah aktif
- [ ] Session management sudah secure

## **🚨 TROUBLESHOOTING**

### **Jika autentikasi tidak bekerja di production:**
1. Check environment variables di Vercel
2. Verifikasi Supabase project URL dan keys
3. Check Supabase dashboard untuk error logs
4. Verifikasi redirect URLs sudah benar
5. Check browser console untuk error messages

### **Jika Google OAuth tidak bekerja:**
1. Verifikasi Google OAuth credentials
2. Check authorized redirect URIs
3. Pastikan Google+ API sudah enabled
4. Verifikasi domain sudah di-whitelist

## **🎯 HASIL YANG DIHARAPKAN**

Setelah setup yang benar:
- ✅ Autentikasi berfungsi sempurna di production
- ✅ Sign up, login, dan logout berjalan lancar
- ✅ Google OAuth berfungsi (jika dikonfigurasi)
- ✅ Password reset berfungsi
- ✅ Session management secure dan reliable
- ✅ Rate limiting dan security features aktif
- ✅ Zero authentication errors di production

## **📞 SUPPORT**

Jika mengalami masalah:
1. Check Supabase dashboard logs
2. Check Vercel function logs
3. Check browser console errors
4. Verifikasi semua environment variables
5. Test di development environment dulu
