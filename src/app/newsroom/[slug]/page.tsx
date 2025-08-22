import { getArticleBySlug, addImageUrls, getAllArticles } from '../../../utils/sanity';
import { notFound } from 'next/navigation';
import ArticleDetailClient from '../../../components/ArticleDetailClient';

export default async function NewsroomDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  try {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);
    
    if (!article) {
      console.log('Article not found for slug:', slug);
      return notFound();
    }
    
    const [articleWithImage] = addImageUrls([article]);
    
    // Get related articles (same category, excluding current article)
    const allArticles = await getAllArticles();
    const relatedArticles = allArticles
      .filter(a => a._id !== article._id && a.category === 'newsroom')
      .slice(0, 6);
    
    const relatedArticlesWithImages = addImageUrls(relatedArticles);

    // Ensure article exists before rendering
    if (!articleWithImage) {
      return notFound();
    }

    return <ArticleDetailClient article={articleWithImage} relatedArticles={relatedArticlesWithImages} />;
  } catch (error) {
    console.error('Error in NewsroomDetailPage:', error);
    return notFound();
  }
} 