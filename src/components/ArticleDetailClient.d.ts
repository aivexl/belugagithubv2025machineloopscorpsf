import { SanityArticleWithImage } from '../utils/sanity';

interface ArticleDetailClientProps {
  article: SanityArticleWithImage;
  relatedArticles?: SanityArticleWithImage[];
}

declare function ArticleDetailClient(props: ArticleDetailClientProps): JSX.Element;

export default ArticleDetailClient; 