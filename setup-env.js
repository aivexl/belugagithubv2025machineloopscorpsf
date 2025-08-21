#!/usr/bin/env node

/**
 * ENTERPRISE-LEVEL ENVIRONMENT SETUP SCRIPT
 * This script helps users quickly set up their environment variables
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 ENTERPRISE-LEVEL ENVIRONMENT SETUP');
console.log('=====================================\n');

// Check if .env.local already exists
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env.local already exists!');
  console.log('   If you want to recreate it, delete the existing file first.\n');
  process.exit(0);
}

// Environment template
const envTemplate = `# ========================================
# ENTERPRISE-LEVEL ENVIRONMENT CONFIGURATION
# ========================================

# SUPABASE CONFIGURATION (REQUIRED)
# Get these from: https://supabase.com/dashboard/project/[YOUR_PROJECT]/settings/api
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
`;

try {
  // Create .env.local file
  fs.writeFileSync(envPath, envTemplate);
  
  console.log('✅ .env.local file created successfully!');
  console.log('\n📋 NEXT STEPS:');
  console.log('1. Get your Supabase credentials from: https://supabase.com');
  console.log('2. Get your CoinGecko API key from: https://www.coingecko.com/en/api');
  console.log('3. Replace the placeholder values in .env.local with your actual credentials');
  console.log('4. Restart your development server: npm run dev');
  console.log('\n🔒 SECURITY: .env.local is already in .gitignore and will not be committed');
  
} catch (error) {
  console.error('❌ Failed to create .env.local:', error.message);
  console.log('\n🔧 MANUAL SETUP:');
  console.log('1. Create a file named .env.local in your project root');
  console.log('2. Copy the template from ENV_TEMPLATE.md');
  console.log('3. Fill in your actual credentials');
}
