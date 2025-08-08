'use client'

import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { getArticlesByCategory, getAllArticles, addImageUrls } from '../utils/sanity';

const PLACEHOLDER = '/Asset/duniacrypto.png';

export default function NewsFeedSanity({ 
  showThumbnails = false, 
  noTitle = false, 
  perPage = 30, 
  initialCount = 10, 
  loadMoreCount = 3,
  category = null // null for all articles, 'newsroom' or 'academy' for specific category
}) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayCount, setDisplayCount] = useState(initialCount);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        let fetchedArticles;
        
        if (category) {
          // Fetch articles by specific category
          fetchedArticles = await getArticlesByCategory(category);
        } else {
          // Fetch all articles
          fetchedArticles = await getAllArticles();
        }
        
        const articlesWithImages = addImageUrls(fetchedArticles);
        setArticles(articlesWithImages);
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError('Failed to load articles');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [category]);

  const handleLoadMore = () => {
    setDisplayCount((prev) => Math.min(prev + loadMoreCount, articles.length));
  };

  useEffect(() => {
    setDisplayCount(initialCount);
  }, [initialCount]);

  if (loading) {
    return (
      <div className="bg-duniacrypto-panel rounded-lg shadow p-4">
        {!noTitle && <h2 className="text-lg font-bold mb-4">Latest Crypto News</h2>}
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-duniacrypto-green"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-duniacrypto-panel rounded-lg shadow p-4">
        {!noTitle && <h2 className="text-lg font-bold mb-4">Latest Crypto News</h2>}
        <div className="text-red-400 text-center py-4">{error}</div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="bg-duniacrypto-panel rounded-lg shadow p-4">
        {!noTitle && <h2 className="text-lg font-bold mb-4">Latest Crypto News</h2>}
        <div className="text-gray-400 text-center py-4">No articles found</div>
      </div>
    );
  }

  return (
    <div className="bg-duniacrypto-panel rounded-lg shadow p-4">
      {!noTitle && <h2 className="text-lg font-bold mb-4">Latest Crypto News</h2>}
      <ul className="flex flex-col gap-4">
        {articles.slice(0, displayCount).map((article, i) => (
          <li key={article._id} className="border-b border-gray-800 pb-2 last:border-b-0 group transition">
            <div className="flex gap-3 items-center group-hover:bg-white/10 rounded-lg px-2 py-2 transition">
              <img 
                src={article.imageUrl || PLACEHOLDER} 
                alt={article.image?.alt || article.title} 
                className="w-16 h-16 rounded-md object-cover bg-black/30 flex-shrink-0 group-hover:scale-105 transition-transform" 
              />
              <div className="flex-1">
                <a
                  href={`/news/${article.slug.current}`}
                  className="text-duniacrypto-green font-semibold no-underline hover:no-underline focus:no-underline active:no-underline"
                >
                  {article.title}
                </a>
                <div className="text-xs text-gray-400 mt-1 flex gap-2 items-center">
                  <span>{article.source || 'Dunia Crypto'}</span>
                  {/* Label News/Academy */}
                  <span className={
                    article.category === 'newsroom'
                      ? 'inline-block px-2 py-0.5 rounded bg-blue-700 text-white font-bold text-[10px] tracking-wide'
                      : 'inline-block px-2 py-0.5 rounded bg-blue-500 text-white font-bold text-[10px] tracking-wide'
                  }>
                    {article.category === 'newsroom' ? 'News' : 'Academy'}
                  </span>
                  <span>•</span>
                  <span>{article.publishedAt ? dayjs(article.publishedAt).fromNow() : 'Baru saja'}</span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {displayCount < articles.length && (
        <button
          onClick={handleLoadMore}
          className="mt-4 w-full py-2 rounded bg-duniacrypto-green text-black font-bold hover:bg-green-400 transition"
        >
          Load More
        </button>
      )}
    </div>
  );
} 