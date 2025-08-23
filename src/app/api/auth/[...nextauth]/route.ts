/**
 * NextAuth.js API Route Handler
 * Enterprise-Grade Authentication Endpoints
 * 
 * Handles all authentication routes:
 * - /api/auth/signin
 * - /api/auth/signout
 * - /api/auth/callback
 * - /api/auth/session
 * - /api/auth/providers
 * - /api/auth/csrf
 */

import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
