"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import GradientText from "./GradientText";
import { useAuth } from "../hooks/useAuth";
import LoginModal from "./auth/LoginModal";
import SignUpModal from "./auth/SignUpModal";

function ProcessedLogo() {
  // Use an intrinsic size that matches the displayed size to avoid hydration diff
  // Display height is 40px (mobile) and 48px (md). Use width that preserves aspect ratio ~1.302 (669/514)
  const intrinsicWidth = 62;  // 48 * 1.302 ≈ 62
  const intrinsicHeight = 48;
  return (
    <Image
      src="/Asset/beluganewlogov2.png"
      alt="Beluga Logo"
      width={intrinsicWidth}
      height={intrinsicHeight}
      // Do not mark as priority to avoid implicit preloading in dev which can trigger preload warnings
      className="h-10 md:h-12 w-auto object-contain group-hover:scale-105 transition-all duration-300 animate-logo-color-cycle hover:[animation-play-state:paused] hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
      style={{ width: 'auto', height: 'auto' }}
      sizes="(max-width: 768px) 40px, 48px"
    />
  );
}

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    } else {
      router.push('/search');
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  // Check if current path is active
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-black/30 backdrop-blur-lg backdrop-saturate-150 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center space-x-2 md:space-x-3">
            <Link href="/" className="flex items-center space-x-3 group no-underline hover:no-underline focus:no-underline active:no-underline" style={{ textDecoration: 'none' }}>
              <ProcessedLogo />
              <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={2}
                showBorder={false}
                 className="text-2xl md:text-3xl font-bold tracking-tight font-sans leading-normal pb-0.5"
              >
                Beluga
              </GradientText>
            </Link>
          </div>

          {/* Desktop nav with search */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-white font-bold transition block hover:text-blue-400 focus:outline-none focus:no-underline" style={{borderRadius: 16, textDecoration: 'none'}}>Home</Link>
            <Link href="/newsroom" className="text-white font-bold transition block hover:text-blue-400 focus:outline-none focus:no-underline" style={{borderRadius: 16, textDecoration: 'none'}}>Newsroom</Link>
            <Link href="/academy" className="text-white font-bold transition block hover:text-blue-400 focus:outline-none focus:no-underline" style={{borderRadius: 16, textDecoration: 'none'}}>Academy</Link>
            <Link href="/kamus" className="text-white font-bold transition block hover:text-blue-400 focus:outline-none focus:no-underline" style={{borderRadius: 16, textDecoration: 'none'}}>Kamus WEB3</Link>
            <Link href="/about" className="text-white font-bold transition block hover:text-blue-400 focus:outline-none focus:no-underline" style={{borderRadius: 16, textDecoration: 'none'}}>About</Link>
            <Link href="/contact" className="text-white font-bold transition block hover:text-blue-400 focus:outline-none focus:no-underline" style={{borderRadius: 16, textDecoration: 'none'}}>Contact</Link>
            
            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 px-3 py-1.5 pl-9 pr-11 md:px-4 md:py-2 md:pl-10 md:pr-12 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                />
                {/* Search Icon */}
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {/* Search Button */}
                <button
                  type="submit"
                  onClick={handleSearchClick}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200"
                  title="Search"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Auth Buttons - Desktop */}
            <div className="flex items-center space-x-3">
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-gray-300 text-sm">
                    {user.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="text-white font-bold hover:text-blue-400 transition-colors duration-200"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setShowSignUpModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-lg backdrop-saturate-150 border-t border-white/10">
        <div className="flex items-center justify-around py-2">
          {/* Home */}
          <Link 
            href="/" 
            className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 focus:outline-none focus:no-underline ${
              isActive('/') 
                ? 'bg-blue-600 text-white' 
                : 'text-white hover:bg-blue-500/20 hover:text-blue-400'
            }`}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs font-medium">Home</span>
          </Link>

          {/* Newsroom */}
          <Link 
            href="/newsroom" 
            className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 focus:outline-none focus:no-underline ${
              isActive('/newsroom') 
                ? 'bg-blue-600 text-white' 
                : 'text-white hover:bg-blue-500/20 hover:text-blue-400'
            }`}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <span className="text-xs font-medium">News</span>
          </Link>

          {/* Academy */}
          <Link 
            href="/academy" 
            className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 focus:outline-none focus:no-underline ${
              isActive('/academy') 
                ? 'bg-blue-600 text-white' 
                : 'text-white hover:bg-blue-500/20 hover:text-blue-400'
            }`}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-xs font-medium">Academy</span>
          </Link>

          {/* Asset */}
          <Link 
            href="/asset" 
            className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 focus:outline-none focus:no-underline ${
              isActive('/asset') 
                ? 'bg-blue-600 text-white' 
                : 'text-white hover:bg-blue-500/20 hover:text-blue-400'
            }`}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            <span className="text-xs font-medium">Asset</span>
          </Link>

          {/* Auth Button - Mobile */}
          {user ? (
            <button
              onClick={handleSignOut}
              className="flex flex-col items-center p-2 rounded-lg transition-all duration-200 focus:outline-none focus:no-underline text-white hover:bg-red-500/20 hover:text-red-400"
            >
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="text-xs font-medium">Sign Out</span>
            </button>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="flex flex-col items-center p-2 rounded-lg transition-all duration-200 focus:outline-none focus:no-underline text-white hover:bg-blue-500/20 hover:text-blue-400"
            >
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs font-medium">Login</span>
            </button>
          )}

          {/* Hamburger Menu */}
          <button
            className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 focus:outline-none focus:no-underline ${
              navOpen 
                ? 'bg-blue-600 text-white' 
                : 'text-white hover:bg-blue-500/20 hover:text-blue-400'
            }`}
            onClick={() => setNavOpen(!navOpen)}
            aria-label="Open navigation menu"
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="text-xs font-medium">Menu</span>
          </button>
        </div>
      </div>

      {/* Mobile nav overlay */}
      {navOpen && (
        <div className="fixed inset-0 z-60 bg-black bg-opacity-60 md:hidden" onClick={() => setNavOpen(false)}>
          <nav
            className="absolute bottom-0 left-0 right-0 bg-duniacrypto-panel shadow-lg flex flex-col py-8 px-6 space-y-6 animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            {/* Tombol Close */}
            <button
              className="absolute top-4 right-4 text-3xl leading-none text-white bg-gray-800 bg-opacity-60 rounded-full w-10 h-10 flex items-center justify-center z-50 focus:outline-none hover:bg-blue-500/80 hover:text-white transition-colors"
              onClick={() => setNavOpen(false)}
              aria-label="Close menu"
            >
              &times;
            </button>

            {/* Mobile Search Bar */}
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 pr-12 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                />
                {/* Search Icon */}
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {/* Search Button */}
                <button
                  type="submit"
                  onClick={() => {
                    handleSearchClick();
                    setNavOpen(false);
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200"
                  title="Search"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>

            <Link href="/kamus" className="text-white text-lg font-bold transition block hover:text-blue-400 focus:outline-none focus:no-underline" onClick={() => setNavOpen(false)} style={{borderRadius: 16, textDecoration: 'none'}}>Kamus WEB3</Link>
            <Link href="/about" className="text-white text-lg font-bold transition block hover:text-blue-400 focus:outline-none focus:no-underline" onClick={() => setNavOpen(false)} style={{borderRadius: 16, textDecoration: 'none'}}>About</Link>
            <Link href="/contact" className="text-white text-lg font-bold transition block hover:text-blue-400 focus:outline-none focus:no-underline" onClick={() => setNavOpen(false)} style={{borderRadius: 16, textDecoration: 'none'}}>Contact</Link>

            {/* Auth Buttons - Mobile Menu */}
            {!user && (
              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-700">
                <button
                  onClick={() => {
                    setShowLoginModal(true);
                    setNavOpen(false);
                  }}
                  className="text-white text-lg font-bold transition block hover:text-blue-400 focus:outline-none focus:no-underline"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setShowSignUpModal(true);
                    setNavOpen(false);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Sign Up
                </button>
              </div>
            )}
          </nav>
        </div>
      )}

      {/* Auth Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignUp={() => {
          setShowLoginModal(false);
          setShowSignUpModal(true);
        }}
      />
      
      <SignUpModal
        isOpen={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
        onSwitchToLogin={() => {
          setShowSignUpModal(false);
          setShowLoginModal(true);
        }}
      />
    </>
  );
} 
