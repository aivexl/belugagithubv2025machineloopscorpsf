"use client";

import React, { useState, useEffect } from "react";

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
        console.warn("Moralis API key not found, using fallback data");
        setTokenMetadata(generateFallbackMetadata());
        setLoading(false);
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
          console.warn(`Moralis API error: ${response.status}, using fallback data`);
          setTokenMetadata(generateFallbackMetadata());
          setLoading(false);
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
        console.log("Using fallback data");
        setTokenMetadata(generateFallbackMetadata());
        setLoading(false);
      }
    };

    // Generate fallback metadata when API fails
    const generateFallbackMetadata = () => {
      return {
        name: token.name || "Unknown Token",
        symbol: token.symbol || "UNKNOWN",
        logo: token.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(token.name || "Token")}&background=1f2937&color=fff&size=64&bold=true`,
            website: null,
            twitter: null,
            telegram: null,
        description: "Token information temporarily unavailable",
        totalSupply: "N/A",
        decimals: token.decimals || 18,
        verified: false
      };
    };

    fetchTokenMetadata();
  }, [token, chainId]);

  // Helper functions
  const formatNumber = (num) => {
    if (!num && num !== 0) return "N/A";
    if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
    return num.toLocaleString();
  };

  const formatPercentChange = (change) => {
    if (!change && change !== 0) return "0.00%";
    const formatted = change.toFixed(2);
    return `${change >= 0 ? "+" : ""}${formatted}%`;
  };

  const shortenAddress = (address) => {
    if (!address) return "N/A";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getExplorerUrl = (address) => {
    if (!address) return "#";
    const explorer = blockExplorers[chainId] || "https://etherscan.io";
    return `${explorer}/token/${address}`;
  };

  if (loading) {
    return (
      <div className="bg-duniacrypto-panel border border-gray-700 rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-duniacrypto-panel border border-gray-700 rounded-lg p-6">
        <div className="text-center text-gray-400">
          <p>Failed to load token information</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-duniacrypto-panel border border-gray-700 rounded-lg p-6 space-y-6">
      {/* Token Header */}
      <div className="flex items-center space-x-4">
        <img
          src={tokenMetadata?.logo || token.logo}
          alt={token.name}
          className="w-16 h-16 rounded-full"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(token.name)}&background=1f2937&color=fff&size=64&bold=true`;
          }}
        />
        <div>
          <h2 className="text-2xl font-bold text-white">{token.name}</h2>
          <p className="text-gray-400">{token.symbol}</p>
          {tokenMetadata?.verified && (
            <span className="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded mt-1">
              Verified
            </span>
          )}
        </div>
      </div>

      {/* Price Information */}
      {pair && (
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-400">Price</div>
              <div className="text-white font-medium text-lg">
                ${formatNumber(pair.usdPrice || 0)}
              </div>
            </div>
          <div>
              <div className="text-gray-400">24h Change</div>
              <div className={`font-medium ${
                (pair.usdPrice24hrPercentChange || 0) >= 0 
                  ? "text-duniacrypto-green" 
                  : "text-duniacrypto-red"
              }`}>
                {formatPercentChange(pair.usdPrice24hrPercentChange || 0)}
            </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm mt-4">
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
                className="text-blue-400 hover:text-blue-300 text-xs"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Network</span>
            <span className="text-white">{chainId}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Decimals</span>
            <span className="text-white">{tokenMetadata?.decimals || token.decimals || "N/A"}</span>
          </div>

          {tokenMetadata?.totalSupply && (
            <div className="flex justify-between">
              <span className="text-gray-400">Total Supply</span>
              <span className="text-white">{formatNumber(tokenMetadata.totalSupply)}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {tokenMetadata?.description && (
          <div className="pt-3 border-t border-gray-700">
            <div className="text-gray-300 text-sm leading-relaxed">
              {tokenMetadata.description}
            </div>
          </div>
        )}

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
            {tokenMetadata?.twitter && (
              <a
                href={tokenMetadata.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                Twitter
              </a>
            )}
            {tokenMetadata?.telegram && (
              <a
                href={tokenMetadata.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                Telegram
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenInfo; 
