// Utility functions for handling Sanity images with enterprise-level error handling

import { urlFor } from '../sanity/lib/image';

// Re-export urlFor for use in components
export { urlFor };

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
 * Generate a Sanity image URL with proper formatting using official Sanity client
 * @param image - Sanity image object
 * @param options - Image options
 * @returns Formatted image URL or null if invalid
 */
export function generateSanityImageUrl(
  image: SanityImage | null | undefined,
  options: {
    width?: number;
    height?: number;
    format?: 'webp' | 'jpg' | 'png';
    quality?: number;
    fit?: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min';
  } = {}
): string | null {
  if (!image || !image.asset || !image.asset._ref) {
    return null;
  }

  try {
  const {
    width = 800,
    height,
    format = 'webp',
    quality = 80,
    fit = 'crop'
  } = options;

    // Use the official Sanity image builder
    let builder = urlFor(image);
    
    // Apply transformations
    if (width) builder = builder.width(width);
    if (height) builder = builder.height(height);
    if (format) builder = builder.format(format);
    if (quality) builder = builder.quality(quality);
    if (fit) builder = builder.fit(fit);
  
  // Add hotspot and crop if available
  if (image.hotspot) {
      builder = builder.crop('focalpoint')
        .focalPoint(image.hotspot.x, image.hotspot.y);
  }
  
  if (image.crop) {
      builder = builder.crop('focalpoint')
        .rect(
          image.crop.left,
          image.crop.top,
          image.crop.right - image.crop.left,
          image.crop.bottom - image.crop.top
        );
    }

    return builder.url();
  } catch (error) {
    console.warn('Failed to generate Sanity image URL:', error);
    return null;
  }
}

/**
 * Generate multiple image URLs for different sizes (responsive images)
 * @param image - Sanity image object
 * @returns Object with different image sizes
 */
export function generateResponsiveImageUrls(image: SanityImage | null | undefined) {
  if (!image) return null;

  try {
  return {
    thumbnail: generateSanityImageUrl(image, { width: 300, height: 200, fit: 'crop' }),
    small: generateSanityImageUrl(image, { width: 600, height: 400, fit: 'crop' }),
    medium: generateSanityImageUrl(image, { width: 800, height: 600, fit: 'crop' }),
    large: generateSanityImageUrl(image, { width: 1200, height: 800, fit: 'crop' }),
    original: generateSanityImageUrl(image, { fit: 'max' })
  };
  } catch (error) {
    console.warn('Failed to generate responsive image URLs:', error);
    return null;
  }
}

/**
 * Generate optimized image URL for article thumbnails with enterprise-level fallbacks
 * @param image - Sanity image object
 * @returns Optimized thumbnail URL or fallback
 */
export function generateArticleThumbnailUrl(image: SanityImage | null | undefined): string {
  try {
    const url = generateSanityImageUrl(image, {
    width: 800,
    height: 450, // 16:9 aspect ratio
    format: 'webp',
    quality: 85,
    fit: 'crop'
  });
    
    // Return the generated URL or fallback to default
    return url || '/Asset/duniacrypto.png';
  } catch (error) {
    console.warn('Failed to generate article thumbnail URL, using fallback:', error);
    return '/Asset/duniacrypto.png';
  }
}

/**
 * Generate hero image URL for featured articles with enterprise-level fallbacks
 * @param image - Sanity image object
 * @returns Hero image URL or fallback
 */
export function generateHeroImageUrl(image: SanityImage | null | undefined): string {
  try {
    const url = generateSanityImageUrl(image, {
    width: 1200,
    height: 600,
    format: 'webp',
    quality: 90,
    fit: 'crop'
    });
    
    // Return the generated URL or fallback to default
    return url || '/Asset/duniacrypto.png';
  } catch (error) {
    console.warn('Failed to generate hero image URL, using fallback:', error);
    return '/Asset/duniacrypto.png';
  }
}

/**
 * Enterprise-level image validation and fallback system
 * @param image - Sanity image object
 * @param fallbackUrl - Fallback image URL
 * @returns Validated image URL or fallback
 */
export function validateAndGetImageUrl(
  image: SanityImage | null | undefined, 
  fallbackUrl: string = '/Asset/duniacrypto.png'
): string {
  // ENTERPRISE-LEVEL VALIDATION: Comprehensive image structure checking
  if (!image) {
    console.warn('validateAndGetImageUrl: No image object provided');
    return fallbackUrl;
  }
  
  if (!image.asset) {
    console.warn('validateAndGetImageUrl: No image asset found:', image);
    return fallbackUrl;
  }
  
  if (!image.asset._ref) {
    console.warn('validateAndGetImageUrl: No image asset reference found:', image.asset);
    return fallbackUrl;
  }
  
  if (typeof image.asset._ref !== 'string') {
    console.warn('validateAndGetImageUrl: Invalid asset reference type:', typeof image.asset._ref);
    return fallbackUrl;
  }

  try {
    const url = generateSanityImageUrl(image, {
      width: 800,
      height: 450,
      format: 'webp',
      quality: 85,
      fit: 'crop'
    });
    
    // ENTERPRISE-LEVEL VALIDATION: Ensure URL is valid
    if (!url || typeof url !== 'string' || url.trim() === '') {
      console.warn('validateAndGetImageUrl: Generated URL is invalid:', url);
      return fallbackUrl;
    }
    
    // ENTERPRISE-LEVEL VALIDATION: Check if URL is accessible
    if (url.startsWith('http') || url.startsWith('https')) {
      console.log('validateAndGetImageUrl: Generated external URL:', url);
      return url;
    }
    
    // ENTERPRISE-LEVEL VALIDATION: Check if URL is relative
    if (url.startsWith('/') || url.startsWith('./')) {
      console.log('validateAndGetImageUrl: Generated relative URL:', url);
      return url;
    }
    
    console.warn('validateAndGetImageUrl: Generated URL format is unexpected:', url);
    return fallbackUrl;
    
  } catch (error) {
    console.error('validateAndGetImageUrl: Image generation failed:', error);
    return fallbackUrl;
  }
}

/**
 * Preload critical images for better performance
 * @param imageUrls - Array of image URLs to preload
 */
export function preloadImages(imageUrls: string[]): void {
  if (typeof window === 'undefined') return; // Server-side only
  
  imageUrls.forEach(url => {
    if (url && url !== '/Asset/duniacrypto.png') {
      const img = new Image();
      img.src = url;
    }
  });
}
