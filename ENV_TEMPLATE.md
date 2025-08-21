# 🚀 **ENTERPRISE-LEVEL ENVIRONMENT SETUP GUIDE**

## **CRITICAL: Authentication Service Currently Unavailable**

Your application is showing **"Authentication service not available"** because Supabase environment variables are not configured.

## **🔐 IMMEDIATE SETUP REQUIRED**

### **Step 1: Create .env.local File**
Create a file named `.env.local` in your project root (same level as `package.json`) with the following content:

```bash
# ========================================
# ENTERPRISE-LEVEL ENVIRONMENT CONFIGURATION
# ========================================

# SUPABASE CONFIGURATION (REQUIRED - Get from https://supabase.com)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# SANITY CMS CONFIGURATION
NEXT_PUBLIC_SANITY_PROJECT_ID=qaofdbqx
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-20
SANITY_API_TOKEN=your-sanity-api-token-here

# COINGECKO API CONFIGURATION
NEXT_PUBLIC_COINGECKO_API_KEY=your-coingecko-api-key-here
COINGECKO_API_KEY=your-coingecko-api-key-here

# APPLICATION CONFIGURATION
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# SECURITY CONFIGURATION
NEXT_PUBLIC_AUTH_ENABLED=true
NEXT_PUBLIC_MAX_LOGIN_ATTEMPTS=5
NEXT_PUBLIC_LOCKOUT_DURATION=900000
NEXT_PUBLIC_SESSION_TIMEOUT=3600000
```

### **Step 2: Get Supabase Credentials**
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Go to **Settings > API**
5. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon/Public Key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Service Role Key** → `SUPABASE_SERVICE_ROLE_KEY`

### **Step 3: Get CoinGecko API Key (Free)**
1. Go to [https://www.coingecko.com/en/api](https://www.coingecko.com/en/api)
2. Sign up for free account
3. Get your API key
4. Add to both `NEXT_PUBLIC_COINGECKO_API_KEY` and `COINGECKO_API_KEY`

### **Step 4: Restart Development Server**
```bash
npm run dev
```

## **🔒 SECURITY NOTES**
- **NEVER commit .env.local to git** (it's already in .gitignore)
- **Keep your API keys secure**
- **Use different keys for development and production**

## **✅ VERIFICATION**
After setup, you should see:
- ✅ Supabase client initialized successfully
- ✅ Authentication service available
- ✅ No more "Authentication service not available" errors

## **🚨 TROUBLESHOOTING**
If you still see errors:
1. Check `.env.local` file exists in project root
2. Verify all Supabase variables are filled
3. Restart development server
4. Check browser console for detailed error messages

## **🌐 PRODUCTION DEPLOYMENT**
For Vercel deployment:
1. Go to your Vercel project dashboard
2. Navigate to **Settings > Environment Variables**
3. Add all variables from `.env.local`
4. Redeploy your application
