"use client";
import { useEffect, useState, useCallback, useMemo } from 'react';
import type { User, Session, AuthError, AuthChangeEvent } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';
import { AuthContext } from './AuthContext';

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

// ENTERPRISE FIX: Singleton Supabase client to prevent multiple instances
let globalSupabaseClient: any = null;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState<Map<string, { count: number; lockoutUntil: number }>>(new Map());
  const [isEnterpriseFallbackActive, setIsEnterpriseFallbackActive] = useState(false);

  // Initialize rate limiter
  const rateLimiter = useMemo(() => new RateLimiter(), []);

  // ENTERPRISE FIX: Singleton Supabase client with fallback
  const supabase = useMemo(() => {
    // CRITICAL: Prevent multiple client instances
    if (globalSupabaseClient) {
      console.log('✅ Reusing existing Supabase client instance');
      return globalSupabaseClient;
    }

    // CRITICAL: Check for production environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('🚨 CRITICAL: Supabase environment variables not configured');
      console.error('Production environment variables missing:', {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseAnonKey,
        nodeEnv: process.env.NODE_ENV,
        isProduction: process.env.NODE_ENV === 'production'
      });
      
      // ENTERPRISE FALLBACK: Use hardcoded production values as emergency backup
      const emergencyUrl = 'https://pedasqlddhrqvbwdlzge.supabase.co';
      const emergencyKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlZGFzcWxkZGhycXZid2RsemdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNjE3ODIsImV4cCI6MjA2ODYzNzc4Mn0.G2zTfu-4vVO7R86rU8KJ2xKrjGOCLus2Clm0ZobZYBM';
      
      console.log('🚨 EMERGENCY: Using hardcoded production Supabase credentials');
      setIsEnterpriseFallbackActive(true);
      
      globalSupabaseClient = createBrowserClient(emergencyUrl, emergencyKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
          flowType: 'pkce',
          storage: {
            // ENTERPRISE FIX: Enhanced session storage configuration
            getItem: (key: string) => {
              try {
                // Try localStorage first, then sessionStorage, then cookies
                const localStorageValue = localStorage.getItem(key);
                if (localStorageValue) return localStorageValue;
                
                const sessionStorageValue = sessionStorage.getItem(key);
                if (sessionStorageValue) return sessionStorageValue;
                
                // Fallback to cookie parsing
                const cookies = document.cookie.split(';');
                for (const cookie of cookies) {
                  const [cookieKey, cookieValue] = cookie.trim().split('=');
                  if (cookieKey === key) return decodeURIComponent(cookieValue);
                }
                
                return null;
              } catch (error) {
                console.warn('Storage getItem error:', error);
                return null;
              }
            },
            setItem: (key: string, value: string) => {
              try {
                // Store in multiple locations for redundancy
                localStorage.setItem(key, value);
                sessionStorage.setItem(key, value);
                
                // Also store in cookies as backup
                const cookieValue = `${key}=${encodeURIComponent(value)}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
                document.cookie = cookieValue;
              } catch (error) {
                console.warn('Storage setItem error:', error);
              }
            },
            removeItem: (key: string) => {
              try {
                localStorage.removeItem(key);
                sessionStorage.removeItem(key);
                
                // Remove from cookies
                document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
              } catch (error) {
                console.warn('Storage removeItem error:', error);
              }
            }
          },
          // ENTERPRISE FIX: Enhanced session configuration
          storageKey: 'beluga-enterprise-auth',
          debug: process.env.NODE_ENV === 'development'
        },
        global: {
          headers: {
            'X-Client-Info': 'beluga-enterprise-emergency-fallback'
          }
        }
      });

      return globalSupabaseClient;
    }

    try {
      const client = createBrowserClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
          flowType: 'pkce',
          storage: {
            // ENTERPRISE FIX: Enhanced session storage configuration
            getItem: (key: string) => {
              try {
                // Try localStorage first, then sessionStorage, then cookies
                const localStorageValue = localStorage.getItem(key);
                if (localStorageValue) return localStorageValue;
                
                const sessionStorageValue = sessionStorage.getItem(key);
                if (sessionStorageValue) return sessionStorageValue;
                
                // Fallback to cookie parsing
                const cookies = document.cookie.split(';');
                for (const cookie of cookies) {
                  const [cookieKey, cookieValue] = cookie.trim().split('=');
                  if (cookieKey === key) return decodeURIComponent(cookieValue);
                }
                
                return null;
              } catch (error) {
                console.warn('Storage getItem error:', error);
                return null;
              }
            },
            setItem: (key: string, value: string) => {
              try {
                // Store in multiple locations for redundancy
                localStorage.setItem(key, value);
                sessionStorage.setItem(key, value);
                
                // Also store in cookies as backup
                const cookieValue = `${key}=${encodeURIComponent(value)}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
                document.cookie = cookieValue;
              } catch (error) {
                console.warn('Storage setItem error:', error);
              }
            },
            removeItem: (key: string) => {
              try {
                localStorage.removeItem(key);
                sessionStorage.removeItem(key);
                
                // Remove from cookies
                document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
              } catch (error) {
                console.warn('Storage removeItem error:', error);
              }
            }
          },
          // ENTERPRISE FIX: Enhanced session configuration
          storageKey: 'beluga-enterprise-auth',
          debug: process.env.NODE_ENV === 'development'
        },
        global: {
          headers: {
            'X-Client-Info': 'beluga-web-app'
          }
        }
      });

      console.log('✅ Enterprise Supabase client initialized successfully');
      globalSupabaseClient = client;
      return client;
    } catch (error) {
      console.error('💥 Failed to create Supabase client:', error);
      
      // ENTERPRISE FALLBACK: Emergency backup client
      const emergencyUrl = 'https://pedasqlddhrqvbwdlzge.supabase.co';
      const emergencyKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlZGFzcWxkZGhycXZid2RsemdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNjE3ODIsImV4cCI6MjA2ODYzNzc4Mn0.G2zTfu-4vVO7R86rU8KJ2xKrjGOCLus2Clm0ZobZYBM';
      
      console.log('🚨 EMERGENCY: Using emergency fallback Supabase client');
      setIsEnterpriseFallbackActive(true);
      
      globalSupabaseClient = createBrowserClient(emergencyUrl, emergencyKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
          flowType: 'pkce',
          storage: {
            // ENTERPRISE FIX: Enhanced session storage configuration
            getItem: (key: string) => {
              try {
                // Try localStorage first, then sessionStorage, then cookies
                const localStorageValue = localStorage.getItem(key);
                if (localStorageValue) return localStorageValue;
                
                const sessionStorageValue = sessionStorage.getItem(key);
                if (sessionStorageValue) return sessionStorageValue;
                
                // Fallback to cookie parsing
                const cookies = document.cookie.split(';');
                for (const cookie of cookies) {
                  const [cookieKey, cookieValue] = cookie.trim().split('=');
                  if (cookieKey === key) return decodeURIComponent(cookieValue);
                }
                
                return null;
              } catch (error) {
                console.warn('Storage getItem error:', error);
                return null;
              }
            },
            setItem: (key: string, value: string) => {
              try {
                // Store in multiple locations for redundancy
                localStorage.setItem(key, value);
                sessionStorage.setItem(key, value);
                
                // Also store in cookies as backup
                const cookieValue = `${key}=${encodeURIComponent(value)}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
                document.cookie = cookieValue;
              } catch (error) {
                console.warn('Storage setItem error:', error);
              }
            },
            removeItem: (key: string) => {
              try {
                localStorage.removeItem(key);
                sessionStorage.removeItem(key);
                
                // Remove from cookies
                document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
              } catch (error) {
                console.warn('Storage removeItem error:', error);
              }
            }
          },
          // ENTERPRISE FIX: Enhanced session configuration
          storageKey: 'beluga-enterprise-auth',
          debug: process.env.NODE_ENV === 'development'
        },
        global: {
          headers: {
            'X-Client-Info': 'beluga-enterprise-emergency-fallback'
          }
        }
      });

      return globalSupabaseClient;
    }
  }, []);

  // Enhanced session management with automatic refresh
  const refreshSessionIfNeeded = useCallback(async () => {
    if (!supabase || !session) return;

    try {
      const expiresAt = session.expires_at;
      const now = Math.floor(Date.now() / 1000); // Convert to seconds
      
      // Check if session needs refresh (5 minutes buffer)
      if (expiresAt && now > expiresAt - 300) {
        console.log('🔄 Enterprise: Proactively refreshing session before expiry');
        
        const { data, error } = await supabase.auth.refreshSession();
        if (error) {
          console.warn('Session refresh failed:', error);
          // Don't clear session immediately, let it expire naturally
          return;
        }
        
        if (data.session) {
          setSession(data.session);
          setUser(data.session.user);
          setIsAuthenticated(true);
          console.log('✅ Enterprise: Session refreshed successfully');
          
          // Update storage to ensure persistence
          try {
            const storageKey = 'beluga-enterprise-auth';
            const sessionData = JSON.stringify(data.session);
            localStorage.setItem(`${storageKey}.session`, sessionData);
            sessionStorage.setItem(`${storageKey}.session`, sessionData);
          } catch (storageError) {
            console.warn('Failed to update session storage:', storageError);
          }
        }
      }
    } catch (error) {
      console.warn('Session refresh failed:', error);
      // Don't throw error, just log it
    }
  }, [supabase, session]);

  // ENTERPRISE FIX: Enhanced session validation and recovery
  const validateAndRecoverSession = useCallback(async () => {
    if (!supabase) return;

    try {
      console.log('🔍 Enterprise: Validating and recovering session...');
      
      // Get current session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.warn('Session validation error:', error);
        return;
      }

      if (session) {
        // Check if session is still valid
        const expiresAt = session.expires_at;
        const now = Date.now();
        
        if (expiresAt && now < (expiresAt * 1000)) {
          // Session is valid, update state
          setSession(session);
          setUser(session.user);
          setIsAuthenticated(true);
          console.log('✅ Enterprise: Valid session recovered');
        } else {
          // Session expired, try to refresh
          console.log('🔄 Enterprise: Session expired, attempting refresh...');
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
          
          if (refreshError) {
            console.warn('Session refresh failed:', refreshError);
            // Clear invalid session
            setSession(null);
            setUser(null);
            setIsAuthenticated(false);
          } else if (refreshData.session) {
            setSession(refreshData.session);
            setUser(refreshData.session.user);
            setIsAuthenticated(true);
            console.log('✅ Enterprise: Session refreshed and recovered');
          }
        }
      } else {
        console.log('ℹ️ Enterprise: No active session found');
        setSession(null);
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Session validation and recovery error:', error);
    }
  }, [supabase]);

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
          console.log('✅ Enterprise: User signed in successfully');
          break;
        case 'SIGNED_OUT':
          // Clear all auth state
          setUser(null);
          setSession(null);
          setIsAuthenticated(false);
          console.log('ℹ️ Enterprise: User signed out');
          break;
        case 'TOKEN_REFRESHED':
          // Update session with refreshed token
          if (session) {
            setSession(session);
            setUser(session.user);
            console.log('✅ Enterprise: Token refreshed successfully');
          }
          break;
        case 'USER_UPDATED':
          // Handle user profile updates
          if (session?.user) {
            setUser(session.user);
            console.log('✅ Enterprise: User profile updated');
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

  // Initialize authentication with enterprise fallback
  useEffect(() => {
    let mounted = true;
    let sessionCheckTimeout: NodeJS.Timeout;

    const initializeAuth = async () => {
      try {
        if (!supabase) {
          console.error('No authentication service available');
          setAuthError('Authentication service not available');
          setLoading(false);
          return;
        }

        // ENTERPRISE FIX: Progressive session recovery with rate limiting protection
        console.log('🔍 Enterprise: Starting session recovery...');

        // First, try to get existing session without making new requests
        const { data: { session }, error } = await supabase.auth.getSession();

        if (mounted) {
          if (error) {
            console.warn('Initial session fetch error:', error);
            // Don't set error immediately, try session recovery first
          }

          if (session) {
            console.log('✅ Enterprise: Active session found, validating...');
            
            // Validate session expiry
            const expiresAt = session.expires_at;
            const now = Math.floor(Date.now() / 1000); // Convert to seconds
            
            if (expiresAt && now < expiresAt - 300) { // 5 minutes buffer
              // Session is valid
              setSession(session);
              setUser(session.user);
              setIsAuthenticated(true);
              setAuthError(null);
              console.log('✅ Enterprise: Valid session restored successfully');
            } else {
              // Session expired or about to expire, try refresh
              console.log('🔄 Enterprise: Session expired, attempting refresh...');
              
              try {
                const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
                
                if (!refreshError && refreshData.session) {
                  setSession(refreshData.session);
                  setUser(refreshData.session.user);
                  setIsAuthenticated(true);
                  setAuthError(null);
                  console.log('✅ Enterprise: Session refreshed successfully');
                } else {
                  console.warn('Session refresh failed:', refreshError);
                  // Clear expired session
                  setSession(null);
                  setUser(null);
                  setIsAuthenticated(false);
                  setAuthError(null); // Don't show error for expired sessions
                }
              } catch (refreshErr) {
                console.warn('Session refresh error:', refreshErr);
                setSession(null);
                setUser(null);
                setIsAuthenticated(false);
                setAuthError(null);
              }
            }
          } else {
            console.log('ℹ️ Enterprise: No active session found');
            setSession(null);
            setUser(null);
            setIsAuthenticated(false);
            setAuthError(null);
          }

          // Set up auth state change listener ONCE
          const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);
          
          // Return cleanup function
          return () => {
            if (subscription) {
              subscription.unsubscribe();
            }
            if (sessionCheckTimeout) {
              clearTimeout(sessionCheckTimeout);
            }
          };
        }
      } catch (error) {
        console.error('Initial auth setup error:', error);
        if (mounted) {
          // Only set error for actual system failures, not auth failures
          if (error.message?.includes('network') || error.message?.includes('fetch')) {
            setAuthError('Network connection issue');
          } else {
            setAuthError(null); // Don't show auth errors to users
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // ENTERPRISE FIX: Debounced initialization to prevent multiple rapid calls
    sessionCheckTimeout = setTimeout(() => {
      initializeAuth();
    }, 100); // Small delay to prevent race conditions

    // Set up periodic session validation (every 5 minutes)
    const sessionValidationInterval = setInterval(() => {
      if (session && supabase) {
        refreshSessionIfNeeded();
      }
    }, 5 * 60 * 1000); // 5 minutes

    // ENTERPRISE FIX: Handle browser events for session persistence
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && supabase) {
        // Page became visible, validate session
        console.log('🔍 Enterprise: Page visible, validating session...');
        validateAndRecoverSession();
      }
    };

    const handlePageShow = () => {
      if (supabase) {
        // Page shown (back/forward navigation), validate session
        console.log('🔍 Enterprise: Page shown, validating session...');
        validateAndRecoverSession();
      }
    };

    const handleFocus = () => {
      if (supabase) {
        // Window focused, validate session
        console.log('🔍 Enterprise: Window focused, validating session...');
        validateAndRecoverSession();
      }
    };

    // Add event listeners for session persistence
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('focus', handleFocus);

    return () => {
      mounted = false;
      if (sessionCheckTimeout) {
        clearTimeout(sessionCheckTimeout);
      }
      if (sessionValidationInterval) {
        clearInterval(sessionValidationInterval);
      }
      
      // Remove event listeners
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('focus', handleFocus);
    };
  }, [handleAuthStateChange, refreshSessionIfNeeded, supabase, session, validateAndRecoverSession]);

  // Enhanced sign in with enterprise fallback
  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) {
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
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
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

        return { error };
      }

      // Reset login attempts on success
      setLoginAttempts(prev => {
        const newMap = new Map(prev);
        if (email) {
          newMap.delete(email);
        }
        return newMap;
      });

      return { data, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: error as AuthError };
    }
  }, [supabase, loginAttempts, rateLimiter]);

  // Enhanced sign up with enterprise fallback
  const signUp = useCallback(async (email: string, password: string, fullName?: string) => {
    if (!supabase) {
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
        redirectUrl = process.env['NEXT_PUBLIC_PRODUCTION_DOMAIN'] ||
                     'https://belugagithubv2025machineloopscorpsf-gold.vercel.app';
      } else {
        // Development environment
        redirectUrl = process.env['NEXT_PUBLIC_DEVELOPMENT_DOMAIN'] ||
                     window.location.origin;
      }

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

      if (error) {
        return { error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: error as AuthError };
    }
  }, [supabase, rateLimiter]);

  // Enhanced sign out with enterprise fallback
  const signOut = useCallback(async () => {
    if (!supabase) {
      // Force clear state even if service is unavailable
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.warn('Sign out API call failed:', error);
        // Force clear state even if API call fails
        setUser(null);
        setSession(null);
        setIsAuthenticated(false);
      } else {
        // Clear all auth state
        setUser(null);
        setSession(null);
        setIsAuthenticated(false);
        setAuthError(null);
      }
    } catch (error) {
      console.error('Sign out error:', error);
      // Force clear state even if API call fails
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
    }
  }, [supabase]);

  // Enhanced Google sign in with enterprise fallback
  const signInWithGoogle = useCallback(async () => {
    if (!supabase) {
      return { error: { message: 'Authentication service not available' } as AuthError };
    }

    try {
      // ENHANCED FIX: Dynamic domain detection for Google OAuth
      let redirectUrl;

      if (process.env.NODE_ENV === 'production') {
        // Use environment variable if available, fallback to hardcoded production domain
        redirectUrl = process.env['NEXT_PUBLIC_PRODUCTION_DOMAIN'] ||
                     'https://belugagithubv2025machineloopscorpsf-gold.vercel.app';
      } else {
        // Development environment
        redirectUrl = process.env['NEXT_PUBLIC_DEVELOPMENT_DOMAIN'] ||
                     window.location.origin;
      }

      const finalRedirectUrl = `${redirectUrl}/auth/callback`;

      console.log('Google OAuth redirect URL:', finalRedirectUrl);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: finalRedirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('Google sign in error:', error);
      return { error: error as AuthError };
    }
  }, [supabase]);

  // Password reset with enterprise fallback
  const resetPassword = useCallback(async (email: string) => {
    if (!supabase) {
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
        redirectUrl = process.env['NEXT_PUBLIC_PRODUCTION_DOMAIN'] ||
                     'https://belugagithubv2025machineloopscorpsf-gold.vercel.app';
      } else {
        // Development environment
        redirectUrl = process.env['NEXT_PUBLIC_DEVELOPMENT_DOMAIN'] ||
                     window.location.origin;
      }

      const finalRedirectUrl = `${redirectUrl}/auth/reset-password`;

      console.log('Password reset redirect URL:', finalRedirectUrl);

      const { data, error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: finalRedirectUrl });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('Password reset error:', error);
      return { error: error as AuthError };
    }
  }, [supabase, rateLimiter]);

  // Update user profile with enterprise fallback
  const updateProfile = useCallback(async (updates: { [key: string]: any }) => {
    if (!supabase || !user) {
      return { error: { message: 'User not authenticated or service unavailable' } as AuthError };
    }

    try {
      const { data, error } = await supabase.auth.updateUser(updates);

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('Profile update error:', error);
      return { error: error as AuthError };
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
    refreshSession: refreshSessionIfNeeded,
    // Enterprise features
    isEnterpriseFallbackActive,
    enterpriseFallback: {
      currentService: isEnterpriseFallbackActive ? 'emergency-fallback' : 'primary',
      health: 'operational',
      circuitBreakers: {},
      performance: {}
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
    isEnterpriseFallbackActive
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
