import React, { useEffect, useRef, useState } from 'react';
import { CoinLogosOnly } from './CoinTags';

const PLACEHOLDER = '/Asset/duniacrypto.png';

type SanityArticle = {
  _id: string;
  title: string;
  slug: { current: string };
  imageUrl?: string;
  category?: string;
  publishedAt?: string;
  coinTags?: Array<{
    _id: string;
    name: string;
    symbol: string;
    logo: {
      asset: {
        _ref: string;
        _type: string;
      };
      alt?: string;
    };
    category: string;
    isActive: boolean;
    link?: string;
  }>;
};

type NewsSliderProps = {
  articles?: SanityArticle[];
};

const NewsSlider: React.FC<NewsSliderProps> = ({ articles = [] }) => {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Convert Sanity articles to slider format
  const sliderArticles = articles.slice(0, 5).map((article) => ({
    id: article._id,
    title: article.title,
    url: `/${article.category === 'newsroom' ? 'newsroom' : 'academy'}/${article.slug.current}`,
    image: article.imageUrl || PLACEHOLDER,
    category: article.category || 'academy',
    coinTags: article.coinTags || []
  }));

  useEffect(() => {
    if (sliderArticles.length === 0) return;
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sliderArticles.length);
    }, 4000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [sliderArticles.length]);

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + sliderArticles.length) % sliderArticles.length);
  };
  
  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % sliderArticles.length);
  };

  if (sliderArticles.length === 0) {
    return (
      <div className="bg-duniacrypto-panel rounded-lg shadow p-4 text-center text-gray-400" style={{height: '400px'}}>
        <div className="flex items-center justify-center h-full">
          <div>
            <h3 className="text-xl font-semibold mb-2">Belum ada artikel</h3>
            <p className="text-sm">Artikel Academy dan News akan muncul di sini setelah ditambahkan melalui Sanity Studio.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-duniacrypto-panel rounded-lg shadow p-0 overflow-hidden w-full max-w-full mb-6" style={{height: '400px'}}>
      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
        <button
          className="bg-duniacrypto-card rounded-full p-2 hover:bg-duniacrypto-green/20 focus:outline-none"
          onClick={handlePrev}
          aria-label="Previous article"
        >
          <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" /></svg>
        </button>
      </div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
        <button
          className="bg-duniacrypto-card rounded-full p-2 hover:bg-duniacrypto-green/20 focus:outline-none"
          onClick={handleNext}
          aria-label="Next article"
        >
          <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
      <div className="w-full h-full flex transition-transform duration-700" style={{ transform: `translateX(-${current * 100}%)` }}>
        {sliderArticles.map((item) => (
          <div
            key={item.id}
            className="flex-shrink-0 w-full h-full flex flex-col items-center justify-center relative"
            style={{ minWidth: '100%', maxWidth: '100%', height: '400px' }}
          >
            <a href={item.url} className="block w-full h-full group">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover rounded-t-lg bg-black/30 transition-transform group-hover:scale-105"
                style={{margin: 0, padding: 0, width: '100%', height: '100%'}}
                onError={(event: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  event.currentTarget.src = PLACEHOLDER;
                }}
              />
              <div className="absolute top-4 left-4">
                <span className={`inline-block px-3 py-1.5 rounded-full text-white font-bold text-sm tracking-wide shadow-lg ${
                  item.category === 'newsroom' ? 'bg-blue-700' : 'bg-blue-500'
                }`}>
                  {item.category === 'newsroom' ? 'News' : 'Academy'}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg">
                {/* Coin Logos Above Title */}
                {item.coinTags && item.coinTags.length > 0 && (
                  <div className="mb-2">
                    <CoinLogosOnly 
                      coinTags={item.coinTags} 
                      size="sm"
                      maxDisplay={4}
                      className="justify-start"
                      disableLinks={true}
                    />
                  </div>
                )}
                
                <div className="text-lg md:text-2xl font-bold text-white line-clamp-2 drop-shadow-lg mb-8">
                  {item.title}
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>
      {/* Dots indicator */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {sliderArticles.map((_, i) => (
          <button
            key={i}
            className={`w-2 h-2 rounded-full ${i === current ? 'bg-duniacrypto-green' : 'bg-gray-600'}`}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default NewsSlider; 