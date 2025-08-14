"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const API_KEY = process.env.NEXT_PUBLIC_MORALIS_API_KEY;

const TrendingPage = () => {
  const [trendingTokens, setTrendingTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChain, setSelectedChain] = useState("0x1"); // Ethereum by default

  const chains = [
    { id: "0x1", name: "Ethereum", path: "ethereum" },
    { id: "0x38", name: "BSC", path: "bsc" },
    { id: "0x89", name: "Polygon", path: "polygon" },
    { id: "0xa4b1", name: "Arbitrum", path: "arbitrum" },
    { id: "0xa", name: "Optimism", path: "optimism" },
    { id: "0x2105", name: "Base", path: "base" },
    { id: "0xa86a", name: "Avalanche", path: "avalanche" },
    { id: "solana", name: "Solana", path: "solana" },
  ];

  useEffect(() => {
    const fetchTrendingTokens = async () => {
      try {
        setLoading(true);
        setError(null);

        let url;
        if (selectedChain === "solana") {
          url = "https://solana-gateway.moralis.io/token/mainnet/trending";
        } else {
          url = `https://deep-index.moralis.io/api/v2.2/tokens/trending?chain=${selectedChain}`;
        }

        console.log("Fetching trending tokens from:", url);

        const response = await fetch(url, {
          headers: {
            accept: "application/json",
            "X-API-Key": API_KEY,
          },
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Trending tokens response:", data);

        // Normalize data
        const tokens = data.tokens || data || [];
        setTrendingTokens(tokens);
      } catch (err) {
        console.error("Error fetching trending tokens:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingTokens();
  }, [selectedChain]);

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

  const getChainPath = (chainId) => {
    const chain = chains.find(c => c.id === chainId);
    return chain?.path || "ethereum";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-duniacrypto-bg-darker p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <div className="text-xl text-gray-400">Loading trending tokens...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-duniacrypto-bg-darker p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-red-400">
            <h2 className="text-xl font-bold mb-2">Error Loading Trending Tokens</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-duniacrypto-bg-darker">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Trending Tokens</h1>
          
          {/* Chain Selector */}
          <div className="flex flex-wrap gap-2">
            {chains.map((chain) => (
              <button
                key={chain.id}
                onClick={() => setSelectedChain(chain.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedChain === chain.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {chain.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tokens Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {trendingTokens.map((token, index) => (
            <Link
              key={token.address || index}
              href={`/token/${getChainPath(selectedChain)}/${token.address}`}
              className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors border border-gray-700"
            >
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src={token.logo || "/images/token-default.svg"}
                  alt={token.name}
                  className="w-10 h-10 rounded-full"
                  onError={(e) => {
                    e.target.onError = null;
                    e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzM0Mzk0NyIvPjwvc3ZnPg==";
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold truncate">{token.name}</h3>
                  <p className="text-gray-400 text-sm">{token.symbol}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Price</span>
                  <span className="text-white font-medium">
                    {formatPrice(token.usdPrice || token.price)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">24h Change</span>
                  <span className="text-sm">
                    {formatPercentChange(token.usdPrice24hrPercentChange || token.priceChange24h)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Market Cap</span>
                  <span className="text-white text-sm">
                    ${formatNumber(token.marketCap || token.mcap)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Volume</span>
                  <span className="text-white text-sm">
                    ${formatNumber(token.volume24hrUsd || token.volume24h)}
                  </span>
                </div>

                <div className="pt-2 border-t border-gray-700">
                  <div className="text-gray-400 text-xs font-mono">
                    {shortenAddress(token.address)}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {trendingTokens.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <h3 className="text-lg font-semibold mb-2">No Trending Tokens</h3>
            <p>No trending tokens found for the selected chain.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendingPage; 