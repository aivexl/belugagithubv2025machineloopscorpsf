/**
 * Enterprise-Level CSP Monitoring and Validation
 * Fortune 500 Grade Security Monitoring
 * 
 * This utility provides real-time CSP monitoring, validation, and reporting
 * for enterprise-level security compliance.
 */

export interface CSPViolation {
  timestamp: Date
  violatedDirective: string
  blockedURI: string
  sourceFile?: string
  lineNumber?: number
  columnNumber?: number
  userAgent: string
  referrer: string
}

export interface CSPReport {
  violations: CSPViolation[]
  totalViolations: number
  criticalViolations: number
  lastViolation: Date | null
  topViolatedDirectives: Array<{ directive: string; count: number }>
}

class CSPMonitor {
  private violations: CSPViolation[] = []
  private listeners: Array<(report: CSPReport) => void> = []

  constructor() {
    this.initializeMonitoring()
  }

  /**
   * Initialize CSP violation monitoring
   */
  private initializeMonitoring() {
    if (typeof window === 'undefined') return

    // Listen for CSP violation reports
    document.addEventListener('securitypolicyviolation', (event) => {
      this.handleViolation(event as SecurityPolicyViolationEvent)
    })

    // Monitor console for CSP-related errors
    const originalError = console.error
    console.error = (...args) => {
      const message = args.join(' ')
      if (message.includes('Content Security Policy') || 
          message.includes('CSP') ||
          message.includes('Refused to load')) {
        this.handleConsoleViolation(message)
      }
      originalError.apply(console, args)
    }
  }

  /**
   * Handle CSP violation events
   */
  private handleViolation(event: SecurityPolicyViolationEvent) {
    const violation: CSPViolation = {
      timestamp: new Date(),
      violatedDirective: event.violatedDirective,
      blockedURI: event.blockedURI,
      sourceFile: event.sourceFile,
      lineNumber: event.lineNumber,
      columnNumber: event.columnNumber,
      userAgent: navigator.userAgent,
      referrer: document.referrer
    }

    this.violations.push(violation)
    this.notifyListeners()
  }

  /**
   * Handle console-based CSP violations
   */
  private handleConsoleViolation(message: string) {
    const violation: CSPViolation = {
      timestamp: new Date(),
      violatedDirective: this.extractDirective(message),
      blockedURI: this.extractBlockedURI(message),
      userAgent: navigator.userAgent,
      referrer: document.referrer
    }

    this.violations.push(violation)
    this.notifyListeners()
  }

  /**
   * Extract directive from console message
   */
  private extractDirective(message: string): string {
    const match = message.match(/violates the following Content Security Policy directive: "([^"]+)"/)
    return match ? match[1] : 'unknown'
  }

  /**
   * Extract blocked URI from console message
   */
  private extractBlockedURI(message: string): string {
    const match = message.match(/Refused to (?:load|connect to) '([^']+)'/)
    return match ? match[1] : 'unknown'
  }

  /**
   * Get current CSP report
   */
  getReport(): CSPReport {
    const totalViolations = this.violations.length
    const criticalViolations = this.violations.filter(v => 
      v.violatedDirective.includes('script-src') || 
      v.violatedDirective.includes('connect-src')
    ).length

    const directiveCounts = this.violations.reduce((acc, violation) => {
      acc[violation.violatedDirective] = (acc[violation.violatedDirective] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topViolatedDirectives = Object.entries(directiveCounts)
      .map(([directive, count]) => ({ directive, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return {
      violations: [...this.violations],
      totalViolations,
      criticalViolations,
      lastViolation: this.violations.length > 0 ? this.violations[this.violations.length - 1].timestamp : null,
      topViolatedDirectives
    }
  }

  /**
   * Add listener for CSP reports
   */
  addListener(listener: (report: CSPReport) => void) {
    this.listeners.push(listener)
  }

  /**
   * Remove listener
   */
  removeListener(listener: (report: CSPReport) => void) {
    this.listeners = this.listeners.filter(l => l !== listener)
  }

  /**
   * Notify all listeners
   */
  private notifyListeners() {
    const report = this.getReport()
    this.listeners.forEach(listener => listener(report))
  }

  /**
   * Clear violations history
   */
  clearViolations() {
    this.violations = []
    this.notifyListeners()
  }

  /**
   * Validate CSP configuration
   */
  validateCSP(): { isValid: boolean; issues: string[] } {
    const issues: string[] = []
    const report = this.getReport()

    // Check for critical violations
    if (report.criticalViolations > 0) {
      issues.push(`${report.criticalViolations} critical CSP violations detected`)
    }

    // Check for repeated violations
    const repeatedViolations = report.topViolatedDirectives.filter(d => d.count > 3)
    if (repeatedViolations.length > 0) {
      issues.push(`Repeated violations detected: ${repeatedViolations.map(d => d.directive).join(', ')}`)
    }

    // Check for recent violations
    const recentViolations = this.violations.filter(v => 
      Date.now() - v.timestamp.getTime() < 60000 // Last minute
    )
    if (recentViolations.length > 5) {
      issues.push('High frequency of recent CSP violations')
    }

    return {
      isValid: issues.length === 0,
      issues
    }
  }
}

// Global CSP monitor instance
export const cspMonitor = new CSPMonitor()

/**
 * CSP Validation Utilities
 */
export class CSPValidator {
  /**
   * Validate CSP header format
   */
  static validateHeader(cspHeader: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    // Check for required directives
    const requiredDirectives = ['default-src', 'script-src', 'object-src']
    requiredDirectives.forEach(directive => {
      if (!cspHeader.includes(directive)) {
        errors.push(`Missing required directive: ${directive}`)
      }
    })

    // Check for dangerous patterns
    const dangerousPatterns = [
      { pattern: /'unsafe-eval'/, message: 'unsafe-eval detected - security risk' },
      { pattern: /'unsafe-inline'/, message: 'unsafe-inline detected - consider nonces' },
      { pattern: /\*/, message: 'Wildcard (*) detected - security risk' }
    ]

    dangerousPatterns.forEach(({ pattern, message }) => {
      if (pattern.test(cspHeader)) {
        errors.push(message)
      }
    })

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Generate CSP compliance report
   */
  static generateComplianceReport(cspHeader: string): {
    score: number
    recommendations: string[]
    compliance: {
      owasp: boolean
      enterprise: boolean
      strict: boolean
    }
  } {
    const validation = this.validateHeader(cspHeader)
    let score = 100

    // Deduct points for each error
    score -= validation.errors.length * 10

    // Check for enterprise compliance
    const hasHSTS = cspHeader.includes('Strict-Transport-Security')
    const hasFrameOptions = cspHeader.includes('X-Frame-Options')
    const hasObjectSrc = cspHeader.includes("object-src 'none'")

    const recommendations: string[] = []
    if (!hasHSTS) recommendations.push('Add Strict-Transport-Security header')
    if (!hasFrameOptions) recommendations.push('Add X-Frame-Options header')
    if (!hasObjectSrc) recommendations.push('Add object-src \'none\' directive')

    return {
      score: Math.max(0, score),
      recommendations,
      compliance: {
        owasp: score >= 70,
        enterprise: score >= 80,
        strict: score >= 90
      }
    }
  }
}

// Export for global use
if (typeof window !== 'undefined') {
  (window as any).cspMonitor = cspMonitor
  (window as any).CSPValidator = CSPValidator
}


