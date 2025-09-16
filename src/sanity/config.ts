// Sanity configuration to prevent version fetch errors
// This file helps prevent "Failed to fetch version for package" errors

export const sanityConfig = {
  // Disable automatic version checking
  disableVersionCheck: true,
  
  // Set custom API version to prevent fetch attempts
  apiVersion: '2025-07-22',
  
  // Disable telemetry to prevent network calls
  telemetry: false,
  
  // Custom error handling
  onError: (error: Error) => {
    // Suppress version fetch errors
    if (error.message.includes('Failed to fetch version for package')) {
      console.warn('Sanity version check suppressed:', error.message);
      return;
    }
    
    // Log other errors normally
    console.error('Sanity error:', error);
  }
};

// Export for use in other files
export default sanityConfig;

