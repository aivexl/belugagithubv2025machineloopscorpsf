import React from 'react';
import useFetch from '../hooks/useFetch';
import { formatDate } from '../utils/formatters';

const API_URL =
  'https://cryptopanic.com/api/v1/posts/?auth=&public=true&currencies=BTC,ETH&filter=hot&kind=news&limit=1';

export default function TopNewsCard() {
  const { data, loading, error } = useFetch(API_URL, { refreshInterval: 120000 });
  if (error) {
    return <div className="text-duniacrypto-negative font-semibold">Top news error: {error.message}</div>;
  }
  if (loading || !data || !data.results?.length) {
    return <div className="h-48 bg-gray-100 dark:bg-duniacrypto-panel animate-pulse rounded-lg" />;
  }
  const news = data.results[0];
  return (
    <div className="bg-white dark:bg-duniacrypto-card rounded-lg shadow p-6 flex flex-col md:flex-row gap-6 items-start">
      {news.metadata?.image && (
        <img
          src={news.metadata.image}
          alt={news.title}
          className="w-full md:w-64 h-40 object-cover rounded mb-4 md:mb-0"
        />
      )}
      <div className="flex-1">
        <a
          href={news.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl font-bold hover:text-yellow-500"
        >
          {news.title}
        </a>
        <div className="text-xs text-gray-400 mt-1 mb-2">
          {news.source?.title || 'Unknown'} • {formatDate(news.published_at, 'MMM D, HH:mm')}
        </div>
        {news.metadata?.description && (
          <p className="text-base text-gray-700 dark:text-gray-300 mb-2 line-clamp-3">{news.metadata.description}</p>
        )}
        <a
          href={news.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 text-yellow-600 dark:text-yellow-400 font-semibold hover:underline"
        >
          Read full article →
        </a>
      </div>
    </div>
  );
} 