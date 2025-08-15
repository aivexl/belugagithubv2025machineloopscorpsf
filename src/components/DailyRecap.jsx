"use client";

import React from 'react';
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
        <>
          {/* First item - visible */}
          <ul className="list-disc pl-6 text-gray-200 space-y-2">
            <li>{recapItems[0]}</li>
          </ul>
          {/* Single blue line at the top of blurred section */}
          <div className="mt-2 border-t-2 border-blue-500" />
          {/* Blurred items with centered Sign In overlay */}
          <div className="relative mt-2">
            <ul className="list-disc pl-6 text-gray-200 space-y-2 filter blur-sm opacity-60 select-none">
              {recapItems.slice(1).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <div className="absolute inset-0 flex items-center justify-center">
              <Link href="#login" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2 rounded-md no-underline hover:no-underline focus:no-underline">
                Login
              </Link>
            </div>
          </div>
        </>
      )}

      {/* No extra CTA below; Sign In is centered inside blurred block */}
    </div>
  );
}