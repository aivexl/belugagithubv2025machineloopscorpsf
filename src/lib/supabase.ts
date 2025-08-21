import { createClient } from '@supabase/supabase-js';

// ENTERPRISE-LEVEL SUPABASE CLIENT CONFIGURATION
// Edge Runtime Compatible - No Node.js APIs

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// ENTERPRISE-LEVEL: Create Supabase client with optimized configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // ENTERPRISE-LEVEL: Optimized auth settings
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
  realtime: {
    // ENTERPRISE-LEVEL: Disable realtime for Edge Runtime compatibility
    params: {
      eventsPerSecond: 10,
    },
  },
  global: {
    // ENTERPRISE-LEVEL: Global headers for better tracking
    headers: {
      'X-Client-Info': 'beluga-crypto-app/1.0',
    },
  },
});

// ENTERPRISE-LEVEL: Server-side client for SSR
export const createServerClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });
};

// ENTERPRISE-LEVEL: Edge Runtime compatible client
export const createEdgeClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    realtime: {
      params: {
        eventsPerSecond: 0, // Disable realtime for Edge
      },
    },
  });
};
