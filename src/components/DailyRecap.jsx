"use client";

import React, { useEffect, useState } from 'react';

const recapItems = [
  'Arus masuk Bitcoin ETF mencapai rekor tertinggi baru.',
  'Upgrade Ethereum Dencun berhasil diluncurkan.',
  'Jaringan Solana memproses transaksi terbanyak sepanjang sejarah.',
  'USDC kini tersedia di dua blockchain baru.',
  'Dogecoin melonjak karena spekulasi pembayaran di platform X.',
];

export default function DailyRecap() {
  return (
    <div className="bg-duniacrypto-panel rounded-lg shadow p-4">
      <h2 className="text-lg font-bold mb-4">Daily Recap</h2>
      <ul className="list-disc pl-6 text-gray-200 space-y-2">
        {recapItems.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
} 