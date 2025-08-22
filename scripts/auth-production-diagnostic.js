#!/usr/bin/env node

// =============================================================================
// ENTERPRISE AUTHENTICATION PRODUCTION DIAGNOSTIC TOOL
// =============================================================================
// Fortune 500 Enterprise Standard - Zero Tolerance for Authentication Failures
// MIT-level Technical Excellence with IBM/Google CTO Experience
// =============================================================================

import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enterprise Configuration
const CONFIG = {
  PRODUCTION_DOMAIN: process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN || 'https://belugagithubv2025machineloopscorpsf-gold.vercel.app',
  DEVELOPMENT_DOMAIN: process.env.NEXT_PUBLIC_DEVELOPMENT_DOMAIN || 'http://localhost:3000',
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  TIMEOUT: 30000, // 30 seconds
  MAX_RETRIES: 3,
  VERBOSE: process.argv.includes('--verbose')
};

// Enterprise Logging System
class EnterpriseLogger {
  constructor() {
    this.logs = [];
    this.startTime = Date.now();
  }

  log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const entry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      data,
      duration: Date.now() - this.startTime
    };

    this.logs.push(entry);

    const colors = {
      INFO: '\x1b[36m',    // Cyan
      SUCCESS: '\x1b[32m', // Green
      WARNING: '\x1b[33m', // Yellow
      ERROR: '\x1b[31m',   // Red
      CRITICAL: '\x1b[35m', // Magenta
      RESET: '\x1b[0m'
    };

    const color = colors[level.toUpperCase()] || colors.RESET;
    console.log(`${color}[${level.toUpperCase()}]\x1b[0m ${message}`);

    if (data && CONFIG.VERBOSE) {
      console.log(`${color}Data:\x1b[0m`, JSON.stringify(data, null, 2));
    }
  }

  saveReport() {
    const reportPath = path.join(process.cwd(), `auth-diagnostic-${Date.now()}.json`);
    const report = {
      timestamp: new Date().toISOString(),
      duration: Date.now() - this.startTime,
      environment: process.env.NODE_ENV || 'unknown',
      config: {
        productionDomain: CONFIG.PRODUCTION_DOMAIN,
        hasSupabaseUrl: !!CONFIG.SUPABASE_URL,
        hasSupabaseKey: !!CONFIG.SUPABASE_ANON_KEY,
        hasServiceRoleKey: !!CONFIG.SUPABASE_SERVICE_ROLE_KEY,
        hasGoogleAuth: !!CONFIG.GOOGLE_CLIENT_ID
      },
      logs: this.logs
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    this.log('INFO', `Diagnostic report saved to: ${reportPath}`);
  }
}

const logger = new EnterpriseLogger();

// Enterprise HTTP Request Handler
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https://') ? https : http;
    const req = client.request(url, {
      timeout: CONFIG.TIMEOUT,
      headers: {
        'User-Agent': 'Beluga-Enterprise-Auth-Diagnostic/1.0',
        ...options.headers
      },
      ...options
    }, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const result = {
            statusCode: res.statusCode,
            headers: res.headers,
            data: data,
            url: url
          };

          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(result);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Request timeout after ${CONFIG.TIMEOUT}ms`));
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
}

// Test Functions
async function testSupabaseConnectivity() {
  logger.log('INFO', 'Testing Supabase connectivity...');

  if (!CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_ANON_KEY) {
    logger.log('ERROR', 'Missing Supabase configuration');
    return false;
  }

  try {
    // Test basic connectivity
    const response = await makeRequest(`${CONFIG.SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': CONFIG.SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}`
      }
    });

    logger.log('SUCCESS', 'Supabase connectivity test passed', {
      statusCode: response.statusCode,
      url: response.url
    });
    return true;
  } catch (error) {
    logger.log('ERROR', 'Supabase connectivity test failed', {
      error: error.message,
      url: CONFIG.SUPABASE_URL
    });
    return false;
  }
}

