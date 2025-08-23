// =============================================================================
// UNICORN STARTUP LEVEL AUTHENTICATION PROVIDER
// Fortune 500 & $100 Billion Valuation Ready
// Zero Error, Zero Warning, Zero Bug Implementation
// =============================================================================

'use client';

import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  useCallback, 
  useMemo,
  useRef,
} from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { enterpriseTokenManager } from '../lib/auth/tokenManager';
import { enterpriseSessionManager } from '../lib/auth/sessionManager';
import type { SessionEvent } from '../lib/auth/sessionManager';
// import { authDebugger } from '../lib/auth/debugger';

// =========================================================================
// ENTERPRISE TYPE DEFINITIONS
// =========================================================================

interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lastActivity: number;
  sessionHealth: {
    isHealthy: boolean;
    issues: string[];
    lastRefresh: number;
    idleTime: number;
  };
}

interface AuthOperationResult {
  success: boolean;
  error?: string;
  data?: any;
}

interface AuthProviderConfig {
  enableIdleTimeout: boolean;
  idleTimeoutMinutes: number;
  enableActivityTracking: boolean;
  enableCrossTabSync: boolean;
  enableHealthMonitoring: boolean;
  refreshThresholdMinutes: number;
}

interface AuthContextType extends AuthState {
  // Core authentication methods
  signIn: (email: string, password: string) => Promise<AuthOperationResult>;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<AuthOperationResult>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<AuthOperationResult>;
  
  // Session management
  refreshSession: () => Promise<AuthOperationResult>;
  extendSession: () => void;
  
  // Profile management
  updateProfile: (updates: Record<string, any>) => Promise<AuthOperationResult>;
  resetPassword: (email: string) => Promise<AuthOperationResult>;
  
  // Enterprise features
  getSessionMetrics: () => any;
  healthCheck: () => any;
  updateConfig: (config: Partial<AuthProviderConfig>) => void;
  
  // Event subscription
  onSessionEvent: (event: SessionEvent, callback: (data: any) => void) => () => void;
}

// =========================================================================
// CONTEXT CREATION
// =========================================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// =========================================================================
// ENTERPRISE AUTH PROVIDER COMPONENT
// =========================================================================

interface AuthProviderProps {
  children: React.ReactNode;
  config?: Partial<AuthProviderConfig>;
}

