"use client";

import { useState } from 'react';
import { FiChevronLeft } from 'react-icons/fi';
import { useAcademyFilters } from './AcademyFiltersProvider';

interface AcademySubmenuProps {
  isOpen: boolean;
  onClose: () => void;
}

// Level categories with images - EXACT copy from AcademyClient
const LEVEL_CATEGORIES = [
  { 
    id: 'newbie', 
    title: 'Newbie', 
    color: 'bg-green-600',
    description: 'Mulai dari dasar cryptocurrency',
    image: '/Asset/duniacrypto.png'
  },
  { 
    id: 'intermediate', 
    title: 'Intermediate', 
    color: 'bg-yellow-600',
    description: 'Tingkatkan pengetahuan blockchain',
    image: '/Asset/duniacrypto.png'
  },
  { 
    id: 'expert', 
    title: 'Expert', 
    color: 'bg-red-600',
    description: 'Mahir dalam teknologi crypto',
    image: '/Asset/duniacrypto.png'
  }
];

// Topic categories - EXACT copy from AcademyClient
const TOPIC_CATEGORIES = [
  'DeFi', 'NFT', 'Wallet', 'Blockchain', 'Trading', 'Airdrop', 
  'Security', 'Tokenomics', 'Stablecoin', 'GameFi', 'Web3', 
  'DAO', 'Mining', 'Metaverse'
];

// Blockchain network categories - EXACT copy from AcademyClient
const NETWORK_CATEGORIES = [
  'Bitcoin Network', 'Ethereum Network', 'Binance Smart Chain (BSC)', 
  'Solana Network', 'Polygon Network', 'Avalanche Network', 
  'Arbitrum Network', 'Cardano Network'
];

