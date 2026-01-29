## 2026-01-29 - Unprotected Admin API
**Vulnerability:** Found a Next.js API route `/api/admin` that was completely unprotected, allowing any user (authenticated or not) to POST/PUT/DELETE data. It also contained hardcoded Supabase credentials.
**Learning:** The developer likely copied a client-side Supabase pattern (`createClient` with keys) into a server-side route without realizing that API routes need explicit session verification and should use the server-side client helper to handle cookies correctly.
**Prevention:** Always use `@/utils/supabase/server` for server-side clients which respects cookies, and explicit `supabase.auth.getUser()` checks for mutation endpoints.
