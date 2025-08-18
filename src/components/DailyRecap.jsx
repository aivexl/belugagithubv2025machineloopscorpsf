"use client";

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';

const recapItems = [
  'Arus masuk Bitcoin ETF mencapai rekor tertinggi baru.',
  'Upgrade Ethereum Dencun berhasil diluncurkan.',
  'Jaringan Solana memproses transaksi terbanyak sepanjang sejarah.',
  'USDC kini tersedia di dua blockchain baru.',
  'Dogecoin melonjak karena spekulasi pembayaran di platform X.',
];

export default function DailyRecap() {
  const { user } = useAuth();
  const isLoggedIn = Boolean(user);

  // Conditional preloading for aistar image - only when component is rendered
  useEffect(() => {
    // Preload aistar image only when component is actually visible
    const aistarImg = new Image();
    aistarImg.src = '/Asset/aistar.png';
  }, []);

  return (
    <div className="bg-duniacrypto-panel rounded-lg shadow p-4">
      {/* Header with title and Aistar icon on the right */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Daily Recap</h2>
        <div className="flex items-center space-x-2">
          {/* Aistar icon (white) */}
          <Image
            src="/Asset/aistar.png"
            alt="Beluga AI"
            width={20}
            height={20}
            className="brightness-0 invert"
          />
        </div>
      </div>

      {/* Items rendering */}
      {isLoggedIn ? (
        // Logged in: show all items normally
        <ul className="list-disc pl-6 text-gray-200 space-y-2">
          {recapItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      ) : (
        // Not logged in: first item visible; rest blurred with a single blue line at the top and Sign In centered over the blurred area
        <div className="relative">
          {/* First item visible */}
          <ul className="list-disc pl-6 text-gray-200 space-y-2">
            <li>{recapItems[0]}</li>
          </ul>
          
          {/* Blurred area with blue line */}
          <div className="mt-2 relative">
            {/* Blue line at top */}
            <div className="h-0.5 bg-blue-500 mb-2"></div>
            
            {/* Blurred items */}
            <div className="blur-sm opacity-50">
              <ul className="list-disc pl-6 text-gray-200 space-y-2">
                {recapItems.slice(1).map((item, i) => (
                  <li key={i + 1}>{item}</li>
                ))}
              </ul>
            </div>
            
            {/* Sign In overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Link
                href="/auth/signin"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-300 font-medium"
              >
                Sign In to See More
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}