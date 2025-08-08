# API Error Fix Guide

## Problem
The error `API error: 400` was occurring in `TokenSidebar.jsx` at line 119 because the code was throwing an error instead of gracefully handling API failures.

## Fixes Applied

### 1. Improved Error Handling in TokenSidebar.jsx
- **Before**: Code threw an error on any non-200 response
- **After**: Code now gracefully handles 400, 401, and other errors by falling back to CoinGecko API

### 2. Improved Error Handling in TokenInfo.jsx
- **Before**: Code threw an error on API failures
- **After**: Code now logs warnings and sets error state instead of throwing

## Environment Setup

### 1. Create .env.local file
Create a file named `.env.local` in your project root directory with:

```env
# Moralis API Key (Required for token metadata)
NEXT_PUBLIC_MORALIS_API_KEY=your_moralis_api_key_here

# CoinGecko API Key (Optional, for fallback)
NEXT_PUBLIC_COINGECKO_API_KEY=your_coingecko_api_key_here
```

### 2. Get Moralis API Key
1. Go to [Moralis.io](https://moralis.io/)
2. Sign up/Login
3. Go to Web3 APIs section
4. Copy your API key
5. Replace `your_moralis_api_key_here` in `.env.local`

### 3. Test Your Setup
After creating `.env.local`, test your API connection:

```bash
# Test environment variables
curl http://localhost:3000/api/test-env

# Test Moralis API connection
curl http://localhost:3000/api/moralis/test
```

## Common Issues & Solutions

### Issue 1: 400 Bad Request
**Cause**: Invalid token address, chain ID, or malformed request
**Solution**: The code now gracefully falls back to CoinGecko API

### Issue 2: 401 Unauthorized
**Cause**: Invalid or missing API key
**Solution**: 
1. Check your `.env.local` file exists
2. Verify API key is correct
3. Restart development server after adding `.env.local`

### Issue 3: Rate Limiting
**Cause**: Too many API requests
**Solution**: The code now uses fallback APIs when primary API fails

## Testing Your Fix

1. **Restart your development server**:
   ```bash
   npm run dev
   ```

2. **Test the token page** with a known token address

3. **Check browser console** for any remaining errors

4. **Verify fallback behavior** by temporarily using an invalid API key

## Additional Improvements

The code now includes:
- ✅ Graceful error handling
- ✅ Multiple API fallbacks
- ✅ Better logging for debugging
- ✅ Mock data when all APIs fail
- ✅ No more unhandled promise rejections

## Next Steps

1. Create the `.env.local` file with your API keys
2. Restart your development server
3. Test the application
4. Monitor console logs for any remaining issues

If you still see errors, check the browser console for specific error messages and ensure your API keys are valid.
