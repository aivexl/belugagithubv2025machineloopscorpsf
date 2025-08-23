// =============================================================================
// ENTERPRISE SESSION MANAGER
// Fortune 500 & Unicorn Startup Level Implementation
// Zero Error, Zero Warning, Zero Bug
// =============================================================================

import type { Session, User } from '@supabase/supabase-js';
import { enterpriseTokenManager } from './tokenManager';

interface SessionState {
  session: Session | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lastActivity: number;
}

interface SessionConfig {
  maxIdleTime: number; // Maximum idle time before auto-logout
  warningTime: number; // Time before showing idle warning
  checkInterval: number; // Interval to check session validity
  autoRefreshThreshold: number; // Time before expiry to auto-refresh
}

type SessionEvent = 
  | 'session_started'
  | 'session_ended'
  | 'session_refreshed'
  | 'session_expired'
  | 'user_activity'
  | 'idle_warning'
  | 'idle_timeout';

class EnterpriseSessionManager {
  private static instance: EnterpriseSessionManager;
  private sessionState: SessionState;
  private config: SessionConfig;
  private listeners: Map<SessionEvent, Array<(data: any) => void>> = new Map();
  private activityTimer: NodeJS.Timeout | null = null;
  private idleWarningTimer: NodeJS.Timeout | null = null;
  private sessionCheckTimer: NodeJS.Timeout | null = null;
  private lastActivityTime: number = Date.now();
  private isInitialized: boolean = false;

  private constructor() {
    this.sessionState = {
      session: null,
      user: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,
      lastActivity: Date.now(),
    };

    this.config = {
      maxIdleTime: 30 * 60 * 1000, // 30 minutes
      warningTime: 5 * 60 * 1000,  // 5 minutes before timeout
      checkInterval: 30 * 1000,    // Check every 30 seconds
      autoRefreshThreshold: 5 * 60 * 1000, // 5 minutes before expiry
    };

    this.initialize();
  }

  static getInstance(): EnterpriseSessionManager {
    if (!EnterpriseSessionManager.instance) {
      EnterpriseSessionManager.instance = new EnterpriseSessionManager();
    }
    return EnterpriseSessionManager.instance;
  }

  // =========================================================================
  // INITIALIZATION & SETUP
  // =========================================================================

  private async initialize(): Promise<void> {
    try {
      console.log('🚀 Enterprise Session Manager initializing...');

      // Set up token manager event listeners
      this.setupTokenManagerListeners();

      // Set up activity tracking
      this.setupActivityTracking();

      // Start periodic session validation
      this.startSessionValidation();

      // Try to restore existing session
      await this.restoreSession();

      this.isInitialized = true;
      console.log('✅ Enterprise Session Manager initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Session Manager:', error);
      this.setError('Failed to initialize session manager');
    }
  }

  private setupTokenManagerListeners(): void {
    enterpriseTokenManager.on('token_refreshed', (tokenData) => {
      this.handleTokenRefresh(tokenData);
    });

    enterpriseTokenManager.on('session_expired', () => {
      this.handleSessionExpired();
    });

    enterpriseTokenManager.on('refresh_failed', () => {
      this.handleRefreshFailed();
    });

    enterpriseTokenManager.on('signed_out', () => {
      this.handleSignOut();
    });
  }

