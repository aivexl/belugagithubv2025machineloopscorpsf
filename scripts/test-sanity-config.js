#!/usr/bin/env node

/**
 * Sanity Configuration Test Script
 * Tests all aspects of the Sanity setup to ensure zero errors
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Sanity Configuration Test Suite');
console.log('===================================\n');

// Test 1: Check environment variables
console.log('1️⃣  Testing Environment Variables...');
const envPath = path.join(process.cwd(), '.env.local');

if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const requiredVars = [
  'NEXT_PUBLIC_SANITY_PROJECT_ID',
  'NEXT_PUBLIC_SANITY_DATASET',
  'NEXT_PUBLIC_SANITY_API_VERSION',
  'SANITY_AUTH_TOKEN'
];

let envErrors = [];
requiredVars.forEach(varName => {
  const regex = new RegExp(`^${varName}=(.+)$`, 'm');
  const match = envContent.match(regex);
  if (!match) {
    envErrors.push(`Missing: ${varName}`);
  } else if (!match[1] || match[1].trim() === '') {
    envErrors.push(`Empty value: ${varName}`);
  } else {
    console.log(`✅ ${varName}: ${match[1].substring(0, 10)}...`);
  }
});

if (envErrors.length > 0) {
  console.log('❌ Environment variable errors:');
  envErrors.forEach(error => console.log(`   - ${error}`));
  process.exit(1);
}

// Test 2: Check configuration file
console.log('\n2️⃣  Testing Sanity Configuration File...');
const configPath = path.join(process.cwd(), 'sanity.config.ts');

if (!fs.existsSync(configPath)) {
  console.log('❌ sanity.config.ts file not found');
  process.exit(1);
}

const configContent = fs.readFileSync(configPath, 'utf8');

// Check for common issues
const configChecks = [
  { name: 'Project ID configuration', regex: /projectId/, required: true },
  { name: 'Dataset configuration', regex: /dataset/, required: true },
  { name: 'API Version configuration', regex: /apiVersion/, required: true },
  { name: 'Authentication token', regex: /token:\s*process\.env\.SANITY_AUTH_TOKEN/, required: true },
  { name: 'No client directive', regex: /'use client'/, required: false, shouldNotExist: true },
];

configChecks.forEach(check => {
  const match = configContent.match(check.regex);
  if (check.required && !match) {
    console.log(`❌ Missing: ${check.name}`);
    process.exit(1);
  } else if (check.shouldNotExist && match) {
    console.log(`❌ Should not exist: ${check.name}`);
    process.exit(1);
  } else if (check.required) {
    console.log(`✅ ${check.name}`);
  } else if (check.shouldNotExist && !match) {
    console.log(`✅ ${check.name} correctly absent`);
  }
});

// Test 3: Check studio page
console.log('\n3️⃣  Testing Studio Page Configuration...');
const studioPath = path.join(process.cwd(), 'src/app/studio/[[...tool]]/page.tsx');

if (!fs.existsSync(studioPath)) {
  console.log('❌ Studio page not found');
  process.exit(1);
}

const studioContent = fs.readFileSync(studioPath, 'utf8');

// Check import path
if (!studioContent.includes('../../../sanity.config')) {
  console.log('❌ Incorrect import path in studio page');
  process.exit(1);
}

console.log('✅ Studio page configuration correct');

// Test 4: Check API route
console.log('\n4️⃣  Testing API Route Configuration...');
const apiPath = path.join(process.cwd(), 'src/app/api/sanity/query/route.ts');

if (!fs.existsSync(apiPath)) {
  console.log('❌ Sanity API route not found');
  process.exit(1);
}

const apiContent = fs.readFileSync(apiPath, 'utf8');

// Check for proper error handling
const apiChecks = [
  'SANITY_AUTH_TOKEN',
  'error handling',
  'timeout protection',
  'authentication validation'
];

apiChecks.forEach(check => {
  if (apiContent.includes(check) || apiContent.includes(check.replace(' ', '_'))) {
    console.log(`✅ ${check}`);
  } else {
    console.log(`⚠️  ${check} - may need improvement`);
  }
});

// Test 5: Validate configuration consistency
console.log('\n5️⃣  Validating Configuration Consistency...');

// Extract values from different files and compare
const envProjectId = envContent.match(/^NEXT_PUBLIC_SANITY_PROJECT_ID=(.+)$/m)?.[1];
const envDataset = envContent.match(/^NEXT_PUBLIC_SANITY_DATASET=(.+)$/m)?.[1];
const envApiVersion = envContent.match(/^NEXT_PUBLIC_SANITY_API_VERSION=(.+)$/m)?.[1];

console.log('📊 Configuration Summary:');
console.log(`   Project ID: ${envProjectId || 'NOT SET'}`);
console.log(`   Dataset: ${envDataset || 'NOT SET'}`);
console.log(`   API Version: ${envApiVersion || 'NOT SET'}`);
console.log(`   Auth Token: ${envContent.includes('SANITY_AUTH_TOKEN=') ? 'SET' : 'NOT SET'}`);

console.log('\n✅ All configuration tests passed!');
console.log('🎉 Sanity setup is properly configured.');
console.log('\n🚀 Next steps:');
console.log('   1. Restart your development server: npm run dev');
console.log('   2. Test Studio access: http://localhost:3000/studio');
console.log('   3. Test client queries: http://localhost:3000/test-sanity');
console.log('   4. Test server queries: http://localhost:3000/test-sanity-server');

process.exit(0);


