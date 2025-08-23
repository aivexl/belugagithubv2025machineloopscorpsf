"use client";
import { useEffect, useState, useCallback, useMemo } from 'react';
import type { User, Session, AuthError, AuthChangeEvent } from '@supabase/supabase-js';
import { AuthContext } from './AuthContext';
import { enterpriseAuthFallback, executeAuthOperation, getAuthServiceStatus } from '@/lib/authEnterpriseFallback';
import { handleAuthError, handleAuthSuccess } from '@/lib/authErrorHandler';

// Enterprise-level security constants
const SECURITY_CONFIG = {
  SESSION_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes before expiry
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  PASSWORD_MIN_LENGTH: 8,
  RATE_LIMIT_WINDOW: 60 * 1000, // 1 minute
  RATE_LIMIT_MAX_REQUESTS: 10
};

// Rate limiting utility
class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(identifier);

    if (!attempt || now > attempt.resetTime) {
      this.attempts.set(identifier, { count: 1, resetTime: now + SECURITY_CONFIG.RATE_LIMIT_WINDOW });
      return true;
    }

    if (attempt.count >= SECURITY_CONFIG.RATE_LIMIT_MAX_REQUESTS) {
      return false;
    }

    attempt.count++;
    return true;
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

export function AuthProviderEnterprise({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState<Map<string, { count: number; lockoutUntil: number }>>(new Map());
  const [authServiceStatus, setAuthServiceStatus] = useState(getAuthServiceStatus());

  // Initialize rate limiter
  const rateLimiter = useMemo(() => new RateLimiter(), []);

  // Enhanced session management with automatic refresh
  const refreshSessionIfNeeded = useCallback(async () => {
    const client = enterpriseAuthFallback.getCurrentService();
    if (!client || !session) return;

    try {
      const expiresAt = session.expires_at;
      if (expiresAt && Date.now() > (expiresAt * 1000) - SECURITY_CONFIG.SESSION_REFRESH_THRESHOLD) {
        const result = await executeAuthOperation(
          (c) => c.auth.refreshSession(),
          'session_refresh',
          { criticalOperation: true }
        );

        if (result.success && result.data?.session) {
          setSession(result.data.session);
          setUser(result.data.session.user);
          handleAuthSuccess('session_refresh');
        } else {
          console.warn('Session refresh failed:', result.error);
        }
      }
    } catch (error) {
      console.warn('Session refresh failed:', error);
      // Don't throw error, just log it
    }
  }, [session]);

  // Enhanced authentication state management
  const handleAuthStateChange = useCallback(async (event: AuthChangeEvent, session: Session | null) => {
    try {
      // Log auth events only in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Auth state changed:', event, session?.user?.email);
      }

      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);
      setAuthError(null);

      // Handle specific auth events
      switch (event) {
        case 'SIGNED_IN':
          // Reset login attempts on successful login
          if (session?.user?.email) {
            setLoginAttempts(prev => {
              const newMap = new Map(prev);
              newMap.delete(session.user.email!);
              return newMap;
            });
          }
          handleAuthSuccess('sign_in');
          break;
        case 'SIGNED_OUT':
          // Clear all auth state
          setUser(null);
          setSession(null);
          setIsAuthenticated(false);
          handleAuthSuccess('sign_out');
          break;
        case 'TOKEN_REFRESHED':
          // Update session with refreshed token
          if (session) {
            setSession(session);
            setUser(session.user);
            handleAuthSuccess('token_refresh');
          }
          break;
        case 'USER_UPDATED':
          // Handle user profile updates
          if (session?.user) {
            setUser(session.user);
            handleAuthSuccess('user_update');
          }
          break;
      }
    } catch (error) {
      console.error('Auth state change error:', error);
      await handleAuthError(error, {
        userId: session?.user?.id || 'anonymous',
        sessionId: session?.access_token?.substring(0, 10) || 'unknown',
        action: 'auth_state_change',
        component: 'AuthProviderEnterprise',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        metadata: { event, hasSession: !!session }
      });
      setAuthError('Authentication error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize authentication with enterprise fallback
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const client = enterpriseAuthFallback.getCurrentService();

        if (!client) {
          console.error('No authentication service available');
          setAuthError('Authentication service not available');
          setLoading(false);
          return;
        }

        // Get initial session with enterprise fallback
        const result = await executeAuthOperation(
          (c) => c.auth.getSession(),
          'initial_session',
          { criticalOperation: true }
        );

        if (mounted) {
          if (result.success && result.data?.data?.session) {
            const { session } = result.data.data;
            setSession(session);
            setUser(session?.user ?? null);
            setIsAuthenticated(!!session?.user);

            // Set up auth state change listener
            const { data: { subscription } } = client.auth.onAuthStateChange(handleAuthStateChange);
            return () => subscription.unsubscribe();
          } else {
            console.warn('Initial session fetch failed:', result.error);
            setAuthError('Failed to initialize authentication');
          }
        }
      } catch (error) {
        console.error('Initial auth setup error:', error);
        if (mounted) {
          await handleAuthError(error, {
            userId: 'system',
            sessionId: 'initialization',
            action: 'initial_auth_setup',
            component: 'AuthProviderEnterprise',
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            metadata: { phase: 'initialization' }
          });
          setAuthError('Authentication service initialization failed');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Set up session refresh interval
    const refreshInterval = setInterval(refreshSessionIfNeeded, 60000); // Check every minute

    // Update service status periodically
    const statusInterval = setInterval(() => {
      setAuthServiceStatus(getAuthServiceStatus());
    }, 30000);

    return () => {
      mounted = false;
      clearInterval(refreshInterval);
      clearInterval(statusInterval);
    };
  }, [handleAuthStateChange, refreshSessionIfNeeded]);

  // Enhanced sign in with enterprise fallback
  const signIn = useCallback(async (email: string, password: string) => {
    const client = enterpriseAuthFallback.getCurrentService();

    if (!client) {
      return { error: { message: 'Authentication service not available' } as AuthError };
    }

    // Check rate limiting
    if (!rateLimiter.isAllowed(`login:${email}`)) {
      return { error: { message: 'Too many login attempts. Please try again later.' } as AuthError };
    }

    // Check account lockout
    const lockoutInfo = loginAttempts.get(email);
    if (lockoutInfo && Date.now() < lockoutInfo.lockoutUntil) {
      const remainingTime = Math.ceil((lockoutInfo.lockoutUntil - Date.now()) / 1000 / 60);
      return { error: { message: `Account temporarily locked. Try again in ${remainingTime} minutes.` } as AuthError };
    }

    try {
      const result = await executeAuthOperation(
        (c) => c.auth.signInWithPassword({ email, password }),
        'sign_in',
        { criticalOperation: true }
      );

      if (result.success) {
        // Reset login attempts on success
        setLoginAttempts(prev => {
          const newMap = new Map(prev);
          newMap.delete(email);
          return newMap;
        });

        return { data: result.data, error: null };
      } else {
        // Handle failed login attempts
        const currentAttempts = loginAttempts.get(email)?.count || 0;
        const newAttempts = currentAttempts + 1;

        if (newAttempts >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS) {
          const lockoutUntil = Date.now() + SECURITY_CONFIG.LOCKOUT_DURATION;
          setLoginAttempts(prev => new Map(prev).set(email, { count: newAttempts, lockoutUntil }));
          return { error: { message: 'Account locked due to too many failed attempts. Try again in 15 minutes.' } as AuthError };
        } else {
          setLoginAttempts(prev => new Map(prev).set(email, { count: newAttempts, lockoutUntil: 0 }));
        }

        return { error: { message: result.error || 'Login failed' } as AuthError };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: error as AuthError };
    }
  }, [loginAttempts, rateLimiter]);

  // Enhanced sign up with enterprise fallback
  const signUp = useCallback(async (email: string, password: string, fullName?: string) => {
    const client = enterpriseAuthFallback.getCurrentService();

    if (!client) {
      return { error: { message: 'Authentication service not available' } as AuthError };
    }

    // Check rate limiting
    if (!rateLimiter.isAllowed(`signup:${email}`)) {
      return { error: { message: 'Too many signup attempts. Please try again later.' } as AuthError };
    }

    // Enhanced password validation
    if (password.length < SECURITY_CONFIG.PASSWORD_MIN_LENGTH) {
      return { error: { message: `Password must be at least ${SECURITY_CONFIG.PASSWORD_MIN_LENGTH} characters long` } as AuthError };
    }

    // Check for common weak passwords
    const weakPasswords = ['password', '123456', 'qwerty', 'admin', 'user'];
    if (weakPasswords.includes(password.toLowerCase())) {
      return { error: { message: 'Password is too weak. Please choose a stronger password.' } as AuthError };
    }

    try {
      // ENHANCED FIX: Dynamic domain detection for production
      let redirectUrl;

      if (process.env.NODE_ENV === 'production') {
        // Use environment variable if available, fallback to hardcoded production domain
        redirectUrl = process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN ||
                     'https://belugagithubv2025machineloopscorpsf-gold.vercel.app';
      } else {
        // Development environment
        redirectUrl = process.env.NEXT_PUBLIC_DEVELOPMENT_DOMAIN ||
                     window.location.origin;
      }

      const finalRedirectUrl = `${redirectUrl}/auth/callback`;

      console.log('Signup redirect URL:', finalRedirectUrl);

      const result = await executeAuthOperation(
        (c) => c.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: finalRedirectUrl,
            data: {
              full_name: fullName || '',
              signup_date: new Date().toISOString(),
              user_agent: navigator.userAgent,
              ip_address: 'client-side', // Will be captured server-side
              environment: process.env.NODE_ENV || 'development',
              redirect_url: finalRedirectUrl
            }
          }
        }),
        'sign_up',
        { criticalOperation: true }
      );

      if (result.success) {
        return { data: result.data, error: null };
      } else {
        return { error: { message: result.error || 'Signup failed' } as AuthError };
      }
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: error as AuthError };
    }
  }, [rateLimiter]);

  // Enhanced sign out with enterprise fallback
  const signOut = useCallback(async () => {
    const client = enterpriseAuthFallback.getCurrentService();

    if (!client) {
      // Force clear state even if service is unavailable
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      return;
    }

    try {
      const result = await executeAuthOperation(
        (c) => c.auth.signOut(),
        'sign_out',
        { criticalOperation: true }
      );

      if (result.success) {
        // Clear all auth state
        setUser(null);
        setSession(null);
        setIsAuthenticated(false);
        setAuthError(null);
      } else {
        console.warn('Sign out API call failed:', result.error);
        // Force clear state even if API call fails
        setUser(null);
        setSession(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Sign out error:', error);
      // Force clear state even if API call fails
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
    }
  }, []);

  // Enhanced Google sign in with enterprise fallback
  const signInWithGoogle = useCallback(async () => {
    const client = enterpriseAuthFallback.getCurrentService();

    if (!client) {
      return { error: { message: 'Authentication service not available' } as AuthError };
    }

    try {
      // ENHANCED FIX: Dynamic domain detection for Google OAuth
      let redirectUrl;

      if (process.env.NODE_ENV === 'production') {
        // Use environment variable if available, fallback to hardcoded production domain
        redirectUrl = process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN ||
                     'https://belugagithubv2025machineloopscorpsf-gold.vercel.app';
      } else {
        // Development environment
        redirectUrl = process.env.NEXT_PUBLIC_DEVELOPMENT_DOMAIN ||
                     window.location.origin;
      }

      const finalRedirectUrl = `${redirectUrl}/auth/callback`;

      console.log('Google OAuth redirect URL:', finalRedirectUrl);

      const result = await executeAuthOperation(
        (c) => c.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: finalRedirectUrl,
            queryParams: {
              access_type: 'offline',
              prompt: 'consent'
            }
          }
        }),
        'google_sign_in',
        { criticalOperation: true }
      );

      if (result.success) {
        return { error: null };
      } else {
        return { error: { message: result.error || 'Google sign in failed' } as AuthError };
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      return { error: error as AuthError };
    }
  }, []);

  // Password reset with enterprise fallback
  const resetPassword = useCallback(async (email: string) => {
    const client = enterpriseAuthFallback.getCurrentService();

    if (!client) {
      return { error: { message: 'Authentication service not available' } as AuthError };
    }

    // Check rate limiting
    if (!rateLimiter.isAllowed(`reset:${email}`)) {
      return { error: { message: 'Too many password reset attempts. Please try again later.' } as AuthError };
    }

    try {
      // ENHANCED FIX: Dynamic domain detection for password reset
      let redirectUrl;

      if (process.env.NODE_ENV === 'production') {
        // Use environment variable if available, fallback to hardcoded production domain
        redirectUrl = process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN ||
                     'https://belugagithubv2025machineloopscorpsf-gold.vercel.app';
      } else {
        // Development environment
        redirectUrl = process.env.NEXT_PUBLIC_DEVELOPMENT_DOMAIN ||
                     window.location.origin;
      }

      const finalRedirectUrl = `${redirectUrl}/auth/reset-password`;

      console.log('Password reset redirect URL:', finalRedirectUrl);

      const result = await executeAuthOperation(
        (c) => c.auth.resetPasswordForEmail(email, { redirectTo: finalRedirectUrl }),
        'password_reset',
        { criticalOperation: false }
      );

      if (result.success) {
        return { error: null };
      } else {
        return { error: { message: result.error || 'Password reset failed' } as AuthError };
      }
    } catch (error) {
      console.error('Password reset error:', error);
      return { error: error as AuthError };
    }
  }, [rateLimiter]);

  // Update user profile with enterprise fallback
  const updateProfile = useCallback(async (updates: { [key: string]: any }) => {
    const client = enterpriseAuthFallback.getCurrentService();

    if (!client || !user) {
      return { error: { message: 'User not authenticated or service unavailable' } as AuthError };
    }

    try {
      const result = await executeAuthOperation(
        (c) => c.auth.updateUser(updates),
        'profile_update',
        { criticalOperation: false }
      );

      if (result.success) {
        return { error: null };
      } else {
        return { error: { message: result.error || 'Profile update failed' } as AuthError };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return { error: error as AuthError };
    }
  }, [user]);

  // Context value with all functionality
  const contextValue = useMemo(() => ({
    user,
    session,
    loading,
    isAuthenticated,
    authError,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    resetPassword,
    updateProfile,
    refreshSession: refreshSessionIfNeeded,
    // Enterprise features
    authServiceStatus,
    enterpriseFallback: {
      currentService: authServiceStatus.currentService,
      health: authServiceStatus.health,
      circuitBreakers: authServiceStatus.circuitBreakers,
      performance: authServiceStatus.performance
    }
  }), [
    user,
    session,
    loading,
    isAuthenticated,
    authError,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    resetPassword,
    updateProfile,
    refreshSessionIfNeeded,
    authServiceStatus
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
