// Utility functions for handling Sanity images

export interface SanityImage {
  asset: {
    _ref: string;
    _type: string;
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

/**
 * Generate a Sanity image URL with proper formatting
 * @param image - Sanity image object
 * @param options - Image options
 * @returns Formatted image URL or null if invalid
 */
export function generateSanityImageUrl(
  image: SanityImage | null | undefined,
  options: {
    width?: number;
    height?: number;
    format?: 'webp' | 'jpg' | 'png' | 'avif';
    quality?: number;
    fit?: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min';
  } = {}
): string | null {
  if (!image || !image.asset || !image.asset._ref) {
    return null;
  }

  const {
    width = 800,
    height,
    format = 'webp',
    quality = 80,
    fit = 'crop'
  } = options;

  // Extract project and dataset from environment
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'qaofdbqx';
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

  // Extract asset ID from reference
  // Reference format: image-{assetId}-{originalWidth}x{originalHeight}-{originalFormat}
  const assetRef = image.asset._ref;
  const assetId = assetRef.replace('image-', '').split('-')[0];

  // Build the URL with Sanity's image transformation API
  let url = `https://cdn.sanity.io/images/${projectId}/${dataset}/${assetId}`;
  
  // Add transformations
  const params = new URLSearchParams();
  
  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  if (format) params.append('fm', format);
  if (quality) params.append('q', quality.toString());
  if (fit) params.append('fit', fit);
  
  // Add hotspot and crop if available
  if (image.hotspot) {
    params.append('fp-x', image.hotspot.x.toString());
    params.append('fp-y', image.hotspot.y.toString());
    params.append('fp-z', '1');
  }
  
  if (image.crop) {
    params.append('rect', `${image.crop.left},${image.crop.top},${image.crop.right - image.crop.left},${image.crop.bottom - image.crop.top}`);
  }

  // Append parameters if any
  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  return url;
}

/**
 * Generate multiple image URLs for different sizes (responsive images)
 * @param image - Sanity image object
 * @returns Object with different image sizes
 */
export function generateResponsiveImageUrls(image: SanityImage | null | undefined) {
  if (!image) return null;

  return {
    thumbnail: generateSanityImageUrl(image, { width: 300, height: 200, fit: 'crop' }),
    small: generateSanityImageUrl(image, { width: 600, height: 400, fit: 'crop' }),
    medium: generateSanityImageUrl(image, { width: 800, height: 600, fit: 'crop' }),
    large: generateSanityImageUrl(image, { width: 1200, height: 800, fit: 'crop' }),
    original: generateSanityImageUrl(image, { fit: 'max' })
  };
}

/**
 * Generate optimized image URL for article thumbnails
 * @param image - Sanity image object
 * @returns Optimized thumbnail URL
 */
export function generateArticleThumbnailUrl(image: SanityImage | null | undefined): string | null {
  return generateSanityImageUrl(image, {
    width: 800,
    height: 450, // 16:9 aspect ratio
    format: 'webp',
    quality: 85,
    fit: 'crop'
  });
}

/**
 * Generate hero image URL for featured articles
 * @param image - Sanity image object
 * @returns Hero image URL
 */
export function generateHeroImageUrl(image: SanityImage | null | undefined): string | null {
  return generateSanityImageUrl(image, {
    width: 1200,
    height: 600,
    format: 'webp',
    quality: 90,
    fit: 'crop'
  });
}
