"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAcademyFilters } from './AcademyFiltersProvider';
// Import Sanity client directly like in the search API
import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';

// Create Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'qaofdbqx',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-07-22',
  useCdn: false,
});

const builder = imageUrlBuilder(client);

function urlFor(source) {
  return builder.image(source);
}

// Function to fetch academy articles
async function getArticlesByCategory(category) {
  const query = `
    *[_type == "article" && category == $category] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      content,
      image,
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
  const [displayCount, setDisplayCount] = useState(9);
  const { activeLevel, activeTopic, activeNetwork } = useAcademyFilters();
  
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getArticlesByCategory('academy');
        
        // Transform articles to include image URLs
        const articlesWithImages = data.map(article => ({
          ...article,
          mainImage: article.image ? urlFor(article.image).url() : null
        }));
        
        setArticles(articlesWithImages);
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

  if (filteredArticles.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No articles found matching your criteria.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                {/* Article Image */}
                <div className="aspect-video bg-gray-800 overflow-hidden">
                  {article.mainImage ? (
                    <img
                      src={article.mainImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <img
                      src="/Asset/duniacrypto.png"
                      alt="Default Academy Image"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
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
    </div>
  );
} 