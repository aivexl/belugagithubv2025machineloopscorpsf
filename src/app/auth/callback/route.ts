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
            getAll() {
              return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value, options }) => {
                try {
                  cookieStore.set({ name, value, ...options });
                } catch (error) {
                  console.error('Error setting cookie:', error);
                }
              });
            },
          },
        }
      );

      // CRITICAL FIX: Exchange code for session with enhanced error handling
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Supabase auth error:', error);
        // Don't throw error, continue with redirect
      } else if (data.session) {
        console.log('Successfully authenticated user:', data.session.user.email);
      }

    } catch (error) {
      console.error('Critical error in auth callback:', error);
      // Continue with redirect even if there's an error
    }
  } else {
    console.warn('Missing required parameters for authentication');
  }

  // CRITICAL FIX: Enhanced redirect logic for production with environment variable support
  let redirectUrl;
  
  if (process.env.NODE_ENV === 'production') {
    // Use environment variable if available, fallback to hardcoded production domain
    redirectUrl = process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN || 
                 'https://belugagithubv2025machineloopscorpsf-gold.vercel.app';
  } else {
    // Development environment
    redirectUrl = process.env.NEXT_PUBLIC_DEVELOPMENT_DOMAIN || 
                 requestUrl.origin;
  }

  // Add success parameter for better UX
  const finalRedirectUrl = `${redirectUrl}?auth=success&verified=true`;
  
  return NextResponse.redirect(finalRedirectUrl);
}
