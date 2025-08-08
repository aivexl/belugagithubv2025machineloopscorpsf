"use client";

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';

const CoinDetailNav = ({ coinId, coinSymbol }) => {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    {
      id: 'info',
      label: 'Info',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      path: `/crypto/${coinId}`
    },
    {
      id: 'chart-txns',
      label: 'Chart & Txns',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      path: `/crypto/${coinId}/chart-txns`
    },
    {
      id: 'chart',
      label: 'Chart',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      ),
      path: `/crypto/${coinId}/chart`
    },
    {
      id: 'txns',
      label: 'Txns',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      path: `/crypto/${coinId}/txns`
    }
  ];

  const isActive = (path) => {
    if (path === `/crypto/${coinId}`) {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  const handleTabClick = (path) => {
    router.push(path);
  };

  return (
    <div className="bg-duniacrypto-panel border-b border-gray-700 fixed bottom-16 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 px-4">
          {/* Icon with Text Navigation - Full Width */}
          <div className="flex justify-between w-full max-w-md mx-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.path)}
                className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
                  isActive(item.path)
                    ? 'text-blue-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}>
                  {item.icon}
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinDetailNav; 