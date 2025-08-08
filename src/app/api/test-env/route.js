import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('=== ENVIRONMENT VARIABLES TEST ===');
    console.log('All environment variables:', Object.keys(process.env));
    console.log('MORALIS_API_KEY exists:', !!process.env.MORALIS_API_KEY);
    console.log('NEXT_PUBLIC_MORALIS_API_KEY exists:', !!process.env.NEXT_PUBLIC_MORALIS_API_KEY);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    
    return NextResponse.json({
      success: true,
      envVars: {
        MORALIS_API_KEY: !!process.env.MORALIS_API_KEY,
        NEXT_PUBLIC_MORALIS_API_KEY: !!process.env.NEXT_PUBLIC_MORALIS_API_KEY,
        NODE_ENV: process.env.NODE_ENV,
        totalEnvVars: Object.keys(process.env).length
      },
      moralisKeyLength: process.env.MORALIS_API_KEY ? process.env.MORALIS_API_KEY.length : 0,
      publicKeyLength: process.env.NEXT_PUBLIC_MORALIS_API_KEY ? process.env.NEXT_PUBLIC_MORALIS_API_KEY.length : 0
    });
  } catch (error) {
    console.error('Error in test-env:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message
    }, { status: 500 });
  }
} 