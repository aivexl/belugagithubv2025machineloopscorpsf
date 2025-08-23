/**
 * Supabase Client-side Configuration
 * Official SSR Pattern Implementation
 */

import { createBrowserClient } from "@supabase/ssr"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://sqjqirkrcfczypxygdtm.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxanFpcmtyY2ZjenlweHlnZHRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5NzE5MDAsImV4cCI6MjA3MTU0NzkwMH0.7Tnurb-zS8n_KeuE_K2rA_RlLSVsk2E4S3YiTf9MfhI'

export const createClient = () =>
  createBrowserClient(
    supabaseUrl,
    supabaseKey,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    }
  )
