"use client";

import React from "react";
import CryptoTicker from "./CryptoTicker";
import SubscribeContainer from "./SubscribeContainer";
import DailyRecap from "./DailyRecap";
import NewsSlider from "./NewsSlider";
import { CoinGeckoProvider } from "./CoinGeckoContext";
import NewsFeedServer from "./NewsFeedServer";

export default function HomeClient({ articles = [] }) {
  return (
    <CoinGeckoProvider>
      {/* Ticker */}
      <CryptoTicker />
      {/* Main Layout */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-4 md:py-6 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 flex-1 w-full">
        <section className="col-span-1 lg:col-span-2 space-y-4 md:space-y-6">
          {/* Prioritas slider: showInSlider > featured > terbaru, maksimal 8, urutan: showInSlider dulu */}
          {(() => {
            let sliderArticles = [];
            const sorted = [...articles].sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));
            const showInSlider = sorted.filter(a => a.showInSlider);
            sliderArticles = [...showInSlider];
            if (sliderArticles.length < 8) {
              const featured = sorted.filter(a => a.featured && !sliderArticles.some(s => s._id === a._id));
              sliderArticles = sliderArticles.concat(featured);
            }
            if (sliderArticles.length < 8) {
              const latest = sorted.filter(a => !sliderArticles.some(s => s._id === a._id));
              sliderArticles = sliderArticles.concat(latest);
            }
            sliderArticles = sliderArticles.slice(0, 8);
            return <NewsSlider articles={sliderArticles} />;
          })()}
          <DailyRecap />
          <NewsFeedServer articles={articles} />
        </section>
        <aside className="col-span-1 space-y-4 md:gap-6">
          <SubscribeContainer />
        </aside>
      </main>
    </CoinGeckoProvider>
  );
} 