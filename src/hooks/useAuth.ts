/**
 * NextAuth.js Authentication Hook
 * Enterprise-Grade Authentication Interface
 * 
 * Provides a unified interface that maintains compatibility
 * with existing components while using NextAuth.js internally
 */

'use client'

import { useSession, signIn, signOut } from "next-auth/react"
import { useCallback } from "react"

// Backward compatibility types
export interface User {
  id: string
  email: string
  fullName?: string | null
  avatarUrl?: string | null
}

export interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export interface AuthResult {
  success: boolean
  error?: string
  user?: User
  message?: string
  requiresConfirmation?: boolean
}

export function useAuth() {
  const { data: session, status } = useSession()
  
  const loading = status === "loading"
  const authenticated = status === "authenticated"
  
  // Transform NextAuth session to our User interface
  const user: User | null = authenticated && session?.user ? {
    id: (session.user as any).id || "",
    email: session.user.email || "",
    fullName: session.user.name || null,
    avatarUrl: session.user.image || null,
  } : null

  // Sign in with email and password
  const handleSignIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        return {
          success: false,
          error: result.error === 'CredentialsSignin' 
            ? 'Invalid email or password. Please try again.' 
            : 'Sign in failed. Please try again.',
        }
      }

      if (result?.ok) {
        return {
          success: true,
          message: 'Signed in successfully!',
        }
      }

      return {
        success: false,
        error: 'Sign in failed. Please try again.',
      }
    } catch (error) {
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      }
    }
  }, [])

  // Sign up with email and password
  const handleSignUp = useCallback(async (email: string, password: string, fullName?: string): Promise<AuthResult> => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, fullName }),
      })

      const data = await response.json()

      if (!data.success) {
        return {
          success: false,
          error: data.error || 'Sign up failed',
        }
      }

      return {
        success: true,
        message: data.message || 'Account created successfully!',
        user: data.user,
      }
    } catch (error) {
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      }
    }
  }, [])

  // Sign out
  const handleSignOut = useCallback(async (): Promise<void> => {
    await signOut({ redirect: false })
  }, [])

  // Check auth status (for compatibility)
  const checkAuth = useCallback(async () => {
    // NextAuth handles this automatically
    return Promise.resolve()
  }, [])

  return {
    // State
    user,
    loading,
    error: null, // NextAuth handles errors differently
    
    // Methods (maintaining backward compatibility)
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    checkAuth,
    
    // Additional NextAuth specific data
    session,
    status,
  }
}