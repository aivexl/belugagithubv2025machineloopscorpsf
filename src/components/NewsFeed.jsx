import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { dummyNews } from '../data/dummyNews';

const PLACEHOLDER = '/Asset/duniacrypto.png';

export default function NewsFeed({ showThumbnails = false, noTitle = false, perPage = 30, initialCount = 10, loadMoreCount = 3 }) {
  const [displayCount, setDisplayCount] = useState(initialCount);

  const news = dummyNews;

  const handleLoadMore = () => {
    setDisplayCount((prev) => Math.min(prev + loadMoreCount, news.length));
  };

  useEffect(() => {
    setDisplayCount(initialCount);
  }, [initialCount]);

  return (
    <div className="bg-duniacrypto-panel rounded-lg shadow p-4">
      {!noTitle && <h2 className="text-lg font-bold mb-4">Latest Crypto News</h2>}
      <ul className="flex flex-col gap-4">
        {news.slice(0, displayCount).map((item, i) => (
          <li key={i} className="border-b border-gray-800 pb-2 last:border-b-0 group transition">
            <div className="flex gap-3 items-center group-hover:bg-white/10 rounded-lg px-2 py-2 transition">
              <img src={item.image} alt="news" className="w-16 h-16 rounded-md object-cover bg-black/30 flex-shrink-0 group-hover:scale-105 transition-transform" />
              <div className="flex-1">
                <a
                  href={`/news/${item.slug}`}
                  className="text-duniacrypto-green font-semibold no-underline hover:no-underline focus:no-underline active:no-underline"
                >
                  {item.title}
                </a>
                <div className="text-xs text-gray-400 mt-1 flex gap-2 items-center">
                  <span>{item.source?.name || 'Unknown'}</span>
                  {/* Label News/Academy */}
                  <span className={
                    i % 2 === 0
                      ? 'inline-block px-2 py-0.5 rounded bg-blue-700 text-white font-bold text-[10px] tracking-wide'
                      : 'inline-block px-2 py-0.5 rounded bg-blue-500 text-white font-bold text-[10px] tracking-wide'
                  }>
                    {i % 2 === 0 ? 'News' : 'Academy'}
                  </span>
                  <span>•</span>
                  <span>Baru saja</span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {displayCount < news.length && (
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