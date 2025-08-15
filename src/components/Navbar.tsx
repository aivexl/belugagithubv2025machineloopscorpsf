"use client";
    import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import GradientText from "./GradientText";
import { useAuth } from "../hooks/useAuth";
import LoginModal from "./auth/LoginModal";
import SignUpModal from "./auth/SignUpModal";
import { 
  AiOutlineHome,
  AiOutlineExperiment,
  AiOutlineRead,
  AiOutlineSwap,
  AiOutlineGift,
  AiOutlineRocket,
  AiOutlineBook,
  AiOutlineInfoCircle,
  AiOutlinePhone
} from "react-icons/ai";
import { FaBitcoin } from "react-icons/fa";
import { HiAcademicCap, HiOutlineCash } from "react-icons/hi";


function ProcessedLogo() {
  // Mobile/Tablet: Keep larger size, Desktop: Smaller for proportion
  // Mobile: 48px, Tablet: 56px, Desktop: 48px - preserving aspect ratio ~1.302 (669/514)
  const intrinsicWidth = 73;  // 56 * 1.302 ≈ 73
  const intrinsicHeight = 56;
  return (
    <Image
      src="/Asset/beluganewlogov2.png"
      alt="Beluga Logo"
      width={intrinsicWidth}
      height={intrinsicHeight}
      // Do not mark as priority to avoid implicit preloading in dev which can trigger preload warnings
      className="h-12 md:h-14 xl:h-12 w-auto object-contain group-hover:scale-105 transition-all duration-300 animate-logo-color-cycle hover:[animation-play-state:paused] hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
      style={{ width: 'auto', height: 'auto' }}
      sizes="(max-width: 768px) 48px, (max-width: 1280px) 56px, 48px"
    />
  );
}

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  const headerRef = useRef<HTMLElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  // Keep spacer height exactly equal to actual navbar height across breakpoints
  useEffect(() => {
    const headerEl = headerRef.current;

    const updateNavHeight = () => {
      const height = headerEl?.offsetHeight || 64;
      if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty('--nav-height', `${height}px`);
      }
    };

    updateNavHeight();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof window !== 'undefined' && 'ResizeObserver' in window && headerEl) {
      resizeObserver = new ResizeObserver(() => updateNavHeight());
      resizeObserver.observe(headerEl as Element);
    } else if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateNavHeight);
    }

    return () => {
      if (resizeObserver && headerEl) resizeObserver.unobserve(headerEl as Element);
      if (typeof window !== 'undefined') window.removeEventListener('resize', updateNavHeight);
    };
  }, []);

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
      {/* Spacer for fixed navbar - dynamic height to avoid gaps/overlap */}
      <div style={{ height: 'var(--nav-height, 64px)' }} aria-hidden="true"></div>
      
      {/* Desktop Sidebar - Only visible on desktop */}
      <aside className="hidden xl:block fixed left-0 top-0 h-full w-20 z-40 bg-black/40 backdrop-blur-xl backdrop-saturate-150 shadow-lg">
        <div className="flex flex-col items-center space-y-1" style={{ paddingTop: 'calc(var(--nav-height, 64px) + 1rem)' }}>
          {/* Home */}
          <Link 
            href="/" 
            className={`flex flex-col items-center p-1 rounded-md transition-all duration-200 group w-16 no-underline hover:no-underline focus:no-underline ${
              isActive('/') 
                ? 'bg-blue-600 text-white' 
                : 'text-white hover:bg-blue-500/20 hover:text-blue-400'
            }`}
          >
            <AiOutlineHome className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium text-center leading-tight">Home</span>
          </Link>

          {/* Academy */}
          <Link 
            href="/academy" 
            className={`flex flex-col items-center p-1 rounded-md transition-all duration-200 group w-16 no-underline hover:no-underline focus:no-underline ${
              isActive('/academy')
                ? 'bg-blue-600 text-white' 
                : 'text-white hover:bg-blue-500/20 hover:text-blue-400'
            }`}
          >
            <HiAcademicCap className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium text-center leading-tight">Academy</span>
          </Link>

          {/* Research */}
          <Link 
            href="/research" 
            className={`flex flex-col items-center p-1 rounded-md transition-all duration-200 group w-16 no-underline hover:no-underline focus:no-underline ${
              isActive('/research') 
                ? 'bg-blue-600 text-white' 
                : 'text-white hover:bg-blue-500/20 hover:text-blue-400'
            }`}
          >
            <AiOutlineExperiment className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium text-center leading-tight">Research</span>
          </Link>

          {/* Newsroom */}
          <Link 
            href="/newsroom" 
            className={`flex flex-col items-center p-1 rounded-md transition-all duration-200 group w-16 no-underline hover:no-underline focus:no-underline ${
              isActive('/newsroom') 
                ? 'bg-blue-600 text-white' 
                : 'text-white hover:bg-blue-500/20 hover:text-blue-400'
            }`}
          >
            <AiOutlineRead className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium text-center leading-tight">Newsroom</span>
          </Link>

          {/* Asset */}
          <Link 
            href="/asset" 
            className={`flex flex-col items-center p-1 rounded-md transition-all duration-200 group w-16 no-underline hover:no-underline focus:no-underline ${
              isActive('/asset') 
                ? 'bg-blue-600 text-white' 
                : 'text-white hover:bg-blue-500/20 hover:text-blue-400'
            }`}
          >
            <FaBitcoin className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium text-center leading-tight">Asset</span>
          </Link>

          {/* Beluga AI */}
          <Link 
            href="/beluga-ai" 
            className={`flex flex-col items-center p-1 rounded-md transition-all duration-200 group w-16 no-underline hover:no-underline focus:no-underline ${
              isActive('/beluga-ai') 
                ? 'bg-blue-600 text-white' 
                : 'text-white hover:bg-blue-500/20 hover:text-blue-400'
            }`}
          >
            <Image 
              src="/Asset/aistar.png" 
              alt="AI" 
              width={20} 
              height={20} 
              className="mb-0.5 brightness-0 invert" 
            />
            <span className="text-[10px] font-medium text-center leading-tight">Beluga AI</span>
          </Link>

          {/* Exchanges */}
          <Link 
            href="/exchanges" 
            className={`flex flex-col items-center p-1 rounded-md transition-all duration-200 group w-16 no-underline hover:no-underline focus:no-underline ${
              isActive('/exchanges') 
                ? 'bg-blue-600 text-white' 
                : 'text-white hover:bg-blue-500/20 hover:text-blue-400'
            }`}
          >
            <AiOutlineSwap className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium text-center leading-tight">Exchanges</span>
          </Link>

          {/* Airdrop */}
          <Link 
            href="/airdrop" 
            className={`flex flex-col items-center p-1 rounded-md transition-all duration-200 group w-16 no-underline hover:no-underline focus:no-underline ${
              isActive('/airdrop') 
                ? 'bg-blue-600 text-white' 
                : 'text-white hover:bg-blue-500/20 hover:text-blue-400'
            }`}
          >
            <AiOutlineGift className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium text-center leading-tight">Airdrop</span>
          </Link>

          {/* ICO/IDO */}
          <Link 
            href="/ico-ido" 
            className={`flex flex-col items-center p-1 rounded-md transition-all duration-200 group w-16 no-underline hover:no-underline focus:no-underline ${
              isActive('/ico-ido') 
                ? 'bg-blue-600 text-white' 
                : 'text-white hover:bg-blue-500/20 hover:text-blue-400'
            }`}
          >
            <AiOutlineRocket className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium text-center leading-tight">ICO/IDO</span>
          </Link>

          {/* Fundraising */}
          <Link 
            href="/fundraising" 
            className={`flex flex-col items-center p-1 rounded-md transition-all duration-200 group w-16 no-underline hover:no-underline focus:no-underline ${
              isActive('/fundraising') 
                ? 'bg-blue-600 text-white' 
                : 'text-white hover:bg-blue-500/20 hover:text-blue-400'
            }`}
          >
            <HiOutlineCash className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium text-center leading-tight">Fundraising</span>
          </Link>

          {/* Kamus WEB3 */}
          <Link 
            href="/kamus" 
            className={`flex flex-col items-center p-1 rounded-md transition-all duration-200 group w-16 no-underline hover:no-underline focus:no-underline ${
              isActive('/kamus') 
                ? 'bg-blue-600 text-white' 
                : 'text-white hover:bg-blue-500/20 hover:text-blue-400'
            }`}
          >
            <AiOutlineBook className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium text-center leading-tight">Kamus WEB3</span>
          </Link>

          {/* About */}
          <Link 
            href="/about" 
            className={`flex flex-col items-center p-1 rounded-md transition-all duration-200 group w-16 no-underline hover:no-underline focus:no-underline ${
              isActive('/about') 
                ? 'bg-blue-600 text-white' 
                : 'text-white hover:bg-blue-500/20 hover:text-blue-400'
            }`}
          >
            <AiOutlineInfoCircle className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium text-center leading-tight">About</span>
          </Link>

          {/* Contact */}
          <Link 
            href="/contact" 
            className={`flex flex-col items-center p-1 rounded-md transition-all duration-200 group w-16 no-underline hover:no-underline focus:no-underline ${
              isActive('/contact') 
                ? 'bg-blue-600 text-white' 
                : 'text-white hover:bg-blue-500/20 hover:text-blue-400'
            }`}
          >
            <AiOutlinePhone className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium text-center leading-tight">Contact</span>
          </Link>
        </div>
      </aside>

      {/* Desktop Logo - Positioned at border between sidebar and navbar */}
      <div className="hidden xl:block fixed left-20 top-4 z-[60]">
        <Link href="/" className="flex items-center space-x-2 group no-underline hover:no-underline focus:no-underline active:no-underline" style={{ textDecoration: 'none' }}>
          <ProcessedLogo />
          <GradientText
            colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
            animationSpeed={2}
            showBorder={false}
            className="text-3xl font-bold tracking-tight font-sans leading-normal pb-0.5"
          >
            Beluga
          </GradientText>
        </Link>
      </div>

      <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl backdrop-saturate-150 shadow-lg xl:left-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 md:px-6 lg:px-8 py-2 sm:py-3 md:py-3 lg:py-4 tablet-container xl:justify-start xl:space-x-8">
          {/* Logo Section - Mobile/Tablet */}
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 flex-shrink-0 xl:hidden">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 group no-underline hover:no-underline focus:no-underline active:no-underline" style={{ textDecoration: 'none' }}>
              <ProcessedLogo />
              <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={2}
                showBorder={false}
                className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold tracking-tight font-sans leading-normal pb-0.5"
              >
                Beluga
              </GradientText>
            </Link>
          </div>

          {/* Desktop Search Bar - Centered */}
          <div className="hidden xl:flex flex-1 justify-center">
            <form onSubmit={handleSearch} className="relative w-full max-w-md">
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
          </div>

          {/* Desktop Auth Buttons - Right side */}
          <div className="hidden xl:flex items-center space-x-3 flex-shrink-0">
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
        </div>
      </header>

      {/* Mobile & Tablet Bottom Navigation */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-lg backdrop-saturate-150 border-t border-white/10">
        <div className="flex items-center justify-around py-2 md:py-3">
          {/* Home */}
          <Link 
            href="/" 
            className={`flex flex-col items-center p-2 md:p-3 rounded-lg transition-all duration-200 focus:outline-none focus:no-underline ${
              isActive('/') 
                ? 'bg-blue-600 text-white' 
                : 'text-white hover:bg-blue-500/20 hover:text-blue-400'
            }`}
          >
            <svg className="w-6 h-6 md:w-7 md:h-7 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs md:text-sm font-medium">Home</span>
          </Link>

          {/* Newsroom */}
          <Link 
            href="/newsroom" 
            className={`flex flex-col items-center p-2 md:p-3 rounded-lg transition-all duration-200 focus:outline-none focus:no-underline ${
              isActive('/newsroom') 
                ? 'bg-blue-600 text-white' 
                : 'text-white hover:bg-blue-500/20 hover:text-blue-400'
            }`}
          >
            <svg className="w-6 h-6 md:w-7 md:h-7 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <span className="text-xs md:text-sm font-medium">News</span>
          </Link>

          {/* Academy */}
          <Link 
            href="/academy" 
            className={`flex flex-col items-center p-2 md:p-3 rounded-lg transition-all duration-200 focus:outline-none focus:no-underline ${
              isActive('/academy') 
                ? 'bg-blue-600 text-white' 
                : 'text-white hover:bg-blue-500/20 hover:text-blue-400'
            }`}
          >
            <svg className="w-6 h-6 md:w-7 md:h-7 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-xs md:text-sm font-medium">Academy</span>
          </Link>

          {/* Asset */}
          <Link 
            href="/asset" 
            className={`flex flex-col items-center p-2 md:p-3 rounded-lg transition-all duration-200 focus:outline-none focus:no-underline ${
              isActive('/asset') 
                ? 'bg-blue-600 text-white' 
                : 'text-white hover:bg-blue-500/20 hover:text-blue-400'
            }`}
          >
            <svg className="w-6 h-6 md:w-7 md:h-7 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            <span className="text-xs md:text-sm font-medium">Asset</span>
          </Link>



          {/* Hamburger Menu */}
          <button
            className={`flex flex-col items-center p-2 md:p-3 rounded-lg transition-all duration-200 focus:outline-none focus:no-underline ${
              navOpen 
                ? 'bg-blue-600 text-white' 
                : 'text-white hover:bg-blue-500/20 hover:text-blue-400'
            }`}
            onClick={() => setNavOpen(!navOpen)}
            aria-label="Open navigation menu"
          >
            <svg className="w-6 h-6 md:w-7 md:h-7 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="text-xs md:text-sm font-medium">Menu</span>
          </button>
        </div>
      </div>

      {/* Mobile & Tablet nav overlay - Higher z-index to be above slider */}
      {navOpen && (
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-60 xl:hidden" onClick={() => setNavOpen(false)}>
          <nav
            className="absolute bottom-0 left-0 right-0 bg-duniacrypto-panel shadow-lg flex flex-col py-6 md:py-8 px-4 md:px-6 space-y-4 md:space-y-6 animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button - Positioned ABOVE search bar */}
            <div className="flex justify-end mb-4">
              <button
                className="text-white hover:text-red-400 focus:outline-none transition-colors p-2 md:p-3 bg-gray-800/50 rounded-full hover:bg-red-500/20"
                onClick={() => setNavOpen(false)}
                aria-label="Close menu"
              >
                <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Search Bar - Mobile & Tablet */}
            <div className="relative">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 md:px-5 py-3 md:py-4 pl-12 md:pl-14 pr-12 md:pr-14 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 backdrop-blur-sm text-sm md:text-base"
                  />
                  {/* Search Icon */}
                  <svg
                    className="absolute left-4 md:left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-gray-400"
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
                    className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 p-2 md:p-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                    title="Search"
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>

            {/* Navigation Links - Only items NOT in bottom navigation */}
            <div className="space-y-3 md:space-y-4">
              <Link href="/kamus" className="text-white text-lg md:text-xl font-bold transition block hover:text-blue-400 focus:outline-none focus:no-underline py-2 md:py-3 px-2" onClick={() => setNavOpen(false)} style={{borderRadius: 16, textDecoration: 'none'}}>Kamus WEB3</Link>
              <Link href="/about" className="text-white text-lg md:text-xl font-bold transition block hover:text-blue-400 focus:outline-none focus:no-underline py-2 md:py-3 px-2" onClick={() => setNavOpen(false)} style={{borderRadius: 16, textDecoration: 'none'}}>About</Link>
              <Link href="/contact" className="text-white text-lg md:text-xl font-bold transition block hover:text-blue-400 focus:outline-none focus:no-underline py-2 md:py-3 px-2" onClick={() => setNavOpen(false)} style={{borderRadius: 16, textDecoration: 'none'}}>Contact</Link>
            </div>

            {/* Auth Buttons - Mobile/Tablet Menu */}
            <div className="pt-4 md:pt-6 border-t border-gray-700">
              {user ? (
                <div className="space-y-3 md:space-y-4">
                  <span className="text-gray-300 text-sm md:text-base block">
                    {user.email}
                  </span>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setNavOpen(false);
                    }}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 md:py-4 px-4 md:px-6 rounded-lg transition-colors duration-200 text-base md:text-lg"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-3 md:space-y-4">
                  <button
                    onClick={() => {
                      setShowLoginModal(true);
                      setNavOpen(false);
                    }}
                    className="text-white text-lg md:text-xl font-bold transition block hover:text-blue-400 focus:outline-none focus:no-underline py-2 md:py-3 px-2"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setShowSignUpModal(true);
                      setNavOpen(false);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 md:py-4 px-4 md:px-6 rounded-lg transition-colors duration-200 text-base md:text-lg"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
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
