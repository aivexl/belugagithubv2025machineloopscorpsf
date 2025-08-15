"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAcademyFilters } from './AcademyFiltersProvider';

export default function AcademyClient() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(9);
  const { activeLevel, activeTopic, activeNetwork } = useAcademyFilters();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/sanity/academy');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error('Error fetching academy articles:', error);
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
        const level = Array.isArray(article.level) ? article.level[0] : article.level;
        return level === activeLevel;
      });
    }

    if (activeTopic && activeTopic !== 'all') {
      filtered = filtered.filter(article => {
        const topics = Array.isArray(article.topics) ? article.topics : [article.topics];
        return topics.includes(activeTopic);
      });
    }

    if (activeNetwork && activeNetwork !== 'all') {
      filtered = filtered.filter(article => {
        const networks = Array.isArray(article.networks) ? article.networks : [article.networks];
        return networks.includes(activeNetwork);
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

  if (filteredArticles.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No articles found matching your criteria.
      </div>
    );
  }

  return (
    <div className="w-full">
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.slice(0, displayCount).map((article) => (
            <Link
              key={article._id}
              href={`/academy/${article.slug?.current || article.slug}`}
              className="block group"
            >
              <div className="bg-duniacrypto-panel border border-gray-700 rounded-lg overflow-hidden hover:border-blue-500 transition-all duration-200 h-full flex flex-col">
                {/* Image */}
                {article.mainImage && (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={article.mainImage}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                  {/* Tags at the top */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {article.level && (
                      <span className="px-2 py-1 bg-green-900/50 text-green-300 text-xs rounded">
                        {Array.isArray(article.level) ? article.level[0] : article.level}
                      </span>
                    )}
                    {article.topics && Array.isArray(article.topics) && article.topics.map((topic, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-900/50 text-blue-300 text-xs rounded">
                        {topic}
                      </span>
                    ))}
                    {article.networks && Array.isArray(article.networks) && article.networks.map((network, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-900/50 text-purple-300 text-xs rounded">
                        {network}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-white mb-2 min-h-[3.5rem] group-hover:text-blue-400 transition-colors">
                    {article.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-300 text-sm flex-1">
                    {article.excerpt || article.description}
                  </p>

                  {/* Source and Date */}
                  <div className="mt-auto pt-3 text-xs text-gray-400">
                    {article.source && <span>{article.source}</span>}
                    {article.publishedAt && (
                      <span className="ml-2">
                        {new Date(article.publishedAt).toLocaleDateString()}
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
          <div className="text-center mt-8">
            <button
              onClick={() => setDisplayCount(prev => Math.min(prev + 3, filteredArticles.length))}
              className="px-8 py-3 bg-duniacrypto-green text-black rounded-lg hover:bg-green-400 transition-colors font-medium"
            >
              Load More ({filteredArticles.length - displayCount} remaining)
            </button>
          </div>
        )}
      </section>
    </div>
  );
} 