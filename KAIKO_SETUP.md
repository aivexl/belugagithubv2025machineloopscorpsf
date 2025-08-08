# Kaiko API Setup Guide

## Overview
This application now uses Kaiko API for cryptocurrency chart data instead of TradingView. Kaiko provides high-quality, institutional-grade market data.

## Setup Instructions

### 1. Get Kaiko API Key
1. Visit [Kaiko API Portal](https://www.kaiko.com/api)
2. Sign up for an account
3. Subscribe to a plan (they offer free tier)
4. Generate your API key

### 2. Configure Environment Variables
Add your Kaiko API key to `.env.local`:

```bash
# CoinGecko API Key
COINGECKO_API_KEY=CG-jrJUt1cGARECPAnb9TUeCdqE

# Kaiko API Key (Replace with your actual Kaiko API key)
KAIKO_API_KEY=your_actual_kaiko_api_key_here
```

### 3. Features
- **Real-time Data**: Live cryptocurrency price data
- **Multiple Timeframes**: 1H, 1D, 1W, 1M, 3M, 1Y
- **High Quality**: Institutional-grade data from multiple exchanges
- **Beluga Branding**: Elegant overlay with aqua gradient styling

### 4. API Endpoints Used
- `/api/kaiko/data/trades.v1/spot_direct_exchange_rate/{symbol}`
- Supports various parameters: start_time, end_time, interval, page_size

### 5. Fallback Behavior
If Kaiko API is unavailable or API key is invalid, the chart will:
- Show mock data for demonstration
- Display appropriate error messages
- Continue to function with simulated data

### 6. Chart Features
- **Interactive Time Range Selector**: Switch between different time periods
- **Real-time Price Display**: Current price with proper formatting
- **Responsive Design**: Works on mobile and desktop
- **Elegant Styling**: Aqua gradient theme with Beluga branding

## Troubleshooting

### API Key Issues
- Ensure your API key is valid and active
- Check your Kaiko subscription status
- Verify the key is correctly set in `.env.local`

### Rate Limiting
- Kaiko has rate limits based on your subscription tier
- The app includes proper error handling for rate limits
- Consider upgrading your plan if you hit limits frequently

### Data Issues
- Some symbols might not be available on Kaiko
- Check Kaiko's supported symbols list
- The app will fallback to mock data if symbol is not found

## Benefits of Kaiko
1. **High Quality Data**: Institutional-grade market data
2. **Multiple Exchanges**: Aggregated data from major exchanges
3. **Real-time Updates**: Live price feeds
4. **Professional API**: Robust and reliable service
5. **Comprehensive Coverage**: Wide range of cryptocurrencies 