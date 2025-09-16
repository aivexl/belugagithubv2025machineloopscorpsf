"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/id';
import { useAcademyFilters } from './AcademyFiltersProvider';
import { client } from '../sanity/lib/client';
import { validateAndGetImageUrl } from '../utils/sanityImageUtils';
import { CoinLogosOnly } from './CoinTags';

// Configure dayjs
dayjs.extend(relativeTime);
dayjs.locale('id');

// ENTERPRISE-LEVEL SANITY QUERY FUNCTION
async function getArticlesByCategory(category) {
  try {
    console.log('AcademyClientEnterprise: Fetching articles from Sanity for category:', category);
    
    const query = `
      *[_type == "article" && category == $category] | order(publishedAt desc) {
        _id,
        title,
        slug,
        excerpt,
        content,
        "mainImage": image.asset->url,
        "imageAsset": {
          "_ref": image.asset._ref,
          "_type": image.asset._type
        },
        category,
        source,
        publishedAt,
        featured,
        showInSlider,
        level,
        topics,
        networks,
        coinTags[]->{
          _id,
          name,
          symbol,
          logo,
          category,
          isActive
        }
      }
    `;
    
    const data = await client.fetch(query, { category });
    
    console.log('AcademyClientEnterprise: Raw Sanity response:', {
      totalArticles: data?.length || 0,
      sampleArticle: data?.[0] || null,
      imageData: data?.[0]?.mainImage || 'No image URL'
    });
    
    return data;
  } catch (error) {
    console.error('AcademyClientEnterprise: Sanity query failed:', error);
    throw error;
  }
}

