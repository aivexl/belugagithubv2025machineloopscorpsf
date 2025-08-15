/**
 * Scrollbar utility component for applying custom dark theme scrollbar styles
 * Usage: <div className="scrollbar-thin"> or <div className="scrollbar-default">
 */

export const scrollbarClasses = {
  // Default thin scrollbar (6px)
  default: 'scrollbar-default',
  
  // Extra thin scrollbar (4px) for tight spaces
  thin: 'custom-scrollbar-thin',
  
  // No scrollbar (auto-hide)
  hidden: 'scrollbar-hidden'
} as const;

// CSS-in-JS styles for dynamic use
export const scrollbarStyles = {
  default: {
    scrollbarWidth: 'thin' as const,
    scrollbarColor: '#374151 #1f2937',
  },
  
  webkit: {
    '&::-webkit-scrollbar': {
      width: '6px',
      height: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#1f2937',
      borderRadius: '3px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#374151',
      borderRadius: '3px',
      border: '1px solid #1f2937',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#4b5563',
    },
  }
};

export default scrollbarClasses;
