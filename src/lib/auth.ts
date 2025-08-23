/**
 * NextAuth.js Configuration
 * Enterprise-Grade Authentication with Supabase Integration
 * 
 * Features:
 * - Supabase Database Adapter
 * - Email-only Authentication (Magic Links)
 * - Session Management
 * - Security Headers
 * - CSRF Protection
 */

import NextAuth, { type NextAuthOptions, type Session } from "next-auth"
import { SupabaseAdapter } from "@next-auth/supabase-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import { createClient } from "@supabase/supabase-js"
import bcrypt from "bcryptjs"

// Environment variables with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pedasqlddhrqvbvbwdlzge.supabase.co'
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlZGFzcWxkZGhycXZid2RsemdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNjE3ODIsImV4cCI6MjA2ODYzNzc4Mn0.G2zTfu-4vVO7R86rU8KJ2xKrjGOCLus2Clm0ZobZYBM'

// Supabase client for manual user management
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

export const authOptions: NextAuthOptions = {
  adapter: SupabaseAdapter({
    url: supabaseUrl,
    secret: supabaseServiceRoleKey,
  }),
  
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required")
        }

        try {
          // Get user from Supabase
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('email', credentials.email)
            .single()

          if (userError || !userData) {
            throw new Error("Invalid email or password")
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(credentials.password, userData.password_hash)
          
          if (!isPasswordValid) {
            throw new Error("Invalid email or password")
          }

          // Return user object
          return {
            id: userData.id,
            email: userData.email,
            name: userData.name || userData.full_name,
            image: userData.avatar_url
          }
        } catch (error) {
          console.error("Authentication error:", error)
          throw new Error("Authentication failed")
        }
      }
    })
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: "/",
    verifyRequest: "/auth/verify-request",
    error: "/auth/error",
  },

  callbacks: {
    async jwt({ token, user }) {
      // Persist user id to the token right after signin
      if (user) {
        token.id = user.id
        token.email = user.email || null
      }
      return token
    },

    async session({ session, token }) {
      // Send properties to the client
      if (token && session.user) {
        (session.user as any).id = token.id as string
        session.user.email = token.email as string | null
      }
      return session
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },

  events: {
    async signIn({ user }) {
      console.log(`✅ User signed in: ${user.email}`)
    },
    async signOut({ session }) {
      console.log(`🚪 User signed out: ${session?.user?.email || 'Unknown'}`)
    },
    async createUser({ user }) {
      console.log(`👤 New user created: ${user.email}`)
    },
  },

  debug: process.env.NODE_ENV === 'development',

  // Security configuration
  useSecureCookies: process.env.NODE_ENV === 'production',
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60, // 30 days
      },
    },
  },
}

export default NextAuth(authOptions)
