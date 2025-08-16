"use client";

import React, { useState, useEffect } from "react";

const API_KEY = process.env.NEXT_PUBLIC_MORALIS_API_KEY;

const TokenInfo = ({ token, pair, timeFrame, chainId }) => {
  const [tokenMetadata, setTokenMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Block explorer URLs by chain
  const blockExplorers = {
    "0x1": "https://etherscan.io",
    "0x38": "https://bscscan.com",
    "0x89": "https://polygonscan.com",
    "0xa4b1": "https://arbiscan.io",
    "0xa": "https://optimistic.etherscan.io",
    "0x2105": "https://basescan.org",
    "0xa86a": "https://snowtrace.io",
    "0xe708": "https://lineascan.build",
    "0xfa": "https://ftmscan.com",
    "0x171": "https://scan.pulsechain.com",
    "0x7e4": "https://app.roninchain.com",
    solana: "https://solscan.io",
  };

  // Fetch token metadata
  useEffect(() => {
    const fetchTokenMetadata = async () => {
      if (!token || !token.address) return;

      // Check if Moralis API key is available
      const moralisApiKey = process.env.NEXT_PUBLIC_MORALIS_API_KEY;
      
      if (!moralisApiKey) {
        console.warn("Moralis API key not found, using CoinGecko API directly");
        await fetchFromCoinGecko();
        return;
      }

      try {
        let url;
        const isSolana = chainId === "solana";

        if (isSolana) {
          url = `https://solana-gateway.moralis.io/token/mainnet/${token.address}/metadata`;
        } else {
          url = `https://deep-index.moralis.io/api/v2.2/erc20/metadata?chain=${chainId}&addresses[0]=${token.address}`;
        }

        console.log("Fetching token metadata from:", url);

        const response = await fetch(url, {
          headers: {
            accept: "application/json",
            "X-API-Key": moralisApiKey,
          },
        });

        if (!response.ok) {
          console.warn(`Moralis API error: ${response.status}, trying CoinGecko API`);
          await fetchFromCoinGecko();
          return;
        }

        const data = await response.json();
        console.log("Token metadata response:", data);

        // Handle different response formats
        if (isSolana) {
          setTokenMetadata(data);
        } else {
          // EVM response is an array, take first item
          setTokenMetadata(
            Array.isArray(data) && data.length > 0 ? data[0] : null
          );
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching token metadata from Moralis:", err);
        console.log("Falling back to CoinGecko API");
        await fetchFromCoinGecko();
      }
    };

    // Fallback function to fetch from CoinGecko
    const fetchFromCoinGecko = async () => {
      try {
        console.log("Fetching token data from CoinGecko API...");
        
        const symbol = token.symbol?.toLowerCase();
        if (!symbol) {
          setTokenMetadata({
            name: token.name,
            symbol: token.symbol,
            logo: token.logo,
            website: null,
            twitter: null,
            telegram: null,
            discord: null,
          });
          setLoading(false);
          return;
        }

        const coingeckoApiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
        const apiKeyParam = coingeckoApiKey ? `&x_cg_demo_api_key=${coingeckoApiKey}` : '';
        
        // First try to search by symbol
        		const searchUrl = `/api/coingecko-proxy/search?query=${symbol}`;
                  const searchResponse = await fetch(searchUrl, {
            headers: {
              'X-CG-Demo-API-Key': 'CG-1NBArXikTdDPy9GPrpUyEmwt',
              'Accept': 'application/json'
            }
          });
        
        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          
          if (searchData.coins && searchData.coins.length > 0) {
            // Get the first matching coin
            const coinId = searchData.coins[0].id;
            
            // Now get detailed data for this coin
            		const detailUrl = `/api/coingecko-proxy/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;
                          const detailResponse = await fetch(detailUrl, {
                headers: {
                  'X-CG-Demo-API-Key': 'CG-1NBArXikTdDPy9GPrpUyEmwt',
                  'Accept': 'application/json'
                }
              });
            
            if (detailResponse.ok) {
              const coinData = await detailResponse.json();
              
              setTokenMetadata({
                name: coinData.name || token.name,
                symbol: coinData.symbol?.toUpperCase() || token.symbol,
                logo: coinData.image?.large || coinData.image?.small || token.logo,
                website: coinData.links?.homepage?.[0] || null,
                twitter: coinData.links?.twitter_screen_name ? `https://twitter.com/${coinData.links.twitter_screen_name}` : null,
                telegram: coinData.links?.telegram_channel_identifier ? `https://t.me/${coinData.links.telegram_channel_identifier}` : null,
                discord: coinData.links?.repos_url?.github?.[0] || null,
                market_cap: coinData.market_data?.market_cap?.usd || 0,
                volume_24h: coinData.market_data?.total_volume?.usd || 0,
                price_change_24h: coinData.market_data?.price_change_percentage_24h || 0,
                totalSupply: coinData.market_data?.total_supply || 0,
                circulatingSupply: coinData.market_data?.circulating_supply || 0,
              });
              setLoading(false);
              return;
            }
          }
        }
        
        // Fallback: use basic token info
        setTokenMetadata({
          name: token.name,
          symbol: token.symbol,
          logo: token.logo,
          website: null,
          twitter: null,
          telegram: null,
          discord: null,
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching from CoinGecko:", err);
        // Use basic token info as final fallback
        setTokenMetadata({
          name: token.name,
          symbol: token.symbol,
          logo: token.logo,
          website: null,
          twitter: null,
          telegram: null,
          discord: null,
        });
        setLoading(false);
      }
    };

    fetchTokenMetadata();
  }, [token, chainId]);

  const formatPrice = (price) => {
    if (!price || price === 0) return "$0.00";
    return "$" + price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
  };

  const formatNumber = (num) => {
    if (!num || num === 0) return "0";
    if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
    return num.toString();
  };

  const formatPercentChange = (value) => {
    if (!value && value !== 0) return "0.00%";
    const num = parseFloat(value);
    if (isNaN(num)) return "0.00%";
    const isPositive = num >= 0;
    return (
      <span className={isPositive ? "text-green-400" : "text-red-400"}>
        {isPositive ? "+" : ""}{num.toFixed(2)}%
      </span>
    );
  };

  const shortenAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const getExplorerUrl = (address, type = "address") => {
    const explorer = blockExplorers[chainId];
    if (!explorer) return "#";
    return `${explorer}/${type}/${address}`;
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-700 rounded"></div>
            <div className="h-3 bg-gray-700 rounded"></div>
            <div className="h-3 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="p-4 text-center text-gray-400">
        No token information available
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Token Header */}
      <div className="flex items-center space-x-3">
        <img
          src={token.logo || tokenMetadata?.logo || "/images/token-default.svg"}
          alt={token.name}
          className="w-12 h-12 rounded-full"
          onError={(e) => {
            e.target.onError = null;
            e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzM0Mzk0NyIvPjwvc3ZnPg==";
          }}
        />
        <div>
          <h2 className="text-xl font-bold text-white">{token.name}</h2>
          <p className="text-gray-400">{token.symbol}</p>
        </div>
      </div>

      {/* Price Information */}
      {pair && (
        <div className="space-y-3">
          <div>
            <div className="text-2xl font-bold text-white">
              {formatPrice(pair.usdPrice)}
            </div>
            <div className="text-sm">
              {formatPercentChange(pair.usdPrice24hrPercentChange)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-400">Market Cap</div>
              <div className="text-white font-medium">
                ${formatNumber(pair.liquidityUsd || 0)}
              </div>
            </div>
            <div>
              <div className="text-gray-400">24h Volume</div>
              <div className="text-white font-medium">
                ${formatNumber(pair.volume24hrUsd || 0)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Token Details */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Token Details</h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Contract Address</span>
            <div className="flex items-center space-x-2">
              <span className="text-white font-mono">
                {shortenAddress(token.address)}
              </span>
              <button
                onClick={() => navigator.clipboard.writeText(token.address)}
                className="text-blue-400 hover:text-blue-300"
                title="Copy address"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Decimals</span>
            <span className="text-white">{token.decimals || tokenMetadata?.decimals || "18"}</span>
          </div>

          {tokenMetadata?.totalSupply && (
            <div className="flex justify-between">
              <span className="text-gray-400">Total Supply</span>
              <span className="text-white">{formatNumber(tokenMetadata.totalSupply)}</span>
            </div>
          )}
        </div>

        {/* Links */}
        <div className="pt-3 border-t border-gray-700">
          <div className="flex space-x-3">
            <a
              href={getExplorerUrl(token.address)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              View on Explorer
            </a>
            {tokenMetadata?.website && (
              <a
                href={tokenMetadata.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                Website
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenInfo; 