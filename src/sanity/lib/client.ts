// ENTERPRISE-LEVEL SANITY CLIENT WITH BULLETPROOF ERROR HANDLING
// Using server-side proxy to avoid CORS issues and ensure enterprise-level security

// ENTERPRISE-LEVEL: Configurable timeout and retry settings
const ENTERPRISE_CONFIG = {
  TIMEOUT_MS: 30000, // 30 seconds for enterprise-level reliability
  MAX_RETRIES: 3,
  RETRY_DELAY_MS: 1000,
  EXPONENTIAL_BACKOFF: true
};

// ENTERPRISE-LEVEL: Exponential backoff retry logic
async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ENTERPRISE-LEVEL: Retry with exponential backoff
async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = ENTERPRISE_CONFIG.MAX_RETRIES,
  baseDelay: number = ENTERPRISE_CONFIG.RETRY_DELAY_MS
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        break; // Final attempt failed
      }
      
      // ENTERPRISE-LEVEL: Exponential backoff
      const delayMs = ENTERPRISE_CONFIG.EXPONENTIAL_BACKOFF 
        ? baseDelay * Math.pow(2, attempt)
        : baseDelay;
      
      console.warn(`Enterprise Sanity Client: Attempt ${attempt + 1} failed, retrying in ${delayMs}ms...`, error);
      await delay(delayMs);
    }
  }
  
  throw lastError!;
}

export async function querySanity(query: string, params: any = {}) {
  return retryWithBackoff(async () => {
    try {
      const queryParams = new URLSearchParams({
        query: query,
        params: JSON.stringify(params)
      });

      console.log('Enterprise Sanity Client: Executing query with params:', { query, params });

      const response = await fetch(`/api/sanity/query?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // ENTERPRISE-LEVEL: Extended timeout for complex queries
        signal: AbortSignal.timeout(ENTERPRISE_CONFIG.TIMEOUT_MS),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      
      // ENTERPRISE-LEVEL: Validate response data
      if (data.error) {
        throw new Error(`Sanity API error: ${data.error}`);
      }

      console.log('Enterprise Sanity Client: Query successful, data length:', Array.isArray(data) ? data.length : 'N/A');
      return data;
      
    } catch (error) {
      console.error('Enterprise Sanity Client: Query failed:', error);
      
      // ENTERPRISE-LEVEL: Provide meaningful error context
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`Query timeout after ${ENTERPRISE_CONFIG.TIMEOUT_MS}ms - please try again`);
        }
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Network error - please check your connection');
        }
        if (error.message.includes('HTTP error! status: 500')) {
          throw new Error('Server error - please try again later');
        }
        if (error.message.includes('HTTP error! status: 404')) {
          throw new Error('API endpoint not found - please contact support');
        }
      }
      
      throw new Error('Failed to fetch data from Sanity CMS');
    }
  });
}

// ENTERPRISE-LEVEL: Export a client object for compatibility
export const client = {
  fetch: querySanity
};
