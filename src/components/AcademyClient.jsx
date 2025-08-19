"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAcademyFilters } from './AcademyFiltersProvider';
// Import custom Sanity client and image utilities
import { client } from '../sanity/lib/client';
import { validateAndGetImageUrl } from '../utils/sanityImageUtils';
// Import enterprise-level image component
import { ArticleThumbnail } from './EnterpriseImage';
import ImageDebugPanel from './ImageDebugPanel';

// Function to fetch academy articles using custom client with complete image data
async function getArticlesByCategory(category) {
  const query = `
    *[_type == "article" && category == $category] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      content,
      "image": {
        "asset": {
          "_ref": image.asset._ref,
          "_type": image.asset._type
        },
        "hotspot": image.hotspot,
        "crop": image.crop,
        "alt": image.alt
      },
      category,
      source,
      publishedAt,
      featured,
      showInSlider,
      level,
      topics,
      networks
    }
  `;
  return client.fetch(query, { category });
}

export default function AcademyClient() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayCount, setDisplayCount] = useState(9);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const { activeLevel, activeTopic, activeNetwork } = useAcademyFilters();
  
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getArticlesByCategory('academy');
        
        // ENTERPRISE-LEVEL DEBUGGING: Log the raw data structure
        console.log('AcademyClient: Raw Sanity data received:', {
          totalArticles: data?.length || 0,
          sampleArticle: data?.[0] || null,
          imageStructure: data?.[0]?.image || null
        });
        
        // Transform articles to include proper image URLs using enterprise-level utility function
        const articlesWithImages = data.map(article => {
          const imageUrl = validateAndGetImageUrl(article.image, '/Asset/duniacrypto.png');
          
          // ENTERPRISE-LEVEL DEBUGGING: Log each article's image transformation
          console.log('AcademyClient: Article image transformation:', {
            articleId: article._id,
            articleTitle: article.title,
            originalImage: article.image,
            transformedImageUrl: imageUrl
          });
          
          return {
            ...article,
            mainImage: imageUrl
          };
        });
        
        setArticles(articlesWithImages);
      } catch (error) {
        console.error('Error fetching academy articles:', error);
        setError('Failed to load articles. Please try again later.');
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const filteredArticles = useMemo(() => {
    let filtered = articles;

    if (activeLevel && activeLevel !== 'all') {
      filtered = filtered.filter(article => {
        return article.level === activeLevel;
      });
    }

    if (activeTopic && activeTopic !== 'all') {
      filtered = filtered.filter(article => {
        return article.topics === activeTopic;
      });
    }

    if (activeNetwork && activeNetwork !== 'all') {
      filtered = filtered.filter(article => {
        return article.networks === activeNetwork;
      });
    }

    return filtered;
  }, [articles, activeLevel, activeTopic, activeNetwork]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-400 text-lg mb-4">
          {error}
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (filteredArticles.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No articles found matching your criteria.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ENTERPRISE-LEVEL DEBUG CONTROLS */}
      <div className="mb-6 flex justify-between items-center">
        <div className="text-left">
          <h1 className="text-2xl font-bold text-white mb-2">Academy Articles</h1>
          <p className="text-gray-400 text-sm">
            Total: {articles.length} • With Images: {articles.filter(a => a.mainImage && a.mainImage !== '/Asset/duniacrypto.png').length}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowDebugPanel(!showDebugPanel)}
            className={`px-3 py-2 rounded-md text-xs font-medium transition-colors ${
              showDebugPanel 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {showDebugPanel ? '🔒 Hide Debug' : '🔍 Debug Images'}
          </button>
        </div>
      </div>

      {/* Articles Section */}
      <section>
        {filteredArticles.length > 0 ? (
          <>
            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredArticles.slice(0, displayCount).map((article) => (
                <Link
                  key={article._id}
                  href={`/academy/${article.slug?.current || article.slug}`}
                  className="block group no-underline hover:no-underline focus:no-underline active:no-underline"
                >
                  <div className="bg-duniacrypto-panel border border-gray-700 rounded-lg overflow-hidden hover:border-gray-600 transition-colors group h-full flex flex-col">
                    {/* Article Image - Enterprise-Level Component */}
                    <div className="aspect-video bg-gray-800 overflow-hidden">
                                             {/* ENTERPRISE-LEVEL IMAGE HANDLING: Bulletproof fallback system */}
                       {article.mainImage && article.mainImage !== '/Asset/duniacrypto.png' ? (
                         <ArticleThumbnail
                           src={article.mainImage}
                           alt={article.title || 'Academy Article'}
                           className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                           priority={false}
                         />
                       ) : (
                         /* Fallback: Professional placeholder with article info */
                         <div className="w-full h-full bg-gradient-to-br from-blue-900/50 to-purple-900/50 flex items-center justify-center p-4">
                           <div className="text-center">
                             <div className="w-16 h-16 mx-auto mb-3 bg-blue-600/20 rounded-full flex items-center justify-center">
                               <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 5.477 9.246 5 7.5 5s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 19 16.5 19c-1.746 0-3.332-.477-4.5-1.253" />
                               </svg>
                             </div>
                             <h4 className="text-white font-semibold text-sm mb-1">Academy Article</h4>
                             <p className="text-blue-200 text-xs">{article.title || 'Learning Content'}</p>
                           </div>
                         </div>
                       )}
                    </div>

                    {/* Article Content */}
                    <div className="p-4 flex flex-col flex-1">
                      {/* Category Badge */}
                      <div className="mb-3">
                        <span className="px-2 py-1 text-xs font-medium rounded text-white bg-blue-500">
                          Academy
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors min-h-[3.5rem] no-underline hover:no-underline focus:no-underline active:no-underline">
                        {article.title}
                      </h3>

                      {/* Tags - Fixed at bottom */}
                      <div className="flex flex-wrap gap-1 mt-auto">
                        {/* Level Tag */}
                        {article.level && (
                          <span className="px-2 py-1 bg-green-900/50 text-green-300 text-xs rounded">
                            {article.level}
                          </span>
                        )}
                        
                        {/* Topics Tag */}
                        {article.topics && (
                          <span className="px-2 py-1 bg-blue-900/50 text-blue-300 text-xs rounded">
                            {article.topics}
                          </span>
                        )}
                        
                        {/* Networks Tag */}
                        {article.networks && (
                          <span className="px-2 py-1 bg-purple-900/50 text-purple-300 text-xs rounded">
                            {article.networks}
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
                  onClick={() => setDisplayCount(prev => Math.min(prev + 3, filteredArticles.length))}
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
              Belum ada artikel Academy
            </div>
            <p className="text-gray-500">
              Artikel Academy akan muncul di sini setelah ditambahkan melalui Sanity Studio.
            </p>
          </div>
        )}
      </section>
      
      {/* ENTERPRISE-LEVEL DEBUG PANEL */}
      <ImageDebugPanel
        articles={articles}
        isVisible={showDebugPanel}
        onClose={() => setShowDebugPanel(false)}
      />
    </div>
  );
} 