import React from "react";
import { getAllArticles, addImageUrls } from "../utils/sanity";
import type { SanityArticleWithImage } from "../utils/sanity";
import HomeClient from "../components/HomeClient";

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
