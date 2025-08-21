#!/usr/bin/env node

/**
 * ENTERPRISE ENVIRONMENT SETUP SCRIPT
 * Helps configure required environment variables for production deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 ENTERPRISE ENVIRONMENT SETUP');
console.log('================================\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envExists = fs.existsSync(envPath);

if (envExists) {
  console.log('✅ .env.local file already exists');
  console.log('📁 Location:', envPath);
} else {
  console.log('❌ .env.local file not found');
  console.log('📝 Creating template file...\n');
  
  const template = `# ========================================
# ENTERPRISE AUTHENTICATION CONFIGURATION
# ========================================
# Fill in your values below

# SUPABASE CONFIGURATION (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# APPLICATION CONFIGURATION
NEXT_PUBLIC_APP_URL=https://your-domain.com

# GOOGLE OAUTH (OPTIONAL)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id

# AUTHENTICATION SECURITY
NEXT_PUBLIC_AUTH_ENABLED=true
NEXT_PUBLIC_MAX_LOGIN_ATTEMPTS=5
NEXT_PUBLIC_LOCKOUT_DURATION=900000
NEXT_PUBLIC_SESSION_TIMEOUT=3600000

# PERFORMANCE & MONITORING
NEXT_PUBLIC_DEBUG=false
NEXT_PUBLIC_ANALYTICS_ENABLED=true
`;

  try {
    fs.writeFileSync(envPath, template);
    console.log('✅ .env.local template created successfully');
    console.log('📁 Location:', envPath);
  } catch (error) {
    console.error('❌ Failed to create .env.local file:', error.message);
    process.exit(1);
  }
}

console.log('\n📋 NEXT STEPS:');
console.log('1. Edit .env.local with your actual values');
console.log('2. Get Supabase credentials from your dashboard');
console.log('3. Set production domain for Vercel deployment');
console.log('4. Restart your development server');

console.log('\n🔗 USEFUL LINKS:');
console.log('- Supabase Dashboard: https://supabase.com/dashboard');
console.log('- Vercel Dashboard: https://vercel.com/dashboard');
console.log('- Environment Setup Guide: ENVIRONMENT_TEMPLATE.md');

console.log('\n✅ Setup complete!');
