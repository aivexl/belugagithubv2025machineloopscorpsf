#!/usr/bin/env node

/**
 * Sanity CMS Setup Script
 * This script helps you configure your Sanity environment variables
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const ENV_FILE = '.env.local';
const EXAMPLE_FILE = '.env.example';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function setupSanity() {
  console.log('🔧 Sanity CMS Setup Wizard');
  console.log('==========================\n');

  // Check if .env.local already exists
  const envPath = path.join(process.cwd(), ENV_FILE);
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env.local already exists!');
    const overwrite = await ask('Do you want to overwrite it? (y/N): ');
    if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
      console.log('Setup cancelled.');
      rl.close();
      return;
    }
  }

  console.log('📋 Required Information:');
  console.log('1. Go to https://sanity.io/manage');
  console.log('2. Select your project (qaofdbqx)');
  console.log('3. Go to API → Tokens');
  console.log('4. Create a new token with "Editor" permissions\n');

  const sanityToken = await ask('Enter your Sanity authentication token: ');
  if (!sanityToken.trim()) {
    console.log('❌ Token is required. Setup cancelled.');
    rl.close();
    return;
  }

  const envContent = `# =============================================================================
# SANITY CMS ENVIRONMENT VARIABLES
# =============================================================================

# Required Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=qaofdbqx
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-07-22

# Required: Sanity Authentication Token
SANITY_AUTH_TOKEN=${sanityToken}

# Optional: Sanity Studio Configuration
SANITY_STUDIO_PREVIEW_URL=http://localhost:3000
SANITY_STUDIO_PRODUCTION_URL=https://your-deployment-domain.vercel.app
`;

  try {
    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log('✅ .env.local created successfully!');
    console.log('🔄 Restart your development server to apply the changes.');
    console.log('🧪 Test your setup by visiting: http://localhost:3000/test-sanity');
  } catch (error) {
    console.error('❌ Failed to create .env.local:', error.message);
  }

  rl.close();
}

setupSanity().catch(console.error);


