import React, { useState } from 'react';
import CryptoTicker from './components/CryptoTicker';
import CryptoTable from './components/CryptoTable';
import MarketOverview from './components/MarketOverview';
import NewsFeed from './components/NewsFeed';
import DailyRecap from './components/DailyRecap';
import Mindshare from './components/Mindshare';
import NewsSlider from './components/NewsSlider';
import StarBorder from './components/StarBorder';
import GradientText from './components/GradientText';
import { CoinGeckoProvider } from './CoinGeckoContext';

function Popup({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="bg-duniacrypto-panel text-white rounded-lg px-6 py-4 shadow-lg" onClick={e => e.stopPropagation()}>
        {children}
        <button className="mt-4 px-4 py-1 bg-duniacrypto-green text-black rounded" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

const Footer = () => (
  <footer className="w-full bg-duniacrypto-panel text-gray-400 text-center py-6 mt-10 border-t border-gray-800">
    &copy; {new Date().getFullYear()} Dunia Crypto. All rights reserved.
  </footer>
);

export default function App() {
  const [popup, setPopup] = useState('');
  const [navOpen, setNavOpen] = useState(false);
  return (
    <CoinGeckoProvider>
      <div className="min-h-screen bg-duniacrypto-background text-white flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-duniacrypto-panel border-b border-gray-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-3">
              <img src="/Asset/duniacrypto.png" alt="Dunia Crypto Logo" className="h-10 w-10 object-contain" style={{filter: 'drop-shadow(0 0 16px #22c5ff)'}} />
              <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={3}
                showBorder={false}
                className="text-2xl font-bold tracking-tight font-sans"
              >
                Dunia Crypto
              </GradientText>
            </div>
            {/* Hamburger for mobile */}
            <button
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none"
              onClick={() => setNavOpen(!navOpen)}
              aria-label="Open navigation menu"
            >
              <span className={`block w-6 h-0.5 bg-white mb-1 transition-transform ${navOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-white mb-1 transition-opacity ${navOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-white transition-transform ${navOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </button>
            {/* Desktop nav */}
            <nav className="hidden md:flex space-x-6">
              <a href="#home" className="text-white font-bold transition block hover:text-blue-400" style={{borderRadius: 16, textDecoration: 'none'}}>Home</a>
              <a href="#newsroom" className="text-white font-bold transition block hover:text-blue-400" style={{borderRadius: 16, textDecoration: 'none'}}>Newsroom</a>
              <a href="#academy" className="text-white font-bold transition block hover:text-blue-400" onClick={e => {e.preventDefault(); setPopup('academy');}} style={{borderRadius: 16, textDecoration: 'none'}}>Academy</a>
              <a href="#kamus" className="text-white font-bold transition block hover:text-blue-400" onClick={e => {e.preventDefault(); setPopup('kamus');}} style={{borderRadius: 16, textDecoration: 'none'}}>Kamus WEB3</a>
              <a href="#about" className="text-white font-bold transition block hover:text-blue-400" style={{borderRadius: 16, textDecoration: 'none'}}>About</a>
              <a href="#contact" className="text-white font-bold transition block hover:text-blue-400" style={{borderRadius: 16, textDecoration: 'none'}}>Contact</a>
            </nav>
          </div>
          {/* Mobile nav overlay */}
          {navOpen && (
            <div className="fixed inset-0 z-40 bg-black bg-opacity-60 md:hidden" onClick={() => setNavOpen(false)}>
              <nav
                className="absolute top-0 right-0 w-3/4 max-w-xs h-full bg-duniacrypto-panel shadow-lg flex flex-col py-8 px-6 space-y-6 animate-slide-in"
                onClick={e => e.stopPropagation()}
              >
                {/* Tombol Close */}
                <button
                  className="absolute top-4 right-4 text-3xl leading-none text-white bg-gray-800 bg-opacity-60 rounded-full w-10 h-10 flex items-center justify-center z-50 focus:outline-none hover:bg-duniacrypto-green/80 hover:text-black transition-colors"
                  onClick={() => setNavOpen(false)}
                  aria-label="Close menu"
                >
                  &times;
                </button>
                <a href="#home" className="text-white text-lg font-bold transition block hover:text-blue-400" onClick={() => setNavOpen(false)} style={{borderRadius: 16, textDecoration: 'none'}}>Home</a>
                <a href="#newsroom" className="text-white text-lg font-bold transition block hover:text-blue-400" onClick={() => setNavOpen(false)} style={{borderRadius: 16, textDecoration: 'none'}}>Newsroom</a>
                <a href="#academy" className="text-white text-lg font-bold transition block hover:text-blue-400" onClick={e => {e.preventDefault(); setPopup('academy'); setNavOpen(false);}} style={{borderRadius: 16, textDecoration: 'none'}}>Academy</a>
                <a href="#kamus" className="text-white text-lg font-bold transition block hover:text-blue-400" onClick={e => {e.preventDefault(); setPopup('kamus'); setNavOpen(false);}} style={{borderRadius: 16, textDecoration: 'none'}}>Kamus WEB3</a>
                <a href="#about" className="text-white text-lg font-bold transition block hover:text-blue-400" onClick={() => setNavOpen(false)} style={{borderRadius: 16, textDecoration: 'none'}}>About</a>
                <a href="#contact" className="text-white text-lg font-bold transition block hover:text-blue-400" onClick={() => setNavOpen(false)} style={{borderRadius: 16, textDecoration: 'none'}}>Contact</a>
              </nav>
            </div>
          )}
        </header>
        <Popup open={popup==='academy'} onClose={()=>setPopup('')}>Academy Coming Soon</Popup>
        <Popup open={popup==='kamus'} onClose={()=>setPopup('')}>Kamus WEB3 Coming Soon</Popup>
        {/* Ticker */}
        <CryptoTicker />
        {/* Main Layout */}
        <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-4 md:py-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 flex-1 w-full">
          <section className="col-span-1 xl:col-span-2 space-y-4 md:space-y-6">
            <NewsSlider />
            <DailyRecap />
            <NewsFeed perPage={30} initialCount={10} loadMoreCount={3} showThumbnails={true} noTitle={true} />
          </section>
          <aside className="col-span-1 space-y-4 md:space-y-6">
            <MarketOverview />
            <CryptoTable />
            <Mindshare />
          </aside>
        </main>
        <Footer />
      </div>
    </CoinGeckoProvider>
  );
} 