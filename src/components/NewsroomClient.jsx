"use client";

import React, { useState } from "react";
import { CoinGeckoProvider } from "./CoinGeckoContext";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/id';

// Configure dayjs
dayjs.extend(relativeTime);
dayjs.locale('id');

// Dummy articles for Newsroom
const dummyNewsroomArticles = Array.from({ length: 20 }, (_, i) => ({
  _id: `newsroom-${i + 1}`,
  title: `Berita Crypto Terbaru ${i + 1}: ${[
    'Bitcoin Mencapai Level Tertinggi Baru',
    'Ethereum 2.0 Update Terbaru',
    'Regulasi Crypto di Indonesia',
    'DeFi Protocol Terbaru',
    'NFT Marketplace Populer',
    'Stablecoin dan Dampaknya',
    'Mining Bitcoin di Indonesia',
    'Exchange Crypto Terpercaya',
    'Wallet Digital Terbaik',
    'Trading Strategy Crypto',
    'Market Analysis Hari Ini',
    'Altcoin yang Menjanjikan',
    'Blockchain Technology Update',
    'Smart Contract Security',
    'Cross-chain Bridge Terbaru',
    'DAO Governance Model',
    'Privacy Coin Development',
    'Layer 2 Scaling Solution',
    'GameFi dan Metaverse',
    'Crypto Investment Tips'
  ][i % 20]}`,
  excerpt: `Berita terbaru seputar ${[
    'pergerakan harga Bitcoin yang mencapai level tertinggi baru',
    'pembaruan Ethereum 2.0 yang membawa perubahan signifikan',
    'regulasi cryptocurrency yang sedang dibahas di Indonesia',
    'protocol DeFi terbaru yang menarik perhatian investor',
    'marketplace NFT yang semakin populer di kalangan kolektor',
    'stablecoin dan dampaknya terhadap stabilitas pasar crypto',
    'aktivitas mining Bitcoin yang berkembang di Indonesia',
    'exchange crypto yang terpercaya untuk trading',
    'wallet digital terbaik untuk menyimpan aset crypto',
    'strategi trading crypto yang efektif untuk pemula',
    'analisis market crypto hari ini dan prediksi ke depan',
    'altcoin yang menjanjikan untuk investasi jangka panjang',
    'perkembangan teknologi blockchain yang terbaru',
    'keamanan smart contract dan best practices',
    'cross-chain bridge terbaru untuk interoperability',
    'model governance DAO yang inovatif',
    'perkembangan privacy coin untuk privasi transaksi',
    'solusi scaling Layer 2 untuk meningkatkan throughput',
    'trend GameFi dan metaverse dalam dunia crypto',
    'tips investasi crypto yang aman dan menguntungkan'
  ][i % 20]}.`,
  content: `Ini adalah konten lengkap berita crypto nomor ${i + 1}. Berita ini membahas secara mendalam tentang perkembangan terbaru dalam dunia cryptocurrency dan blockchain. Pembaca akan mendapatkan informasi yang akurat dan terpercaya tentang berbagai aspek crypto.`,
  slug: { current: `newsroom-article-${i + 1}` },
  category: 'newsroom',
  source: 'Dunia Crypto News',
  publishedAt: new Date(Date.now() - i * 86400000).toISOString(),
  imageUrl: `/Asset/duniacrypto.png`,
  featured: i < 3
}));

export default function NewsroomClient({ articles = [] }) {
  const [displayCount, setDisplayCount] = useState(9);
  
  // Use dummy articles if no articles from Sanity
  const allArticles = articles.length > 0 ? articles : dummyNewsroomArticles;
  const displayedArticles = allArticles.slice(0, displayCount);
  const hasMore = displayCount < allArticles.length;

  const handleLoadMore = () => {
    setDisplayCount(prev => Math.min(prev + 3, allArticles.length));
  };

  return (
    <CoinGeckoProvider>
      {/* Main Layout - Responsive width */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-6">
        {/* Header - Responsive */}
        <div className="relative mb-8 md:mb-12">
          {/* Background Full Width */}
          <div className="absolute inset-x-0 top-0 bottom-0 bg-gradient-to-r from-cyan-900/20 via-blue-900/20 to-purple-900/20 rounded-xl border border-cyan-500/30 backdrop-blur-sm"></div>
          {/* Content */}
          <div className="relative text-center py-8 md:py-12 px-4 md:px-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Newsroom</h1>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-300">
              Berita terbaru seputar cryptocurrency dan blockchain
            </p>
          </div>
        </div>
        
        {/* Articles List - Responsive layout */}
        {displayedArticles.length > 0 ? (
          <>
            <div className="space-y-4 mb-8 md:mb-12">
              {displayedArticles.map((article) => (
                <a 
                  key={article._id}
                  href={`/newsroom/${article.slug.current}`}
                  className="block bg-duniacrypto-panel rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-gray-800 cursor-pointer transform hover:scale-[1.02] no-underline hover:no-underline focus:no-underline active:no-underline"
                >
                  {/* Article Content - Responsive layout */}
                  <div className="flex flex-col md:flex-row">
                    {/* Article Image - Responsive width */}
                    <div className="relative aspect-[4/3] w-full md:w-48 lg:w-60 xl:w-72 h-auto overflow-hidden flex-shrink-0">
                      <img
                        src={article.imageUrl || '/Asset/duniacrypto.png'}
                        alt={article.image?.alt || article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="inline-block px-2 py-1 rounded-full bg-blue-700 text-white font-bold text-xs tracking-wide shadow-lg">
                          News
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    
                    {/* Article Content - Responsive padding */}
                    <div className="flex-1 p-4 md:p-5 min-w-0">
                      <h2 className="text-base md:text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-duniacrypto-green transition-colors duration-300 leading-tight">
                        {article.title}
                      </h2>
                      
                      {article.excerpt && (
                        <p className="text-gray-300 text-sm mb-3 line-clamp-2 leading-relaxed">
                          {article.excerpt}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-800">
                        <span className="font-medium">{article.source || 'Dunia Crypto'}</span>
                        <span>{article.publishedAt ? dayjs(article.publishedAt).fromNow() : 'Baru saja'}</span>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
            
            {/* Load More Button */}
            {hasMore && (
              <div className="text-center">
                <button
                  onClick={handleLoadMore}
                  className="bg-duniacrypto-green hover:bg-green-600 text-white font-semibold py-3 md:py-4 px-8 md:px-10 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-base md:text-lg"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-duniacrypto-panel rounded-lg shadow p-8 md:p-12 text-center">
            <h3 className="text-xl md:text-2xl font-semibold text-white mb-4">
              Belum ada artikel Newsroom
            </h3>
            <p className="text-gray-400 text-base md:text-lg">
              Artikel Newsroom akan muncul di sini setelah ditambahkan melalui Sanity Studio.
            </p>
          </div>
        )}
      </main>
    </CoinGeckoProvider>
  );
} 