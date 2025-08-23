/**
 * Auth Guard Component with FOUC Prevention
 * Maintains visual consistency during auth state transitions
 */

'use client'

import { useAuth } from './AuthProvider'
import { useEffect, useState } from 'react'

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isInitialized, loading } = useAuth()
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Prevent FOUC by ensuring auth state is resolved before showing content
    if (isInitialized && !loading) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setShowContent(true)
      }, 50)
      
      return () => clearTimeout(timer)
    }
  }, [isInitialized, loading])

  // During initialization, show fallback or maintain layout
  if (!showContent) {
    return (
      <div style={{ 
        opacity: 0, 
        transition: 'opacity 150ms ease-in-out',
        minHeight: '100vh'
      }}>
        {fallback || children}
      </div>
    )
  }

  // Once initialized, show content with fade-in
  return (
    <div style={{ 
      opacity: 1, 
      transition: 'opacity 150ms ease-in-out' 
    }}>
      {children}
    </div>
  )
}

// Higher-order component for auth protection
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    fallback?: React.ReactNode
    requireAuth?: boolean
  }
) {
  return function WrappedComponent(props: P) {
    const { isAuthenticated, isInitialized } = useAuth()
    
    if (!isInitialized) {
      return options?.fallback || <div style={{ minHeight: '100vh' }} />
    }
    
    if (options?.requireAuth && !isAuthenticated) {
      return options?.fallback || <div>Please sign in to continue</div>
    }
    
    return <Component {...props} />
  }
}
