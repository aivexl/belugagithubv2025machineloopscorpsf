"use client";
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function PasswordResetModal({ 
  isOpen, 
  onClose, 
  onSwitchToLogin 
}: PasswordResetModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resetAttempts, setResetAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);
  
  const { resetPassword } = useAuth();

  // Check lockout status - FIXED: Moved to useEffect to follow React hooks rules
  useEffect(() => {
    if (isLocked && lockoutTime > 0) {
      const timer = setInterval(() => {
        const remaining = Math.ceil((lockoutTime - Date.now()) / 1000);
        if (remaining <= 0) {
          setIsLocked(false);
          setLockoutTime(0);
          setResetAttempts(0);
        }
      }, 1000);
      
      return () => clearInterval(timer);
    }
    return undefined;
  }, [isLocked, lockoutTime]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      const remaining = Math.ceil((lockoutTime - Date.now()) / 1000);
      setError(`Too many reset attempts. Try again in ${remaining} seconds.`);
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error } = await resetPassword(email.trim());
      
      if (error) {
        setError(error.message);
        setResetAttempts(prev => prev + 1);
        
        // Lock after 3 failed attempts
        if (resetAttempts >= 2) {
          setIsLocked(true);
          setLockoutTime(Date.now() + (10 * 60 * 1000)); // 10 minutes
          setError('Too many reset attempts. Try again in 10 minutes.');
        }
      } else {
        setSuccess('Password reset link sent! Check your email.');
        setTimeout(() => {
          onClose();
        }, 3000);
      }
    } catch (_err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  }, [email, resetPassword, resetAttempts, isLocked, lockoutTime, onClose]);

  const handleClose = useCallback(() => {
    if (!loading) {
      onClose();
    }
  }, [loading, onClose]);

  if (!isOpen) return null;

  const remainingLockoutTime = isLocked ? Math.ceil((lockoutTime - Date.now()) / 1000) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" 
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-duniacrypto-panel border border-gray-700 rounded-lg p-8 w-full max-w-md mx-4 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={handleClose}
          disabled={loading}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold transition-colors duration-200 disabled:opacity-50"
        >
          ×
        </button>
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-full mb-4">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
          <p className="text-gray-400">Enter your email to receive a reset link</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Success Display */}
        {success && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg text-green-400 text-sm">
            {success}
          </div>
        )}

        {/* Lockout Warning */}
        {isLocked && (
          <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500 rounded-lg text-yellow-400 text-sm">
            Too many reset attempts. Try again in {remainingLockoutTime} seconds.
          </div>
        )}

        {/* Reset Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label htmlFor="reset-email" className="block text-sm font-medium text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="reset-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || isLocked}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              placeholder="Enter your email address"
              required
              autoComplete="email"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || isLocked}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending reset link...
              </div>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        {/* Information */}
        <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
          <h3 className="text-sm font-medium text-white mb-2">What happens next?</h3>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• Check your email for a password reset link</li>
            <li>• Click the link to set a new password</li>
            <li>• The link expires in 1 hour for security</li>
            <li>• Check your spam folder if you don't see it</li>
          </ul>
        </div>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Remember your password?{' '}
            <button
              onClick={onSwitchToLogin}
              disabled={loading || isLocked}
              className="text-blue-400 hover:text-blue-300 font-medium disabled:opacity-50 transition-colors duration-200"
            >
              Back to login
            </button>
          </p>
        </div>

        {/* Security Notice */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            🔒 Password reset links are encrypted and secure
          </p>
        </div>
      </div>
    </div>
  );
}
