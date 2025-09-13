import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Check if user has valid session
    const sessionCookie = request.cookies.get('sanity-session')
    
    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    // Verify session with Sanity
    const response = await fetch(`https://qaofdbqx.api.sanity.io/v2021-06-07/auth/sessions/me`, {
      headers: {
        'Authorization': `Bearer ${sessionCookie.value}`,
      },
    })

    if (response.ok) {
      return NextResponse.json({ authenticated: true })
    } else {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json({ authenticated: false }, { status: 500 })
  }
}