export default function AcademySubmenu({ isOpen, onClose }: AcademySubmenuProps) {
  const { 
    activeLevel, 
    activeTopic, 
    activeNetwork, 
    handleLevelClick, 
    handleTopicClick, 
    handleNetworkClick, 
    clearAllFilters 
  } = useAcademyFilters();
  
  const [showTopics, setShowTopics] = useState(true);
  const [showNetworks, setShowNetworks] = useState(true);

  if (!isOpen) return null;

  return (
    <>
      {/* Desktop Version - Sidebar Style */}
    <div 
        className="hidden xl:block fixed left-20 z-[60] bg-duniacrypto-panel border-r border-gray-700 shadow-xl overflow-y-auto custom-scrollbar-thin"
      style={{ 
        top: 'var(--nav-height, 64px)',
        height: 'calc(100vh - var(--nav-height, 64px))',
        width: '380px'
      }}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Academy</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Status - Like AcademyClient */}
        {(activeLevel || activeTopic || activeNetwork) && (
          <div className="mb-6 p-3 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-gray-300 text-sm">Filter aktif:</span>
              {activeLevel && (
                <span className="px-2 py-1 bg-green-600 text-white rounded-full text-xs">
                  {LEVEL_CATEGORIES.find(l => l.id === activeLevel)?.title}
                </span>
              )}
              {activeTopic && (
                <span className="px-2 py-1 bg-blue-600 text-white rounded-full text-xs">
                  {activeTopic}
                </span>
              )}
              {activeNetwork && (
                <span className="px-2 py-1 bg-purple-600 text-white rounded-full text-xs">
                  {activeNetwork}
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="px-2 py-1 bg-gray-600 text-white rounded-full text-xs hover:bg-gray-500 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* SECTION 1 - Learning Levels */}
        <section className="mb-8">
          <h3 className="text-lg font-bold text-white mb-4">
            Pilih Level Pembelajaranmu
          </h3>
          <div className="space-y-3">
            {LEVEL_CATEGORIES.map((level) => (
              <button
                key={level.id}
                onClick={() => handleLevelClick(level.id)}
                className={`w-full p-3 rounded-lg border-2 border-blue-500 transition-all duration-200 text-left group relative overflow-hidden ${
                  activeLevel === level.id
                    ? `${level.color} text-white shadow-lg transform scale-105`
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {/* Hover overlay */}
                <span className={`pointer-events-none absolute inset-0 rounded-lg bg-blue-500/10 transition-opacity duration-200 z-10 ${
                  activeLevel === level.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}></span>
                <div className="relative z-20 text-center">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{level.title}</h4>
                    <p className="text-xs opacity-80">{level.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* SECTION 2 - Crypto Topics */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Topik Crypto</h3>
            <button
              onClick={() => setShowTopics(!showTopics)}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              <svg 
                className={`w-4 h-4 transition-transform duration-200 ${showTopics ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          {showTopics && (
            <div className="grid grid-cols-2 gap-2">
              {TOPIC_CATEGORIES.map((topic) => (
                <button
                  key={topic}
                  onClick={() => handleTopicClick(topic)}
                  className={`p-2 rounded-lg border transition-all duration-200 text-xs font-medium ${
                    activeTopic === topic
                      ? 'bg-blue-600 border-transparent text-white shadow-lg'
                      : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600 hover:bg-gray-700'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* SECTION 3 - Blockchain Networks */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Jaringan Blockchain</h3>
            <button
              onClick={() => setShowNetworks(!showNetworks)}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              <svg 
                className={`w-4 h-4 transition-transform duration-200 ${showNetworks ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          {showNetworks && (
            <div className="grid grid-cols-1 gap-2">
              {NETWORK_CATEGORIES.map((network) => (
                <button
                  key={network}
                  onClick={() => handleNetworkClick(network)}
                  className={`p-2 rounded-lg border transition-all duration-200 text-xs font-medium text-left ${
                    activeNetwork === network
                      ? 'bg-purple-600 border-transparent text-white shadow-lg'
                      : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600 hover:bg-gray-700'
                  }`}
                >
                  {network}
                </button>
              ))}
            </div>
          )}
        </section>
        </div>
      </div>

      {/* Mobile Version - Bottom Sheet Style */}
      <div className="xl:hidden fixed inset-0 z-[60] bg-black bg-opacity-50" onClick={onClose}>
        <div
          className="absolute bottom-0 left-0 right-0 bg-duniacrypto-panel border-t border-gray-700 rounded-t-xl animate-slide-up max-h-[90vh] overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Handle Bar */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1 bg-gray-600 rounded-full"></div>
          </div>

          <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 60px)' }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Academy</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Status - Like AcademyClient */}
            {(activeLevel || activeTopic || activeNetwork) && (
              <div className="mb-6 p-3 bg-gray-800 rounded-lg border border-gray-700">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-gray-300 text-sm">Filter aktif:</span>
                  {activeLevel && (
                    <span className="px-2 py-1 bg-green-600 text-white rounded-full text-xs">
                      {LEVEL_CATEGORIES.find(l => l.id === activeLevel)?.title}
                    </span>
                  )}
                  {activeTopic && (
                    <span className="px-2 py-1 bg-blue-600 text-white rounded-full text-xs">
                      {activeTopic}
                    </span>
                  )}
                  {activeNetwork && (
                    <span className="px-2 py-1 bg-purple-600 text-white rounded-full text-xs">
                      {activeNetwork}
                    </span>
                  )}
                  <button
                    onClick={clearAllFilters}
                    className="px-2 py-1 bg-gray-600 text-white rounded-full text-xs hover:bg-gray-500 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            )}

            {/* SECTION 1 - Learning Levels */}
            <section className="mb-8">
              <h3 className="text-lg font-bold text-white mb-4">
                Pilih Level Pembelajaranmu
              </h3>
              <div className="space-y-3">
                {LEVEL_CATEGORIES.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => handleLevelClick(level.id)}
                    className={`w-full p-3 rounded-lg border-2 border-blue-500 transition-all duration-200 text-left group relative overflow-hidden ${
                      activeLevel === level.id
                        ? `${level.color} text-white shadow-lg transform scale-105`
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {/* Hover overlay */}
                    <span className={`pointer-events-none absolute inset-0 rounded-lg bg-blue-500/10 transition-opacity duration-200 z-10 ${
                      activeLevel === level.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}></span>
                    <div className="relative z-20 text-center">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{level.title}</h4>
                        <p className="text-xs opacity-80">{level.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* SECTION 2 - Crypto Topics */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Topik Crypto</h3>
                <button
                  onClick={() => setShowTopics(!showTopics)}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${showTopics ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              {showTopics && (
                <div className="grid grid-cols-2 gap-2">
                  {TOPIC_CATEGORIES.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => handleTopicClick(topic)}
                      className={`p-2 rounded-lg border transition-all duration-200 text-xs font-medium ${
                        activeTopic === topic
                          ? 'bg-blue-600 border-transparent text-white shadow-lg'
                          : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600 hover:bg-gray-700'
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              )}
            </section>

            {/* SECTION 3 - Blockchain Networks */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Jaringan Blockchain</h3>
                <button
                  onClick={() => setShowNetworks(!showNetworks)}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${showNetworks ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              {showNetworks && (
                <div className="grid grid-cols-1 gap-2">
                  {NETWORK_CATEGORIES.map((network) => (
                    <button
                      key={network}
                      onClick={() => handleNetworkClick(network)}
                      className={`p-2 rounded-lg border transition-all duration-200 text-xs font-medium text-left ${
                        activeNetwork === network
                          ? 'bg-purple-600 border-transparent text-white shadow-lg'
                          : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600 hover:bg-gray-700'
                      }`}
                    >
                      {network}
                    </button>
                  ))}
                </div>
              )}
            </section>
          </div>
      </div>
    </div>
    </>
  );
}