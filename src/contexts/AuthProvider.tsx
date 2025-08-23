// =============================================================================
// ENTERPRISE AUTH PROVIDER - SIMPLE & SECURE
// Fortune 500 & $100B Unicorn Ready - Minimal Complexity, Maximum Reliability
// =============================================================================

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

// =============================================================================
// TYPES
// =============================================================================

interface User {
  id: string;
  email: string;
  fullName?: string | null;
  avatarUrl?: string | null;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
  message?: string;
  requiresConfirmation?: boolean;
}

interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string, fullName?: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

// =============================================================================
// CONTEXT CREATION
// =============================================================================

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// =============================================================================
// AUTH PROVIDER COMPONENT
// =============================================================================

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  // Check authentication status on mount
  const checkAuth = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      console.log('🔍 AUTH: Checking authentication...');
      console.log('🍪 AUTH: Document cookie:', document.cookie);
      console.log('💾 AUTH: localStorage token:', localStorage.getItem('beluga-auth-token') ? 'EXISTS' : 'NOT FOUND');
      
      // Get token from localStorage as fallback
      const storedToken = localStorage.getItem('beluga-auth-token');
      const storedUser = localStorage.getItem('beluga-user-data');
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      // Add Authorization header if we have stored token
      if (storedToken) {
        headers['Authorization'] = `Bearer ${storedToken}`;
        console.log('🔑 AUTH: Using stored token for auth check');
      }
      
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include', // Include httpOnly cookies
        headers,
      });

      console.log('🔍 AUTH: Response status:', response.status);

      const data = await response.json();
      console.log('🔍 AUTH: Response data:', data);

      if (data.success && data.user) {
        console.log('✅ AUTH: User authenticated -', data.user.email);
        
        // Store user data in localStorage for persistence
        localStorage.setItem('beluga-user-data', JSON.stringify(data.user));
        
        setAuthState({
          user: data.user,
          loading: false,
          error: null,
        });
      } else {
        console.log('❌ AUTH: No valid session -', data.error || 'Unknown error');
        
        // If API fails but we have stored user data, use it temporarily
        if (storedUser && storedToken) {
          try {
            const userData = JSON.parse(storedUser);
            console.log('🔄 AUTH: Using stored user data as fallback');
            setAuthState({
              user: userData,
              loading: false,
              error: null,
            });
            return; // Exit early with stored data
          } catch (e) {
            console.log('❌ AUTH: Stored user data corrupted, clearing');
            localStorage.removeItem('beluga-user-data');
            localStorage.removeItem('beluga-auth-token');
          }
        }
        
        // Clear any stored data if auth failed
        localStorage.removeItem('beluga-user-data');
        localStorage.removeItem('beluga-auth-token');
        
        setAuthState({
          user: null,
          loading: false,
          error: null,
        });
      }
    } catch (error: any) {
      console.error('❌ AUTH: Session check failed:', error);
      
      // Try to use stored data as last resort
      const storedUser = localStorage.getItem('beluga-user-data');
      const storedToken = localStorage.getItem('beluga-auth-token');
      
      if (storedUser && storedToken) {
        try {
          const userData = JSON.parse(storedUser);
          console.log('🆘 AUTH: Network failed, using stored data');
          setAuthState({
            user: userData,
            loading: false,
            error: null,
          });
          return;
        } catch (e) {
          // Ignore parsing errors
        }
      }
      
      setAuthState({
        user: null,
        loading: false,
        error: 'Session check failed',
      });
    }
  };

  // Sign in method
  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('🔍 AUTH: Login response:', data);
      console.log('🔍 AUTH: Login response cookies:', response.headers.get('set-cookie'));

      if (data.success && data.user) {
        console.log('✅ AUTH: Login successful, storing data...');
        
        // Store token and user data in localStorage for maximum persistence
        if (data.token) {
          localStorage.setItem('beluga-auth-token', data.token);
          console.log('💾 AUTH: Token stored in localStorage');
        }
        
        if (data.sessionData) {
          localStorage.setItem('beluga-session-data', JSON.stringify(data.sessionData));
          console.log('💾 AUTH: Session data stored');
        }
        
        localStorage.setItem('beluga-user-data', JSON.stringify(data.user));
        console.log('💾 AUTH: User data stored in localStorage');
        
        // Wait a bit for cookie to be set
        setTimeout(() => {
          console.log('🍪 AUTH: Document cookie after login:', document.cookie);
          console.log('💾 AUTH: LocalStorage after login:', {
            token: localStorage.getItem('beluga-auth-token') ? 'EXISTS' : 'NOT FOUND',
            user: localStorage.getItem('beluga-user-data') ? 'EXISTS' : 'NOT FOUND',
          });
        }, 100);

        setAuthState({
          user: data.user,
          loading: false,
          error: null,
        });
        return { success: true, user: data.user };
      } else {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: data.error || 'Login failed',
        }));
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  };

  // Sign up method
  const signUp = async (email: string, password: string, fullName?: string): Promise<AuthResult> => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password, fullName }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.requiresConfirmation) {
          setAuthState(prev => ({ ...prev, loading: false }));
          return { 
            success: true, 
            message: data.message,
            requiresConfirmation: true 
          };
        } else if (data.user) {
          setAuthState({
            user: data.user,
            loading: false,
            error: null,
          });
          return { success: true, user: data.user, message: data.message };
        }
      }

      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: data.error || 'Signup failed',
      }));
      return { success: false, error: data.error || 'Signup failed' };

    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  };

  // Sign out method
  const signOut = async (): Promise<void> => {
    try {
      console.log('🚪 AUTH: Manual logout initiated');
      
      // Clear localStorage immediately
      localStorage.removeItem('beluga-auth-token');
      localStorage.removeItem('beluga-user-data');
      localStorage.removeItem('beluga-session-data');
      console.log('💾 AUTH: LocalStorage cleared');
      
      // Call logout API to clear server-side session
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      console.log('✅ AUTH: User signed out successfully');
      setAuthState({
        user: null,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('❌ AUTH: Logout API error (but localStorage cleared):', error);
      
      // Force logout even if API call fails - localStorage already cleared
      setAuthState({
        user: null,
        loading: false,
        error: null,
      });
    }
  };

  // Auto-login check on mount
  useEffect(() => {
    console.log('🔒 AUTH: Checking authentication status...');
    checkAuth();
  }, []);

  // Context value
  const contextValue: AuthContextValue = {
    ...authState,
    signIn,
    signUp,
    signOut,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// =============================================================================
// CUSTOM HOOK
// =============================================================================

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

// =============================================================================
// CONVENIENCE HOOKS
// =============================================================================

export function useUser(): User | null {
  const { user } = useAuth();
  return user;
}

export function useSession() {
  const { session } = useAuth();
  return session;
}

export function useAuthState() {
  const { user, session, loading, error } = useAuth();
  return { user, session, loading, error, isAuthenticated: !!user };
}
