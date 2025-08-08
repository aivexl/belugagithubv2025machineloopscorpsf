"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/id';
import StarBorder from './StarBorder';

// Configure dayjs
dayjs.extend(relativeTime);
dayjs.locale('id');

// Level categories with images
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

// Topic categories
const TOPIC_CATEGORIES = [
  'DeFi', 'NFT', 'Wallet', 'Blockchain', 'Trading', 'Airdrop', 
  'Security', 'Tokenomics', 'Stablecoin', 'GameFi', 'Web3', 
  'DAO', 'Mining', 'Metaverse'
];

// Blockchain network categories
const NETWORK_CATEGORIES = [
  'Bitcoin Network', 'Ethereum Network', 'Binance Smart Chain (BSC)', 
  'Solana Network', 'Polygon Network', 'Avalanche Network', 
  'Arbitrum Network', 'Cardano Network'
];

export default function AcademyClient({ articles = [] }) {
  const [isClient, setIsClient] = useState(false);
  const [activeLevel, setActiveLevel] = useState('');
  const [activeTopic, setActiveTopic] = useState('');
  const [activeNetwork, setActiveNetwork] = useState('');
  const [displayCount, setDisplayCount] = useState(9);
  const [showTopics, setShowTopics] = useState(false);
  const [showNetworks, setShowNetworks] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    // Inisialisasi filter dari query string
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const level = params.get('level');
      const topic = params.get('topic');
      const network = params.get('network');
      if (level && LEVEL_CATEGORIES.some(l => l.id === level)) setActiveLevel(level);
      if (topic && TOPIC_CATEGORIES.includes(topic)) setActiveTopic(topic);
      if (network && NETWORK_CATEGORIES.includes(network)) setActiveNetwork(network);
    }
  }, []);

  // Filter articles based on active filters
  const filteredArticles = articles.filter(article => {
    if (activeLevel && !article.level?.includes(activeLevel)) return false;
    if (activeTopic && !article.topics?.includes(activeTopic)) return false;
    if (activeNetwork && !article.networks?.includes(activeNetwork)) return false;
    return true;
  });

  const displayedArticles = filteredArticles.slice(0, displayCount);

  const handleLoadMore = () => {
    setDisplayCount(prev => Math.min(prev + 9, filteredArticles.length));
  };

  const handleLevelClick = (levelId) => {
    setActiveLevel(activeLevel === levelId ? '' : levelId);
    setActiveTopic('');
    setActiveNetwork('');
    setDisplayCount(9);
  };

  const handleTopicClick = (topic) => {
    setActiveTopic(activeTopic === topic ? '' : topic);
    setActiveLevel('');
    setActiveNetwork('');
    setDisplayCount(9);
  };

  const handleNetworkClick = (network) => {
    setActiveNetwork(activeNetwork === network ? '' : network);
    setActiveLevel('');
    setActiveTopic('');
    setDisplayCount(9);
  };

  const clearAllFilters = () => {
    setActiveLevel('');
    setActiveTopic('');
    setActiveNetwork('');
    setDisplayCount(9);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* SECTION 0 - Judul Halaman dengan Background */}
      <div className="relative mb-12">
        {/* Background Full Width */}
        <div className="absolute inset-x-0 top-0 bottom-0 bg-gradient-to-r from-cyan-900/20 via-blue-900/20 to-purple-900/20 rounded-xl border border-cyan-500/30 backdrop-blur-sm"></div>
        
        {/* Content */}
        <div className="relative text-center py-12 px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Academy
          </h1>
          <p className="text-xl md:text-2xl text-gray-300">
            Pelajari cryptocurrency dan blockchain dari Newbie hingga Expert
          </p>
        </div>
      </div>

      {/* Filter Status */}
      {(activeLevel || activeTopic || activeNetwork) && (
        <div className="mb-6 p-4 bg-duniacrypto-panel rounded-lg border border-gray-700">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-gray-300">Filter aktif:</span>
            {activeLevel && (
              <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm">
                {LEVEL_CATEGORIES.find(l => l.id === activeLevel)?.title}
              </span>
            )}
            {activeTopic && (
              <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm">
                {activeTopic}
              </span>
            )}
            {activeNetwork && (
              <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm">
                {activeNetwork}
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="px-3 py-1 bg-gray-600 text-white rounded-full text-sm hover:bg-gray-500 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* SECTION 1 - Kategori Level */}
      <section className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
          Pilih Level Pembelajaranmu
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LEVEL_CATEGORIES.map((level) => (
            <button
              key={level.id}
              onClick={() => handleLevelClick(level.id)}
              className={`p-0 rounded-lg border-2 border-blue-500 transition-all duration-200 text-left group relative overflow-hidden ${
                activeLevel === level.id
                  ? `${level.color} text-white shadow-lg transform scale-105`
                  : 'bg-duniacrypto-panel text-gray-300'
              }`}
              tabIndex={0}
            >
              {/* Hover overlay biru tipis */}
              <span className={`pointer-events-none absolute inset-0 rounded-lg bg-blue-500/10 transition-opacity duration-200 z-10 ${activeLevel === level.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></span>
              <div className="w-full relative z-20">
                <div className="relative w-full h-40 md:h-48 rounded-t-lg overflow-hidden bg-duniacrypto-panel">
                  <img
                    src={level.image}
                    alt={level.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/Asset/duniacrypto.png';
                    }}
                  />
                </div>
                <div className={`rounded-b-lg w-full flex flex-col justify-center items-start p-6 ${level.color} bg-opacity-80`}>
                  <h3 className="text-xl font-bold mb-2">{level.title}</h3>
                  <p className="text-sm opacity-80 mb-0">{level.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* SECTION 2 - Kategori Topik Crypto */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Topik Crypto
          </h2>
          {/* Mobile Dropdown Toggle */}
          <button
            onClick={() => setShowTopics(!showTopics)}
            className="md:hidden flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <span className="text-sm font-medium">
              {showTopics ? 'Sembunyikan' : 'Tampilkan'}
            </span>
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
        <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 transition-all duration-300 ${
          showTopics ? 'block' : 'hidden md:grid'
        }`}>
          {TOPIC_CATEGORIES.map((topic) => (
            <button
              key={topic}
              onClick={() => handleTopicClick(topic)}
              className={`p-3 rounded-lg border transition-all duration-200 text-sm font-medium no-underline ${
                activeTopic === topic
                  ? 'bg-blue-600 border-transparent text-white shadow-lg'
                  : 'bg-duniacrypto-panel border-gray-700 text-gray-300 hover:border-gray-600 hover:bg-gray-800'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </section>

      {/* SECTION 3 - Kategori Jaringan Blockchain */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Jaringan Blockchain
          </h2>
          {/* Mobile Dropdown Toggle */}
          <button
            onClick={() => setShowNetworks(!showNetworks)}
            className="md:hidden flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <span className="text-sm font-medium">
              {showNetworks ? 'Sembunyikan' : 'Tampilkan'}
            </span>
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
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 transition-all duration-300 ${
          showNetworks ? 'block' : 'hidden md:grid'
        }`}>
          {NETWORK_CATEGORIES.map((network) => (
            <button
              key={network}
              onClick={() => handleNetworkClick(network)}
              className={`p-3 rounded-lg border transition-all duration-200 text-sm font-medium no-underline ${
                activeNetwork === network
                  ? 'bg-purple-600 border-transparent text-white shadow-lg'
                  : 'bg-duniacrypto-panel border-gray-700 text-gray-300 hover:border-gray-600 hover:bg-gray-800'
              }`}
            >
              {network}
            </button>
          ))}
        </div>
      </section>

      {/* SECTION 4 - Artikel Terbaru */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Artikel Terbaru
          </h2>
          <span className="text-gray-400 text-sm">
            {filteredArticles.length} artikel ditemukan
          </span>
        </div>
        
        {displayedArticles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">
              Tidak ada artikel yang ditemukan
            </div>
            <button
              onClick={clearAllFilters}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Lihat Semua Artikel
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 max-w-6xl mx-auto">
              {displayedArticles.map((article) => (
                <Link
                  key={article._id}
                  href={`/${article.category === 'newsroom' ? 'newsroom' : 'academy'}/${article.slug.current}`}
                  className="group block no-underline hover:no-underline focus:no-underline active:no-underline"
                >
                  <div className="bg-duniacrypto-panel rounded-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:shadow-xl hover:transform hover:scale-105">
                    {/* Article Image */}
                    <div className="relative h-48 overflow-hidden">
                    <img
                      src={article.imageUrl || '/Asset/duniacrypto.png'}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = '/Asset/duniacrypto.png';
                        }}
                      />
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`inline-block px-2 py-1 rounded-full text-white font-bold text-xs ${
                          article.category === 'newsroom' ? 'bg-blue-700' : 'bg-blue-500'
                        }`}>
                          {article.category === 'newsroom' ? 'News' : 'Academy'}
                      </span>
                    </div>
                  </div>
                  
                    {/* Article Content */}
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors">
                      {article.title}
                      </h3>
                    {article.excerpt && (
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}
                    
                      {/* Article Meta */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{article.source || 'Dunia Crypto'}</span>
                        <span>
                          {isClient ? dayjs(article.publishedAt).fromNow() : 'Loading...'}
                        </span>
                      </div>

                      {/* Article Tags */}
                      {(article.level || article.topics || article.networks) && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {article.level && (
                            <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">
                              {article.level}
                            </span>
                          )}
                          {article.topics && (
                            <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
                              {article.topics}
                            </span>
                          )}
                          {article.networks && (
                            <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded">
                              {article.networks}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Load More Button */}
            {displayedArticles.length < filteredArticles.length && (
              <div className="text-center">
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-3 bg-duniacrypto-green text-black font-semibold rounded-lg hover:bg-duniacrypto-green/80 transition-colors"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
} 