import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const endpoint = `/${slug.join('/')}`;
    
    // Get query parameters from the request
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    
    // Get API key from headers
    const apiKey = request.headers.get('X-CG-Demo-API-Key');
    
    if (!apiKey) {
      console.error('[PROXY] No API key provided');
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 401 }
      );
    }
    
    // Validate API key format
    if (!apiKey.startsWith('CG-')) {
      console.error('[PROXY] Invalid API key format:', apiKey);
      return NextResponse.json(
        { error: 'Invalid API key format' },
        { status: 401 }
      );
    }
    
    // Construct the full CoinGecko API URL
    const baseUrl = 'https://api.coingecko.com/api/v3';
    const fullUrl = `${baseUrl}${endpoint}${queryString ? `?${queryString}` : ''}`;
    
    console.log(`[PROXY] Forwarding request to: ${fullUrl}`);
    console.log(`[PROXY] Using API key: ${apiKey.substring(0, 8)}...`);
    
    // Determine the correct header format based on endpoint
    const headers = {
      'Accept': 'application/json',
      'User-Agent': 'DuniaCrypto/1.0'
    };
    
    // For market chart endpoints, try multiple authentication methods
    if (endpoint.includes('/market_chart')) {
      console.log(`[PROXY] Market chart endpoint detected: ${endpoint}`);
      
      // Try method 1: Query parameter with x_cg_demo_api_key
      const separator1 = queryString ? '&' : '?';
      const urlWithKey1 = `${fullUrl}${separator1}x_cg_demo_api_key=${apiKey}`;
      
      console.log(`[PROXY] Trying method 1 (query param): ${urlWithKey1.substring(0, 100)}...`);
      
      let response = await fetch(urlWithKey1, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Beluga-Crypto-App/1.0'
        },
        signal: AbortSignal.timeout(30000)
      });
      
      if (response.ok) {
        console.log(`[PROXY] Method 1 successful!`);
        return handleResponse(response, endpoint);
      }
      
      console.log(`[PROXY] Method 1 failed: ${response.status} ${response.statusText}`);
      
      // Try method 2: Query parameter with api_key
      const separator2 = queryString ? '&' : '?';
      const urlWithKey2 = `${fullUrl}${separator2}api_key=${apiKey}`;
      
      console.log(`[PROXY] Trying method 2 (api_key): ${urlWithKey2.substring(0, 100)}...`);
      
      response = await fetch(urlWithKey2, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Beluga-Crypto-App/1.0'
        },
        signal: AbortSignal.timeout(30000)
      });
      
      if (response.ok) {
        console.log(`[PROXY] Method 2 successful!`);
        return handleResponse(response, endpoint);
      }
      
      console.log(`[PROXY] Method 2 failed: ${response.status} ${response.statusText}`);
      
      // Try method 3: Header authentication
      console.log(`[PROXY] Trying method 3 (header auth)...`);
      
      response = await fetch(fullUrl, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Beluga-Crypto-App/1.0',
          'X-CG-Demo-API-Key': apiKey
        },
        signal: AbortSignal.timeout(30000)
      });
      
      if (response.ok) {
        console.log(`[PROXY] Method 3 successful!`);
        return handleResponse(response, endpoint);
      }
      
      console.log(`[PROXY] Method 3 failed: ${response.status} ${response.statusText}`);
      
      // Try method 4: Authorization header
      console.log(`[PROXY] Trying method 4 (Authorization header)...`);
      
      response = await fetch(fullUrl, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Beluga-Crypto-App/1.0',
          'Authorization': `Bearer ${apiKey}`
        },
        signal: AbortSignal.timeout(30000)
      });
      
      if (response.ok) {
        console.log(`[PROXY] Method 4 successful!`);
        return handleResponse(response, endpoint);
      }
      
      console.log(`[PROXY] Method 4 failed: ${response.status} ${response.statusText}`);
      
      // All methods failed, return the last error
      console.error(`[PROXY] All authentication methods failed for market chart endpoint`);
      return handleResponse(response, endpoint);
      
    } else {
      // For other endpoints, use header authentication
      headers['X-CG-Demo-API-Key'] = apiKey;
      
      const response = await fetch(fullUrl, {
        headers,
        signal: AbortSignal.timeout(30000)
      });
      
      return handleResponse(response, endpoint);
    }
    
  } catch (error) {
    console.error('[PROXY] Proxy error:', error);
    
    // Handle specific error types
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Request timeout. The API request took too long to complete.' },
        { status: 408 }
      );
    }
    
    if (error.code === 'ENOTFOUND') {
      return NextResponse.json(
        { error: 'Network error. Unable to reach CoinGecko API.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal proxy error', details: error.message },
      { status: 500 }
    );
  }
}

// Helper function to handle response
async function handleResponse(response, endpoint) {
  // Handle different response statuses
  if (response.ok) {
    const data = await response.json();
    console.log(`[PROXY] Success: ${response.status} for ${endpoint}`);
    return NextResponse.json(data);
  }
  
  // Handle specific error cases
  if (response.status === 401) {
    console.error(`[PROXY] CoinGecko API error: ${response.status} Unauthorized`);
    console.error(`[PROXY] This usually means the API key is invalid or expired`);
    return NextResponse.json(
      { 
        error: 'API key is invalid or expired. Please check your CoinGecko API key.',
        details: 'The provided API key was rejected by CoinGecko. Please verify the key is correct and has not expired.'
      },
      { status: 401 }
    );
  }
  
  if (response.status === 429) {
    console.error(`[PROXY] CoinGecko API error: ${response.status} Too Many Requests`);
    return NextResponse.json(
      { 
        error: 'Rate limit exceeded. Please try again later.',
        details: 'You have exceeded the rate limit for CoinGecko API. Please wait before making more requests.'
      },
      { status: 429 }
    );
  }
  
  // Handle other errors
  const errorText = await response.text();
  console.error(`[PROXY] CoinGecko API error: ${response.status} ${response.statusText}`);
  console.error(`[PROXY] Error details:`, errorText);
  
  return NextResponse.json(
    { 
      error: `CoinGecko API error: ${response.status} ${response.statusText}`,
      details: errorText
    },
    { status: response.status }
  );
}
