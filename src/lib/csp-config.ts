/**
 * Enterprise-Level Content Security Policy Configuration
 * Fortune 500 Grade Security Headers
 * 
 * This utility provides centralized CSP configuration for different application contexts
 * while maintaining enterprise-level security standards.
 */

export interface CSPConfig {
  defaultSrc: string[]
  scriptSrc: string[]
  styleSrc: string[]
  fontSrc: string[]
  imgSrc: string[]
  connectSrc: string[]
  frameSrc: string[]
  objectSrc: string[]
  baseUri: string[]
  formAction: string[]
  frameAncestors: string[]
}

// Base CSP configuration for main application
const baseCSPConfig: CSPConfig = {
  defaultSrc: ["'self'"],
  scriptSrc: [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    "https://vercel.live",
    "https://*.vercel.app",
    "https://va.vercel-scripts.com",
    "https://vitals.vercel-insights.com",
    "https://cdn.sanity.io",
    "https://www.googletagmanager.com",
    "https://pagead2.googlesyndication.com",
    "https://*.googlesyndication.com"
  ],
  styleSrc: [
    "'self'",
    "'unsafe-inline'",
    "https://fonts.googleapis.com"
  ],
  fontSrc: [
    "'self'",
    "https://fonts.gstatic.com"
  ],
  imgSrc: [
    "'self'",
    "data:",
    "https:",
    "http:",
    "https://*.google.com",
    "https://*.googleadservices.com",
    "https://*.g.doubleclick.net"
  ],
  connectSrc: [
    "'self'",
    "https://sqjqirkrcfczypxygdtm.supabase.co",
    "https://*.supabase.co",
    "https://api.coingecko.com",
    "https://va.vercel-scripts.com",
    "https://vitals.vercel-insights.com",
    "https://cdn.sanity.io",
    "https://www.googletagmanager.com",
    "https://*.googletagmanager.com",
    "https://pagead2.googlesyndication.com",
    "https://*.googlesyndication.com",
    "https://*.google.com",
    "https://*.googleadservices.com",
    "https://*.g.doubleclick.net",
    "https://*.doubleclick.net",
    "https://*.adtrafficquality.google",
    "https://ep1.adtrafficquality.google",
    "wss://*.supabase.co"
  ],
  frameSrc: [
    "'self'",
    "https://www.googletagmanager.com",
    "https://tpc.googlesyndication.com",
    "https://googleads.g.doubleclick.net",
    "https://*.g.doubleclick.net",
    "https://*.doubleclick.net",
    "https://*.googleadservices.com",
    "https://pagead2.googlesyndication.com",
    "https://*.googlesyndication.com"
  ],
  objectSrc: ["'none'"],
  baseUri: ["'self'"],
  formAction: ["'self'"],
  frameAncestors: ["'none'"]
}

