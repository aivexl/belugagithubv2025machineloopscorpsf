import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pedasqlddhrqvbvbwdlzge.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlZGFzcWxkZGhycXZid2RsemdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNjE3ODIsImV4cCI6MjA2ODYzNzc4Mn0.G2zTfu-4vVO7R86rU8KJ2xKrjGOCLus2Clm0ZobZYBM';
const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production-2024-enterprise-grade-security';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password required' },
        { status: 400 }
      );
    }

    // Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      console.error('Supabase auth error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }

    if (!data.user || !data.session) {
      return NextResponse.json(
        { success: false, error: 'Authentication failed' },
        { status: 401 }
      );
    }

    // Create JWT token
    const jwtPayload = {
      userId: data.user.id,
      email: data.user.email,
      supabaseToken: data.session.access_token,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7), // 7 days (match cookie)
    };

    const token = jwt.sign(jwtPayload, jwtSecret);

    // Create response with both httpOnly cookie AND token in response for localStorage
    const response = NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        fullName: data.user.user_metadata?.full_name || null,
        avatarUrl: data.user.user_metadata?.avatar_url || null,
      },
      token: token, // Include token in response for localStorage fallback
      sessionData: {
        userId: data.user.id,
        email: data.user.email,
        supabaseToken: data.session.access_token,
        expiresAt: Date.now() + (60 * 60 * 24 * 7 * 1000), // 7 days in milliseconds
      }
    });

    // Try multiple cookie setting approaches for maximum compatibility
    const cookieOptions = {
      httpOnly: false, // Allow JS access for debugging and fallback
      secure: false, // Allow in development
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    };

    // Set multiple cookie variants for compatibility
    response.cookies.set('auth-token', token, cookieOptions);
    response.cookies.set('beluga-auth', token, cookieOptions);
    
    // Also set headers for manual cookie setting
    response.headers.set('Set-Cookie', [
      `auth-token=${token}; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax`,
      `beluga-auth=${token}; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax`
    ].join(', '));

    console.log('🍪 AUTH: Multiple cookies set successfully', {
      token: token.substring(0, 20) + '...',
      maxAge: 60 * 60 * 24 * 7,
      cookieOptions,
    });

    return response;

  } catch (error: any) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
