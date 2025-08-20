"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthProvider';
import { useRouter } from 'next/navigation';
import AuthModalManager, { AuthModalType } from './auth/AuthModalManager';
import Profile from './Profile';

export default function Navbar() {
  const { user, signOut, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalType, setAuthModalType] = useState<AuthModalType>('login');

  // Conditional preloading for logo - only when navbar is rendered
  useEffect(() => {
    // Preload logo image only when navbar is actually visible
    // Use native browser Image constructor, not next/image
    if (typeof window !== 'undefined') {
      const logoImg = new window.Image();
      logoImg.src = '/Asset/beluganewlogov2.png';
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const openAuthModal = (type: AuthModalType = 'login') => {
    setAuthModalType(type);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  // Auto-close auth modal when user is authenticated
  useEffect(() => {
    if (isAuthenticated && authModalOpen) {
      closeAuthModal();
    }
  }, [isAuthenticated, authModalOpen]);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-duniacrypto-panel/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <img 
                src="/Asset/beluganewlogov2.png" 
                alt="Beluga Logo" 
                className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-110"
                style={{filter: 'drop-shadow(0 0 16px #22c5ff)'}}
              />
              <span className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                Beluga
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-white hover:text-blue-400 transition-colors duration-300">
                Home
              </Link>
              <Link href="/newsroom" className="text-white hover:text-blue-400 transition-colors duration-300">
                Newsroom
              </Link>
              <Link href="/academy" className="text-white hover:text-blue-400 transition-colors duration-300">
                Academy
              </Link>
              <Link href="/exchanges" className="text-white hover:text-blue-400 transition-colors duration-300">
                Exchanges
              </Link>
              <Link href="/airdrop" className="text-white hover:text-blue-400 transition-colors duration-300">
                Airdrop
              </Link>
              <Link href="/fundraising" className="text-white hover:text-blue-400 transition-colors duration-300">
                Fundraising
              </Link>
              <Link href="/ico-ido" className="text-white hover:text-blue-400 transition-colors duration-300">
                ICO/IDO
              </Link>
              <Link href="/asset" className="text-white hover:text-blue-400 transition-colors duration-300">
                Asset
              </Link>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {!loading && (
                <>
                  {isAuthenticated && user ? (
                    <Profile showDropdown={true} />
                  ) : (
                    <div className="flex items-center space-x-3">
                      {/* Sign In Button */}
                      <button
                        onClick={() => openAuthModal('login')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium transform hover:scale-105 active:scale-95"
                      >
                        Sign In
                      </button>
                      
                      {/* Sign Up Button */}
                      <button
                        onClick={() => openAuthModal('signup')}
                        className="bg-transparent hover:bg-white/10 text-white border border-white/20 hover:border-white/40 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium transform hover:scale-105 active:scale-95"
                      >
                        Sign Up
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* Loading State */}
              {loading && (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-400 text-sm">Loading...</span>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-white hover:text-blue-400 transition-colors duration-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-duniacrypto-panel/95 backdrop-blur-sm border-t border-gray-700">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link href="/" className="block px-3 py-2 text-white hover:text-blue-400 transition-colors duration-300">
                  Home
                </Link>
                <Link href="/newsroom" className="block px-3 py-2 text-white hover:text-blue-400 transition-colors duration-300">
                  Newsroom
                </Link>
                <Link href="/academy" className="block px-3 py-2 text-white hover:text-blue-400 transition-colors duration-300">
                  Academy
                </Link>
                <Link href="/exchanges" className="block px-3 py-2 text-white hover:text-blue-400 transition-colors duration-300">
                  Exchanges
                </Link>
                <Link href="/airdrop" className="block px-3 py-2 text-white hover:text-blue-400 transition-colors duration-300">
                  Airdrop
                </Link>
                <Link href="/fundraising" className="block px-3 py-2 text-white hover:text-blue-400 transition-colors duration-300">
                  Fundraising
                </Link>
                <Link href="/ico-ido" className="block px-3 py-2 text-white hover:text-blue-400 transition-colors duration-300">
                  ICO/IDO
                </Link>
                <Link href="/asset" className="block px-3 py-2 text-white hover:text-blue-400 transition-colors duration-300">
                  Asset
                </Link>
                
                {/* Mobile Auth Section */}
                {!loading && (
                  <div className="border-t border-gray-700 pt-3 mt-3">
                    {isAuthenticated && user ? (
                      <div className="px-3 py-2">
                        <div className="text-gray-300 text-sm mb-2">
                          Signed in as: {user.email}
                        </div>
                        <button
                          onClick={handleSignOut}
                          className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors duration-300 text-sm"
                        >
                          Sign Out
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            openAuthModal('login');
                          }}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 text-sm"
                        >
                          Sign In
                        </button>
                        <button
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            openAuthModal('signup');
                          }}
                          className="w-full bg-transparent hover:bg-white/10 text-white border border-white/20 hover:border-white/40 px-4 py-2 rounded-lg transition-colors duration-300 text-sm"
                        >
                          Sign Up
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Auth Modal Manager */}
      <AuthModalManager
        isOpen={authModalOpen}
        onClose={closeAuthModal}
        initialModal={authModalType}
      />
    </>
  );
}
