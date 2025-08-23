import React from 'react';
import { getArticlesByCategory, addImageUrls } from '../../utils/sanity';
import type { SanityArticleWithImage } from '../../utils/sanity';
import NewsroomClient from '../../components/NewsroomClient';

export default async function NewsroomPage() {
  let articles: SanityArticleWithImage[] = [];
  
  try {
    const fetchedArticles = await getArticlesByCategory('newsroom');
    articles = addImageUrls(fetchedArticles);
  } catch (error) {
    console.error('Error fetching newsroom articles:', error);
    // Return empty array on error
    articles = [];
  }

  return <NewsroomClient articles={articles as any} />;
} 