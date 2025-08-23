import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pedasqlddhrqvbvbwdlzge.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlZGFzcWxkZGhycXZid2RsemdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNjE3ODIsImV4cCI6MjA2ODYzNzc4Mn0.G2zTfu-4vVO7R86rU8KJ2xKrjGOCLus2Clm0ZobZYBM';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password required' },
        { status: 400 }
      );
    }

    // Sign up with Supabase
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          full_name: fullName?.trim() || null,
        },
      },
    });

    if (error) {
      console.error('Supabase signup error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    // Check if email confirmation is required
    if (data.user && !data.session) {
      return NextResponse.json({
        success: true,
        message: 'Please check your email for a confirmation link.',
        requiresConfirmation: true,
      });
    }

    // If user is immediately signed up (no email confirmation required)
    if (data.user && data.session) {
      return NextResponse.json({
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          fullName: data.user.user_metadata?.full_name || null,
          avatarUrl: data.user.user_metadata?.avatar_url || null,
        },
        message: 'Account created successfully!',
      });
    }

    return NextResponse.json(
      { success: false, error: 'Signup failed' },
      { status: 400 }
    );

  } catch (error: any) {
    console.error('Signup API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
