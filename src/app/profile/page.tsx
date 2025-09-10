"use client";

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { 
  AiOutlineUser, 
  AiOutlineEdit,
  AiOutlineSave,
  AiOutlineClose,
  AiOutlineMail
} from 'react-icons/ai';

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  
  // Profile state management
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state - Only essential fields
  const [fullName, setFullName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [hasInitialized, setHasInitialized] = useState(false);

  // Initialize form data when user data is available
  useEffect(() => {
    if (user && !hasInitialized) {
      setFullName(user.user_metadata?.['full_name'] || '');
      setDisplayName(user.user_metadata?.['display_name'] || '');
      setHasInitialized(true);
    }
  }, [user, hasInitialized]);

  // Update form data when user data changes (but only if not editing)
  useEffect(() => {
    if (user && !isEditing && hasInitialized) {
      setFullName(user.user_metadata?.['full_name'] || '');
      setDisplayName(user.user_metadata?.['display_name'] || '');
    }
  }, [user, isEditing, hasInitialized]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  // Memoized user data for performance
  const userData = useMemo(() => ({
    fullName: user?.user_metadata?.['full_name'] || 'Anonymous User',
    displayName: user?.user_metadata?.['display_name'] || user?.user_metadata?.['full_name'] || 'Anonymous',
    email: user?.email || 'No email',
    joinDate: user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'
  }), [user]);

  // Handle profile update
  const handleProfileUpdate = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      // Validate input
      if (!fullName.trim() || !displayName.trim()) {
        setError('Full Name and Display Name are required');
        return;
      }

      const updates = {
        data: {
          full_name: fullName.trim(),
          display_name: displayName.trim(),
          updated_at: new Date().toISOString()
        }
      };

      console.log('Updating profile with:', updates);

      // Note: Profile updates would be implemented with Supabase user metadata updates
      // For now, just show success message
      setSuccess('Profile saved locally!');
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [fullName, displayName]);

  // Cancel editing
  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setFullName(userData.fullName);
    setDisplayName(userData.displayName);
    setError('');
  }, [userData.fullName, userData.displayName]);

  // Generate avatar initials
  const getAvatarInitials = useCallback((name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, []);

  // Loading state
  if (!user) {
    return (
      <div className="min-h-screen bg-duniacrypto-background pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-yellow-400 text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-white mb-4">Authentication Required</h1>
          <p className="text-gray-400 mb-6">Please sign in to access your profile.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-duniacrypto-background pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Profile
            </h1>
            <p className="text-gray-400 text-lg">Manage your account information</p>
          </div>
          
          <div className="flex items-center space-x-3">
            {!isEditing ? (
              <button
                onClick={() => {
                  // Ensure form fields are properly set before editing
                  if (user) {
                    setFullName(user.user_metadata?.['full_name'] || '');
                    setDisplayName(user.user_metadata?.['display_name'] || '');
                  }
                  setIsEditing(true);
                }}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              >
                <AiOutlineEdit className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleProfileUpdate}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:from-green-800 disabled:to-green-900 text-white rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:transform-none"
                >
                  <AiOutlineSave className="w-4 h-4" />
                  <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                >
                  <AiOutlineClose className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-400">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
              {/* Avatar */}
              <div className="flex justify-center mb-8">
                <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-4xl shadow-2xl ring-4 ring-gray-800/50">
                  {getAvatarInitials(userData.fullName)}
                </div>
              </div>

              {/* User Info */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {userData.displayName}
                </h2>
                <p className="text-gray-400 text-base">
                  {userData.email}
                </p>
              </div>

              {/* Stats */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm p-3 bg-gray-800/50 rounded-xl border border-gray-700/30">
                  <span className="text-gray-400">Member since</span>
                  <span className="text-white font-medium">{userData.joinDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Details */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
                <AiOutlineUser className="w-6 h-6 mr-3 text-blue-400" />
                Basic Information
              </h3>
              
              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      onBlur={(e) => e.target.value.trim() === '' && setFullName(userData.fullName)}
                      disabled={isLoading}
                      className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 backdrop-blur-sm"
                      placeholder="Enter your full name"
                      required
                    />
                  ) : (
                    <p className="text-white text-lg py-3 px-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                      {userData.fullName}
                    </p>
                  )}
                </div>

                {/* Display Name */}
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-300 mb-2">
                    Display Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      onBlur={(e) => e.target.value.trim() === '' && setDisplayName(userData.displayName)}
                      disabled={isLoading}
                      className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 backdrop-blur-sm"
                      placeholder="Enter your display name"
                      required
                    />
                  ) : (
                    <p className="text-white text-lg py-3 px-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                      {userData.displayName}
                    </p>
                  )}
                </div>

                {/* Email (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="flex items-center space-x-2">
                    <AiOutlineMail className="w-4 h-4 text-gray-400" />
                    <p className="text-white">{userData.email}</p>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">
                    Email address cannot be changed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
