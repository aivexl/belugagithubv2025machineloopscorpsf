// ENTERPRISE-LEVEL: Global Type Definitions
// Comprehensive type support for the entire application

/// <reference types="next" />
/// <reference types="next/image-types/global" />
/// <reference types="next/navigation-types/compat/navigation" />

// ENTERPRISE-LEVEL: Module declarations for better compatibility
declare module '*.svg' {
  import React from 'react';
  const SVG: React.FC<React.SVGProps<SVGSVGElement>>;
  export default SVG;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

declare module '*.ico' {
  const content: string;
  export default content;
}

declare module '*.bmp' {
  const content: string;
  export default content;
}

// ENTERPRISE-LEVEL: CSS Modules support
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { [key: string]: string };
  export default classes;
}

// ENTERPRISE-LEVEL: JSON modules support
declare module '*.json' {
  const value: any;
  export default value;
}

// ENTERPRISE-LEVEL: Environment variables
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    NEXT_PUBLIC_APP_ENV: 'development' | 'staging' | 'production';
  }
}

// ENTERPRISE-LEVEL: Global utility types
declare global {
  interface Window {
    // ENTERPRISE-LEVEL: Global window extensions
    __NEXT_DATA__?: any;
    __NEXT_PRELOADREADY__?: (id: string) => void;
    __NEXT_REGISTER_PAGE__?: (route: string, Component: any) => void;
    
    // ENTERPRISE-LEVEL: Analytics and tracking
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    
    // ENTERPRISE-LEVEL: Custom global variables
    belugaApp?: {
      version: string;
      environment: string;
      features: Record<string, boolean>;
    };
  }
  
  // ENTERPRISE-LEVEL: Global error handling
  interface Error {
    code?: string;
    statusCode?: number;
    isOperational?: boolean;
  }
  
  // ENTERPRISE-LEVEL: Global fetch extensions
  interface Response {
    ok: boolean;
    status: number;
    statusText: string;
    json(): Promise<any>;
    text(): Promise<string>;
    headers: Headers;
  }
  
  // ENTERPRISE-LEVEL: Global console extensions
  interface Console {
    // ENTERPRISE-LEVEL: Structured logging
    log: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    error: (...args: any[]) => void;
    info: (...args: any[]) => void;
    debug: (...args: any[]) => void;
    
    // ENTERPRISE-LEVEL: Performance logging
    time: (label: string) => void;
    timeEnd: (label: string) => void;
    timeLog: (label: string, ...args: any[]) => void;
  }
}

// ENTERPRISE-LEVEL: Export for module augmentation
export {}; 