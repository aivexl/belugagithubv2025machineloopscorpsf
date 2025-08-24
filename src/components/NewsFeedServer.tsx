"use client";

import React, { useState, useMemo, useEffect } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/id';
import type { SanityArticleWithImage } from '../utils/sanity';

// Configure dayjs
dayjs.extend(relativeTime);
dayjs.locale('id');

const PLACEHOLDER = '/Asset/duniacrypto.png';

interface NewsFeedServerProps {
  articles?: SanityArticleWithImage[];
  noTitle?: boolean;
  initialCount?: number;
}

const NewsFeedServer = React.memo(({ articles = [], noTitle = false, initialCount = 10 }: NewsFeedServerProps) => {
  const [displayCount, setDisplayCount] = useState(initialCount);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Sort articles by publishedAt (newest first) and combine News and Academy
  const sortedArticles = useMemo(() => {
    return articles
      .sort((a, b) => {
        const dateA = new Date(a.publishedAt || 0).getTime();
        const dateB = new Date(b.publishedAt || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, displayCount);
  }, [articles, displayCount]);

  const handleLoadMore = () => {
    setDisplayCount(prev => Math.min(prev + 3, articles.length));
  };

  const hasMore = displayCount < articles.length;

  if (!sortedArticles.length) {
    return (
      <div className="bg-duniacrypto-panel rounded-lg shadow p-4">
        <div className="text-center text-gray-400">
          <p>Tidak ada artikel tersedia</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-duniacrypto-panel rounded-lg shadow p-4">
      {!noTitle && (
        <h2 className="text-xl font-bold mb-6 text-white">Berita Terbaru</h2>
      )}
      
      <div className="space-y-4">
        {sortedArticles.map((article) => (
          <a
            key={article._id}
            href={`/${article.category === 'newsroom' ? 'newsroom' : 'academy'}/${article.slug.current}`}
            className="block group hover:bg-white/10 rounded-lg p-4 transition cursor-pointer no-underline hover:no-underline focus:no-underline active:no-underline border border-gray-700 hover:border-gray-600"
          >
            <div className="flex gap-4">
              <img
                src={article.imageUrl || PLACEHOLDER}
                alt={article.title}
                className="w-32 h-24 object-cover rounded-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = PLACEHOLDER;
                }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-lg line-clamp-2 group-hover:text-blue-300 transition mb-2 leading-tight">
                  {article.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className={`inline-block px-2 py-1 rounded text-white font-medium ${
                    article.category === 'newsroom' ? 'bg-blue-700' : 'bg-blue-500'
                  }`}>
                    {article.category === 'newsroom' ? 'News' : 'Academy'}
                  </span>
                  <span>
                    {isClient ? dayjs(article.publishedAt).fromNow() : 'Loading...'}
                  </span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={handleLoadMore}
            className="px-6 py-3 bg-duniacrypto-green text-black font-semibold rounded-lg hover:bg-duniacrypto-green/80 transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
});

NewsFeedServer.displayName = 'NewsFeedServer';

export default NewsFeedServer; 