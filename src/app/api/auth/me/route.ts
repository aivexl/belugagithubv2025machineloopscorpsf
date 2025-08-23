import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

const jwtSecret = process.env.JWT_SECRET || 'your-fallback-secret-key';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: NextRequest) {
  try {
    // Get token from httpOnly cookie
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
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
