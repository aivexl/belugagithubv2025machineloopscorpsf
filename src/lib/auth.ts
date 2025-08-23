// =============================================================================
// ENTERPRISE AUTHENTICATION SYSTEM - SIMPLE & SECURE
// Fortune 500 & $100B Unicorn Ready - Zero Complexity, Maximum Reliability
// =============================================================================

'use client';

import { createClient } from '@supabase/supabase-js';
import type { 
  SupabaseClient, 
  User, 
  Session,
  AuthError,
  AuthResponse 
} from '@supabase/supabase-js';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
  session?: Session;
}

// =============================================================================
// ENTERPRISE AUTH CLIENT - SINGLETON PATTERN
// =============================================================================

class EnterpriseAuth {
  private static instance: EnterpriseAuth;
  private client: SupabaseClient | null = null;
  private listeners: Set<(state: AuthState) => void> = new Set();
  private currentState: AuthState = {
    user: null,
    session: null,
    loading: true,
    error: null,
  };

  private constructor() {
    this.initializeClient();
    this.setupAuthListener();
  }

  static getInstance(): EnterpriseAuth {
    if (!EnterpriseAuth.instance) {
      EnterpriseAuth.instance = new EnterpriseAuth();
    }
    return EnterpriseAuth.instance;
  }

  // ==========================================================================
  // CLIENT INITIALIZATION
  // ==========================================================================

  private initializeClient(): void {
    try {
      // Only initialize in browser
      if (typeof window === 'undefined') {
        console.log('🔒 AUTH: Server-side, skipping client init');
        return;
      }

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase environment variables');
      }

      this.client = createClient(supabaseUrl, supabaseKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
          flowType: 'pkce',
        },
      });

      console.log('✅ AUTH: Client initialized successfully');
    } catch (error) {
      console.error('❌ AUTH: Initialization failed:', error);
      this.updateState({ 
        loading: false, 
        error: 'Authentication system initialization failed' 
      });
    }
  }

  // ==========================================================================
  // AUTH STATE LISTENER
  // ==========================================================================

  private setupAuthListener(): void {
    if (!this.client) return;

    this.client.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 AUTH: State change -', event, session?.user?.email || 'no user');

      switch (event) {
        case 'SIGNED_IN':
          this.updateState({
            user: session?.user || null,
            session,
            loading: false,
            error: null,
          });
          break;

        case 'SIGNED_OUT':
          this.updateState({
            user: null,
            session: null,
            loading: false,
            error: null,
          });
          break;

        case 'TOKEN_REFRESHED':
          this.updateState({
            user: session?.user || null,
            session,
            loading: false,
            error: null,
          });
          break;

        case 'USER_UPDATED':
          this.updateState({
            user: session?.user || null,
            session,
            loading: false,
            error: null,
          });
          break;

        default:
          // Initial session check
          this.updateState({
            user: session?.user || null,
            session,
            loading: false,
            error: null,
          });
      }
    });
  }

  // ==========================================================================
  // STATE MANAGEMENT
  // ==========================================================================

  private updateState(updates: Partial<AuthState>): void {
    this.currentState = { ...this.currentState, ...updates };
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.currentState);
      } catch (error) {
        console.error('❌ AUTH: Listener error:', error);
      }
    });
  }

  // ==========================================================================
  // PUBLIC API
  // ==========================================================================

  // Subscribe to auth state changes
  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.add(listener);
    
    // Immediately call with current state
    listener(this.currentState);
    
    // Return unsubscribe function
    return () => this.listeners.delete(listener);
  }

  // Get current state
  getState(): AuthState {
    return { ...this.currentState };
  }

  // Check if client is ready
  isReady(): boolean {
    return this.client !== null;
  }

  // ==========================================================================
  // AUTHENTICATION METHODS
  // ==========================================================================

  async signIn(email: string, password: string): Promise<AuthResult> {
    if (!this.client) {
      return { success: false, error: 'Authentication not initialized' };
    }

    try {
      this.updateState({ loading: true, error: null });

      const { data, error } = await this.client.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        this.updateState({ loading: false, error: error.message });
        return { success: false, error: error.message };
      }

      // State will be updated by auth listener
      return { 
        success: true, 
        user: data.user, 
        session: data.session 
      };

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign in failed';
      this.updateState({ loading: false, error: message });
      return { success: false, error: message };
    }
  }

  async signUp(email: string, password: string, fullName?: string): Promise<AuthResult> {
    if (!this.client) {
      return { success: false, error: 'Authentication not initialized' };
    }

    try {
      this.updateState({ loading: true, error: null });

      const { data, error } = await this.client.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: fullName?.trim() || '',
          },
        },
      });

      if (error) {
        this.updateState({ loading: false, error: error.message });
        return { success: false, error: error.message };
      }

      // Check if email confirmation is required
      if (data.user && !data.session) {
        this.updateState({ loading: false, error: null });
        return { 
          success: true, 
          error: 'Please check your email for confirmation link',
          user: data.user 
        };
      }

      // State will be updated by auth listener
      return { 
        success: true, 
        user: data.user, 
        session: data.session 
      };

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign up failed';
      this.updateState({ loading: false, error: message });
      return { success: false, error: message };
    }
  }

  async signInWithGoogle(): Promise<AuthResult> {
    if (!this.client) {
      return { success: false, error: 'Authentication not initialized' };
    }

    try {
      this.updateState({ loading: true, error: null });

      const { data, error } = await this.client.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        this.updateState({ loading: false, error: error.message });
        return { success: false, error: error.message };
      }

      // OAuth redirect will handle the rest
      return { success: true };

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Google sign in failed';
      this.updateState({ loading: false, error: message });
      return { success: false, error: message };
    }
  }

  async signOut(): Promise<void> {
    if (!this.client) return;

    try {
      await this.client.auth.signOut();
      // State will be updated by auth listener
    } catch (error) {
      console.error('❌ AUTH: Sign out error:', error);
      // Force state update even if signOut fails
      this.updateState({
        user: null,
        session: null,
        loading: false,
        error: null,
      });
    }
  }

  async resetPassword(email: string): Promise<AuthResult> {
    if (!this.client) {
      return { success: false, error: 'Authentication not initialized' };
    }

    try {
      const { error } = await this.client.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        }
      );

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Password reset failed';
      return { success: false, error: message };
    }
  }

  async updateProfile(updates: { full_name?: string; avatar_url?: string }): Promise<AuthResult> {
    if (!this.client) {
      return { success: false, error: 'Authentication not initialized' };
    }

    if (!this.currentState.user) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const { data, error } = await this.client.auth.updateUser({
        data: updates,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, user: data.user };

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Profile update failed';
      return { success: false, error: message };
    }
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export const auth = EnterpriseAuth.getInstance();
export default auth;
