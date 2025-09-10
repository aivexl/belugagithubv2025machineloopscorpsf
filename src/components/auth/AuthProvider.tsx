/**
 * Production Supabase Auth Provider
 * Official SSR Pattern with FOUC Prevention
 */

'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, metadata?: { full_name?: string }) => Promise<{ error?: any; data?: any }>
  signIn: (email: string, password: string) => Promise<{ error?: any; data?: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error?: any; data?: any }>
  isAuthenticated: boolean
  isInitialized: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  
  const supabase = createClient()

  // FOUC Prevention: Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get existing session
        const { data: { session: existingSession }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.warn('Session check error:', error)
        }

        if (existingSession) {
          setSession(existingSession)
          setUser(existingSession.user)
          console.log('✅ Existing session restored')
        }
      } catch (error: any) {
        console.error('Auth initialization error:', error)
      } finally {
        setLoading(false)
        setIsInitialized(true)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)
      setLoading(false)
      setIsInitialized(true)

      // Handle auth events
      if (event === 'SIGNED_IN') {
        console.log('✅ User signed in')
      } else if (event === 'SIGNED_OUT') {
        console.log('✅ User signed out')
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('✅ Token refreshed')
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const signUp = useCallback(async (
    email: string, 
    password: string, 
    metadata?: { full_name?: string }
  ) => {
    try {
      setLoading(true)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata || {}
        }
      })
      
      if (error) {
        console.error('❌ Signup error:', error)
      } else {
        console.log('✅ Signup successful')
      }
      
      return { data, error }
    } catch (error: any) {
      console.error('❌ Signup failed:', error)
      return { 
        error: { 
          message: error.message || 'Signup failed' 
        } 
      }
    } finally {
      setLoading(false)
    }
  }, [supabase.auth])

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        console.error('❌ Signin error:', error)
      } else {
        console.log('✅ Signin successful')
      }
      
      return { data, error }
    } catch (error: any) {
      console.error('❌ Signin failed:', error)
      return { 
        error: { 
          message: error.message || 'Signin failed' 
        } 
      }
    } finally {
      setLoading(false)
    }
  }, [supabase.auth])

  const signOut = useCallback(async () => {
    try {
      setLoading(true)
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setLoading(false)
    }
  }, [supabase.auth])

  const resetPassword = useCallback(async (email: string) => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      return { data, error }
    } catch (error) {
      return { error }
    } finally {
      setLoading(false)
    }
  }, [supabase.auth])

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    isAuthenticated: !!user,
    isInitialized
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
