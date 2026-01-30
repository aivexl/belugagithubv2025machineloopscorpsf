import { getArticleBySlug, addImageUrls, getAllArticles } from '../../../utils/sanity';
import { notFound } from 'next/navigation';
import ArticleDetailClient from '../../../components/ArticleDetailClient';
import type { Metadata } from 'next';

export async function generateMetadata({
    params
}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);

    if (!article) {
        return {
            title: 'Article Not Found - Beluga',
            description: 'The requested article could not be found.',
        };
    }

    const baseUrl = process.env.NODE_ENV === 'production' ? 'https://beluga.id' : 'http://localhost:3000';
    const articleUrl = `${baseUrl}/crypto/${slug}`;

    // Fix: Generate image URL correctly using addImageUrls helper
    const [articleWithImage] = addImageUrls([article]);
    const imageUrl = articleWithImage.imageUrl || `${baseUrl}/Asset/belugalogov3white.png`;

    const description = article.metaDescription || article.excerpt || 'Edukasi cryptocurrency dan blockchain dari Beluga.';

    return {
        title: article.metaTitle || article.title,
        description,
        keywords: article.coinTags?.map(tag => tag.name).join(', ') || 'crypto, cryptocurrency, blockchain, edukasi, indonesia',
        authors: [{ name: article.source || 'Beluga Team' }],
        openGraph: {
            title: article.title,
            description,
            url: articleUrl,
            siteName: 'Beluga',
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: article.title,
                },
            ],
            locale: 'id_ID',
            type: 'article',
            publishedTime: article.publishedAt,
            modifiedTime: article.publishedAt,
            authors: [article.source || 'Beluga Team'],
        },
        twitter: {
            card: 'summary_large_image',
            title: article.title,
            description,
            images: [imageUrl],
        },
        alternates: {
            canonical: articleUrl,
        },
    };
}

export default async function CryptoArticlePage({
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
            .filter(a => a._id !== article._id && a.category === 'academy')
            .slice(0, 6);

        const relatedArticlesWithImages = addImageUrls(relatedArticles);

        // Ensure article exists before rendering
        if (!articleWithImage) {
            return notFound();
        }

        const baseUrl = process.env.NODE_ENV === 'production' ? 'https://beluga.id' : 'http://localhost:3000';
        const articleUrl = `${baseUrl}/crypto/${slug}`;
        const imageUrl = articleWithImage.imageUrl || `${baseUrl}/Asset/belugalogov3white.png`;

        const jsonLd = {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.title,
            description: article.metaDescription || article.excerpt,
            image: imageUrl,
            datePublished: article.publishedAt,
            dateModified: article.publishedAt,
            author: {
                '@type': 'Person',
                name: article.source || 'Beluga Team',
            },
            publisher: {
                '@type': 'Organization',
                name: 'Beluga',
                logo: {
                    '@type': 'ImageObject',
                    url: `${baseUrl}/Asset/belugalogov3white.png`,
                },
            },
            mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': articleUrl,
            },
        };

        return (
            <>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                <ArticleDetailClient article={articleWithImage} relatedArticles={relatedArticlesWithImages} />
            </>
        );
    } catch (error) {
        console.error('Error in CryptoArticlePage:', error);
        return notFound();
    }
}
