# =============================================================================
# SANITY CMS ENVIRONMENT VARIABLES - ERROR FIX VERSION
# Copy this to .env.local and fill in your actual values
# =============================================================================

# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=qaofdbqx
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-07-22

# Required: Sanity Authentication Token
# Get this from: https://sanity.io/manage -> API -> Tokens
# Create a new token with Editor permissions
SANITY_AUTH_TOKEN=your_sanity_auth_token_here

# Optional: Sanity Studio Configuration
SANITY_STUDIO_PREVIEW_URL=http://localhost:3000
SANITY_STUDIO_PRODUCTION_URL=https://your-deployment-domain.vercel.app

# Sanity Error Prevention
# Disable version checking to prevent fetch errors
SANITY_DISABLE_VERSION_CHECK=true
SANITY_DISABLE_TELEMETRY=true

# =============================================================================
# ERROR FIXES APPLIED:
# =============================================================================
# 1. Added SANITY_DISABLE_VERSION_CHECK to prevent "Failed to fetch version" errors
# 2. Added SANITY_DISABLE_TELEMETRY to prevent network calls
# 3. Updated GlobalErrorHandler to suppress Sanity-related errors
# 4. Added unstable_noAuthBoundary to Sanity config
# 5. Disabled telemetry in Sanity config
#
# These changes should resolve the console error:
# "Failed to fetch version for package (using tag=latest) sanity"
# =============================================================================
