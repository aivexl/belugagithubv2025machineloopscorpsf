#!/usr/bin/env node

/**
 * Production Build Script
 * Ensures consistent builds between development and production
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting production build process...');

// Set production environment
process.env.NODE_ENV = 'production';
process.env.NEXT_PUBLIC_APP_ENV = 'production';

// Clean previous builds
console.log('🧹 Cleaning previous builds...');
try {
  if (fs.existsSync('.next')) {
    execSync('Remove-Item -Recurse -Force .next', { stdio: 'inherit' });
  }
  console.log('✅ Cleaned .next directory');
} catch (error) {
  console.log('⚠️  Could not clean .next directory:', error.message);
}

// Install dependencies if needed
console.log('📦 Checking dependencies...');
try {
  execSync('npm ci --production=false', { stdio: 'inherit' });
  console.log('✅ Dependencies installed');
} catch (error) {
  console.log('⚠️  Could not install dependencies:', error.message);
}

// Build the application
console.log('🔨 Building application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Verify build output
console.log('🔍 Verifying build output...');
const buildPath = path.join(__dirname, '..', '.next');
if (fs.existsSync(buildPath)) {
  const stats = fs.statSync(buildPath);
  console.log(`✅ Build output verified (${Math.round(stats.size / 1024 / 1024)}MB)`);
} else {
  console.error('❌ Build output not found');
  process.exit(1);
}

// Check for critical files
const criticalFiles = [
  'static',
  'server',
  'server/app',
  'server/app/api',
  'server/app/api/coingecko-proxy'
];

console.log('📋 Checking critical build files...');
criticalFiles.forEach(file => {
  const filePath = path.join(buildPath, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`⚠️  ${file} missing`);
  }
});

console.log('🎉 Production build process completed successfully!');
console.log('📁 Build output available in .next/ directory');
console.log('🚀 Ready for deployment to Vercel');