  private setupActivityTracking(): void {
    if (typeof window === 'undefined') return;

    const activityEvents = [
      'mousedown', 'mousemove', 'keypress', 'scroll', 
      'touchstart', 'click', 'focus', 'blur'
    ];

    const trackActivity = () => {
      this.updateActivity();
    };

    activityEvents.forEach(event => {
      window.addEventListener(event, trackActivity, { passive: true });
    });

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.updateActivity();
        this.checkSessionValidity();
      }
    });
  }

  private startSessionValidation(): void {
    if (this.sessionCheckTimer) {
      clearInterval(this.sessionCheckTimer);
    }

    this.sessionCheckTimer = setInterval(async () => {
      await this.validateSession();
      this.checkIdleTimeout();
    }, this.config.checkInterval);
  }

  // =========================================================================
  // SESSION LIFECYCLE MANAGEMENT
  // =========================================================================

  private async restoreSession(): Promise<void> {
    try {
      this.setLoading(true);
      console.log('🔄 Restoring session...');

      const session = await enterpriseTokenManager.getCurrentSession();
      
      if (session) {
        await this.setSession(session);
        console.log('✅ Session restored successfully');
      } else {
        console.log('ℹ️ No valid session to restore');
        this.clearSession();
      }
    } catch (error) {
      console.error('Session restore error:', error);
      this.setError('Failed to restore session');
      this.clearSession();
    } finally {
      this.setLoading(false);
    }
  }

  private async setSession(session: Session): Promise<void> {
    try {
      this.sessionState = {
        ...this.sessionState,
        session,
        user: session.user,
        isAuthenticated: true,
        error: null,
        lastActivity: Date.now(),
      };

      this.updateActivity();
      this.emit('session_started', { session, user: session.user });
      
      console.log('✅ Session set successfully');
    } catch (error) {
      console.error('Set session error:', error);
      this.setError('Failed to set session');
    }
  }

  private clearSession(): void {
    try {
      const wasAuthenticated = this.sessionState.isAuthenticated;
      
      this.sessionState = {
        session: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        lastActivity: Date.now(),
      };

      this.clearTimers();

      if (wasAuthenticated) {
        this.emit('session_ended', null);
      }

      console.log('🧹 Session cleared');
    } catch (error) {
      console.error('Clear session error:', error);
    }
  }

  // =========================================================================
  // SESSION VALIDATION & REFRESH
  // =========================================================================

  private async validateSession(): Promise<boolean> {
    if (!this.sessionState.session) {
      return false;
    }

    try {
      const currentSession = await enterpriseTokenManager.getCurrentSession();
      
      if (!currentSession) {
        this.handleSessionExpired();
        return false;
      }

      // Check if session changed (refreshed by another tab)
      if (currentSession.access_token !== this.sessionState.session.access_token) {
        await this.setSession(currentSession);
      }

      // Check if refresh is needed
      if (this.shouldRefreshSession(currentSession)) {
        await this.refreshSession();
      }

      return true;
    } catch (error) {
      console.error('Session validation error:', error);
      return false;
    }
  }

  private shouldRefreshSession(session: Session): boolean {
    if (!session.expires_at) return false;

    const now = Date.now();
    const expiresAt = session.expires_at * 1000;
    const timeUntilExpiry = expiresAt - now;

    return timeUntilExpiry <= this.config.autoRefreshThreshold;
  }

  private async refreshSession(): Promise<boolean> {
    try {
      console.log('🔄 Refreshing session...');
      
      const result = await enterpriseTokenManager.refreshTokens();
      
      if (result.success && result.data) {
        const newSession = this.createSessionFromTokenData(result.data);
        await this.setSession(newSession);
        this.emit('session_refreshed', newSession);
        console.log('✅ Session refreshed successfully');
        return true;
      } else {
        console.warn('Session refresh failed:', result.error);
        this.setError(result.error || 'Session refresh failed');
        return false;
      }
    } catch (error) {
      console.error('Refresh session error:', error);
      this.setError('Session refresh failed');
      return false;
    }
  }

  // =========================================================================
  // IDLE TIMEOUT MANAGEMENT
  // =========================================================================

  private updateActivity(): void {
    this.lastActivityTime = Date.now();
    this.sessionState.lastActivity = this.lastActivityTime;
    
    // Clear existing timers
    this.clearIdleTimers();
    
    // Set new timers if authenticated
    if (this.sessionState.isAuthenticated) {
      this.setIdleTimers();
    }

    this.emit('user_activity', { timestamp: this.lastActivityTime });
  }

  private setIdleTimers(): void {
    // Set warning timer
    const warningDelay = this.config.maxIdleTime - this.config.warningTime;
    this.idleWarningTimer = setTimeout(() => {
      this.emit('idle_warning', { timeLeft: this.config.warningTime });
    }, warningDelay);

    // Set timeout timer
    this.activityTimer = setTimeout(() => {
      this.handleIdleTimeout();
    }, this.config.maxIdleTime);
  }

  private clearIdleTimers(): void {
    if (this.activityTimer) {
      clearTimeout(this.activityTimer);
      this.activityTimer = null;
    }

    if (this.idleWarningTimer) {
      clearTimeout(this.idleWarningTimer);
      this.idleWarningTimer = null;
    }
  }

  private checkIdleTimeout(): void {
    if (!this.sessionState.isAuthenticated) return;

    const now = Date.now();
    const idleTime = now - this.lastActivityTime;

    if (idleTime >= this.config.maxIdleTime) {
      this.handleIdleTimeout();
    }
  }

  private handleIdleTimeout(): void {
    console.log('⏰ Session idle timeout');
    this.emit('idle_timeout', null);
    this.signOut();
  }

  // =========================================================================
  // EVENT HANDLERS
  // =========================================================================

  private handleTokenRefresh(tokenData: any): void {
    if (tokenData && this.sessionState.isAuthenticated) {
      const newSession = this.createSessionFromTokenData(tokenData);
      this.setSession(newSession);
      this.emit('session_refreshed', newSession);
    }
  }

  private handleSessionExpired(): void {
    console.log('⏰ Session expired');
    this.emit('session_expired', null);
    this.clearSession();
  }

  private handleRefreshFailed(): void {
    console.log('❌ Session refresh failed');
    this.setError('Session refresh failed');
    this.clearSession();
  }

  private handleSignOut(): void {
    console.log('👋 User signed out');
    this.clearSession();
  }

  // =========================================================================
  // UTILITY FUNCTIONS
  // =========================================================================

  private createSessionFromTokenData(tokenData: any): Session {
    return {
      access_token: tokenData.accessToken,
      refresh_token: tokenData.refreshToken,
      expires_at: tokenData.expiresAt,
      expires_in: Math.max(0, tokenData.expiresAt - Math.floor(Date.now() / 1000)),
      token_type: 'bearer',
      user: tokenData.user,
    };
  }

  private setLoading(isLoading: boolean): void {
    this.sessionState.isLoading = isLoading;
  }

  private setError(error: string | null): void {
    this.sessionState.error = error;
    if (error) {
      console.error('Session error:', error);
    }
  }

  private clearTimers(): void {
    this.clearIdleTimers();
    
    if (this.sessionCheckTimer) {
      clearInterval(this.sessionCheckTimer);
      this.sessionCheckTimer = null;
    }
  }

  // =========================================================================
  // EVENT SYSTEM
  // =========================================================================

  on(event: SessionEvent, callback: (data: any) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  private emit(event: SessionEvent, data: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in session event callback for ${event}:`, error);
        }
      });
    }
  }

  // =========================================================================
  // PUBLIC API
  // =========================================================================

  async signOut(): Promise<void> {
    try {
      console.log('👋 Signing out...');
      await enterpriseTokenManager.signOut();
      this.clearSession();
    } catch (error) {
      console.error('Sign out error:', error);
      // Force clear session even if signOut fails
      this.clearSession();
    }
  }

  extendSession(): void {
    if (this.sessionState.isAuthenticated) {
      this.updateActivity();
      console.log('⏰ Session extended due to user activity');
    }
  }

  getCurrentSession(): Session | null {
    return this.sessionState.session;
  }

  getCurrentUser(): User | null {
    return this.sessionState.user;
  }

  isAuthenticated(): boolean {
    return this.sessionState.isAuthenticated;
  }

  isLoading(): boolean {
    return this.sessionState.isLoading;
  }

  getError(): string | null {
    return this.sessionState.error;
  }

  getLastActivity(): number {
    return this.sessionState.lastActivity;
  }

  getIdleTime(): number {
    return Date.now() - this.lastActivityTime;
  }

  updateConfig(newConfig: Partial<SessionConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('⚙️ Session config updated:', this.config);
  }

  getSessionState(): Readonly<SessionState> {
    return { ...this.sessionState };
  }

  // =========================================================================
  // CLEANUP
  // =========================================================================

  cleanup(): void {
    console.log('🧹 Cleaning up Session Manager...');
    this.clearTimers();
    this.listeners.clear();
    this.clearSession();
  }

  // =========================================================================
  // HEALTH CHECK
  // =========================================================================

  healthCheck(): {
    isHealthy: boolean;
    issues: string[];
    metrics: {
      isInitialized: boolean;
      hasSession: boolean;
      isAuthenticated: boolean;
      idleTime: number;
      lastRefresh: number;
    };
  } {
    const issues: string[] = [];
    
    if (!this.isInitialized) {
      issues.push('Session manager not initialized');
    }

    if (!enterpriseTokenManager.isHealthy()) {
      issues.push('Token manager unhealthy');
    }

    if (this.sessionState.error) {
      issues.push(`Session error: ${this.sessionState.error}`);
    }

    const idleTime = this.getIdleTime();
    if (idleTime > this.config.maxIdleTime && this.sessionState.isAuthenticated) {
      issues.push('Session idle timeout exceeded');
    }

    return {
      isHealthy: issues.length === 0,
      issues,
      metrics: {
        isInitialized: this.isInitialized,
        hasSession: !!this.sessionState.session,
        isAuthenticated: this.sessionState.isAuthenticated,
        idleTime,
        lastRefresh: enterpriseTokenManager.getLastRefreshTime(),
      },
    };
  }
}

// Export singleton instance
export const enterpriseSessionManager = EnterpriseSessionManager.getInstance();
export type { SessionState, SessionConfig, SessionEvent };
export default enterpriseSessionManager;

