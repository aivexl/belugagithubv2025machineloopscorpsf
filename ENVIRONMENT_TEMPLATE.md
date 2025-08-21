# 🚀 **ENTERPRISE ENVIRONMENT CONFIGURATION TEMPLATE**

## **CRITICAL: Environment Variables Required for Production**

Copy these variables to your `.env.local` file (development) or Vercel environment variables (production):

### **🔐 SUPABASE CONFIGURATION (REQUIRED)**
```bash
# Get these from your Supabase project dashboard
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### **🌐 APPLICATION CONFIGURATION**
```bash
# Set this to your production domain
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### **🔑 GOOGLE OAUTH CONFIGURATION (OPTIONAL)**
```bash
# Get these from Google Cloud Console
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

### **🛡️ AUTHENTICATION SECURITY SETTINGS**
```bash
NEXT_PUBLIC_AUTH_ENABLED=true
NEXT_PUBLIC_MAX_LOGIN_ATTEMPTS=5
NEXT_PUBLIC_LOCKOUT_DURATION=900000
NEXT_PUBLIC_SESSION_TIMEOUT=3600000
```

### **📊 SANITY CMS CONFIGURATION (OPTIONAL)**
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your-sanity-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-sanity-api-token
```

### **💰 COINGECKO API CONFIGURATION (OPTIONAL)**
```bash
COINGECKO_API_KEY=your-coingecko-api-key
NEXT_PUBLIC_COINGECKO_API_KEY=your-coingecko-api-key
```

### **⚡ PERFORMANCE & MONITORING**
```bash
NEXT_PUBLIC_DEBUG=false
NEXT_PUBLIC_ANALYTICS_ENABLED=true
NEXT_PUBLIC_PERFORMANCE_MONITORING=true
```

## **🚨 IMMEDIATE ACTION REQUIRED**

1. **Create `.env.local` file** in your project root
2. **Add Supabase credentials** from your dashboard
3. **Set production domain** in Vercel environment variables
4. **Redeploy** your application

## **🔍 VERIFICATION STEPS**

After setting environment variables:

1. **Check console logs** for "✅ Environment configuration is healthy"
2. **Verify authentication** works without "Authentication service not available" errors
3. **Test login/signup** functionality
4. **Monitor performance** metrics (CLS, LCP, FID)

## **📱 VERCEL DEPLOYMENT**

For Vercel production deployment:

1. Go to your Vercel project dashboard
2. Navigate to **Settings > Environment Variables**
3. Add all required variables
4. Redeploy the application

## **🆘 TROUBLESHOOTING**

If you still see authentication errors:

1. **Verify Supabase project** is active and running
2. **Check API keys** are correct and not expired
3. **Ensure redirect URLs** are configured in Supabase
4. **Clear browser cache** and cookies
5. **Check Vercel logs** for deployment errors
