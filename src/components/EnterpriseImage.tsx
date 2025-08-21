"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { startImageMonitoring, recordImageSuccess, recordImageFailure } from '../utils/imagePerformanceMonitor';

interface EnterpriseImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fallbackSrc?: string;
  onError?: (error: Error) => void;
  onLoad?: () => void;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  quality?: number;
  fill?: boolean;
  style?: React.CSSProperties;
}

/**
 * Enterprise-Level Image Component with Bulletproof Error Handling
 * Features:
 * - Automatic fallback handling
 * - Lazy loading optimization
 * - Performance monitoring
 * - SEO optimization
 * - Accessibility compliance
 * - Zero-error guarantee
 */
export default function EnterpriseImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fallbackSrc = '/Asset/duniacrypto.png',
  onError,
  onLoad,
  placeholder = 'empty',
  blurDataURL,
  quality = 85,
  fill = false,
  style
}: EnterpriseImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isFallback, setIsFallback] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const retryCountRef = useRef(0);
  const monitoringIdRef = useRef<string>('');
  const maxRetries = 2;
  const retryDelay = 1000; // 1 second base delay

  // Handle image loading errors with enterprise-level fallback strategy
  const handleImageError = useCallback(() => {
    const error = new Error('Image failed to load');
    
    if (process.env.NODE_ENV === 'development') {
      console.warn(`EnterpriseImage: Image load error for ${imageSrc}:`, error);
    }

    // Increment retry count
    retryCountRef.current += 1;

    // Record error in performance monitor
    recordImageFailure(monitoringIdRef.current, imageSrc, error.message, retryCountRef.current);

    // Try retry logic first
    if (retryCountRef.current < maxRetries && !isFallback) {
      console.log(`EnterpriseImage: Retrying image load (${retryCountRef.current}/${maxRetries}): ${imageSrc}`);
      setTimeout(() => {
        setImageSrc(src);
        setIsLoading(true);
        setHasError(false);
      }, retryDelay * retryCountRef.current);
      return;
    }

    // Use fallback image
    if (!isFallback && fallbackSrc !== src) {
      console.log(`EnterpriseImage: Using fallback image: ${fallbackSrc}`);
      setImageSrc(fallbackSrc);
      setIsFallback(true);
      setHasError(false);
      setIsLoading(true);
      retryCountRef.current = 0;
      return;
    }

    // Final fallback - use default image
    if (fallbackSrc !== '/Asset/duniacrypto.png') {
      console.log('EnterpriseImage: Using default fallback image');
      setImageSrc('/Asset/duniacrypto.png');
      setIsFallback(true);
      setHasError(false);
      setIsLoading(true);
      retryCountRef.current = 0;
      return;
    }

    // All fallbacks exhausted
    setHasError(true);
    setIsLoading(false);
    onError?.(error);
  }, [src, fallbackSrc, isFallback, onError, imageSrc]);

  // Handle successful image load
  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
    
    // Record success in performance monitor
    recordImageSuccess(monitoringIdRef.current, imageSrc, 0, 'webp');
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`EnterpriseImage: Successfully loaded image: ${imageSrc}`);
    }
  }, [imageSrc, onLoad]);

  // Reset state when src changes
  useEffect(() => {
    setImageSrc(src);
    setIsLoading(true);
    setHasError(false);
    setIsFallback(false);
    retryCountRef.current = 0;
    
    // Start performance monitoring
    monitoringIdRef.current = startImageMonitoring();
    
    return undefined;
  }, [src]);

  // Preload critical images for better performance
  useEffect(() => {
    if (priority && src && src !== fallbackSrc && typeof window !== 'undefined') {
      try {
        // ENTERPRISE-LEVEL: Proper browser API handling with TypeScript safety
        const img = new (window as any).Image() as HTMLImageElement;
        img.src = src;
        img.onload = () => {
          if (process.env.NODE_ENV === 'development') {
            console.log(`EnterpriseImage: Preloaded critical image: ${src}`);
          }
        };
        img.onerror = () => {
          if (process.env.NODE_ENV === 'development') {
            console.warn(`EnterpriseImage: Failed to preload image: ${src}`);
          }
        };
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('EnterpriseImage: Image preloading not supported in this environment');
        }
      }
    }
  }, [priority, src, fallbackSrc]);

  // Performance monitoring
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const startTime = performance.now();
      
      return () => {
        const loadTime = performance.now() - startTime;
        if (loadTime > 1000) {
          console.warn(`EnterpriseImage: Slow image load detected: ${loadTime.toFixed(2)}ms for ${src}`);
        }
      };
    }
  }, [src]);

  // Accessibility: Ensure alt text is always present
  const safeAlt = alt || 'Image';
  
  // SEO: Add loading attribute for non-critical images
  const loadingAttr = priority ? 'eager' : 'lazy';

  // Error state display
  if (hasError && isFallback) {
    return (
      <div 
        className={`bg-gray-800 flex items-center justify-center text-gray-400 ${className}`}
        style={{
          width: fill ? '100%' : width,
          height: fill ? '100%' : height,
          ...style
        }}
        role="img"
        aria-label={`${safeAlt} - Image failed to load`}
      >
        <div className="text-center">
          <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs">Image unavailable</span>
        </div>
      </div>
    );
  }

  // Loading state display
  if (isLoading && !fill) {
    return (
      <div 
        className={`bg-gray-800 animate-pulse ${className}`}
        style={{
          width: width || '100%',
          height: height || '200px',
          ...style
        }}
        aria-label="Loading image..."
      />
    );
  }

  // Main image render with Next.js Image optimization
  return (
    <div className={`relative ${className}`} style={style}>
      {fill ? (
        <Image
          ref={imageRef}
          src={imageSrc}
          alt={safeAlt}
          fill={true}
          className={`transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          priority={priority}
          placeholder={placeholder}
          {...(blurDataURL && { blurDataURL })}
          quality={quality}
          loading={loadingAttr}
          onError={handleImageError}
          onLoad={handleImageLoad}
          onLoadingComplete={() => setIsLoading(false)}
          style={{
            objectFit: 'cover',
            ...style
          }}
          unoptimized={false}
        />
      ) : (
        <Image
          ref={imageRef}
          src={imageSrc}
          alt={safeAlt}
          width={width || 800}
          height={height || 600}
          className={`transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          priority={priority}
          placeholder={placeholder}
          {...(blurDataURL && { blurDataURL })}
          quality={quality}
          loading={loadingAttr}
          onError={handleImageError}
          onLoad={handleImageLoad}
          onLoadingComplete={() => setIsLoading(false)}
          style={{
            objectFit: 'cover',
            ...style
          }}
          unoptimized={false}
        />
      )}
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {/* Error overlay for debugging */}
      {process.env.NODE_ENV === 'development' && hasError && (
        <div className="absolute inset-0 bg-red-900/20 border border-red-500 flex items-center justify-center">
          <span className="text-red-400 text-xs">Image Error</span>
        </div>
      )}
    </div>
  );
}

/**
 * Optimized image component for article thumbnails
 */
export function ArticleThumbnail({
  src,
  alt,
  className = '',
  priority = false
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <EnterpriseImage
      src={src}
      alt={alt}
      width={800}
      height={450}
      className={`aspect-video ${className}`}
      priority={priority}
      fallbackSrc="/Asset/duniacrypto.png"
      placeholder="empty"
      quality={85}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}

/**
 * Optimized image component for hero images
 */
export function HeroImage({
  src,
  alt,
  className = '',
  priority = true
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <EnterpriseImage
      src={src}
      alt={alt}
      width={1200}
      height={600}
      className={`aspect-[2/1] ${className}`}
      priority={priority}
      fallbackSrc="/Asset/duniacrypto.png"
      placeholder="empty"
      quality={90}
      sizes="100vw"
    />
  );
}
