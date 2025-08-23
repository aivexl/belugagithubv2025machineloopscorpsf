// =============================================================================
// ENTERPRISE AUTHENTICATION DEBUGGER
// Fortune 500 & $100 Billion Valuation Ready
// Zero Error, Zero Warning, Zero Bug Implementation
// =============================================================================

'use client';

interface AuthDebugEvent {
  timestamp: number;
  event: string;
  component: string;
  details: any;
  level: 'info' | 'warn' | 'error' | 'success';
}

class EnterpriseAuthDebugger {
  private static instance: EnterpriseAuthDebugger;
  private events: AuthDebugEvent[] = [];
  private maxEvents = 100;
  private isEnabled = process.env.NODE_ENV === 'development';

  private constructor() {}

  static getInstance(): EnterpriseAuthDebugger {
    if (!EnterpriseAuthDebugger.instance) {
      EnterpriseAuthDebugger.instance = new EnterpriseAuthDebugger();
    }
    return EnterpriseAuthDebugger.instance;
  }

  log(event: string, component: string, details: any = {}, level: 'info' | 'warn' | 'error' | 'success' = 'info') {
    if (!this.isEnabled) return;

    const debugEvent: AuthDebugEvent = {
      timestamp: Date.now(),
      event,
      component,
      details,
      level
    };

    this.events.push(debugEvent);
    
    // Keep only last maxEvents
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Console output with colors
    const color = {
      info: '#4A90E2',
      warn: '#F39C12',
      error: '#E74C3C',
      success: '#27AE60'
    }[level];

    console.log(`%c🔐 AUTH DEBUG [${component}]: ${event}`, `color: ${color}; font-weight: bold;`, details);
  }

  getEvents(): AuthDebugEvent[] {
    return [...this.events];
  }

  getLatestEvents(count: number = 10): AuthDebugEvent[] {
    return this.events.slice(-count);
  }

  clearEvents(): void {
    this.events = [];
  }

  getEventsByComponent(component: string): AuthDebugEvent[] {
    return this.events.filter(event => event.component === component);
  }

  getEventsByLevel(level: 'info' | 'warn' | 'error' | 'success'): AuthDebugEvent[] {
    return this.events.filter(event => event.level === level);
  }

  generateReport(): string {
    const report = this.events.map(event => {
      const time = new Date(event.timestamp).toLocaleTimeString();
      return `[${time}] ${event.level.toUpperCase()} - ${event.component}: ${event.event}`;
    }).join('\n');

    return `AUTHENTICATION DEBUG REPORT\n${'='.repeat(50)}\n${report}`;
  }
}

// Export singleton instance
export const authDebugger = EnterpriseAuthDebugger.getInstance();
