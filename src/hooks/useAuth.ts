'use client';

import { useAuth as useAuthUnicorn } from '../contexts/AuthProviderUnicorn';

export function useAuth() {
  return useAuthUnicorn();
}

export type { 
  AuthContextType,
  AuthState,
  AuthOperationResult,
  AuthProviderConfig,
  SessionEvent
} from '../contexts/AuthProviderUnicorn';
