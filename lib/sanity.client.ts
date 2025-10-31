import { createClient } from 'next-sanity'

// Environment configuration
// Use a safe default to prevent build-time crashes when env is missing
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'qaofdbqx'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-10-01'
const authToken = process.env.SANITY_AUTH_TOKEN

// Note: We intentionally avoid throwing at build-time if the env is missing.
// The default projectId ensures non-critical routes (e.g., sitemap) do not fail builds.

// Common client configuration
const commonConfig = {
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Disable CDN for fresh data and studio compatibility
  perspective: 'published' as const,
  // Request configuration for better reliability
  stega: {
    enabled: false, // Disable stega for studio compatibility
  },
}

// Regular client for production use
export const sanityClient = createClient({
  ...commonConfig,
  ...(authToken && { token: authToken }),
})

// Preview client for draft content
export const previewClient = createClient({
  ...commonConfig,
  ...(authToken && { token: authToken }),
  perspective: 'previewDrafts',
  useCdn: false, // Never use CDN for preview/draft content
})

// Helper function to choose client based on preview mode
export function getClient(preview = false) {
  return preview ? previewClient : sanityClient
}

// Query helper with error handling
export async function sanityFetch<T = any>(
  query: string,
  params: Record<string, any> = {},
  preview = false
): Promise<T> {
  try {
    const client = getClient(preview)

    // Add debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Sanity Query:', { query, params, preview })
    }

    const result = await client.fetch<T>(query, params)

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Sanity Response:', result)
    }

    return result
  } catch (error) {
    console.error('❌ Sanity Query Error:', error)

    // Re-throw with more context
    if (error instanceof Error) {
      throw new Error(`Sanity query failed: ${error.message}`)
    }

    throw error
  }
}

// Utility to check if we're in preview mode
export function isPreviewMode(request?: Request): boolean {
  if (!request) return false

  const url = new URL(request.url)
  return url.searchParams.has('preview') || url.searchParams.has('draft')
}


