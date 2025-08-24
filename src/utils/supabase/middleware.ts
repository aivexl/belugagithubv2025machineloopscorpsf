/**
 * Supabase Middleware Configuration
 * Official SSR Pattern Implementation
 */

import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"

const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL'] || 'https://sqjqirkrcfczypxygdtm.supabase.co'
const supabaseKey = process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxanFpcmtyY2ZjenlweHlnZHRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5NzE5MDAsImV4cCI6MjA3MTU0NzkwMH0.7Tnurb-zS8n_KeuE_K2rA_RlLSVsk2E4S3YiTf9MfhI'

export const createClient = (request: NextRequest) => {
  // Validate credentials
  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase credentials missing in middleware')
    throw new Error('Supabase configuration is required')
  }

  // Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => 
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  return { supabase, response: supabaseResponse }
}
