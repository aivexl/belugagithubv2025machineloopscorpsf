"use client";
import { useEffect, useState, useCallback, useMemo } from 'react';
import type { User, Session, AuthError, AuthChangeEvent } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';
import { AuthContext } from './AuthContext';
import { validateSupabaseConfig, getCurrentDomain } from '../utils/env';

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState<Map<string, { count: number; lockoutUntil: number }>>(new Map());

  // Initialize rate limiter
  const rateLimiter = useMemo(() => new RateLimiter(), []);

  // Safety check for static generation
  const isStaticGeneration = typeof window === 'undefined';

  // Create Supabase client with enterprise-level error handling and graceful degradation
  const supabase = useMemo(() => {
    // During static generation, always return mock client
    if (isStaticGeneration) {
      console.log('🔄 Static generation detected, using mock Supabase client');
      return createMockSupabaseClient();
    }

    // Enhanced environment variable validation with detailed logging
    if (!validateSupabaseConfig()) {
      console.warn('🔴 ENTERPRISE ALERT: Supabase environment variables not configured');
      console.warn('📋 Required variables:');
      console.warn('   - NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configured' : '❌ Missing');
      console.warn('   - NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configured' : '❌ Missing');
      
      // Return a mock client for graceful degradation
      return createMockSupabaseClient();
    }

    try {
      const client = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
            flowType: 'pkce'
          },
          global: {
            headers: {
              'X-Client-Info': 'beluga-web-app'
            }
          }
        }
      );
      
      console.log('✅ Supabase client initialized successfully');
      return client;
    } catch (error) {
      console.error('❌ Failed to create Supabase client:', error);
      console.warn('🔄 Falling back to mock client for graceful degradation');
      return createMockSupabaseClient();
    }
  }, [isStaticGeneration]);

  // Enterprise-level mock Supabase client for graceful degradation
  const createMockSupabaseClient = () => {
    console.log('🔄 Initializing mock Supabase client for graceful degradation');
    
    // Create a proper AuthError object that matches the expected interface
    const createAuthError = (message: string): AuthError => {
      const error = new Error(message) as AuthError;
      error.name = 'AuthError';
      error.status = 503;
      error.message = message;
      return error;
    };
    
    return {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        get user() { return null; },
        get session() { return null; },
        signIn: async () => ({ data: { user: null, session: null }, error: createAuthError('Authentication service not available') }),
        signInWithPassword: async () => ({ data: { user: null, session: null }, error: createAuthError('Authentication service not available') }),
        signInWithOAuth: async () => ({ data: { user: null, session: null }, error: createAuthError('Authentication service not available') }),
        signUp: async () => ({ data: { user: null, session: null }, error: createAuthError('Authentication service not available') }),
        signOut: async () => ({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: null } }),
        refreshSession: async () => ({ data: { session: null }, error: null }),
        resetPasswordForEmail: async () => ({ error: null }),
        updateUser: async () => ({ data: { user: null }, error: createAuthError('Authentication service not available') }),
        updatePassword: async () => ({ error: createAuthError('Authentication service not available') }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({ single: async () => ({ data: null, error: { message: 'Database service not available' } }) }),
          insert: async () => ({ data: null, error: { message: 'Database service not available' } }),
          update: async () => ({ data: null, error: { message: 'Database service not available' } }),
          delete: async () => ({ data: null, error: { message: 'Database service not available' } }),
        }),
      }),
    };
  };

  // Enhanced session management with automatic refresh
  const refreshSessionIfNeeded = useCallback(async () => {
    if (!supabase || !session) return;

    try {
      const expiresAt = session.expires_at;
      if (expiresAt && Date.now() > (expiresAt * 1000) - SECURITY_CONFIG.SESSION_REFRESH_THRESHOLD) {
        const { data, error } = await supabase.auth.refreshSession();
        if (error) throw error;
        if (data.session) {
          setSession(data.session);
          setUser(data.session.user);
        }
      }
    } catch (error) {
      console.warn('Session refresh failed:', error);
      // Don't throw error, just log it
    }
  }, [supabase, session]);

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
          break;
        case 'SIGNED_OUT':
          // Clear all auth state
          setUser(null);
          setSession(null);
          setIsAuthenticated(false);
          break;
        case 'TOKEN_REFRESHED':
          // Update session with refreshed token
          if (session) {
            setSession(session);
            setUser(session.user);
          }
          break;
      }
    } catch (error) {
      console.error('Auth state change error:', error);
      setAuthError('Authentication error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize authentication
  useEffect(() => {
    // Skip initialization during static generation
    if (isStaticGeneration) {
      setLoading(false);
      return;
    }

    if (!supabase) {
      setLoading(false);
      return;
    }

    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setIsAuthenticated(!!session?.user);
        }
      } catch (error) {
        console.warn('Initial session fetch error:', error);
        if (mounted) {
          setAuthError('Failed to initialize authentication');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Set up session refresh interval
    const refreshInterval = setInterval(refreshSessionIfNeeded, 60000); // Check every minute

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearInterval(refreshInterval);
    };
  }, [supabase, handleAuthStateChange, refreshSessionIfNeeded, isStaticGeneration]);

  // Enhanced sign in with security measures
  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) {
      const error = new Error('Authentication service not available') as AuthError;
      error.name = 'AuthError';
      error.status = 503;
      return { error };
    }

    // Check rate limiting
    if (!rateLimiter.isAllowed(`login:${email}`)) {
      const error = new Error('Too many login attempts. Please try again later.') as AuthError;
      error.name = 'AuthError';
      error.status = 429;
      return { error };
    }

    // Check account lockout
    const lockoutInfo = loginAttempts.get(email);
    if (lockoutInfo && Date.now() < lockoutInfo.lockoutUntil) {
      const remainingTime = Math.ceil((lockoutInfo.lockoutUntil - Date.now()) / 1000 / 60);
      const error = new Error(`Account temporarily locked. Try again in ${remainingTime} minutes.`) as AuthError;
      error.name = 'AuthError';
      error.status = 423;
      return { error };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Handle failed login attempts
        const currentAttempts = loginAttempts.get(email)?.count || 0;
        const newAttempts = currentAttempts + 1;
        
        if (newAttempts >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS) {
          const lockoutUntil = Date.now() + SECURITY_CONFIG.LOCKOUT_DURATION;
          setLoginAttempts(prev => new Map(prev).set(email, { count: newAttempts, lockoutUntil }));
          const error = new Error('Account locked due to too many failed attempts. Try again in 15 minutes.') as AuthError;
          error.name = 'AuthError';
          error.status = 423;
          return { error };
        } else {
          setLoginAttempts(prev => new Map(prev).set(email, { count: newAttempts, lockoutUntil: 0 }));
        }
        
        return { error };
      }

      // Reset login attempts on success
      setLoginAttempts(prev => {
        const newMap = new Map(prev);
        newMap.delete(email);
        return newMap;
      });

      return { data, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      const authError = new Error('Sign in failed') as AuthError;
      authError.name = 'AuthError';
      authError.status = 500;
      return { error: authError };
    }
  }, [supabase, loginAttempts, rateLimiter]);

  // Enhanced sign up with validation and name support
  const signUp = useCallback(async (email: string, password: string, fullName?: string) => {
    if (!supabase) {
      const error = new Error('Authentication service not available') as AuthError;
      error.name = 'AuthError';
      error.status = 503;
      return { error };
    }

    // Check rate limiting
    if (!rateLimiter.isAllowed(`signup:${email}`)) {
      const error = new Error('Too many signup attempts. Please try again later.') as AuthError;
      error.name = 'AuthError';
      error.status = 429;
      return { error };
    }

    // Enhanced password validation
    if (password.length < SECURITY_CONFIG.PASSWORD_MIN_LENGTH) {
      const error = new Error(`Password must be at least ${SECURITY_CONFIG.PASSWORD_MIN_LENGTH} characters long`) as AuthError;
      error.name = 'AuthError';
      error.status = 400;
      return { error };
    }

    // Check for common weak passwords
    const weakPasswords = ['password', '123456', 'qwerty', 'admin', 'user'];
    if (weakPasswords.includes(password.toLowerCase())) {
      const error = new Error('Password is too weak. Please choose a stronger password.') as AuthError;
      error.name = 'AuthError';
      error.status = 400;
      return { error };
    }

    try {
      // ENHANCED FIX: Use environment utility for domain detection
      const redirectUrl = getCurrentDomain();
      const finalRedirectUrl = `${redirectUrl}/auth/callback`;

      console.log('Signup redirect URL:', finalRedirectUrl);

      const { data, error } = await supabase.auth.signUp({
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
      });

      if (error) return { error };
      
      return { data, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      const authError = new Error('Sign up failed') as AuthError;
      authError.name = 'AuthError';
      authError.status = 500;
      return { error: authError };
    }
  }, [supabase, rateLimiter]);

  // Enhanced sign out
  const signOut = useCallback(async () => {
    if (!supabase) return;

    try {
      await supabase.auth.signOut();
      // Clear all auth state
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      setAuthError(null);
    } catch (error) {
      console.error('Sign out error:', error);
      // Force clear state even if API call fails
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
    }
  }, [supabase]);

  // Enhanced Google sign in with production domain support
  const signInWithGoogle = useCallback(async () => {
    if (!supabase) {
      const error = new Error('Authentication service not available') as AuthError;
      error.name = 'AuthError';
      error.status = 503;
      return { error };
    }

    try {
      // ENHANCED FIX: Use environment utility for domain detection
      const redirectUrl = getCurrentDomain();
      const finalRedirectUrl = `${redirectUrl}/auth/callback`;

      console.log('Google OAuth redirect URL:', finalRedirectUrl);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: finalRedirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      return { error };
    } catch (error) {
      console.error('Google sign in error:', error);
      const authError = new Error('Google sign in failed') as AuthError;
      authError.name = 'AuthError';
      authError.status = 500;
      return { error: authError };
    }
  }, [supabase]);

  // Password reset functionality with production domain support
  const resetPassword = useCallback(async (email: string) => {
    if (!supabase) {
      const error = new Error('Authentication service not available') as AuthError;
      error.name = 'AuthError';
      error.status = 503;
      return { error };
    }

    // Check rate limiting
    if (!rateLimiter.isAllowed(`reset:${email}`)) {
      const error = new Error('Too many password reset attempts. Please try again later.') as AuthError;
      error.name = 'AuthError';
      error.status = 429;
      return { error };
    }

    try {
      // ENHANCED FIX: Use environment utility for domain detection
      const redirectUrl = getCurrentDomain();
      const finalRedirectUrl = `${redirectUrl}/auth/reset-password`;

      console.log('Password reset redirect URL:', finalRedirectUrl);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: finalRedirectUrl
      });

      return { error };
    } catch (error) {
      console.error('Password reset error:', error);
      const authError = new Error('Password reset failed') as AuthError;
      authError.name = 'AuthError';
      authError.status = 500;
      return { error: authError };
    }
  }, [supabase, rateLimiter]);

  // Update user profile
  const updateProfile = useCallback(async (updates: { [key: string]: any }) => {
    if (!supabase || !user) {
      const error = new Error('User not authenticated') as AuthError;
      error.name = 'AuthError';
      error.status = 401;
      return { error };
    }

    try {
      const { error } = await supabase.auth.updateUser(updates);
      return { error };
    } catch (error) {
      console.error('Profile update error:', error);
      const authError = new Error('Profile update failed') as AuthError;
      authError.name = 'AuthError';
      authError.status = 500;
      return { error: authError };
    }
  }, [supabase, user]);

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
    refreshSession: refreshSessionIfNeeded
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
    refreshSessionIfNeeded
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
