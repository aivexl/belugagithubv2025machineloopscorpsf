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
    // Don't initialize immediately - wait for browser context
    if (typeof window !== 'undefined') {
      this.initializeClient();
      this.setupAuthListener();
    }
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

      console.log('🔧 AUTH: Starting client initialization...');
      console.log('🔧 AUTH: Environment check:', {
        hasWindow: typeof window !== 'undefined',
        hasProcess: typeof process !== 'undefined',
        hasEnv: !!process.env,
        nodeEnv: process.env.NODE_ENV,
      });

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      console.log('🔧 AUTH: Supabase config:', {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey,
        urlLength: supabaseUrl?.length || 0,
        keyLength: supabaseKey?.length || 0,
        urlStart: supabaseUrl?.substring(0, 20) + '...',
        keyStart: supabaseKey?.substring(0, 20) + '...',
      });

      if (!supabaseUrl || !supabaseKey) {
        console.error('❌ AUTH: Missing environment variables');
        console.error('❌ AUTH: NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl);
        console.error('❌ AUTH: NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey);
        throw new Error('Missing Supabase environment variables');
      }

      // Validate URL format
      try {
        new URL(supabaseUrl);
        console.log('✅ AUTH: URL format validated');
      } catch (urlError) {
        console.error('❌ AUTH: Invalid URL format:', supabaseUrl);
        throw new Error('Invalid Supabase URL format');
      }

      // Validate key format (should be a JWT-like string)
      if (supabaseKey.length < 50) {
        console.error('❌ AUTH: Key too short:', supabaseKey.length);
        throw new Error('Invalid Supabase key format');
      }

      console.log('🔧 AUTH: Creating Supabase client...');
      
      this.client = createClient(supabaseUrl, supabaseKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
          flowType: 'pkce',
        },
      });

      console.log('✅ AUTH: Client initialized successfully');
      console.log('🔧 AUTH: Client type:', typeof this.client);
      console.log('🔧 AUTH: Client auth:', typeof this.client.auth);
      
      // Test the client immediately
      this.testClientConnection();
      
    } catch (error) {
      console.error('❌ AUTH: Initialization failed:', error);
      console.error('❌ AUTH: Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
      
      this.updateState({ 
        loading: false, 
        error: `Authentication system initialization failed: ${error.message}` 
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

  // Get detailed status for debugging
  getStatus(): {
    hasWindow: boolean;
    hasClient: boolean;
    hasEnv: boolean;
    hasUrl: boolean;
    hasKey: boolean;
    isReady: boolean;
    error: string | null;
  } {
    return {
      hasWindow: typeof window !== 'undefined',
      hasClient: this.client !== null,
      hasEnv: typeof process !== 'undefined' && !!process.env,
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      isReady: this.isReady(),
      error: this.currentState.error,
    };
  }

  // Force reinitialization (useful for debugging)
  forceReinitialize(): void {
    console.log('🔄 AUTH: Force reinitialization requested');
    this.client = null;
    this.ensureInitialized();
  }

  // Ensure client is initialized (call this before any auth operations)
  private ensureInitialized(): void {
    console.log('🔧 AUTH: ensureInitialized called', {
      hasWindow: typeof window !== 'undefined',
      hasClient: !!this.client,
      isReady: this.isReady(),
    });
    
    if (typeof window === 'undefined') {
      console.log('🔒 AUTH: Server-side, cannot initialize');
      return;
    }
    
    if (!this.client) {
      console.log('🔄 AUTH: Lazy initializing client...');
      this.initializeClient();
      this.setupAuthListener();
    } else {
      console.log('✅ AUTH: Client already initialized');
    }
  }

  // Public method to manually trigger initialization (for testing)
  public initialize(): void {
    console.log('🔧 AUTH: Manual initialization requested');
    this.ensureInitialized();
  }

  // Test client connection after initialization
  private async testClientConnection(): Promise<void> {
    if (!this.client) {
      console.log('🔧 AUTH: No client to test');
      return;
    }

    try {
      console.log('🧪 AUTH: Testing client connection...');
      const { data, error } = await this.client.auth.getSession();
      
      if (error) {
        console.warn('⚠️ AUTH: Client test failed:', error.message);
      } else {
        console.log('✅ AUTH: Client connection test successful');
        console.log('🧪 AUTH: Session data:', {
          hasSession: !!data.session,
          hasUser: !!data.user,
          userEmail: data.user?.email || 'no user',
        });
      }
    } catch (testError) {
      console.error('❌ AUTH: Client test error:', testError);
    }
  }

  // ==========================================================================
  // AUTHENTICATION METHODS
  // ==========================================================================

  async signIn(email: string, password: string): Promise<AuthResult> {
    this.ensureInitialized();
    
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
    this.ensureInitialized();
    
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
    this.ensureInitialized();
    
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
    this.ensureInitialized();
    
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
    this.ensureInitialized();
    
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
    this.ensureInitialized();
    
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
