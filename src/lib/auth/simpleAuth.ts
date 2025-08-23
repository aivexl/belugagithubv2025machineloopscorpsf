// =============================================================================
// ENTERPRISE SIMPLE AUTHENTICATION CLIENT
// Robust, Zero-Error Supabase Client for Production
// =============================================================================

'use client';

import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

// Singleton pattern for stable client instance
class SimpleAuthClient {
  private static instance: SimpleAuthClient;
  private client: SupabaseClient | null = null;
  private initialized: boolean = false;

  private constructor() {
    this.initializeClient();
  }

  static getInstance(): SimpleAuthClient {
    if (!SimpleAuthClient.instance) {
      SimpleAuthClient.instance = new SimpleAuthClient();
    }
    return SimpleAuthClient.instance;
  }

  private initializeClient(): void {
    try {
      // Only initialize in browser environment
      if (typeof window === 'undefined') {
        console.log('🔧 SIMPLE AUTH: Skipping server-side initialization');
        return;
      }

      // Get environment variables from window (Vercel injects these)
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      console.log('🔧 SIMPLE AUTH: Environment check', {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey,
        urlLength: supabaseUrl?.length || 0,
        keyLength: supabaseKey?.length || 0
      });

      if (!supabaseUrl || !supabaseKey) {
        console.error('❌ SIMPLE AUTH: Missing environment variables');
        return;
      }

      // Create simple Supabase client with minimal configuration
      this.client = createClient(supabaseUrl, supabaseKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
          flowType: 'pkce'
        }
      });

      this.initialized = true;
      console.log('✅ SIMPLE AUTH: Client initialized successfully');

    } catch (error) {
      console.error('❌ SIMPLE AUTH: Initialization failed:', error);
      this.client = null;
      this.initialized = false;
    }
  }

  // Public method to get client with on-demand initialization
  getClient(): SupabaseClient | null {
    // Reinitialize if not available
    if (!this.client && typeof window !== 'undefined') {
      console.log('🔄 SIMPLE AUTH: Reinitializing client...');
      this.initializeClient();
    }

    if (!this.client) {
      console.error('❌ SIMPLE AUTH: Client unavailable');
      return null;
    }

    return this.client;
  }

  isReady(): boolean {
    return this.initialized && this.client !== null;
  }

  // Test connection
  async testConnection(): Promise<boolean> {
    const client = this.getClient();
    if (!client) return false;

    try {
      const { data, error } = await client.auth.getSession();
      console.log('🧪 SIMPLE AUTH: Connection test', { hasData: !!data, error: error?.message });
      return !error;
    } catch (error) {
      console.error('❌ SIMPLE AUTH: Connection test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const simpleAuthClient = SimpleAuthClient.getInstance();
export default simpleAuthClient;
