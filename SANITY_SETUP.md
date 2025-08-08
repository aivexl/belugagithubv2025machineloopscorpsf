# Sanity CMS Setup for Dunia Crypto

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=qaofdbqx
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-07-22
```

## Sanity Studio

The Sanity Studio is embedded in your Next.js app at `/studio`. You can access it by:

1. Running your Next.js development server: `npm run dev`
2. Navigate to `http://localhost:3000/studio`

## Content Types

### Dunia Crypto Article
- **Type**: `article`
- **Fields**:
  - `title` (required): Article title
  - `slug` (required): URL slug (auto-generated from title)
  - `excerpt`: Short description (max 200 characters)
  - `content` (required): Full article content
  - `image`: Featured image with hotspot
  - `category` (required): Either "newsroom" or "academy"
  - `source`: Article source (default: "Dunia Crypto")
  - `publishedAt`: Publication date (auto-set to current date)
  - `featured`: Boolean to show on home page

## Usage in Next.js

### Fetch Articles
```typescript
import { 
  getAllArticles, 
  getArticlesByCategory, 
  getFeaturedArticles,
  getArticleBySlug,
  addImageUrls 
} from '../utils/sanity'

// Get all articles
const articles = await getAllArticles()

// Get articles by category
const newsroomArticles = await getArticlesByCategory('newsroom')
const academyArticles = await getArticlesByCategory('academy')

// Get featured articles for home page
const featuredArticles = await getFeaturedArticles()

// Get single article by slug
const article = await getArticleBySlug('your-article-slug')

// Add image URLs to articles
const articlesWithImages = addImageUrls(articles)
```

### Example: Update NewsFeed Component
```typescript
// In src/components/NewsFeed.jsx
import { getArticlesByCategory, addImageUrls } from '../utils/sanity'

// Replace dummy data with Sanity data
const newsroomArticles = await getArticlesByCategory('newsroom')
const articlesWithImages = addImageUrls(newsroomArticles)
```

## Deployment

When deploying to Vercel, add the same environment variables in your Vercel project settings:

1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add the three Sanity environment variables

## Next Steps

1. **Add Content**: Use the Sanity Studio to add your first articles
2. **Update Components**: Replace dummy data in your components with Sanity data
3. **Test**: Verify that articles appear correctly on your website
4. **Deploy**: Deploy to Vercel with environment variables configured 