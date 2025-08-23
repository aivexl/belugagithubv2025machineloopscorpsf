/**
 * NextAuth.js Session Provider
 * Enterprise-Grade Session Management
 * 
 * Replaces custom AuthProvider with NextAuth SessionProvider
 * Maintains compatibility with existing components
 */

'use client'

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"
import { ReactNode } from "react"

interface SessionProviderProps {
  children: ReactNode
}

export function SessionProvider({ children }: SessionProviderProps) {
  return (
    <NextAuthSessionProvider
      // Enable refetch on window focus for better security
      refetchOnWindowFocus={true}
      // Refetch interval for session validation
      refetchInterval={5 * 60} // 5 minutes
      // Enable refetch when online
      refetchWhenOffline={false}
    >
      {children}
    </NextAuthSessionProvider>
  )
}
