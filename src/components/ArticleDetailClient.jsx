"use client";

import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/id';
import { CoinGeckoProvider } from './CoinGeckoContext';
import SubscribeContainer from './SubscribeContainer';
import { CoinLogosOnly } from './CoinTags';

// Configure dayjs
dayjs.extend(relativeTime);
dayjs.locale('id');

export default function ArticleDetailClient({ article, relatedArticles = [] }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <CoinGeckoProvider>
      {/* Main Layout - Same as homepage */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-4 md:py-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 flex-1 w-full">
        <section className="col-span-1 xl:col-span-2 space-y-4 md:space-y-6">
          {/* Article Header */}
          <div className="bg-duniacrypto-panel rounded-lg shadow overflow-hidden">
            {/* Featured Image - Same height as slider (400px) */}
            <div className="relative h-96 md:h-[400px]">
              <img
                src={article.imageUrl || '/Asset/duniacrypto.png'}
                alt={article.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/Asset/duniacrypto.png';
                }}
              />
              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <span className={`inline-block px-3 py-1.5 rounded-full text-white font-bold text-sm tracking-wide shadow-lg ${
                  article.category === 'newsroom' ? 'bg-blue-700' : 'bg-blue-500'
                }`}>
                  {article.category === 'newsroom' ? 'News' : 'Academy'}
                </span>
              </div>
              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4 md:p-6">
                {/* Coin tags above title (smaller than article title) */}
                {article.coinTags && article.coinTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {article.coinTags.slice(0, 8).map((tag) => (
                      <span
                        key={tag._id}
                        className="px-2 py-0.5 rounded bg-white/15 text-gray-100 text-[10px] sm:text-xs font-medium"
                        title={tag.name || tag.symbol}
                      >
                        {tag.symbol || tag.name}
                      </span>
                    ))}
                  </div>
                )}
                <h1 className="text-lg md:text-2xl font-bold text-white line-clamp-2 drop-shadow-lg mb-8">
                  {article.title}
                </h1>
                <div className="text-xs sm:text-sm text-gray-200 flex gap-2 items-center">
                  <span>{article.source || 'Dunia Crypto'}</span>
                  <span>•</span>
                  <span>{article.publishedAt ? dayjs(article.publishedAt).format('DD MMM YYYY HH:mm') : 'Baru saja'}</span>
                </div>
              </div>
            </div>
            
            {/* Article Excerpt */}
            {article.excerpt && (
              <div className="p-4 md:p-6 border-b border-gray-700">
                <div className="text-gray-200 text-base md:text-lg leading-relaxed">{article.excerpt}</div>
              </div>
            )}
          </div>
          
          {/* Article Content */}
          <div className="bg-duniacrypto-panel rounded-lg shadow p-4 md:p-6">
            <div className="text-gray-200 whitespace-pre-line leading-relaxed text-sm md:text-base">
              {article.content}
            </div>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="bg-duniacrypto-panel rounded-lg shadow p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6">Artikel Terkait</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {relatedArticles.slice(0, 4).map((relatedArticle) => (
                  <a
                    key={relatedArticle._id}
                    href={`/${relatedArticle.category === 'newsroom' ? 'newsroom' : 'academy'}/${relatedArticle.slug.current}`}
                    className="block group hover:bg-white/10 rounded-lg p-3 md:p-4 transition cursor-pointer no-underline hover:no-underline focus:no-underline active:no-underline border border-gray-700 hover:border-gray-600"
                  >
                    <div className="flex gap-3 md:gap-4">
                      <img
                        src={relatedArticle.imageUrl || '/Asset/duniacrypto.png'}
                        alt={relatedArticle.title}
                        className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg flex-shrink-0"
                        onError={(e) => {
                          e.target.src = '/Asset/duniacrypto.png';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-semibold text-sm md:text-base line-clamp-2 group-hover:text-blue-300 transition mb-2 leading-tight">
                          {relatedArticle.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span className={`inline-block px-2 py-1 rounded text-white font-medium ${
                            relatedArticle.category === 'newsroom' ? 'bg-blue-700' : 'bg-blue-500'
                          }`}>
                            {relatedArticle.category === 'newsroom' ? 'News' : 'Academy'}
                          </span>
                          <span>
                            {isClient ? dayjs(relatedArticle.publishedAt).fromNow() : 'Loading...'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 1 - Kategori Level */}
          <div className="mb-2">
            <div className="text-4xl md:text-5xl font-extrabold text-blue-400 mb-2">Belajar lagi yuk!</div>
            <div className="text-2xl md:text-3xl font-bold font-mono text-blue-500 mb-6">#allaboutcrypto</div>
          </div>
          <section className="mb-12 mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Pilih Level Pembelajaranmu</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { id: 'newbie', title: 'Newbie', color: 'bg-green-600', description: 'Mulai dari dasar cryptocurrency', image: '/Asset/duniacrypto.png' },
                { id: 'intermediate', title: 'Intermediate', color: 'bg-yellow-600', description: 'Tingkatkan pengetahuan blockchain', image: '/Asset/duniacrypto.png' },
                { id: 'expert', title: 'Expert', color: 'bg-red-600', description: 'Mahir dalam teknologi crypto', image: '/Asset/duniacrypto.png' }
              ].map((level) => (
                <div
                  key={level.id}
                  className={`p-0 rounded-lg border-2 border-blue-500 transition-all duration-200 text-left group bg-duniacrypto-panel text-gray-300 hover:bg-gray-800 flex flex-col h-full cursor-pointer`}
                  tabIndex={0}
                  onClick={() => { window.location.href = `/academy?level=${level.id}`; }}
                >
                  <div className="w-full flex flex-col h-full">
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
                    <div className={`rounded-b-lg w-full flex flex-col justify-center items-start p-6 ${level.color} bg-opacity-80 flex-1`}>
                      <h3 className="text-xl font-bold mb-0 text-center w-full">{level.title}</h3>
                      <p className="text-sm opacity-80 mb-0 text-center w-full">{level.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 2 - Kategori Topik Crypto */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Topik Crypto</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {['DeFi', 'NFT', 'Wallet', 'Blockchain', 'Trading', 'Airdrop', 'Security', 'Tokenomics', 'Stablecoin', 'GameFi', 'Web3', 'DAO', 'Mining', 'Metaverse'].map((topic) => (
                <button
                  key={topic}
                  className="p-3 rounded-lg border transition-all duration-200 text-sm font-medium no-underline bg-duniacrypto-panel border-gray-700 text-gray-300 hover:border-gray-600 hover:bg-gray-800"
                  onClick={() => { window.location.href = `/academy?topic=${encodeURIComponent(topic)}`; }}
                >
                  {topic}
                </button>
              ))}
            </div>
          </section>

          {/* SECTION 3 - Kategori Jaringan Blockchain */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Jaringan Blockchain</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {['Bitcoin Network', 'Ethereum Network', 'Binance Smart Chain (BSC)', 'Solana Network', 'Polygon Network', 'Avalanche Network', 'Arbitrum Network', 'Cardano Network'].map((network) => (
                <button
                  key={network}
                  className="p-3 rounded-lg border transition-all duration-200 text-sm font-medium no-underline bg-duniacrypto-panel border-gray-700 text-gray-300 hover:border-gray-600 hover:bg-gray-800"
                  onClick={() => { window.location.href = `/academy?network=${encodeURIComponent(network)}`; }}
                >
                  {network}
                </button>
              ))}
            </div>
          </section>
        </section>

        {/* Sidebar - Same as homepage */}
        <aside className="col-span-1 space-y-4 md:gap-6">
          {/* Subscribe for Crypto Updates - Same as homepage */}
          <SubscribeContainer 
            containerClassName="w-full max-w-full mt-0 mb-8"
            className=""
          />
        </aside>
      </main>
    </CoinGeckoProvider>
  );
}