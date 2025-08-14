"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/id';

// Configure dayjs
dayjs.extend(relativeTime);
dayjs.locale('id');

export default function SearchClient({ query: initialQuery = '' }) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [displayCount, setDisplayCount] = useState(9);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const query = searchParams.get('q') || '';
    setSearchQuery(query);
    if (query) {
      performSearch(query);
    }
  }, [searchParams]);

  const performSearch = async (query) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setHasSearched(true);
    setDisplayCount(9); // Reset display count for new search
    
    try {
      // Search both categories
      const [newsroomResponse, academyResponse] = await Promise.all([
        fetch(`/api/search?q=${encodeURIComponent(query)}&category=newsroom`),
        fetch(`/api/search?q=${encodeURIComponent(query)}&category=academy`)
      ]);

      const [newsroomResults, academyResults] = await Promise.all([
        newsroomResponse.json(),
        academyResponse.json()
      ]);

      // Combine and sort results by publishedAt
      const combinedResults = [...newsroomResults, ...academyResults]
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

      setSearchResults(combinedResults);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLoadMore = () => {
    setDisplayCount(prev => Math.min(prev + 3, searchResults.length));
  };

  // Get displayed articles based on displayCount
  const displayedArticles = searchResults.slice(0, displayCount);
  const hasMore = displayCount < searchResults.length;

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-4 md:py-6">
      {/* Search Header */}
      <div className="bg-duniacrypto-panel rounded-lg shadow p-6 mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">Search Articles</h1>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 pr-16 bg-duniacrypto-bg-darker border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
            {/* Search Icon */}
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition-colors duration-200"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Search Results */}
      <div className="space-y-6">
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="text-gray-400 mt-4">Searching...</p>
          </div>
        )}

        {!isLoading && hasSearched && searchQuery && (
          <div className="mb-6">
            <p className="text-gray-300">
              {searchResults.length === 0 
                ? `No results found for "${searchQuery}"`
                : `Found ${searchResults.length} result${searchResults.length === 1 ? '' : 's'} for "${searchQuery}"`
              }
            </p>
          </div>
        )}

        {!isLoading && displayedArticles.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {displayedArticles.map((article) => (
                <Link
                  key={article._id}
                  href={`/${article.category === 'newsroom' ? 'newsroom' : 'academy'}/${article.slug.current}`}
                  className="block bg-duniacrypto-panel rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-gray-800 cursor-pointer transform hover:scale-105 no-underline hover:no-underline focus:no-underline active:no-underline"
                >
                  {/* Article Image - Better proportions like academy */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={article.imageUrl || '/Asset/duniacrypto.png'}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Article Content - Better spacing like academy */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-4 line-clamp-2 group-hover:text-blue-300 transition-colors duration-300 leading-tight">
                      {article.title}
                    </h3>
                    
                    {article.excerpt && (
                      <p className="text-gray-300 text-sm mb-5 line-clamp-3 leading-relaxed">
                        {article.excerpt}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-800">
                      <span className="font-medium">{article.source || 'Dunia Crypto'}</span>
                      <span>
                        {isClient ? dayjs(article.publishedAt).fromNow() : 'Loading...'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Load More Button - Same styling as academy */}
            {hasMore && (
              <div className="text-center">
                <button
                  onClick={handleLoadMore}
                  className="bg-duniacrypto-green hover:bg-green-600 text-white font-semibold py-4 px-10 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}

        {!isLoading && hasSearched && searchResults.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">No articles found</div>
            <p className="text-gray-500">
              Try searching with different keywords or browse our categories
            </p>
            <div className="mt-6 space-x-4">
              <Link
                href="/newsroom"
                className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Browse News
              </Link>
              <Link
                href="/academy"
                className="inline-block px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Browse Academy
              </Link>
            </div>
          </div>
        )}

        {!hasSearched && !searchQuery && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">Start searching for articles</div>
            <p className="text-gray-500">
              Enter keywords to find relevant articles from our newsroom and academy
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 