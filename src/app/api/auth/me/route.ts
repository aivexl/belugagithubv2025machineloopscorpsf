import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

const jwtSecret = process.env.JWT_SECRET || 'mGvXklk4df50cNpXj09+9TlpfCrPqqYICH75UV2WfBm7Za8fB4SRjktrlcUUhkSn8fB4SRjktrlcUUhkSn8teF4eM1Kn2co+Dipu7V8w==';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pedasqlddhrqvbvbwdlzge.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlZGFzcWxkZGhycXZid2RsemdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNjE3ODIsImV4cCI6MjA2ODYzNzc4Mn0.G2zTfu-4vVO7R86rU8KJ2xKrjGOCLus2Clm0ZobZYBM';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 AUTH: /api/auth/me called');
    console.log('🍪 AUTH: All cookies:', request.cookies.getAll());
    
    // Try multiple token sources for maximum compatibility
    let token = request.cookies.get('auth-token')?.value || 
                request.cookies.get('beluga-auth')?.value ||
                request.headers.get('authorization')?.replace('Bearer ', '');
    
    console.log('🔍 AUTH: Token found:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');

    if (!token) {
      console.log('❌ AUTH: No token found in any source');
      return NextResponse.json(
        { success: false, error: 'No authentication token' },
        { status: 401 }
      );
    }

    // Verify JWT token
    let decoded: any;
    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      
      // Clear invalid cookie
      const response = NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
      response.cookies.delete('auth-token');
      return response;
    }

    // Check if token is expired
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      const response = NextResponse.json(
        { success: false, error: 'Token expired' },
        { status: 401 }
      );
      response.cookies.delete('auth-token');
      return response;
    }

    // Verify with Supabase using stored token
    const { data: userData, error } = await supabase.auth.getUser(decoded.supabaseToken);

    if (error || !userData.user) {
      console.error('Supabase user verification failed:', error);
      
      const response = NextResponse.json(
        { success: false, error: 'User verification failed' },
        { status: 401 }
      );
      response.cookies.delete('auth-token');
      return response;
    }

    // Return user data
    return NextResponse.json({
      success: true,
      user: {
        id: userData.user.id,
        email: userData.user.email,
        fullName: userData.user.user_metadata?.full_name || null,
        avatarUrl: userData.user.user_metadata?.avatar_url || null,
      }
    });

  } catch (error: any) {
    console.error('Auth verification error:', error);
    
    const response = NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
    response.cookies.delete('auth-token');
    return response;
  }
}
