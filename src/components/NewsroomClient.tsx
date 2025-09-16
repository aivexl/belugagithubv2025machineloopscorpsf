"use client";

import React, { useState } from "react";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/id';
import type { SanityArticleWithImage } from '../utils/sanity';
import { CoinLogosOnly } from './CoinTags';

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

interface NewsroomClientProps {
  articles?: SanityArticleWithImage[];
}

export default function NewsroomClient({ articles = [] }: NewsroomClientProps) {
  const [displayCount, setDisplayCount] = useState(9);
  
  // Use dummy articles if no articles from Sanity
  const allArticles = articles.length > 0 ? articles : dummyNewsroomArticles;
  const displayedArticles = allArticles.slice(0, displayCount);

  const handleLoadMore = () => {
    setDisplayCount(prev => Math.min(prev + 3, allArticles.length));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Articles Section */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Berita Terbaru
          </h2>
        </div>
        
        {displayedArticles.length > 0 ? (
          <>
            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {displayedArticles.map((article) => (
                <a 
                  key={article._id}
                  href={`/newsroom/${article.slug?.current || article.slug}`}
                  className="no-underline hover:no-underline focus:no-underline active:no-underline"
                >
                  <div className="bg-duniacrypto-panel border border-gray-700 rounded-lg overflow-hidden hover:border-gray-600 transition-colors group h-full flex flex-col">
                    {/* Article Image */}
                    <div className="aspect-video bg-gray-800 overflow-hidden">
                      <img
                        src={article.imageUrl || '/Asset/duniacrypto.png'}
                        alt={article.image?.alt || article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Article Content */}
                    <div className="p-4 flex flex-col flex-1">
                      {/* Category Badge */}
                      <div className="mb-3">
                        {/* Label and Coin Logos in same row */}
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 text-xs font-medium rounded text-white bg-blue-600">
                            News
                          </span>
                          {/* Coin Logos Beside Label */}
                          {article.coinTags && article.coinTags.length > 0 && (
                            <CoinLogosOnly 
                              coinTags={article.coinTags} 
                              size="xs"
                              maxDisplay={3}
                            />
                          )}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors min-h-[3.5rem]">
                        {article.title}
                      </h3>

                      {/* Excerpt - Fixed height */}
                      <div className="flex-1 mb-3">
                        {article.excerpt ? (
                          <p className="text-gray-400 text-sm line-clamp-3">
                            {article.excerpt}
                          </p>
                        ) : (
                          <p className="text-gray-500 text-sm italic">
                            No excerpt available
                          </p>
                        )}
                      </div>

                      {/* Source and Date - Fixed at bottom */}
                      <div className="flex justify-between items-center mt-auto">
                        <span className="px-2 py-1 bg-gray-700 text-gray-400 text-xs rounded">
                          {article.source || 'Dunia Crypto'}
                        </span>
                        {/* Date at bottom right */}
                        {article.publishedAt && (
                          <div className="text-xs text-gray-400">
                            {dayjs(article.publishedAt).fromNow()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Load More Button */}
            {displayCount < allArticles.length && (
              <div className="text-center">
                <button
                  onClick={handleLoadMore}
                  className="mt-4 w-full py-2 rounded bg-duniacrypto-green text-black font-bold hover:bg-green-400 transition"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">
              Belum ada artikel Newsroom
            </div>
            <p className="text-gray-500">
              Artikel Newsroom akan muncul di sini setelah ditambahkan melalui Sanity Studio.
            </p>
          </div>
        )}
      </section>
    </div>
  );
} 