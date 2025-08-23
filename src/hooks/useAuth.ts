'use client';

import { useAuth as useAuthProvider } from '../contexts/AuthProvider';

export function useAuth() {
  return useAuthProvider();
}

// Re-export types for backward compatibility
export interface User {
  id: string;
  email: string;
  fullName?: string | null;
  avatarUrl?: string | null;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
  message?: string;
  requiresConfirmation?: boolean;
}