import React from "react";
import { getAllArticles, addImageUrls } from "../utils/sanity";
import type { SanityArticleWithImage } from "../utils/sanity";
import HomeClient from "../components/HomeClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beluga - Berita dan Analisis Crypto Indonesia Terkini",
  description: "Platform terdepan untuk berita cryptocurrency, analisis market, dan edukasi blockchain di Indonesia. Dapatkan insight terbaru tentang Bitcoin, Ethereum, dan crypto lainnya.",
  openGraph: {
    title: "Beluga - Berita dan Analisis Crypto Indonesia Terkini",
    description: "Platform terdepan untuk berita cryptocurrency, analisis market, dan edukasi blockchain di Indonesia.",
  },
};

export default async function Home() {
  // Fetch articles server-side
  let articles: SanityArticleWithImage[] = [];
  try {
    const fetchedArticles = await getAllArticles();
    articles = addImageUrls(fetchedArticles);
  } catch (error) {
    console.error('Error fetching articles:', error);
  }

  return <HomeClient articles={articles} />;
}
