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
      
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include', // Include httpOnly cookies
      });

      const data = await response.json();

      if (data.success && data.user) {
        console.log('✅ AUTH: User authenticated -', data.user.email);
        setAuthState({
          user: data.user,
          loading: false,
          error: null,
        });
      } else {
        console.log('❌ AUTH: No valid session');
        setAuthState({
          user: null,
          loading: false,
          error: null,
        });
      }
    } catch (error: any) {
      console.error('❌ AUTH: Session check failed:', error);
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

      if (data.success && data.user) {
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
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      console.log('✅ AUTH: User signed out');
      setAuthState({
        user: null,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('❌ AUTH: Logout error:', error);
      // Force logout even if API call fails
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