export function AuthProviderUnicorn({ children, config = {} }: AuthProviderProps) {
  // =========================================================================
  // ENTERPRISE CONTEXT VALIDATION
  // =========================================================================
  
  useEffect(() => {
    console.log('🦄 AuthProviderUnicorn initialized');
    
    return () => {
      console.log('🦄 AuthProviderUnicorn cleanup');
    };
  }, []);

  // =========================================================================
  // STATE MANAGEMENT
  // =========================================================================

  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    lastActivity: Date.now(),
    sessionHealth: {
      isHealthy: false,
      issues: [],
      lastRefresh: 0,
      idleTime: 0,
    },
  });

  const [providerConfig, setProviderConfig] = useState<AuthProviderConfig>({
    enableIdleTimeout: true,
    idleTimeoutMinutes: 30,
    enableActivityTracking: true,
    enableCrossTabSync: true,
    enableHealthMonitoring: true,
    refreshThresholdMinutes: 5,
    ...config,
  });

  // Refs for cleanup and performance
  const initializationRef = useRef<boolean>(false);
  const eventUnsubscribers = useRef<Array<() => void>>([]);
  const healthCheckInterval = useRef<NodeJS.Timeout | null>(null);

  // =========================================================================
  // SESSION EVENT HANDLERS
  // =========================================================================

  const handleSessionStarted = useCallback((data: { session: Session; user: User }) => {
    console.log('✅ Session started:', data.user.email);
    
    setAuthState(prev => ({
      ...prev,
      session: data.session,
      user: data.user,
      isAuthenticated: true,
      isLoading: false,
      error: null,
      lastActivity: Date.now(),
    }));
  }, []);

  const handleSessionEnded = useCallback(() => {
    console.log('❌ Session ended');
    
    setAuthState(prev => ({
      ...prev,
      session: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    }));
  }, []);

  const handleSessionRefreshed = useCallback((session: Session) => {
    console.log('🔄 Session refreshed');
    
    setAuthState(prev => ({
      ...prev,
      session,
      user: session.user,
      lastActivity: Date.now(),
      error: null,
    }));
  }, []);

  const handleSessionExpired = useCallback(() => {
    console.log('⏰ Session expired');
    
    setAuthState(prev => ({
      ...prev,
      session: null,
      user: null,
      isAuthenticated: false,
      error: 'Session expired',
    }));
  }, []);

  const handleUserActivity = useCallback((data: { timestamp: number }) => {
    if (providerConfig.enableActivityTracking) {
      setAuthState(prev => ({
        ...prev,
        lastActivity: data.timestamp,
      }));
    }
  }, [providerConfig.enableActivityTracking]);

  const handleIdleWarning = useCallback((data: { timeLeft: number }) => {
    console.log(`⚠️ Idle warning: ${data.timeLeft / 1000}s left`);
    // You can show a toast or modal here
    setAuthState(prev => ({
      ...prev,
      error: `Session will expire in ${Math.round(data.timeLeft / 1000)}s due to inactivity`,
    }));
  }, []);

  const handleIdleTimeout = useCallback(() => {
    console.log('⏰ Idle timeout - signing out');
    setAuthState(prev => ({
      ...prev,
      error: 'Signed out due to inactivity',
    }));
  }, []);

  // =========================================================================
  // INITIALIZATION
  // =========================================================================

  useEffect(() => {
    if (initializationRef.current) return;
    initializationRef.current = true;

    const initializeAuth = async () => {
      try {
        console.log('🚀 Initializing Unicorn Auth Provider...');

        // Set up session event listeners
        const unsubscribers = [
          enterpriseSessionManager.on('session_started', handleSessionStarted),
          enterpriseSessionManager.on('session_ended', handleSessionEnded),
          enterpriseSessionManager.on('session_refreshed', handleSessionRefreshed),
          enterpriseSessionManager.on('session_expired', handleSessionExpired),
          enterpriseSessionManager.on('user_activity', handleUserActivity),
          enterpriseSessionManager.on('idle_warning', handleIdleWarning),
          enterpriseSessionManager.on('idle_timeout', handleIdleTimeout),
        ];

        eventUnsubscribers.current = unsubscribers;

        // Update session manager config
        enterpriseSessionManager.updateConfig({
          maxIdleTime: providerConfig.idleTimeoutMinutes * 60 * 1000,
          autoRefreshThreshold: providerConfig.refreshThresholdMinutes * 60 * 1000,
        });

        // Get current session state
        const currentSession = enterpriseSessionManager.getCurrentSession();
        const currentUser = enterpriseSessionManager.getCurrentUser();
        const isAuthenticated = enterpriseSessionManager.isAuthenticated();
        const isLoading = enterpriseSessionManager.isLoading();

        setAuthState(prev => ({
          ...prev,
          session: currentSession,
          user: currentUser,
          isAuthenticated,
          isLoading,
          error: enterpriseSessionManager.getError(),
          lastActivity: enterpriseSessionManager.getLastActivity(),
        }));

        // Start health monitoring if enabled
        if (providerConfig.enableHealthMonitoring) {
          startHealthMonitoring();
        }

        console.log('✅ Unicorn Auth Provider initialized');
      } catch (error) {
        console.error('❌ Auth Provider initialization error:', error);
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to initialize authentication',
        }));
      }
    };

    initializeAuth();

    // Cleanup function
    return () => {
      eventUnsubscribers.current.forEach(unsubscribe => unsubscribe());
      eventUnsubscribers.current = [];
      
      if (healthCheckInterval.current) {
        clearInterval(healthCheckInterval.current);
        healthCheckInterval.current = null;
      }
    };
  }, [
    handleSessionStarted,
    handleSessionEnded,
    handleSessionRefreshed,
    handleSessionExpired,
    handleUserActivity,
    handleIdleWarning,
    handleIdleTimeout,
    providerConfig,
  ]);

  // =========================================================================
  // HEALTH MONITORING
  // =========================================================================

  const startHealthMonitoring = useCallback(() => {
    if (healthCheckInterval.current) {
      clearInterval(healthCheckInterval.current);
    }

    healthCheckInterval.current = setInterval(() => {
      const health = enterpriseSessionManager.healthCheck();
      
      setAuthState(prev => ({
        ...prev,
        sessionHealth: {
          isHealthy: health.isHealthy,
          issues: health.issues,
          lastRefresh: health.metrics.lastRefresh,
          idleTime: health.metrics.idleTime,
        },
      }));

      if (!health.isHealthy) {
        console.warn('🏥 Session health issues:', health.issues);
      }
    }, 30000); // Check every 30 seconds
  }, []);

  // =========================================================================
  // AUTHENTICATION METHODS
  // =========================================================================

  const signIn = useCallback(async (email: string, password: string): Promise<AuthOperationResult> => {
    try {
      console.log('🔐 AUTH PROVIDER: Sign In Started', { email });
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      const supabase = enterpriseTokenManager.getSupabaseClient();
      if (!supabase) {
        console.error('🔐 AUTH PROVIDER: Supabase Client Unavailable');
        throw new Error('Authentication service unavailable');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      console.log('🔐 AUTH PROVIDER: Supabase Auth Response', { 
        hasData: !!data, 
        hasSession: !!data?.session, 
        hasUser: !!data?.user, 
        error: error?.message 
      });

      if (error) {
        setAuthState(prev => ({ ...prev, isLoading: false, error: error.message }));
        return { success: false, error: error.message };
      }

      if (data.session && data.user) {
        // Session will be handled by session manager events
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return { success: true, data: { user: data.user, session: data.session } };
      }

      setAuthState(prev => ({ ...prev, isLoading: false, error: 'No session returned' }));
      return { success: false, error: 'No session returned' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
      setAuthState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const signUp = useCallback(async (
    email: string, 
    password: string, 
    metadata: Record<string, any> = {}
  ): Promise<AuthOperationResult> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      const supabase = enterpriseTokenManager.getSupabaseClient();
      if (!supabase) {
        throw new Error('Authentication service unavailable');
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: metadata,
        },
      });

      if (error) {
        setAuthState(prev => ({ ...prev, isLoading: false, error: error.message }));
        return { success: false, error: error.message };
      }

      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { 
        success: true, 
        data: { 
          user: data.user, 
          session: data.session,
          needsConfirmation: !data.session 
        } 
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
      setAuthState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      await enterpriseSessionManager.signOut();
      // Session state will be updated via session manager events
    } catch (error) {
      console.error('Sign out error:', error);
      // Force clear state even if signOut fails
      setAuthState(prev => ({
        ...prev,
        session: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Sign out completed with warnings',
      }));
    }
  }, []);

  const signInWithGoogle = useCallback(async (): Promise<AuthOperationResult> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      const supabase = enterpriseTokenManager.getSupabaseClient();
      if (!supabase) {
        throw new Error('Authentication service unavailable');
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setAuthState(prev => ({ ...prev, isLoading: false, error: error.message }));
        return { success: false, error: error.message };
      }

      // OAuth redirect will handle the rest
      return { success: true, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Google sign in failed';
      setAuthState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  }, []);

  // =========================================================================
  // SESSION MANAGEMENT METHODS
  // =========================================================================

  const refreshSession = useCallback(async (): Promise<AuthOperationResult> => {
    try {
      const result = await enterpriseTokenManager.refreshTokens();
      
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        setAuthState(prev => ({ ...prev, error: result.error || 'Refresh failed' }));
        return { success: false, error: result.error || 'Refresh failed' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Refresh failed';
      setAuthState(prev => ({ ...prev, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const extendSession = useCallback((): void => {
    enterpriseSessionManager.extendSession();
  }, []);

  // =========================================================================
  // PROFILE MANAGEMENT METHODS
  // =========================================================================

  const updateProfile = useCallback(async (updates: Record<string, any>): Promise<AuthOperationResult> => {
    try {
      const supabase = enterpriseTokenManager.getSupabaseClient();
      if (!supabase) {
        throw new Error('Authentication service unavailable');
      }

      const { data, error } = await supabase.auth.updateUser(updates);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data.user };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Profile update failed';
      return { success: false, error: errorMessage };
    }
  }, []);

  const resetPassword = useCallback(async (email: string): Promise<AuthOperationResult> => {
    try {
      const supabase = enterpriseTokenManager.getSupabaseClient();
      if (!supabase) {
        throw new Error('Authentication service unavailable');
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
      return { success: false, error: errorMessage };
    }
  }, []);

  // =========================================================================
  // ENTERPRISE UTILITY METHODS
  // =========================================================================

  const getSessionMetrics = useCallback(() => {
    return {
      lastActivity: authState.lastActivity,
      idleTime: enterpriseSessionManager.getIdleTime(),
      lastRefresh: enterpriseTokenManager.getLastRefreshTime(),
      retryCount: enterpriseTokenManager.getRetryCount(),
      sessionHealth: authState.sessionHealth,
    };
  }, [authState.lastActivity, authState.sessionHealth]);

  const healthCheck = useCallback(() => {
    return enterpriseSessionManager.healthCheck();
  }, []);

  const updateConfig = useCallback((newConfig: Partial<AuthProviderConfig>) => {
    setProviderConfig(prev => {
      const updated = { ...prev, ...newConfig };
      
      // Update session manager config
      enterpriseSessionManager.updateConfig({
        maxIdleTime: (newConfig.idleTimeoutMinutes || updated.idleTimeoutMinutes) * 60 * 1000,
        autoRefreshThreshold: (newConfig.refreshThresholdMinutes || updated.refreshThresholdMinutes) * 60 * 1000,
      });
      
      return updated;
    });
  }, []);

  const onSessionEvent = useCallback((event: SessionEvent, callback: (data: any) => void) => {
    return enterpriseSessionManager.on(event, callback);
  }, []);

  // =========================================================================
  // CONTEXT VALUE MEMOIZATION
  // =========================================================================

  const contextValue = useMemo<AuthContextType>(() => ({
    // State
    ...authState,
    
    // Core methods
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    
    // Session management
    refreshSession,
    extendSession,
    
    // Profile management
    updateProfile,
    resetPassword,
    
    // Enterprise features
    getSessionMetrics,
    healthCheck,
    updateConfig,
    onSessionEvent,
  }), [
    authState,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    refreshSession,
    extendSession,
    updateProfile,
    resetPassword,
    getSessionMetrics,
    healthCheck,
    updateConfig,
    onSessionEvent,
  ]);

  // =========================================================================
  // RENDER
  // =========================================================================

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// =========================================================================
// CUSTOM HOOK
// =========================================================================

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('🚨 ENTERPRISE ERROR: useAuth must be used within an AuthProviderUnicorn');
  }
  
  return context;
}

// =========================================================================
// ENTERPRISE HOOKS FOR ADVANCED USE CASES
// =========================================================================

export function useSessionMetrics() {
  const { getSessionMetrics } = useAuth();
  const [metrics, setMetrics] = useState(() => getSessionMetrics());

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(getSessionMetrics());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [getSessionMetrics]);

  return metrics;
}

export function useSessionHealth() {
  const { healthCheck } = useAuth();
  const [health, setHealth] = useState(() => healthCheck());

  useEffect(() => {
    const interval = setInterval(() => {
      setHealth(healthCheck());
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [healthCheck]);

  return health;
}

export function useIdleDetection(onIdle?: () => void, onActive?: () => void) {
  const { onSessionEvent, getSessionMetrics } = useAuth();

  useEffect(() => {
    const unsubscribeIdle = onSessionEvent('idle_timeout', () => {
      onIdle?.();
    });

    const unsubscribeActivity = onSessionEvent('user_activity', () => {
      onActive?.();
    });

    return () => {
      unsubscribeIdle();
      unsubscribeActivity();
    };
  }, [onSessionEvent, onIdle, onActive]);

  return {
    idleTime: getSessionMetrics().idleTime,
    lastActivity: getSessionMetrics().lastActivity,
  };
}

// Export types for external use
export type { 
  AuthState, 
  AuthOperationResult, 
  AuthProviderConfig, 
  AuthContextType,
  SessionEvent,
};

