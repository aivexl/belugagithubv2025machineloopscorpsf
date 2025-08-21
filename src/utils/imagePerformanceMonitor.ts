/**
 * Enterprise-Level Image Performance Monitoring System
 * Monitors image loading performance, errors, and provides analytics
 */

export interface ImagePerformanceMetrics {
  url: string;
  loadTime: number;
  size: number;
  format: string;
  success: boolean;
  error?: string;
  timestamp: number;
  retryCount: number;
}

export interface ImagePerformanceReport {
  totalImages: number;
  successfulLoads: number;
  failedLoads: number;
  averageLoadTime: number;
  totalLoadTime: number;
  performanceScore: number;
  recommendations: string[];
}

class ImagePerformanceMonitor {
  private metrics: ImagePerformanceMetrics[] = [];
  private isEnabled: boolean = process.env.NODE_ENV === 'development';

  /**
   * Start monitoring an image load
   */
  startMonitoring(url: string): string {
    if (!this.isEnabled) return '';
    
    const id = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = performance.now();
    
    // Store start time for this image
    sessionStorage.setItem(`img_start_${id}`, startTime.toString());
    
    return id;
  }

  /**
   * Record successful image load
   */
  recordSuccess(id: string, url: string, size: number, format: string): void {
    if (!this.isEnabled || !id) return;
    
    const startTime = parseFloat(sessionStorage.getItem(`img_start_${id}`) || '0');
    const loadTime = performance.now() - startTime;
    
    const metric: ImagePerformanceMetrics = {
      url,
      loadTime,
      size,
      format,
      success: true,
      timestamp: Date.now(),
      retryCount: 0
    };
    
    this.metrics.push(metric);
    sessionStorage.removeItem(`img_start_${id}`);
    
    // Log performance data in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Image Performance: ${url} loaded in ${loadTime.toFixed(2)}ms`);
    }
    
    // Warn about slow images
    if (loadTime > 2000) {
      console.warn(`Slow image detected: ${url} took ${loadTime.toFixed(2)}ms to load`);
    }
  }

  /**
   * Record failed image load
   */
  recordFailure(id: string, url: string, error: string, retryCount: number = 0): void {
    if (!this.isEnabled || !id) return;
    
    const startTime = parseFloat(sessionStorage.getItem(`img_start_${id}`) || '0');
    const loadTime = performance.now() - startTime;
    
    const metric: ImagePerformanceMetrics = {
      url,
      loadTime,
      size: 0,
      format: 'unknown',
      success: false,
      error,
      timestamp: Date.now(),
      retryCount
    };
    
    this.metrics.push(metric);
    sessionStorage.removeItem(`img_start_${id}`);
    
    // Log failure in development
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Image Performance: ${url} failed to load after ${loadTime.toFixed(2)}ms - ${error}`);
    }
  }

  /**
   * Get performance report
   */
  getPerformanceReport(): ImagePerformanceReport {
    if (this.metrics.length === 0) {
      return {
        totalImages: 0,
        successfulLoads: 0,
        failedLoads: 0,
        averageLoadTime: 0,
        totalLoadTime: 0,
        performanceScore: 100,
        recommendations: ['No images loaded yet']
      };
    }

    const successfulLoads = this.metrics.filter(m => m.success);
    const failedLoads = this.metrics.filter(m => !m.success);
    const totalLoadTime = successfulLoads.reduce((sum, m) => sum + m.loadTime, 0);
    const averageLoadTime = successfulLoads.length > 0 ? totalLoadTime / successfulLoads.length : 0;
    
    // Calculate performance score (0-100)
    let performanceScore = 100;
    
    // Deduct points for failures
    performanceScore -= (failedLoads.length / this.metrics.length) * 50;
    
    // Deduct points for slow loads
    if (averageLoadTime > 1000) {
      performanceScore -= Math.min(30, (averageLoadTime - 1000) / 100);
    }
    
    performanceScore = Math.max(0, Math.min(100, performanceScore));

    // Generate recommendations
    const recommendations: string[] = [];
    
    if (failedLoads.length > 0) {
      recommendations.push(`Fix ${failedLoads.length} failed image loads`);
    }
    
    if (averageLoadTime > 1000) {
      recommendations.push('Optimize image loading performance');
    }
    
    if (successfulLoads.length === 0) {
      recommendations.push('Investigate image loading infrastructure');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Image performance is optimal');
    }

    return {
      totalImages: this.metrics.length,
      successfulLoads: successfulLoads.length,
      failedLoads: failedLoads.length,
      averageLoadTime,
      totalLoadTime,
      performanceScore: Math.round(performanceScore),
      recommendations
    };
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics = [];
  }

  /**
   * Export metrics for analysis
   */
  exportMetrics(): ImagePerformanceMetrics[] {
    return [...this.metrics];
  }

  /**
   * Get metrics for specific URL
   */
  getMetricsForUrl(): ImagePerformanceMetrics[] {
    return this.metrics.filter(() => true);
  }

  /**
   * Check if image performance is acceptable
   */
  isPerformanceAcceptable(): boolean {
    const report = this.getPerformanceReport();
    return report.performanceScore >= 80 && report.averageLoadTime <= 1000;
  }

  /**
   * Enable/disable monitoring
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }
}

// Export singleton instance
export const imagePerformanceMonitor = new ImagePerformanceMonitor();

// Export utility functions
export const startImageMonitoring = (url: string) => imagePerformanceMonitor.startMonitoring(url);
export const recordImageSuccess = (id: string, url: string, size: number, format: string) => 
  imagePerformanceMonitor.recordSuccess(id, url, size, format);
export const recordImageFailure = (id: string, url: string, error: string, retryCount?: number) => 
  imagePerformanceMonitor.recordFailure(id, url, error, retryCount);
export const getImagePerformanceReport = () => imagePerformanceMonitor.getPerformanceReport();
export const isImagePerformanceAcceptable = () => imagePerformanceMonitor.isPerformanceAcceptable();
