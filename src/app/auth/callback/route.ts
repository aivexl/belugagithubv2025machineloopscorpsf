import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  // CRITICAL FIX: Enhanced error handling and logging for production
  if (code && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const cookieStore = await cookies();
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
          cookies: {
            get(name: string) {
              return cookieStore.get(name)?.value;
            },
            set(name: string, value: string, options: any) {
              try {
                cookieStore.set({ name, value, ...options });
              } catch (error) {
                // Handle cookie setting errors gracefully
                console.warn('Failed to set cookie:', name, error);
              }
            },
            remove(name: string, options: any) {
              try {
                cookieStore.set({ name, value: '', ...options });
              } catch (error) {
                // Handle cookie removal errors gracefully
                console.warn('Failed to remove cookie:', name, error);
              }
            },
          },
        }
      );

      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error('Auth callback error:', error);
        return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=auth_callback_failed`);
      }

      // CRITICAL FIX: Enhanced redirect logic for production with environment variable support
      let redirectUrl;
      if (process.env.NODE_ENV === 'production') {
        redirectUrl = process.env['NEXT_PUBLIC_PRODUCTION_DOMAIN'] || 'https://belugagithubv2025machineloopscorpsf-gold.vercel.app';
      } else {
        redirectUrl = process.env['NEXT_PUBLIC_DEVELOPMENT_DOMAIN'] || requestUrl.origin;
      }

      return NextResponse.redirect(redirectUrl);
    } catch (error) {
      console.error('Auth callback exception:', error);
      return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=auth_callback_exception`);
    }
  }

  // Fallback redirect if no code or missing environment variables
  console.warn('Auth callback missing code or environment variables');
  return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=missing_parameters`);
}
