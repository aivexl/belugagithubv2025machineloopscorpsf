"use client";

import React from 'react';
import Image from 'next/image';
import { urlFor } from '@/utils/sanityImageUtils';

interface CoinTag {
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
}

interface CoinTagsProps {
  coinTags: CoinTag[];
  className?: string;
  showNames?: boolean;
  size?: 'sm' | 'md' | 'lg';
  maxDisplay?: number;
}

export default function CoinTags({ 
  coinTags = [], 
  className = "",
  showNames = false,
  size = 'md',
  maxDisplay = 10
}: CoinTagsProps) {
  if (!coinTags || coinTags.length === 0) {
    return null;
  }

  // Filter hanya coin yang aktif
  const activeCoins = coinTags.filter(coin => coin.isActive);
  
  // Limit jumlah yang ditampilkan
  const displayCoins = activeCoins.slice(0, maxDisplay);
  
  // Hitung berapa coin yang tidak ditampilkan
  const remainingCount = activeCoins.length - displayCoins.length;

  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className={`flex flex-wrap items-center ${className}`}>
      {displayCoins.map((coin, index) => {
        const coinElement = (
        <div 
          className={`flex items-center gap-2 bg-gray-800/50 rounded-lg px-2 py-1 hover:bg-gray-700/50 transition-colors duration-200 ${index > 0 ? '-ml-2' : ''}`}
          title={`${coin.name} (${coin.symbol})`}
        >
          {coin.logo && (
            <div className={`${sizeClasses[size]} relative flex-shrink-0`}>
              <Image
                src={urlFor(coin.logo).width(48).height(48).url()}
                alt={coin.logo.alt || `${coin.name} logo`}
                fill
                className="rounded-full object-cover"
                sizes="(max-width: 768px) 24px, (max-width: 1200px) 32px, 48px"
              />
            </div>
          )}
          
          {showNames && (
            <span className={`${textSizeClasses[size]} text-white font-medium`}>
              {coin.symbol}
            </span>
          )}
        </div>
        );

        // Wrap with link if coin has a link
        if (coin.link) {
          return (
            <a
              key={coin._id}
              href={coin.link}
              className="no-underline hover:no-underline focus:no-underline active:no-underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {coinElement}
            </a>
          );
        }

        return <div key={coin._id}>{coinElement}</div>;
      })}
      
      {remainingCount > 0 && (
        <div className="flex items-center justify-center bg-gray-600/50 rounded-lg px-2 py-1">
          <span className={`${textSizeClasses[size]} text-gray-300 font-medium`}>
            +{remainingCount}
          </span>
        </div>
      )}
    </div>
  );
}

// Komponen untuk menampilkan coin tags dalam format grid
export function CoinTagsGrid({ 
  coinTags = [], 
  className = "",
  columns = 4,
  size = 'md'
}: {
  coinTags: CoinTag[];
  className?: string;
  columns?: number;
  size?: 'sm' | 'md' | 'lg';
}) {
  if (!coinTags || coinTags.length === 0) {
    return null;
  }

  const activeCoins = coinTags.filter(coin => coin.isActive);
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6'
  };

  return (
    <div className={`grid ${gridCols[columns as keyof typeof gridCols]} gap-3 ${className}`}>
      {activeCoins.map((coin) => (
        <div 
          key={coin._id}
          className="flex flex-col items-center gap-2 p-3 bg-gray-800/30 rounded-lg hover:bg-gray-700/50 transition-colors duration-200"
          title={`${coin.name} (${coin.symbol})`}
        >
          {coin.logo && (
            <div className={`${sizeClasses[size]} relative`}>
              <Image
                src={urlFor(coin.logo).width(64).height(64).url()}
                alt={coin.logo.alt || `${coin.name} logo`}
                fill
                className="rounded-full object-cover"
                sizes="(max-width: 768px) 32px, (max-width: 1200px) 48px, 64px"
              />
            </div>
          )}
          
          <div className="text-center">
            <div className="text-white font-medium text-sm">{coin.symbol}</div>
            <div className="text-gray-400 text-xs truncate max-w-[60px]">{coin.name}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Komponen untuk menampilkan coin tags dalam format list
export function CoinTagsList({ 
  coinTags = [], 
  className = "",
  showCategory = false
}: {
  coinTags: CoinTag[];
  className?: string;
  showCategory?: boolean;
}) {
  if (!coinTags || coinTags.length === 0) {
    return null;
  }

  const activeCoins = coinTags.filter(coin => coin.isActive);

  return (
    <div className={`space-y-2 ${className}`}>
      {activeCoins.map((coin) => (
        <div 
          key={coin._id}
          className="flex items-center gap-3 p-2 bg-gray-800/30 rounded-lg hover:bg-gray-700/50 transition-colors duration-200"
        >
          {coin.logo && (
            <div className="w-8 h-8 relative flex-shrink-0">
              <Image
                src={urlFor(coin.logo).width(32).height(32).url()}
                alt={coin.logo.alt || `${coin.name} logo`}
                fill
                className="rounded-full object-cover"
                sizes="32px"
              />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-white font-medium">{coin.name}</span>
              <span className="text-gray-400 text-sm">({coin.symbol})</span>
            </div>
            {showCategory && (
              <div className="text-gray-500 text-xs capitalize">{coin.category}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Komponen untuk menampilkan logo coin saja (untuk di atas judul)
export function CoinLogosOnly({
  coinTags = [],
  className = "",
  size = 'md',
  maxDisplay = 5,
  disableLinks = false
}: {
  coinTags: CoinTag[];
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  maxDisplay?: number;
  disableLinks?: boolean;
}) {
  if (!coinTags || coinTags.length === 0) {
    return null;
  }

  const activeCoins = coinTags.filter(coin => coin.isActive);
  const displayCoins = activeCoins.slice(0, maxDisplay);
  const remainingCount = activeCoins.length - displayCoins.length;

  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex items-center ${className}`}>
      {displayCoins.map((coin, index) => {
        const logoElement = (
          <div 
            className={`${sizeClasses[size]} relative flex-shrink-0 rounded-full overflow-hidden border border-gray-600/30 shadow-sm hover:scale-110 transition-transform duration-200 ${index > 0 ? '-ml-2' : ''}`}
            title={`${coin.name} (${coin.symbol})`}
          >
            {coin.logo && (
              <Image
                src={urlFor(coin.logo).width(48).height(48).url()}
                alt={coin.logo.alt || `${coin.name} logo`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 24px, (max-width: 1200px) 32px, 48px"
              />
            )}
          </div>
        );

                // Wrap with link if coin has a link and links are not disabled
                if (coin.link && !disableLinks) {
                  return (
                    <a
                      key={coin._id}
                      href={coin.link}
                      className="no-underline hover:no-underline focus:no-underline active:no-underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {logoElement}
                    </a>
                  );
                }

                return <div key={coin._id}>{logoElement}</div>;
      })}
      
      {remainingCount > 0 && (
        <div className={`${sizeClasses[size]} flex items-center justify-center bg-gray-600/50 rounded-full`}>
          <span className="text-gray-300 font-medium text-xs">
            +{remainingCount}
          </span>
        </div>
      )}
    </div>
  );
}
