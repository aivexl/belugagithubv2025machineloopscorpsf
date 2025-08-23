// =============================================================================
// ENTERPRISE-GRADE JWT + REFRESH TOKEN MANAGER
// Fortune 500 & Unicorn Startup Level Implementation
// =============================================================================

import { createBrowserClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { SupabaseClient, Session, User } from '@supabase/supabase-js';

// Enterprise Configuration
const TOKEN_CONFIG = {
  // Security intervals (enterprise-grade timing)
  REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes before expiry
  CHECK_INTERVAL: 30 * 1000, // Check every 30 seconds
  RETRY_DELAY: 1000, // 1 second initial retry delay
  MAX_RETRY_ATTEMPTS: 3,
  
  // Storage keys with namespace collision prevention
  STORAGE_KEYS: {
    ACCESS_TOKEN: 'beluga_enterprise_access_token',
    REFRESH_TOKEN: 'beluga_enterprise_refresh_token',
    USER_DATA: 'beluga_enterprise_user_data',
    SESSION_DATA: 'beluga_enterprise_session_data',
    LAST_REFRESH: 'beluga_enterprise_last_refresh',
    REFRESH_LOCK: 'beluga_enterprise_refresh_lock',
  },
  
  // Enterprise security headers
  SECURITY: {
    CSRF_HEADER: 'X-CSRF-Token',
    CLIENT_ID: 'beluga-enterprise-v2025',
    REQUEST_TIMEOUT: 15000, // 15 seconds
  }
} as const;

interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: User;
  sessionId: string;
}

interface RefreshResult {
  success: boolean;
  data?: TokenData;
  error?: string;
  retryAfter?: number;
}

class EnterpriseTokenManager {
  private static instance: EnterpriseTokenManager;
  private supabaseClient: SupabaseClient | null = null;
  private refreshPromise: Promise<RefreshResult> | null = null;
  private refreshInterval: NodeJS.Timeout | null = null;
  private retryCount: number = 0;
  private isInitialized: boolean = false;
  private lastRefreshTime: number = 0;
  private refreshLock: boolean = false;
  
  // Event listeners for cross-tab synchronization
  private listeners: Map<string, Array<(data: any) => void>> = new Map();
  
  private constructor() {
    this.initializeClient();
    this.setupCrossTabSync();
    this.startPeriodicCheck();
  }

  static getInstance(): EnterpriseTokenManager {
    if (!EnterpriseTokenManager.instance) {
      EnterpriseTokenManager.instance = new EnterpriseTokenManager();
    }
    return EnterpriseTokenManager.instance;
  }

  private initializeClient(): void {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase environment variables');
      }

      // Primary attempt: Browser client (best for app router + client components)
      this.supabaseClient = createBrowserClient(supabaseUrl, supabaseKey, {
        auth: {
          autoRefreshToken: false, // We handle this manually for enterprise control
          persistSession: true,
          detectSessionInUrl: true,
          flowType: 'pkce',
          storage: {
            getItem: this.secureGetItem.bind(this),
            setItem: this.secureSetItem.bind(this),
            removeItem: this.secureRemoveItem.bind(this),
          },
        },
        global: {
          headers: {
            'X-Client-Info': TOKEN_CONFIG.SECURITY.CLIENT_ID,
          },
        },
      });

