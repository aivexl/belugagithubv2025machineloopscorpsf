'use client';

import { useAuth as useAuthProvider } from '../contexts/AuthProvider';

export function useAuth() {
  return useAuthProvider();
}

export type {
  AuthState,
  AuthResult
} from '../lib/auth';