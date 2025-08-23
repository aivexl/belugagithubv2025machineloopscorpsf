// =============================================================================
// ENTERPRISE AUTH PROVIDER - SIMPLE & SECURE
// Fortune 500 & $100B Unicorn Ready - Minimal Complexity, Maximum Reliability
// =============================================================================

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../lib/auth';
import type { AuthState, AuthResult } from '../lib/auth';
import type { User } from '@supabase/supabase-js';

// =============================================================================
// CONTEXT TYPES
// =============================================================================

interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string, fullName?: string) => Promise<AuthResult>;
  signInWithGoogle: () => Promise<AuthResult>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<AuthResult>;
  updateProfile: (updates: { full_name?: string; avatar_url?: string }) => Promise<AuthResult>;
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
    session: null,
    loading: true,
    error: null,
  });

  // Subscribe to auth state changes
  useEffect(() => {
    console.log('🔒 AuthProvider: Initializing...');

    // Only run in browser
    if (typeof window === 'undefined') {
      console.log('🔒 AuthProvider: Server-side, skipping initialization');
      return;
    }

    // Prevent multiple initializations
    let initialized = false;
    let initTimeout: NodeJS.Timeout;

    const initializeAuthOnce = () => {
      if (initialized) {
        console.log('🔒 AuthProvider: Already initialized, skipping');
        return;
      }

      console.log('🔄 AuthProvider: Single initialization attempt...');
      initialized = true;
      
      // Initialize auth client
      auth.initialize();
      
      // Wait for initialization to complete before checking status
      initTimeout = setTimeout(() => {
        const status = auth.getStatus();
        console.log('🔧 AuthProvider: Final auth status:', status);
        
        if (!status.isReady) {
          console.log('⚠️ AuthProvider: Auth still not ready after initialization');
          // Don't force reinitialize to prevent loops
        }
      }, 1000);
    };

    // Initialize once when provider mounts
    initializeAuthOnce();

    const unsubscribe = auth.subscribe((state) => {
      console.log('🔄 AuthProvider: State update -', {
        hasUser: !!state.user,
        hasSession: !!state.session,
        loading: state.loading,
        error: state.error,
      });
      setAuthState(state);
    });

    return () => {
      console.log('🔒 AuthProvider: Cleanup');
      if (initTimeout) clearTimeout(initTimeout);
      unsubscribe();
    };
  }, []);

  // Context value with all auth methods
  const contextValue: AuthContextValue = {
    ...authState,
    signIn: auth.signIn.bind(auth),
    signUp: auth.signUp.bind(auth),
    signInWithGoogle: auth.signInWithGoogle.bind(auth),
    signOut: auth.signOut.bind(auth),
    resetPassword: auth.resetPassword.bind(auth),
    updateProfile: auth.updateProfile.bind(auth),
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
