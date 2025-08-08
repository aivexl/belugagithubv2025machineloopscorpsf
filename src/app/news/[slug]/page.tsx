import { getArticleBySlug, addImageUrls } from '../../../utils/sanity';
import { notFound } from 'next/navigation';
import ArticleDetailClient from '../../../components/ArticleDetailClient';

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug);
  if (!article) return notFound();
  
  const [articleWithImage] = addImageUrls([article]);
  
  return <ArticleDetailClient article={articleWithImage} />;
} 