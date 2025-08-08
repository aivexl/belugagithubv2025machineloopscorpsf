# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - Name: `beluga-crypto` (or your preferred name)
   - Database Password: Choose a strong password
   - Region: Choose closest to your users
6. Click "Create new project"

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to Settings > API
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **Anon/Public Key** (looks like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## 3. Set Up Environment Variables

Create or update your `.env.local` file in the root directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 4. Configure Authentication

1. In your Supabase dashboard, go to Authentication > Settings
2. Under "Site URL", add your domain (for development: `http://localhost:3000`)
3. Under "Redirect URLs", add:
   - `http://localhost:3000/auth/callback` (for development)
   - `https://your-domain.com/auth/callback` (for production)

## 5. Enable Google OAuth (Optional)

1. In your Supabase dashboard, go to Authentication > Providers
2. Click on "Google"
3. Enable Google provider
4. Add your Google OAuth credentials:
   - Client ID
   - Client Secret
5. Save the configuration

## 6. Test the Setup

1. Start your development server: `npm run dev`
2. Navigate to your app
3. Click "Sign Up" or "Login" in the navbar
4. Test both email/password and Google authentication

## Troubleshooting

- Make sure your environment variables are correctly set
- Check that your Supabase project is active
- Verify that the redirect URLs are correctly configured
- Ensure your Google OAuth credentials are valid (if using Google auth)

## Security Notes

- Never commit your `.env.local` file to version control
- Keep your Supabase keys secure
- Use environment variables for all sensitive configuration
- Regularly rotate your API keys
