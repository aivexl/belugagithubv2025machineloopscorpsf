# =============================================================================
# SANITY CMS + GITHUB OAUTH ENVIRONMENT VARIABLES
# Copy this to .env.local and fill in your actual values
# =============================================================================

# GitHub OAuth Configuration
# Get these from: https://github.com/settings/applications/new
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=Zqgn1p2HpIXHBc/Q/HynLmUC5crb2oOXoybz/LV3tL0=

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

# =============================================================================
# SETUP INSTRUCTIONS:
# =============================================================================
# 1. Create GitHub OAuth App at: https://github.com/settings/applications/new
#    - Application name: Beluga Crypto CMS
#    - Homepage URL: http://localhost:3000
#    - Authorization callback URL: http://localhost:3000/api/auth/github/callback
#
# 2. Get Sanity Auth Token from: https://sanity.io/manage
#    - Go to API -> Tokens
#    - Create new token with Editor permissions
#
# 3. Replace the placeholder values above with your actual credentials
#
# 4. Restart your development server: npm run dev
#
# 5. Visit http://localhost:3000/studio to test GitHub login
# =============================================================================
