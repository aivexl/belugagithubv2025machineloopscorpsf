import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const redirectTo = searchParams.get('redirectTo') || '/studio'

  // Generate state parameter for security
  const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  
  // Store state in session/cookie for validation
  const response = NextResponse.redirect(
    `https://github.com/login/oauth/authorize?` +
    `client_id=${process.env.GITHUB_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/github/callback`)}&` +
    `scope=user:email&` +
    `state=${state}`
  )

  // Store state in cookie
  response.cookies.set('github-auth-state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // 10 minutes
  })

  return response
}
