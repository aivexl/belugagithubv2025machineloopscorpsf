"use client";
import { useState, useCallback } from 'react';
import LoginModal from './LoginModal';
import SignUpModal from './SignUpModal';
import PasswordResetModal from './PasswordResetModal';

export type AuthModalType = 'login' | 'signup' | 'reset-password' | null;

interface AuthModalManagerProps {
  isOpen: boolean;
  onClose: () => void;
  initialModal?: AuthModalType;
}

export default function AuthModalManager({ 
  isOpen, 
  onClose, 
  initialModal = 'login' 
}: AuthModalManagerProps) {
  const [currentModal, setCurrentModal] = useState<AuthModalType>(initialModal);

  const handleClose = useCallback(() => {
    setCurrentModal(initialModal);
    onClose();
  }, [initialModal, onClose]);

  const switchToModal = useCallback((modalType: AuthModalType) => {
    setCurrentModal(modalType);
  }, []);

  if (!isOpen) return null;

  return (
    <>
      {currentModal === 'login' && (
        <LoginModal
          isOpen={isOpen}
          onClose={handleClose}
          onSwitchToSignUp={() => switchToModal('signup')}
          onSwitchToResetPassword={() => switchToModal('reset-password')}
        />
      )}

      {currentModal === 'signup' && (
        <SignUpModal
          isOpen={isOpen}
          onClose={handleClose}
          onSwitchToLogin={() => switchToModal('login')}
        />
      )}

      {currentModal === 'reset-password' && (
        <PasswordResetModal
          isOpen={isOpen}
          onClose={handleClose}
          onSwitchToLogin={() => switchToModal('login')}
        />
      )}
    </>
  );
}
