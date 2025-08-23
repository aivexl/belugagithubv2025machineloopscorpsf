"use client";
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthProvider';
// import { authDebugger } from '../../lib/auth/debugger';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignUp: () => void;
  onSwitchToResetPassword: () => void;
}

export default function LoginModal({ 
  isOpen, 
  onClose, 
  onSwitchToSignUp, 
  onSwitchToResetPassword 
}: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);
  
  const { signIn } = useAuth();

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setPassword('');
      setError('');
      setLoginAttempts(0);
      setIsLocked(false);
      setLockoutTime(0);
    }
  }, [isOpen]);

  // No need for auth error handling from context - handled directly in methods

  // Check lockout status
  useEffect(() => {
    if (isLocked && lockoutTime > 0) {
      const timer = setInterval(() => {
        const remaining = Math.ceil((lockoutTime - Date.now()) / 1000);
        if (remaining <= 0) {
          setIsLocked(false);
          setLockoutTime(0);
          setLoginAttempts(0);
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
      setError(`Account temporarily locked. Try again in ${remaining} seconds.`);
      return;
    }

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    
    console.log('🔐 LOGIN: Sign In Started', { email: email.trim() });

    try {
      const result = await signIn(email.trim(), password);
      console.log('🔐 LOGIN: Sign In Response', result);
      
      if (result.error) {
        setError(result.error.message || 'Login failed');
        setLoginAttempts(prev => prev + 1);
        
        // Lock account after 5 failed attempts
        if (loginAttempts >= 4) {
          setIsLocked(true);
          setLockoutTime(Date.now() + (15 * 60 * 1000)); // 15 minutes
          setError('Account locked due to too many failed attempts. Try again in 15 minutes.');
        }
        setLoading(false);
      } else {
        // Success - close modal
        setLoading(false);
        onClose();
      }
    } catch (_err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  }, [email, password, signIn, loginAttempts, isLocked, lockoutTime, onClose]);



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
          <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400">Sign in to your account</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Lockout Warning */}
        {isLocked && (
          <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500 rounded-lg text-yellow-400 text-sm">
            Account locked. Try again in {remainingLockoutTime} seconds.
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || isLocked}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              placeholder="Enter your email"
              required
              autoComplete="email"
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || isLocked}
                className="w-full px-3 py-2 pr-10 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading || isLocked}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white disabled:opacity-50"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading || isLocked}
                className="mr-2 rounded border-gray-600 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
              />
              <span className="text-sm text-gray-300">Remember me</span>
            </label>
            <button
              type="button"
              onClick={onSwitchToResetPassword}
              disabled={loading || isLocked}
              className="text-sm text-blue-400 hover:text-blue-300 disabled:opacity-50 transition-colors duration-200"
            >
              Forgot password?
            </button>
          </div>

          {/* Login Button */}
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
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>



        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToSignUp}
              disabled={loading || isLocked}
              className="text-blue-400 hover:text-blue-300 font-medium disabled:opacity-50 transition-colors duration-200"
            >
              Sign up
            </button>
          </p>
        </div>

        {/* Security Notice */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            🔒 Your data is protected with enterprise-grade security
          </p>
        </div>
      </div>
    </div>
  );
}
