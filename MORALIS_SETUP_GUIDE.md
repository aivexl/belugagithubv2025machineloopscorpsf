# Moralis API Setup Guide

## Your API Key is Ready! 🎉

Your Moralis API key has been provided:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImVjMTAzOTRmLTU5MzMtNDE4NS1hZWIzLTk0ZjcyMGVkNGI3NSIsIm9yZ0lkIjoiNDYxNDYyIiwidXNlcklkIjoiNDc0NzU2IiwidHlwZUlkIjoiYTc4ZDlmZjMtMDlhZS00MmM2LTkxNDItMDk2MDg1ODY3NzE1IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NTM0ODE1NjgsImV4cCI6NDkwOTI0MTU2OH0.59Lf5n4sqfb7EuAYhpn141fdPigaD6lNgVNh-8t4_R0
```

## Step 1: Create Environment File

Create a new file called `.env.local` in your project root directory (same level as `package.json`) and add:

```env
# Moralis API Configuration
MORALIS_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImVjMTAzOTRmLTU5MzMtNDE4NS1hZWIzLTk0ZjcyMGVkNGI3NSIsIm9yZ0lkIjoiNDYxNDYyIiwidXNlcklkIjoiNDc0NzU2IiwidHlwZUlkIjoiYTc4ZDlmZjMtMDlhZS00MmM2LTkxNDItMDk2MDg1ODY3NzE1IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NTM0ODE1NjgsImV4cCI6NDkwOTI0MTU2OH0.59Lf5n4sqfb7EuAYhpn141fdPigaD6lNgVNh-8t4_R0

# CoinGecko API Configuration (if you have one)
COINGECKO_API_KEY=your_coingecko_api_key_here
```

## Step 2: Restart Development Server

After creating the `.env.local` file, restart your development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart it
npm run dev
```

## Step 3: Test the Integration

1. **Navigate to a supported cryptocurrency** like:
   - `/crypto/ethereum` (ETH)
   - `/crypto/usdt` (USDT)
   - `/crypto/bnb` (BNB)
   - `/crypto/matic` (MATIC)

2. **Go to the "Chart & Txns" tab** or "Txns" tab

3. **You should see real transaction data** from the blockchain!

## Supported Cryptocurrencies

The system supports these cryptocurrencies for transaction data:

### Ethereum Mainnet
- **ETH** (native token)
- **USDT**, **USDC**, **WBTC**, **DAI**, **LINK**, **UNI**, **AAVE**, **COMP**, **MKR**

### Binance Smart Chain (BSC)
- **BNB** (native token)
- **BUSD**, **CAKE**

### Other Networks
- **Polygon**: MATIC, WMATIC
- **Avalanche**: AVAX
- **Fantom**: FTM
- **Arbitrum**: ARB
- **Optimism**: OP
- **Solana**: SOL

## Features You'll See

✅ **Real-time transaction data** from blockchain networks
✅ **Sortable transaction table** (by time, value)
✅ **Transaction details** (hash, addresses, amounts)
✅ **Network information** (chain, token type)
✅ **Pagination** with load more functionality
✅ **Error handling** and loading states

## Troubleshooting

If you see "Transaction Data Not Available":
1. Make sure the `.env.local` file is created correctly
2. Restart the development server
3. Try a supported cryptocurrency (ETH, USDT, BNB, etc.)
4. Check the browser console for any errors

## Security Note

The `.env.local` file is automatically ignored by Git, so your API key won't be committed to version control.

---

**Your Moralis integration is now ready! 🚀**

Test it by visiting `/crypto/ethereum/chart-txns` to see real Ethereum transaction data. 