import React from 'react';
import { getArticlesByCategory, addImageUrls } from '../../utils/sanity';
import type { SanityArticleWithImage } from '../../utils/sanity';
import AcademyClient from '../../components/AcademyClient';

export default async function AcademyPage() {
  let articles: SanityArticleWithImage[] = [];
  
  try {
    const fetchedArticles = await getArticlesByCategory('academy');
    articles = addImageUrls(fetchedArticles);
  } catch (error) {
    console.error('Error fetching academy articles:', error);
  }

  return <AcademyClient articles={articles} />;
} 