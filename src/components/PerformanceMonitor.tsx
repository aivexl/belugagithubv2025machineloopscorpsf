"use client";

import { useEffect } from 'react';

// Type definitions for performance entries
interface FirstInputEntry extends PerformanceEntry {
  processingStart: number;
  startTime: number;
}

interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
}

export default function PerformanceMonitor() {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') return;

    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Log critical performance metrics
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP:', entry.startTime);
          // You can send this to analytics
        }
        
        if (entry.entryType === 'first-input') {
          const firstInputEntry = entry as FirstInputEntry;
          if (firstInputEntry.processingStart && firstInputEntry.startTime) {
            console.log('FID:', firstInputEntry.processingStart - firstInputEntry.startTime);
          }
        }
        
        if (entry.entryType === 'layout-shift') {
          const layoutShiftEntry = entry as LayoutShiftEntry;
          console.log('CLS:', layoutShiftEntry.value);
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
    } catch {
      // Browser might not support all metrics
      console.log('Performance monitoring not fully supported');
    }

    // Memory usage monitoring (if supported)
    if ('memory' in performance) {
      const checkMemory = () => {
        const memory = (performance as Performance & { memory: { usedJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
        if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
          console.warn('High memory usage detected');
        }
      };
      
      const memoryInterval = setInterval(checkMemory, 30000); // Check every 30 seconds
      
      return () => {
        clearInterval(memoryInterval);
        observer.disconnect();
      };
    }

    return () => observer.disconnect();
  }, []);

  return null; // This component doesn't render anything
}
