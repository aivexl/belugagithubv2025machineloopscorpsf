#!/usr/bin/env node

/**
 * Sanity Debug Diagnostic Script
 * Advanced debugging for Sanity authentication and configuration issues
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Sanity Debug Diagnostic Tool');
console.log('===============================\n');

async function testSanityConnection() {
  console.log('1️⃣  Testing Sanity API Connection...');

  try {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'qaofdbqx';
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
    const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-07-22';

    // Test basic project info endpoint
    const testUrl = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=*[_type==%22article%22][0..0]{_id,title}`;

    console.log(`   Testing URL: ${testUrl}`);

    const response = await fetch(testUrl, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ API Connection: ${response.status} ${response.statusText}`);
      console.log(`   Response: ${JSON.stringify(data, null, 2)}`);
    } else {
      console.log(`❌ API Connection Failed: ${response.status} ${response.statusText}`);
      console.log(`   Error: ${await response.text()}`);
    }
  } catch (error) {
    console.log(`❌ Network Error: ${error.message}`);
  }
}

async function testAuthentication() {
  console.log('\n2️⃣  Testing Authentication...');

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'qaofdbqx';

  // Load environment variables from .env.local
  const envPath = path.join(process.cwd(), '.env.local');
  let authToken = process.env.SANITY_AUTH_TOKEN;

  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const tokenMatch = envContent.match(/^SANITY_AUTH_TOKEN=(.+)$/m);
    if (tokenMatch) {
      authToken = tokenMatch[1].trim();
      console.log('✅ Loaded auth token from .env.local');
    }
  }

  if (!authToken) {
    console.log('❌ No authentication token found');
    return;
  }

  try {
    // Test authenticated endpoint
    const testUrl = `https://${projectId}.api.sanity.io/v2025-07-22/users/me`;

    console.log(`   Testing authenticated URL: ${testUrl}`);

    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        'x-sanity-app': 'studio@debug'
      },
      credentials: 'include'
    });

    console.log(`   Auth Response: ${response.status} ${response.statusText}`);

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Authentication successful:`);
      console.log(`   User: ${data.name || data.email || 'Unknown'}`);
    } else {
      const errorText = await response.text();
      console.log(`❌ Authentication failed:`);
      console.log(`   ${errorText}`);
    }
  } catch (error) {
    console.log(`❌ Auth Network Error: ${error.message}`);
  }
}

function analyzeConfiguration() {
  console.log('\n3️⃣  Analyzing Configuration...');

  const configPath = path.join(process.cwd(), 'sanity.config.ts');
  const envPath = path.join(process.cwd(), '.env.local');

  // Check sanity.config.ts
  if (fs.existsSync(configPath)) {
    const configContent = fs.readFileSync(configPath, 'utf8');

    console.log('✅ sanity.config.ts exists');

    if (configContent.includes('token: process.env.SANITY_AUTH_TOKEN')) {
      console.log('✅ Authentication token configured in config');
    } else {
      console.log('❌ Authentication token not configured in config');
    }

    if (configContent.includes('useCdn: false')) {
      console.log('✅ CDN disabled for fresh data');
    }

    if (configContent.includes('auth:')) {
      console.log('✅ Studio authentication configured');
    } else {
      console.log('⚠️  Studio authentication not explicitly configured');
    }
  } else {
    console.log('❌ sanity.config.ts not found');
  }

  // Check environment variables
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');

    console.log('✅ .env.local exists');

    const checks = [
      'NEXT_PUBLIC_SANITY_PROJECT_ID',
      'NEXT_PUBLIC_SANITY_DATASET',
      'NEXT_PUBLIC_SANITY_API_VERSION',
      'SANITY_AUTH_TOKEN'
    ];

    checks.forEach(check => {
      if (envContent.includes(`${check}=`)) {
        const match = envContent.match(new RegExp(`${check}=(.+)`, 'm'));
        const value = match ? match[1].trim() : '';
        if (value && value !== 'your_token_here') {
          console.log(`✅ ${check} configured`);
        } else {
          console.log(`❌ ${check} not properly configured`);
        }
      } else {
        console.log(`❌ ${check} missing`);
      }
    });
  } else {
    console.log('❌ .env.local not found');
  }
}

async function main() {
  analyzeConfiguration();
  await testSanityConnection();
  await testAuthentication();

  console.log('\n🎯 Diagnostic Summary:');
  console.log('======================');
  console.log('If you see authentication errors:');
  console.log('1. Verify SANITY_AUTH_TOKEN in .env.local');
  console.log('2. Check token permissions at https://sanity.io/manage');
  console.log('3. Ensure project ID is correct');
  console.log('4. Restart development server after config changes');
  console.log('\n📞 For support: Check browser network tab for detailed error responses');
}

main().catch(console.error);