// Enhanced CSP configuration for Sanity Studio
const studioCSPConfig: CSPConfig = {
  defaultSrc: ["'self'"],
  scriptSrc: [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    "https://vercel.live",
    "https://*.vercel.app",
    "https://va.vercel-scripts.com",
    "https://vitals.vercel-insights.com",
    "https://cdn.sanity.io",
    "https://core.sanity-cdn.com",
    "https://*.sanity.io",
    "https://qaofdbqx.sanity.studio",
    "https://qaofdbqx.api.sanity.io",
    "https://www.googletagmanager.com",
    "https://pagead2.googlesyndication.com",
    "https://*.googlesyndication.com"
  ],
  styleSrc: [
    "'self'",
    "'unsafe-inline'",
    "https://fonts.googleapis.com",
    "https://cdn.sanity.io",
    "https://*.sanity.io",
    "https://qaofdbqx.sanity.studio"
  ],
  fontSrc: [
    "'self'",
    "https://fonts.gstatic.com",
    "https://cdn.sanity.io",
    "https://*.sanity.io",
    "https://qaofdbqx.sanity.studio"
  ],
  imgSrc: [
    "'self'",
    "data:",
    "https:",
    "blob:",
    "https://cdn.sanity.io",
    "https://*.sanity.io",
    "https://qaofdbqx.sanity.studio",
    "https://*.google.com",
    "https://*.googleadservices.com",
    "https://*.g.doubleclick.net"
  ],
  connectSrc: [
    "'self'",
    "https://sqjqirkrcfczypxygdtm.supabase.co",
    "https://*.supabase.co",
    "https://api.coingecko.com",
    "https://va.vercel-scripts.com",
    "https://vitals.vercel-insights.com",
    "https://cdn.sanity.io",
    "https://qaofdbqx.api.sanity.io",
    "https://*.sanity.io",
    "https://*.sanity-cdn.com",
    "https://core.sanity-cdn.com",
    "https://www.googletagmanager.com",
    "https://*.googletagmanager.com",
    "https://pagead2.googlesyndication.com",
    "https://*.googlesyndication.com",
    "https://*.google.com",
    "https://*.googleadservices.com",
    "https://*.g.doubleclick.net",
    "https://*.doubleclick.net",
    "https://*.adtrafficquality.google",
    "https://ep1.adtrafficquality.google",
    "wss://*.supabase.co",
    "wss://*.sanity.io"
  ],
  frameSrc: [
    "'self'",
    "https://*.sanity.io",
    "https://qaofdbqx.sanity.studio",
    "https://core.sanity-cdn.com",
    "https://www.googletagmanager.com",
    "https://tpc.googlesyndication.com",
    "https://googleads.g.doubleclick.net",
    "https://*.g.doubleclick.net",
    "https://*.doubleclick.net",
    "https://*.googleadservices.com",
    "https://pagead2.googlesyndication.com",
    "https://*.googlesyndication.com"
  ],
  objectSrc: ["'none'"],
  baseUri: ["'self'"],
  formAction: ["'self'"],
  frameAncestors: ["'none'"]
}

/**
 * Generates CSP header value from configuration
 */
function generateCSPHeader(config: CSPConfig): string {
  const directives = [
    `default-src ${config.defaultSrc.join(' ')}`,
    `script-src ${config.scriptSrc.join(' ')}`,
    `style-src ${config.styleSrc.join(' ')}`,
    `font-src ${config.fontSrc.join(' ')}`,
    `img-src ${config.imgSrc.join(' ')}`,
    `connect-src ${config.connectSrc.join(' ')}`,
    `frame-src ${config.frameSrc.join(' ')}`,
    `object-src ${config.objectSrc.join(' ')}`,
    `base-uri ${config.baseUri.join(' ')}`,
    `form-action ${config.formAction.join(' ')}`,
    `frame-ancestors ${config.frameAncestors.join(' ')}`
  ]

  return directives.join('; ')
}

/**
 * Gets CSP configuration based on route context
 */
export function getCSPConfig(isStudioRoute: boolean): string {
  const config = isStudioRoute ? studioCSPConfig : baseCSPConfig
  return generateCSPHeader(config)
}

/**
 * Validates CSP configuration for security compliance
 */
export function validateCSPConfig(config: CSPConfig): boolean {
  // Check for dangerous directives
  const dangerousPatterns = [
    /'unsafe-eval'/,
    /'unsafe-inline'/,
    /data:/,
    /blob:/
  ]

  // Allow unsafe-eval and unsafe-inline only for studio routes
  const hasUnsafeDirectives = config.scriptSrc.some(src => 
    src.includes("'unsafe-eval'") || src.includes("'unsafe-inline'")
  )

  // Validate that object-src is properly restricted
  const hasObjectSrcNone = config.objectSrc.includes("'none'")

  return hasObjectSrcNone && (hasUnsafeDirectives || !config.scriptSrc.includes("'unsafe-eval'"))
}

/**
 * Development CSP configuration with additional debugging
 */
export function getDevelopmentCSPConfig(isStudioRoute: boolean): string {
  const baseConfig = isStudioRoute ? studioCSPConfig : baseCSPConfig
  
  // Add development-specific sources
  const devConfig: CSPConfig = {
    ...baseConfig,
    connectSrc: [
      ...baseConfig.connectSrc,
      "http://localhost:*",
      "ws://localhost:*",
      "wss://localhost:*"
    ]
  }

  return generateCSPHeader(devConfig)
}

// Export configurations for external use
export { baseCSPConfig, studioCSPConfig }