      this.isInitialized = true;
      console.log('🚀 Enterprise Token Manager initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Enterprise Token Manager (browser client):', error);
      // Fallback: try standard client to avoid total outage in edge cases
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
        this.supabaseClient = createSupabaseClient(supabaseUrl, supabaseKey, {
          auth: {
            autoRefreshToken: false,
            persistSession: true,
            detectSessionInUrl: true,
            flowType: 'pkce',
          },
          global: {
            headers: {
              'X-Client-Info': TOKEN_CONFIG.SECURITY.CLIENT_ID,
            },
          },
        });
        this.isInitialized = true;
        console.log('✅ Enterprise Token Manager fallback client initialized');
      } catch (fallbackError) {
        console.error('❌ Enterprise Token Manager fallback initialization failed:', fallbackError);
        this.supabaseClient = null;
        this.isInitialized = false;
      }
    }
  }

  // Ensure a client instance exists; reinitialize on-demand if not
  private ensureClient(): void {
    if (this.supabaseClient) return;
    try {
      this.initializeClient();
    } catch (error) {
      console.error('❌ Failed to ensure Supabase client:', error);
    }
  }

  // =========================================================================
  // SECURE STORAGE IMPLEMENTATION
  // =========================================================================

  private secureGetItem(key: string): string | null {
    try {
      // Try multiple storage mechanisms with fallback
      const sources = [
        () => localStorage.getItem(key),
        () => sessionStorage.getItem(key),
        () => this.getCookieValue(key),
      ];

      for (const getSource of sources) {
        try {
          const value = getSource();
          if (value) {
            // Validate data integrity
            if (this.validateStoredData(key, value)) {
              return value;
            }
          }
        } catch (error) {
          console.warn(`Storage source failed for key ${key}:`, error);
          continue;
        }
      }

      return null;
    } catch (error) {
      console.warn('Secure storage get error:', error);
      return null;
    }
  }

  private secureSetItem(key: string, value: string): void {
    try {
      // Add timestamp and integrity check
      const secureValue = this.addIntegrityCheck(value);
      
      // Store in multiple locations for redundancy
      const storageOperations = [
        () => localStorage.setItem(key, secureValue),
        () => sessionStorage.setItem(key, secureValue),
        () => this.setCookieValue(key, secureValue),
      ];

      let successCount = 0;
      for (const operation of storageOperations) {
        try {
          operation();
          successCount++;
        } catch (error) {
          console.warn(`Storage operation failed for key ${key}:`, error);
        }
      }

      if (successCount === 0) {
        throw new Error('All storage operations failed');
      }

      // Notify other tabs about the change
      this.broadcastStorageChange(key, value);
    } catch (error) {
      console.error('Secure storage set error:', error);
    }
  }

  private secureRemoveItem(key: string): void {
    try {
      const removeOperations = [
        () => localStorage.removeItem(key),
        () => sessionStorage.removeItem(key),
        () => this.removeCookieValue(key),
      ];

      for (const operation of removeOperations) {
        try {
          operation();
        } catch (error) {
          console.warn(`Storage removal failed for key ${key}:`, error);
        }
      }

      // Notify other tabs about the removal
      this.broadcastStorageChange(key, null);
    } catch (error) {
      console.error('Secure storage remove error:', error);
    }
  }

  // =========================================================================
  // TOKEN MANAGEMENT CORE FUNCTIONS
  // =========================================================================

  async getCurrentSession(): Promise<Session | null> {
    if (!this.supabaseClient) return null;

    try {
      const { data: { session }, error } = await this.supabaseClient.auth.getSession();
      
      if (error) {
        console.warn('Get session error:', error);
        return null;
      }

      if (session && this.isSessionValid(session)) {
        return session;
      }

      // Try to refresh if session is expired but recoverable
      if (session && this.canRefreshSession(session)) {
        const refreshResult = await this.refreshTokens();
        return refreshResult.success && refreshResult.data ? 
          this.createSessionFromTokenData(refreshResult.data) : null;
      }

      return null;
    } catch (error) {
      console.error('Get current session error:', error);
      return null;
    }
  }

  async refreshTokens(): Promise<RefreshResult> {
    // Prevent concurrent refresh attempts
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    // Check refresh lock (cross-tab protection)
    if (this.isRefreshLocked()) {
      return { success: false, error: 'Refresh locked by another tab' };
    }

    this.refreshPromise = this.performTokenRefresh();
    
    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performTokenRefresh(): Promise<RefreshResult> {
    if (!this.supabaseClient) {
      return { success: false, error: 'Supabase client not initialized' };
    }

    try {
      // Set refresh lock to prevent concurrent attempts
      this.setRefreshLock(true);
      
      console.log('🔄 Enterprise: Starting token refresh...');
      
      const { data, error } = await this.supabaseClient.auth.refreshSession();
      
      if (error) {
        console.error('Token refresh failed:', error);
        this.retryCount++;
        
        if (this.retryCount < TOKEN_CONFIG.MAX_RETRY_ATTEMPTS) {
          // Exponential backoff retry
          const retryDelay = TOKEN_CONFIG.RETRY_DELAY * Math.pow(2, this.retryCount - 1);
          console.log(`🔄 Retrying token refresh in ${retryDelay}ms (attempt ${this.retryCount})`);
          
          await this.delay(retryDelay);
          return this.performTokenRefresh();
        }
        
        // Max retries exceeded
        this.handleRefreshFailure();
        return { 
          success: false, 
          error: error.message,
          retryAfter: 60000 // Retry after 1 minute
        };
      }

      if (!data.session) {
        return { success: false, error: 'No session returned from refresh' };
      }

      // Success - reset retry count and update last refresh time
      this.retryCount = 0;
      this.lastRefreshTime = Date.now();
      
      const tokenData: TokenData = {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt: data.session.expires_at || 0,
        user: data.session.user,
        sessionId: this.generateSessionId(),
      };

      // Store tokens securely
      await this.storeTokenData(tokenData);
      
      console.log('✅ Enterprise: Token refresh successful');
      
      // Notify listeners
      this.emit('token_refreshed', tokenData);
      
      return { success: true, data: tokenData };

    } catch (error) {
      console.error('Token refresh error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    } finally {
      this.setRefreshLock(false);
    }
  }

  // =========================================================================
  // SESSION VALIDATION & UTILITIES
  // =========================================================================

  private isSessionValid(session: Session): boolean {
    if (!session || !session.expires_at) return false;
    
    const now = Date.now();
    const expiresAt = session.expires_at * 1000;
    
    // Session is valid if it doesn't expire within the threshold
    return now < (expiresAt - TOKEN_CONFIG.REFRESH_THRESHOLD);
  }

  private canRefreshSession(session: Session): boolean {
    if (!session || !session.refresh_token) return false;
    
    const now = Date.now();
    const expiresAt = session.expires_at ? session.expires_at * 1000 : 0;
    
    // Can refresh if session is expired but not too old
    return now >= expiresAt && (now - expiresAt) < (24 * 60 * 60 * 1000); // Within 24 hours
  }

  private isRefreshLocked(): boolean {
    try {
      const lockData = localStorage.getItem(TOKEN_CONFIG.STORAGE_KEYS.REFRESH_LOCK);
      if (!lockData) return false;
      
      const { locked, timestamp } = JSON.parse(lockData);
      const now = Date.now();
      
      // Lock expires after 30 seconds to prevent deadlock
      if (locked && (now - timestamp) < 30000) {
        return true;
      }
      
      // Clear expired lock
      if (locked) {
        this.setRefreshLock(false);
      }
      
      return false;
    } catch (error) {
      return false;
    }
  }

  private setRefreshLock(locked: boolean): void {
    try {
      if (locked) {
        const lockData = {
          locked: true,
          timestamp: Date.now(),
          tabId: this.generateTabId(),
        };
        localStorage.setItem(TOKEN_CONFIG.STORAGE_KEYS.REFRESH_LOCK, JSON.stringify(lockData));
      } else {
        localStorage.removeItem(TOKEN_CONFIG.STORAGE_KEYS.REFRESH_LOCK);
      }
    } catch (error) {
      console.warn('Failed to set refresh lock:', error);
    }
  }

  // =========================================================================
  // CROSS-TAB SYNCHRONIZATION
  // =========================================================================

  private setupCrossTabSync(): void {
    if (typeof window === 'undefined') return;

    // Listen for storage events from other tabs
    window.addEventListener('storage', (event) => {
      if (event.key?.startsWith('beluga_enterprise_')) {
        this.handleCrossTabEvent(event);
      }
    });

    // Listen for custom events
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });
  }

  private handleCrossTabEvent(event: StorageEvent): void {
    if (!event.key) return;

    // Handle token updates from other tabs
    if (event.key === TOKEN_CONFIG.STORAGE_KEYS.SESSION_DATA) {
      if (event.newValue) {
        try {
          const sessionData = JSON.parse(event.newValue);
          this.emit('session_updated', sessionData);
        } catch (error) {
          console.warn('Failed to parse cross-tab session data:', error);
        }
      } else {
        // Session was cleared in another tab
        this.emit('session_cleared', null);
      }
    }
  }

  private broadcastStorageChange(key: string, value: string | null): void {
    try {
      // Use a custom event for immediate cross-tab communication
      const event = new CustomEvent('beluga_storage_change', {
        detail: { key, value, timestamp: Date.now() }
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.warn('Failed to broadcast storage change:', error);
    }
  }

  // =========================================================================
  // PERIODIC HEALTH CHECK & MONITORING
  // =========================================================================

  private startPeriodicCheck(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }

    this.refreshInterval = setInterval(async () => {
      await this.performHealthCheck();
    }, TOKEN_CONFIG.CHECK_INTERVAL);
  }

  private async performHealthCheck(): Promise<void> {
    if (!this.isInitialized || !this.supabaseClient) return;

    try {
      const session = await this.getCurrentSession();
      
      if (session) {
        // Check if refresh is needed
        if (this.shouldRefreshToken(session)) {
          await this.refreshTokens();
        }
      } else {
        // No valid session - emit event for UI to handle
        this.emit('session_expired', null);
      }
    } catch (error) {
      console.warn('Health check error:', error);
    }
  }

  private shouldRefreshToken(session: Session): boolean {
    if (!session.expires_at) return false;
    
    const now = Date.now();
    const expiresAt = session.expires_at * 1000;
    const timeUntilExpiry = expiresAt - now;
    
    return timeUntilExpiry <= TOKEN_CONFIG.REFRESH_THRESHOLD;
  }

  // =========================================================================
  // EVENT SYSTEM FOR REACTIVE UPDATES
  // =========================================================================

  on(event: string, callback: (data: any) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: (data: any) => void): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event callback for ${event}:`, error);
        }
      });
    }
  }

  // =========================================================================
  // UTILITY FUNCTIONS
  // =========================================================================

  private async storeTokenData(tokenData: TokenData): Promise<void> {
    try {
      const serializedData = JSON.stringify({
        ...tokenData,
        timestamp: Date.now(),
      });
      
      this.secureSetItem(TOKEN_CONFIG.STORAGE_KEYS.SESSION_DATA, serializedData);
      this.secureSetItem(TOKEN_CONFIG.STORAGE_KEYS.LAST_REFRESH, Date.now().toString());
    } catch (error) {
      console.error('Failed to store token data:', error);
    }
  }

  private createSessionFromTokenData(tokenData: TokenData): Session {
    return {
      access_token: tokenData.accessToken,
      refresh_token: tokenData.refreshToken,
      expires_at: tokenData.expiresAt,
      expires_in: Math.max(0, tokenData.expiresAt - Math.floor(Date.now() / 1000)),
      token_type: 'bearer',
      user: tokenData.user,
    };
  }

  private handleRefreshFailure(): void {
    console.warn('🚨 Enterprise: Token refresh failed - clearing session');
    this.clearAllTokens();
    this.emit('refresh_failed', null);
  }

  private clearAllTokens(): void {
    const keys = Object.values(TOKEN_CONFIG.STORAGE_KEYS);
    keys.forEach(key => this.secureRemoveItem(key));
  }

  private validateStoredData(key: string, value: string): boolean {
    try {
      // Basic validation - can be enhanced with cryptographic signatures
      if (key.includes('session') || key.includes('token')) {
        JSON.parse(value); // Must be valid JSON
        return true;
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  private addIntegrityCheck(value: string): string {
    // Simple integrity check - in production, use HMAC or similar
    const timestamp = Date.now();
    const checksum = this.simpleHash(value + timestamp);
    return JSON.stringify({ value, timestamp, checksum });
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(36);
  }

  private getCookieValue(name: string): string | null {
    try {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        return decodeURIComponent(parts.pop()?.split(';').shift() || '');
      }
    } catch (error) {
      console.warn('Cookie read error:', error);
    }
    return null;
  }

  private setCookieValue(name: string, value: string): void {
    try {
      const maxAge = 30 * 24 * 60 * 60; // 30 days
      document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`;
    } catch (error) {
      console.warn('Cookie set error:', error);
    }
  }

  private removeCookieValue(name: string): void {
    try {
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
    } catch (error) {
      console.warn('Cookie remove error:', error);
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateTabId(): string {
    return `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // =========================================================================
  // CLEANUP & LIFECYCLE MANAGEMENT
  // =========================================================================

  cleanup(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
    
    this.listeners.clear();
    this.setRefreshLock(false);
  }

  // =========================================================================
  // PUBLIC API
  // =========================================================================

  async signOut(): Promise<void> {
    try {
      if (this.supabaseClient) {
        await this.supabaseClient.auth.signOut();
      }
    } catch (error) {
      console.warn('Supabase signOut error:', error);
    } finally {
      this.clearAllTokens();
      this.emit('signed_out', null);
    }
  }

  getSupabaseClient(): SupabaseClient | null {
    this.ensureClient();
    return this.supabaseClient;
  }

  isHealthy(): boolean {
    return this.isInitialized && this.supabaseClient !== null;
  }

  getLastRefreshTime(): number {
    return this.lastRefreshTime;
  }

  getRetryCount(): number {
    return this.retryCount;
  }
}

// Export singleton instance
export const enterpriseTokenManager = EnterpriseTokenManager.getInstance();
export type { TokenData, RefreshResult };
export default enterpriseTokenManager;

