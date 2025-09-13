#!/usr/bin/env node

/**
 * Environment Variables Check Script
 * Verifies that Sanity environment variables are loaded correctly
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Environment Variables Check');
console.log('==============================\n');

// Check required Sanity environment variables
const requiredVars = [
  'NEXT_PUBLIC_SANITY_PROJECT_ID',
  'NEXT_PUBLIC_SANITY_DATASET',
  'NEXT_PUBLIC_SANITY_API_VERSION',
  'SANITY_AUTH_TOKEN'
];

console.log('📋 Required Environment Variables:');
console.log('==================================');

let allPresent = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  const isPresent = !!value;
  const isMasked = varName === 'SANITY_AUTH_TOKEN' && value;

  console.log(`${isPresent ? '✅' : '❌'} ${varName}: ${isMasked ? value.substring(0, 10) + '...' : value || 'NOT SET'}`);

  if (!isPresent) {
    allPresent = false;
  }
});

console.log('\n📊 Summary:');
console.log('===========');

if (allPresent) {
  console.log('✅ All required environment variables are present');
  console.log('🎉 Sanity Studio should work correctly');
} else {
  console.log('❌ Some environment variables are missing');
  console.log('🔧 Please check your .env.local file');
}

// Additional configuration check
console.log('\n🔧 Configuration Details:');
console.log('========================');
console.log(`Project ID: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'qaofdbqx'}`);
console.log(`Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}`);
console.log(`API Version: ${process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-10-01'}`);
console.log(`Token Present: ${!!process.env.SANITY_AUTH_TOKEN}`);

// Check .env.local file content
console.log('\n📄 .env.local File Content:');
console.log('==========================');
try {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    console.log('✅ .env.local exists');
    console.log('Content length:', content.length, 'characters');

    // Check for required variables in file
    const fileChecks = [
      'NEXT_PUBLIC_SANITY_PROJECT_ID',
      'NEXT_PUBLIC_SANITY_DATASET',
      'NEXT_PUBLIC_SANITY_API_VERSION',
      'SANITY_AUTH_TOKEN'
    ];

    fileChecks.forEach(varName => {
      const inFile = content.includes(varName);
      console.log(`${inFile ? '✅' : '❌'} ${varName} in file`);
    });
  } else {
    console.log('❌ .env.local does not exist');
  }
} catch (error) {
  console.log('❌ Error reading .env.local:', error.message);
}