async function testAuthHealthEndpoint() {
  logger.log('INFO', 'Testing authentication health endpoint...');

  const healthUrl = `${CONFIG.PRODUCTION_DOMAIN}/api/auth/health`;

  try {
    const response = await makeRequest(healthUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const healthData = JSON.parse(response.data);

    logger.log('SUCCESS', 'Auth health endpoint accessible', {
      statusCode: response.statusCode,
      overallStatus: healthData.overall?.status,
      healthScore: healthData.overall?.score,
      configValid: healthData.config?.isValid,
      productionValid: healthData.production?.isValid,
      supabaseStatus: healthData.supabase?.status
    });

    // Analyze health data
    if (healthData.overall?.status !== 'healthy') {
      logger.log('ERROR', 'Authentication system is not healthy', healthData.overall);

      if (healthData.config?.errors?.length > 0) {
        logger.log('CRITICAL', 'Configuration errors detected', healthData.config.errors);
      }

      if (healthData.production?.errors?.length > 0) {
        logger.log('CRITICAL', 'Production environment errors', healthData.production.errors);
      }

      if (healthData.supabase?.status === 'error') {
        logger.log('CRITICAL', 'Supabase connection error', healthData.supabase.error);
      }
    }

    return healthData;
  } catch (error) {
    logger.log('ERROR', 'Auth health endpoint test failed', {
      error: error.message,
      url: healthUrl
    });
    return null;
  }
}

async function testAuthCallbackEndpoint() {
  logger.log('INFO', 'Testing auth callback endpoint...');

  const callbackUrl = `${CONFIG.PRODUCTION_DOMAIN}/auth/callback`;

  try {
    // Test with invalid code to see error handling
    const response = await makeRequest(`${callbackUrl}?error=test_error`, {
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });

    logger.log('SUCCESS', 'Auth callback endpoint accessible', {
      statusCode: response.statusCode,
      url: callbackUrl
    });

    return true;
  } catch (error) {
    logger.log('ERROR', 'Auth callback endpoint test failed', {
      error: error.message,
      url: callbackUrl
    });
    return false;
  }
}

async function testHomepageAccessibility() {
  logger.log('INFO', 'Testing homepage accessibility...');

  try {
    const response = await makeRequest(CONFIG.PRODUCTION_DOMAIN, {
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });

    logger.log('SUCCESS', 'Homepage accessible', {
      statusCode: response.statusCode,
      contentLength: response.data.length,
      url: CONFIG.PRODUCTION_DOMAIN
    });

    // Check for authentication-related content
    const hasAuthContent = response.data.includes('auth') ||
                          response.data.includes('login') ||
                          response.data.includes('signup') ||
                          response.data.includes('supabase');

    logger.log(hasAuthContent ? 'SUCCESS' : 'WARNING',
               hasAuthContent ? 'Authentication content found on homepage' : 'No authentication content detected on homepage');

    return true;
  } catch (error) {
    logger.log('ERROR', 'Homepage accessibility test failed', {
      error: error.message,
      url: CONFIG.PRODUCTION_DOMAIN
    });
    return false;
  }
}

async function testEnvironmentConfiguration() {
  logger.log('INFO', 'Analyzing environment configuration...');

  const issues = [];

  // Check required environment variables
  if (!CONFIG.SUPABASE_URL) {
    issues.push('NEXT_PUBLIC_SUPABASE_URL is missing');
  }

  if (!CONFIG.SUPABASE_ANON_KEY) {
    issues.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is missing');
  }

  if (!CONFIG.SUPABASE_SERVICE_ROLE_KEY && process.env.NODE_ENV === 'production') {
    issues.push('SUPABASE_SERVICE_ROLE_KEY is missing (required in production)');
  }

  if (!CONFIG.PRODUCTION_DOMAIN.startsWith('https://')) {
    issues.push('Production domain must use HTTPS');
  }

  if (CONFIG.PRODUCTION_DOMAIN.includes('localhost')) {
    issues.push('Production domain should not be localhost');
  }

  if (issues.length === 0) {
    logger.log('SUCCESS', 'Environment configuration is valid');
  } else {
    logger.log('CRITICAL', 'Environment configuration issues found', issues);
  }

  return issues;
}

async function testDomainConnectivity() {
  logger.log('INFO', 'Testing domain connectivity...');

  const domains = [
    { name: 'Production', url: CONFIG.PRODUCTION_DOMAIN },
    { name: 'Supabase', url: CONFIG.SUPABASE_URL }
  ];

  const results = {};

  for (const domain of domains) {
    if (!domain.url) {
      logger.log('WARNING', `${domain.name} URL not configured`);
      results[domain.name] = 'not_configured';
      continue;
    }

    try {
      await makeRequest(domain.url, { timeout: 10000 });
      logger.log('SUCCESS', `${domain.name} domain accessible`, { url: domain.url });
      results[domain.name] = 'accessible';
    } catch (error) {
      logger.log('ERROR', `${domain.name} domain not accessible`, {
        url: domain.url,
        error: error.message
      });
      results[domain.name] = 'inaccessible';
    }
  }

  return results;
}

async function testSSLConfiguration() {
  logger.log('INFO', 'Testing SSL configuration...');

  if (!CONFIG.PRODUCTION_DOMAIN.startsWith('https://')) {
    logger.log('WARNING', 'Production domain does not use HTTPS');
    return false;
  }

  try {
    const response = await makeRequest(CONFIG.PRODUCTION_DOMAIN, {
      method: 'GET'
    });

    const hasSSLHeaders = response.headers['strict-transport-security'] ||
                          response.headers['x-forwarded-proto'] === 'https';

    if (hasSSLHeaders) {
      logger.log('SUCCESS', 'SSL configuration appears correct');
    } else {
      logger.log('WARNING', 'SSL headers not detected');
    }

    return hasSSLHeaders;
  } catch (error) {
    logger.log('ERROR', 'SSL configuration test failed', { error: error.message });
    return false;
  }
}

// Main Diagnostic Function
async function runDiagnostic() {
  logger.log('INFO', '🚀 Starting Enterprise Authentication Production Diagnostic');
  logger.log('INFO', `Target Domain: ${CONFIG.PRODUCTION_DOMAIN}`);
  logger.log('INFO', `Environment: ${process.env.NODE_ENV || 'unknown'}`);

  const results = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    domain: CONFIG.PRODUCTION_DOMAIN,
    tests: {}
  };

  try {
    // Environment Configuration Test
    results.tests.environmentConfig = await testEnvironmentConfiguration();

    // Domain Connectivity Test
    results.tests.domainConnectivity = await testDomainConnectivity();

    // SSL Configuration Test
    results.tests.sslConfiguration = await testSSLConfiguration();

    // Homepage Accessibility Test
    results.tests.homepageAccessibility = await testHomepageAccessibility();

    // Supabase Connectivity Test
    results.tests.supabaseConnectivity = await testSupabaseConnectivity();

    // Auth Health Endpoint Test
    results.tests.authHealth = await testAuthHealthEndpoint();

    // Auth Callback Endpoint Test
    results.tests.authCallback = await testAuthCallbackEndpoint();

    // Generate Summary
    generateSummary(results);

  } catch (error) {
    logger.log('CRITICAL', 'Diagnostic failed with critical error', {
      error: error.message,
      stack: error.stack
    });
  } finally {
    logger.saveReport();
  }
}

