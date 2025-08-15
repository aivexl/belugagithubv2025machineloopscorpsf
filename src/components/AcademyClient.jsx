"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/id';
import StarBorder from './StarBorder';
import { useAcademyFilters } from './AcademyFiltersProvider';

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
  const { 
    activeLevel, 
    activeTopic, 
    activeNetwork, 
    handleLevelClick, 
    handleTopicClick, 
    handleNetworkClick, 
    clearAllFilters 
  } = useAcademyFilters();
  
  const [isClient, setIsClient] = useState(false);
  const [displayCount, setDisplayCount] = useState(9);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Filter articles based on active filters
  const filteredArticles = articles.filter(article => {
    let matchesLevel = true;
    let matchesTopic = true;
    let matchesNetwork = true;

    if (activeLevel) {
      if (Array.isArray(article.level)) {
        matchesLevel = article.level.includes(activeLevel);
      } else {
        matchesLevel = article.level === activeLevel;
      }
    }

    if (activeTopic) {
      if (Array.isArray(article.topics)) {
        matchesTopic = article.topics.some(topic => 
          topic && topic.toLowerCase().includes(activeTopic.toLowerCase())
        );
      } else {
        matchesTopic = article.topics && article.topics.toLowerCase().includes(activeTopic.toLowerCase());
      }
    }

    if (activeNetwork) {
      if (Array.isArray(article.networks)) {
        matchesNetwork = article.networks.some(network => 
          network && network.toLowerCase().includes(activeNetwork.toLowerCase())
        );
      } else {
        matchesNetwork = article.networks && article.networks.toLowerCase().includes(activeNetwork.toLowerCase());
      }
    }

    return matchesLevel && matchesTopic && matchesNetwork;
  });

  const displayedArticles = filteredArticles.slice(0, displayCount);

  // Wrapper functions that also reset display count
  const wrappedHandleLevelClick = (level) => {
    handleLevelClick(level);
    setDisplayCount(9);
  };

  const wrappedHandleTopicClick = (topic) => {
    handleTopicClick(topic);
    setDisplayCount(9);
  };

  const wrappedHandleNetworkClick = (network) => {
    handleNetworkClick(network);
    setDisplayCount(9);
  };

  const wrappedClearAllFilters = () => {
    clearAllFilters();
    setDisplayCount(9);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Artikel Terbaru */}
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
              onClick={wrappedClearAllFilters}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Lihat Semua Artikel
            </button>
          </div>
        ) : (
          <>
            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {displayedArticles.map((article) => (
                <Link key={article._id} href={`/academy/${article.slug?.current || article.slug}`} className="no-underline hover:no-underline focus:no-underline active:no-underline">
                  <div className="bg-duniacrypto-panel border border-gray-700 rounded-lg overflow-hidden hover:border-gray-600 transition-colors group h-full flex flex-col">
                    {/* Article Image */}
                    <div className="aspect-video bg-gray-800 overflow-hidden">
                      {article.imageUrl ? (
                    <img
                          src={article.imageUrl}
                        alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                          <span className="text-gray-300 text-sm">No Image</span>
                    </div>
                      )}
                  </div>
                  
                    {/* Article Content */}
                    <div className="p-4 flex flex-col flex-1">
                      {/* Tags - Moved to top, ordered: Level → Topics → Networks */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {/* Level tags (First) */}
                        {article.level && (
                          Array.isArray(article.level) ? (
                            article.level.map((level, index) => (
                              <span key={`level-${index}`} className={`px-2 py-1 text-white text-xs rounded ${
                                level === 'newbie' ? 'bg-green-600' :
                                level === 'intermediate' ? 'bg-yellow-600' :
                                'bg-red-600'
                              }`}>
                                {level}
                        </span>
                            ))
                          ) : (
                            <span className={`px-2 py-1 text-white text-xs rounded ${
                              article.level === 'newbie' ? 'bg-green-600' :
                              article.level === 'intermediate' ? 'bg-yellow-600' :
                              'bg-red-600'
                            }`}>
                              {article.level}
                            </span>
                          )
                          )}
                        
                        {/* Topics tags (Second) */}
                          {article.topics && (
                          Array.isArray(article.topics) ? (
                            article.topics.map((topic, index) => (
                              <span key={`topic-${index}`} className="px-2 py-1 bg-blue-900/50 text-blue-300 text-xs rounded">
                                {topic}
                              </span>
                            ))
                          ) : (
                            <span className="px-2 py-1 bg-blue-900/50 text-blue-300 text-xs rounded">
                              {article.topics}
                            </span>
                          )
                          )}
                        
                        {/* Networks tags (Third) */}
                          {article.networks && (
                          Array.isArray(article.networks) ? (
                            article.networks.map((network, index) => (
                              <span key={`network-${index}`} className="px-2 py-1 bg-purple-900/50 text-purple-300 text-xs rounded">
                                {network}
                              </span>
                            ))
                          ) : (
                            <span className="px-2 py-1 bg-purple-900/50 text-purple-300 text-xs rounded">
                              {article.networks}
                            </span>
                          )
                        )}
                        
                        {/* Fallback if no tags */}
                        {!article.topics && !article.networks && !article.level && (
                          <span className="px-2 py-1 bg-gray-700 text-gray-400 text-xs rounded">
                            General
                            </span>
                          )}
                        </div>

                      {/* Title */}
                      <h3 className="text-lg font-semibold text-white line-clamp-2 group-hover:text-blue-400 transition-colors min-h-[3.5rem]">
                        {article.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Load More Button */}
            {displayCount < filteredArticles.length && (
              <div className="text-center">
                <button
                  onClick={() => setDisplayCount(prev => Math.min(prev + 3, filteredArticles.length))}
                  className="mt-4 w-full py-2 rounded bg-duniacrypto-green text-black font-bold hover:bg-green-400 transition"
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
} 
                      </p>

                    )}

                    

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {article.topic && (
                          <span className="px-2 py-1 bg-blue-900/50 text-blue-300 text-xs rounded">
                            {article.topic}
                            </span>


                          )}

                        {article.blockchain && (
                          <span className="px-2 py-1 bg-purple-900/50 text-purple-300 text-xs rounded">
                            {article.blockchain}
                            </span>


                          )}


                        </div>


                    </div>


                  </div>


                </Link>


              ))}


            </div>

            
            
            {/* Load More Button */}


            {displayCount < filteredArticles.length && (
              <div className="text-center">


                <button


                  onClick={() => setDisplayCount(prev => prev + 9)}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >


                  Lihat Lebih Banyak ({filteredArticles.length - displayCount} tersisa)
                </button>


              </div>


            )}


          </>


        )}


      </section>


    </div>


  );


} 