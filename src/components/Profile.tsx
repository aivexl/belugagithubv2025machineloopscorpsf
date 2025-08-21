"use client";

import React, { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { 
  AiOutlineUser, 
  AiOutlineLogout
} from 'react-icons/ai';

interface ProfileProps {
  className?: string;
  showDropdown?: boolean;
  onProfileClick?: () => void;
}

export default function Profile({ className = '', showDropdown = false, onProfileClick }: ProfileProps) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  
  // Simple state management
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Memoized user data for performance
  const userData = useMemo(() => ({
    fullName: user?.user_metadata?.full_name || 'Anonymous User',
    displayName: user?.user_metadata?.display_name || user?.user_metadata?.full_name || 'Anonymous',
    email: user?.email || 'No email'
  }), [user]);

  // Handle sign out with proper cleanup
  const handleSignOut = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
      setError('Failed to sign out. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [signOut, router]);

  // Toggle dropdown
  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen(prev => !prev);
  }, []);

  // Handle click outside dropdown
  const handleClickOutside = useCallback((event: MouseEvent) => {
    const target = event.target as Element;
    if (!target.closest('.profile-dropdown')) {
      setIsDropdownOpen(false);
    }
  }, []);

  // Add/remove click outside listener
  React.useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isDropdownOpen, handleClickOutside]);

  // Generate avatar initials
  const getAvatarInitials = useCallback((name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, []);

  // Profile click handler
  const handleProfileClick = useCallback(() => {
    if (onProfileClick) {
      onProfileClick();
    } else {
      router.push('/profile');
    }
  }, [onProfileClick, router]);

  if (!user) {
    return null;
  }

  return (
    <div className={`relative profile-dropdown ${className}`}>
      {/* Profile Button */}
      <button
        onClick={showDropdown ? toggleDropdown : handleProfileClick}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        aria-label="User profile"
      >
        {/* Avatar */}
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {getAvatarInitials(userData.fullName)}
          </div>
          
          {/* Online Status Indicator */}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-gray-900 rounded-full"></div>
        </div>

        {/* User Info */}
        <div className="hidden sm:flex flex-col items-start text-left">
          <span className="text-white font-medium text-sm leading-tight">
            {userData.displayName}
          </span>
          <span className="text-gray-400 text-xs leading-tight">
            {userData.email}
          </span>
        </div>

        {/* Dropdown Arrow */}
        {showDropdown && (
          <svg 
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {/* Mobile View - Show user info and sign out when no dropdown */}
      {!showDropdown && (
        <div className="flex flex-col space-y-3 mt-3">
          {/* User Info Display */}
          <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {getAvatarInitials(userData.fullName)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-sm truncate">
                {userData.displayName}
              </h3>
              <p className="text-gray-400 text-xs truncate">
                {userData.email}
              </p>
            </div>
          </div>
          
          {/* Sign Out Button for Mobile */}
          <button
            onClick={handleSignOut}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 p-3 bg-red-600 hover:bg-red-700 disabled:bg-red-800 rounded-lg transition-colors duration-200 text-white font-medium"
          >
            <AiOutlineLogout className="w-4 h-4" />
            <span>{isLoading ? 'Signing Out...' : 'Sign Out'}</span>
          </button>
        </div>
      )}

      {/* Simplified Dropdown Menu */}
      {showDropdown && isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-2xl z-50">
          {/* Menu Items - Only Profile and Sign Out */}
          <div className="py-2">
            <Link
              href="/profile"
              className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200 rounded-lg mx-2"
            >
              <AiOutlineUser className="w-4 h-4" />
              <span>Profile</span>
            </Link>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700/50 mx-2"></div>

          {/* Sign Out */}
          <div className="p-3">
            <button
              onClick={handleSignOut}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 p-3 bg-red-600/90 hover:bg-red-600 disabled:bg-red-800/50 rounded-lg transition-all duration-200 text-white font-medium hover:scale-[1.02] active:scale-[0.98]"
            >
              <AiOutlineLogout className="w-4 h-4" />
              <span>{isLoading ? 'Signing Out...' : 'Sign Out'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Error Messages */}
      {error && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm z-50">
          {error}
        </div>
      )}
    </div>
  );
}