function generateSummary(results) {
  logger.log('INFO', '📊 Generating Enterprise Diagnostic Summary');

  const summary = {
    overallStatus: 'unknown',
    criticalIssues: [],
    warnings: [],
    recommendations: [],
    score: 0
  };

  // Calculate score and determine status
  let score = 100;

  // Environment configuration (30 points)
  if (results.tests.environmentConfig?.length > 0) {
    score -= results.tests.environmentConfig.length * 10;
    summary.criticalIssues.push(...results.tests.environmentConfig);
  }

  // Domain connectivity (25 points)
  if (results.tests.domainConnectivity) {
    const inaccessible = Object.values(results.tests.domainConnectivity).filter(s => s === 'inaccessible').length;
    score -= inaccessible * 12;
    if (inaccessible > 0) {
      summary.criticalIssues.push('Domain connectivity issues detected');
    }
  }

  // SSL configuration (15 points)
  if (!results.tests.sslConfiguration) {
    score -= 15;
    summary.criticalIssues.push('SSL configuration issues');
  }

  // Homepage accessibility (10 points)
  if (!results.tests.homepageAccessibility) {
    score -= 10;
    summary.criticalIssues.push('Homepage not accessible');
  }

  // Supabase connectivity (10 points)
  if (!results.tests.supabaseConnectivity) {
    score -= 10;
    summary.criticalIssues.push('Supabase connectivity failed');
  }

  // Auth health (10 points)
  if (!results.tests.authHealth) {
    score -= 10;
    summary.criticalIssues.push('Authentication health endpoint failed');
  }

  summary.score = Math.max(0, score);

  // Determine overall status
  if (summary.score >= 90) {
    summary.overallStatus = 'EXCELLENT';
  } else if (summary.score >= 75) {
    summary.overallStatus = 'GOOD';
  } else if (summary.score >= 60) {
    summary.overallStatus = 'FAIR';
  } else if (summary.score >= 40) {
    summary.overallStatus = 'POOR';
  } else {
    summary.overallStatus = 'CRITICAL';
  }

  // Generate recommendations
  if (summary.criticalIssues.length > 0) {
    summary.recommendations.push('Fix all critical issues immediately');
  }

  if (results.tests.authHealth?.overall?.recommendations) {
    summary.recommendations.push(...results.tests.authHealth.overall.recommendations);
  }

  if (summary.recommendations.length === 0) {
    summary.recommendations.push('Authentication system appears to be working correctly');
  }

  // Log summary
  logger.log('INFO', `🏆 Overall Status: ${summary.overallStatus} (Score: ${summary.score}/100)`);

  if (summary.criticalIssues.length > 0) {
    logger.log('CRITICAL', 'Critical Issues Found:', summary.criticalIssues);
  }

  if (summary.warnings.length > 0) {
    logger.log('WARNING', 'Warnings:', summary.warnings);
  }

  logger.log('INFO', '💡 Recommendations:', summary.recommendations);

  // Enterprise-level action items
  if (summary.score < 60) {
    logger.log('CRITICAL', '🚨 ENTERPRISE ACTION REQUIRED: Authentication system requires immediate attention');
    logger.log('CRITICAL', 'Contact your DevOps team and CTO immediately');
  } else if (summary.score < 80) {
    logger.log('WARNING', '⚠️  MONITOR REQUIRED: Address issues before deployment');
  } else {
    logger.log('SUCCESS', '✅ PRODUCTION READY: Authentication system is healthy');
  }
}

// Run diagnostic if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runDiagnostic().catch((error) => {
    console.error('💥 Diagnostic script failed:', error.message);
    process.exit(1);
  });
}

export { runDiagnostic };
