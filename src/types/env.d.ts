// ENTERPRISE-LEVEL: Environment Variable Type Definitions
// Ensures type safety for all environment variables

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Supabase Configuration
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
      SUPABASE_SERVICE_ROLE_KEY?: string;
      
      // CoinGecko API
      COINGECKO_API_KEY?: string;
      NEXT_PUBLIC_COINGECKO_API_KEY?: string;
      
      // Sanity CMS
      NEXT_PUBLIC_SANITY_PROJECT_ID: string;
      NEXT_PUBLIC_SANITY_DATASET: string;
      SANITY_API_TOKEN?: string;
      
      // Authentication
      NEXTAUTH_SECRET?: string;
      NEXTAUTH_URL?: string;
      
      // Database
      DATABASE_URL?: string;
      
      // External APIs
      MORALIS_API_KEY?: string;
      
      // App Configuration
      NEXT_PUBLIC_APP_ENV: 'development' | 'staging' | 'production';
      NEXT_PUBLIC_APP_URL: string;
      
      // Analytics
      NEXT_PUBLIC_GA_ID?: string;
      NEXT_PUBLIC_GTM_ID?: string;
      
      // Feature Flags
      NEXT_PUBLIC_ENABLE_ANALYTICS?: string;
      NEXT_PUBLIC_ENABLE_FEATURES?: string;
      
      // Custom
      CUSTOM_KEY?: string;
    }
  }
}

// ENTERPRISE-LEVEL: Export for module augmentation
export {};