// ENTERPRISE-LEVEL IMAGE COMPONENT WITH BULLETPROOF ERROR HANDLING
function EnterpriseImageComponent({ src, alt, className, priority = false }) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  // STRATEGIC DECISION: Professional fallback for any image failures
  if (imageError) {
    return (
      <div className={`${className} bg-gradient-to-br from-blue-900/50 to-purple-900/50 flex items-center justify-center p-4`}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-3 bg-blue-600/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 5.477 9.246 5 7.5 5s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 19 16.5 19c-1.746 0-3.332-.477-4.5-1.253" />
            </svg>
          </div>
          <h4 className="text-white font-semibold text-sm mb-1">Academy Article</h4>
          <p className="text-blue-200 text-xs">{alt || 'Learning Content'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative overflow-hidden`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading={priority ? 'eager' : 'lazy'}
      />
    </div>
  );
}

export default function AcademyClientEnterprise() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayCount, setDisplayCount] = useState(9);
  const { activeLevel, activeTopic, activeNetwork } = useAcademyFilters();

  // ENTERPRISE-LEVEL DATA FETCHING FROM REAL SANITY CMS
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);

        // ENTERPRISE-LEVEL: Add performance monitoring
        const startTime = performance.now();
        
        // Fetch real articles from Sanity
        const data = await getArticlesByCategory('academy');
        
        const fetchTime = performance.now() - startTime;
        
        // ENTERPRISE-LEVEL: Validate data structure
        if (!data || !Array.isArray(data)) {
          throw new Error(`Invalid data structure received: ${typeof data}`);
        }
        
        // Transform articles to include proper image URLs using enterprise-level utility
        const articlesWithImages = data.map(article => {
          let imageUrl = '/Asset/duniacrypto.png'; // Default fallback
          
          // ENTERPRISE-LEVEL IMAGE PROCESSING: Multiple fallback strategies
          if (article.mainImage && typeof article.mainImage === 'string' && article.mainImage.trim() !== '') {
            // Use direct Sanity URL if available
            imageUrl = article.mainImage;
          } else if (article.imageAsset && article.imageAsset._ref) {
            // Generate URL using our utility function
            try {
              const generatedUrl = validateAndGetImageUrl(article.imageAsset, '/Asset/duniacrypto.png');
              if (generatedUrl && generatedUrl !== '/Asset/duniacrypto.png') {
                imageUrl = generatedUrl;
              }
            } catch (error) {
              console.warn('AcademyClientEnterprise: Image generation failed for article:', article.title, error);
            }
          }
          
          return {
            ...article,
            mainImage: imageUrl
          };
        });
        
        setArticles(articlesWithImages);
        
        const totalTime = performance.now() - startTime;
        
      } catch (error) {
        console.error('AcademyClientEnterprise: Error loading articles from Sanity:', error);
        
        // ENTERPRISE-LEVEL: Provide user-friendly error messages
        let userMessage = 'Failed to load articles from CMS. Please try again later.';
        
        if (error instanceof Error) {
          if (error.message.includes('timeout')) {
            userMessage = 'Request timed out. Please check your connection and try again.';
          } else if (error.message.includes('Network error')) {
            userMessage = 'Network connection issue. Please check your internet connection.';
          } else if (error.message.includes('Server error')) {
            userMessage = 'Server temporarily unavailable. Please try again in a few minutes.';
          } else if (error.message.includes('API endpoint not found')) {
            userMessage = 'Service configuration error. Please contact support.';
          }
        }
        
        setError(userMessage);
        setArticles([]); // Empty array on error
        
        // ENTERPRISE-LEVEL: Log detailed error for debugging
        console.error('AcademyClientEnterprise: Detailed error analysis:', {
          errorType: error?.constructor?.name,
          errorMessage: error?.message,
          errorStack: error?.stack,
          timestamp: new Date().toISOString()
        });
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // ENTERPRISE-LEVEL FILTERING WITH PERFORMANCE OPTIMIZATION
  const filteredArticles = useMemo(() => {
    let filtered = articles;

    // Apply level filter
    if (activeLevel && activeLevel !== 'all') {
      filtered = filtered.filter(article => article.level === activeLevel);
    }

    // Apply topic filter
    if (activeTopic && activeTopic !== 'all') {
      filtered = filtered.filter(article => article.topics === activeTopic);
    }

    // Apply network filter
    if (activeNetwork && activeNetwork !== 'all') {
      filtered = filtered.filter(article => article.networks === activeNetwork);
    }

    return filtered;
  }, [articles, activeLevel, activeTopic, activeNetwork]);

  // ENTERPRISE-LEVEL LOADING STATE
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  // ENTERPRISE-LEVEL ERROR STATE
  if (error && articles.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="text-red-400 text-lg mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  // ENTERPRISE-LEVEL EMPTY STATE
  if (filteredArticles.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">Academy Articles</h1>
        </div>

        <div className="text-center py-16">
          <div className="text-gray-400 text-lg mb-4">
            No articles found matching your criteria.
          </div>
          <p className="text-gray-500">
            Try adjusting your filters or check back later for new content.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ENTERPRISE-LEVEL HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Academy Articles</h1>
      </div>

      {/* ARTICLES SECTION - PIXEL-PERFECT DESIGN PRESERVATION */}
      <section>
        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredArticles.slice(0, displayCount).map((article) => (
            <Link
              key={article._id}
              href={`/academy/${article.slug?.current || article.slug}`}
              className="block group no-underline hover:no-underline focus:no-underline active:no-underline"
            >
              <div className="bg-duniacrypto-panel border border-gray-700 rounded-lg overflow-hidden hover:border-gray-600 transition-colors group h-full flex flex-col">
                {/* Article Image - ENTERPRISE-LEVEL BULLETPROOF SYSTEM */}
                <div className="aspect-video bg-gray-800 overflow-hidden">
                  <EnterpriseImageComponent
                    src={article.mainImage}
                    alt={article.title || 'Academy Article'}
                    className="w-full h-full"
                    priority={false}
                  />
                </div>

                {/* Article Content - EXACT PIXEL-PERFECT DESIGN */}
                <div className="p-4 flex flex-col flex-1">
                  {/* Category Badge */}
                  <div className="mb-3">
          {/* Label and Coin Logos in same row */}
          <div className="flex items-center gap-1.5 mb-1">
            <span className="px-1.5 py-0.5 text-xs font-medium rounded text-white bg-blue-500">
                      Academy
                    </span>
            {/* Coin Logos Beside Label */}
            {article.coinTags && article.coinTags.length > 0 && (
              <CoinLogosOnly 
                coinTags={article.coinTags} 
                size="xs"
                maxDisplay={2}
              />
            )}
          </div>
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
        
        {/* Load More Button - EXACT PIXEL-PERFECT DESIGN */}
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
      </section>
    </div>
  );
}
