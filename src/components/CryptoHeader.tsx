"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import SocialMediaIcons from './SocialMediaIcons';

interface CryptoHeaderProps {
  coinData: {
    id?: string;
    name?: string;
    symbol?: string;
    image?: string;
    current_price?: number;
    price_change_percentage_24h?: number;
  };
  detailedData?: {
    links?: any;
  };
}

const formatPrice = (price: number | undefined) => {
  if (!price || price === 0) return '$0.00';
  return '$' + price.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const formatPercentage = (percentage: number | undefined) => {
  if (percentage === null || percentage === undefined) return '0.00%';
  const value = parseFloat(percentage.toString());
  if (isNaN(value)) return '0.00%';
  const isPositive = value >= 0;
  return (
    <span className={isPositive ? 'text-green-400' : 'text-red-400'}>
      {isPositive ? '+' : ''}{value.toFixed(2)}%
    </span>
  );
};

export default function CryptoHeader({ coinData, detailedData }: CryptoHeaderProps) {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  if (!coinData) return null;

  return (
    <div className="bg-duniacrypto-panel border-b border-gray-700">
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
            <button
              onClick={handleBackClick}
              className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <div className="flex items-center space-x-2 sm:space-x-3">
              {coinData.image && (
                <img
                  src={coinData.image}
                  alt={coinData.name || 'Coin'}
                  className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full"
                />
              )}
              <div>
                <h1 className="text-white font-bold text-base sm:text-lg md:text-xl lg:text-2xl">
                  {coinData.name || 'Unknown'}
                </h1>
                <p className="text-gray-400 text-xs sm:text-sm">
                  {coinData.symbol?.toUpperCase() || ''}
                </p>
                {detailedData?.links && (
                  <SocialMediaIcons 
                    links={detailedData.links} 
                    className="mt-1 sm:mt-2"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
            <div className="text-right">
              <div className="text-white font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl">
                {formatPrice(coinData.current_price)}
              </div>
              <div className="text-xs sm:text-sm">
                {formatPercentage(coinData.price_change_percentage_24h)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

