// Redirect to feed.xml for compatibility
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.redirect(new URL('/feed.xml', process.env.NODE_ENV === 'production' ? 'https://beluga.id' : 'http://localhost:3000'));
}




