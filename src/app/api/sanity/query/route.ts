import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'next-sanity';

// Create Sanity client for server-side
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'qaofdbqx',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-07-22',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // Optional: for private datasets
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const params = searchParams.get('params');

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    let parsedParams = {};
    if (params) {
      try {
        parsedParams = JSON.parse(params);
      } catch (error) {
        console.warn('Failed to parse params:', error);
      }
    }

    // Execute the GROQ query
    const result = await client.fetch(query, parsedParams);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Sanity query API error:', error);
    
    // Return a more user-friendly error
    return NextResponse.json(
      { 
        error: 'Failed to fetch data from Sanity',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      }, 
      { status: 500 }
    );
  }
}
