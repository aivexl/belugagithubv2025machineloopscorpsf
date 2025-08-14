"use client";

import React, { useState, useEffect, useRef } from "react";
import { getQuoteFromPair } from "../utils/getQuoteFromPair";

const DexScreenerTokenTransactions = ({ pair, chainId, currentPriceUsd }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTransactionIds, setNewTransactionIds] = useState(new Set());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isResizing, setIsResizing] = useState(false);
  const [height, setHeight] = useState(400);
  const [resolvedPairAddress, setResolvedPairAddress] = useState(null);
  // Base poll 45s to reduce API load; will backoff on failures
  const [pollMs, setPollMs] = useState(45000);
  const pollTimeoutRef = useRef(null);
  const pollingActiveRef = useRef(false);
  const pollInterval = useRef(null);
  const tableRef = useRef(null);
  const resizeRef = useRef(null);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);

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

  const isSolana = chainId === "solana";

  // Initialize resize functionality
  useEffect(() => {
    const resizeHandle = resizeRef.current;
    if (!resizeHandle) return;

    const onMouseDown = (e) => {
      startYRef.current = e.clientY;
      startHeightRef.current = height;
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    const onMouseMove = (e) => {
      const deltaY = startYRef.current - e.clientY;
      const newHeight = Math.max(200, startHeightRef.current + deltaY);
      setHeight(newHeight);
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    resizeHandle.addEventListener("mousedown", onMouseDown);

    return () => {
      resizeHandle.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [height]);

  // Self-scheduling polling to avoid drift/overlap
  useEffect(() => {
    const startPolling = async () => {
      pollingActiveRef.current = true;
      await fetchTransactions();
      const schedule = (delay) => {
        if (!pollingActiveRef.current) return;
        if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current);
        pollTimeoutRef.current = setTimeout(async () => {
          if (!pollingActiveRef.current) return;
          try { await fetchNewTransactions(); } finally { schedule(pollMs); }
        }, delay);
      };
      schedule(pollMs);
    };

    if (pair) startPolling();

    return () => {
      pollingActiveRef.current = false;
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
        pollTimeoutRef.current = null;
      }
    };
  }, [pair, chainId, pollMs]);

  // Pause polling when tab hidden; resume and refresh on visible
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === 'visible') {
        // resume polling and fetch immediately
        if (!pollingActiveRef.current) return;
        fetchNewTransactions();
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  // Update current time every second for real-time timestamp display
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Helper: allow only buy/sell
  const isBuySellTx = (tx) => {
    const t = (tx?.transaction_type || tx?.transactionType || '').toString().toLowerCase();
    return t === 'buy' || t === 'sell';
  };

  // Helper: parse timestamp in ms
  const getTxTimestampMs = (tx) => {
    const raw = tx.block_timestamp || tx.blockTimestamp;
    if (!raw) return 0;
    if (typeof raw === 'number') return raw * 1000; // seconds → ms
    const d = new Date(raw);
    return isNaN(d.getTime()) ? 0 : d.getTime();
  };

  // Order helpers
  const sortByTimeDesc = (list) => [...list].sort((a, b) => getTxTimestampMs(b) - getTxTimestampMs(a));
  // Keep only one transaction per minute bucket (newest wins)
  const reduceOnePerMinute = (list) => {
    const sorted = sortByTimeDesc(list);
    const seenMinutes = new Set();
    const result = [];
    for (const tx of sorted) {
      const ts = getTxTimestampMs(tx);
      if (!ts) continue;
      const bucket = Math.floor(ts / 60000);
      if (!seenMinutes.has(bucket)) {
        seenMinutes.add(bucket);
        result.push(tx);
      }
    }
    return result;
  };

  // Normalize amounts and USD values using pair context
  const normalizeTransactions = (list) => {
    const quoteSymbol = (getQuoteFromPair({ pair, fallback: '' }) || '').toUpperCase();
    const STABLE = new Set(['USDT', 'USDC', 'BUSD', 'FDUSD', 'TUSD', 'DAI']);
    const isStableQuote = STABLE.has(quoteSymbol);
    const baseAddr = (pair?.baseToken?.address || '').toLowerCase();

    return list.map((tx) => {
      let tType = (tx.transaction_type || tx.transactionType || '').toString().toLowerCase();
      if (tType !== 'buy' && tType !== 'sell') {
        // Fallback inference using bought/sold fields if present
        const boughtAddr = (tx.bought?.address || tx.bought_token?.address || tx.boughtToken?.address || '').toLowerCase();
        const soldAddr = (tx.sold?.address || tx.sold_token?.address || tx.soldToken?.address || '').toLowerCase();
        if (baseAddr) {
          if (boughtAddr && boughtAddr === baseAddr) tType = 'buy';
          else if (soldAddr && soldAddr === baseAddr) tType = 'sell';
        }
      }
      const baseQuotePrice = parseFloat(tx.base_quote_price ?? tx.baseQuotePrice ?? 0);
      const quotePriceUsd = parseFloat(tx.quote_token_price_usd ?? tx.quoteTokenPriceUsd ?? 0);

      let baseAmt = parseFloat(tx.base_token_amount ?? tx.baseTokenAmount ?? tx.amount ?? 0);
      let quoteAmt = parseFloat(tx.quote_token_amount ?? tx.quoteTokenAmount ?? 0);
      // Prefer tx price; fallback to current coin price from header
      let priceUsd = parseFloat(tx.base_token_price_usd ?? tx.baseTokenPriceUsd ?? 0);
      if (!isFinite(priceUsd) || priceUsd <= 0) {
        const cp = parseFloat(currentPriceUsd || 0);
        if (isFinite(cp) && cp > 0) priceUsd = cp;
        else priceUsd = 0;
      }
      let totalUsd = parseFloat(tx.total_value_usd ?? tx.totalValueUsd ?? 0);

      if (!isFinite(baseAmt)) baseAmt = 0;
      if (!isFinite(quoteAmt)) quoteAmt = 0;
      if (!isFinite(priceUsd)) priceUsd = 0;
      if (!isFinite(totalUsd)) totalUsd = 0;

      // Prefer stable quote equivalence
      if (isStableQuote && !totalUsd && quoteAmt) totalUsd = Math.abs(quoteAmt);

      // Fill missing totals/prices
      if (!totalUsd && baseAmt && priceUsd) totalUsd = baseAmt * priceUsd;
      if (!priceUsd && baseAmt && totalUsd) priceUsd = totalUsd / baseAmt;
      if (!priceUsd && baseAmt && quoteAmt && quotePriceUsd) priceUsd = (quoteAmt * quotePriceUsd) / baseAmt;
      if (!priceUsd && isStableQuote && baseQuotePrice) priceUsd = baseQuotePrice; // USDT/USDC quotes

      // Derive missing amounts using baseQuotePrice
      if (!quoteAmt && baseAmt && baseQuotePrice) quoteAmt = baseAmt * baseQuotePrice;
      if (!baseAmt && quoteAmt && baseQuotePrice) baseAmt = baseQuotePrice ? (quoteAmt / baseQuotePrice) : 0;
      if (!quoteAmt && totalUsd && quotePriceUsd) quoteAmt = totalUsd / quotePriceUsd;
      if (!baseAmt && totalUsd && priceUsd) baseAmt = totalUsd / priceUsd;

      baseAmt = Math.abs(baseAmt);
      quoteAmt = Math.abs(quoteAmt);
      totalUsd = Math.abs(totalUsd);

      // Decide best maker wallet (prefer any valid address over tx hash)
      const candidateWallets = [
        tx.wallet_address, tx.walletAddress, tx.from_address, tx.fromAddress, tx.to_address, tx.toAddress,
        tx.maker, tx.makerAddress, tx.from, tx.to, tx.sender, tx.receiver
      ].filter(Boolean);
      let chosenWallet = '';
      for (const cand of candidateWallets) {
        if (typeof cand === 'string' && isAddress(cand)) { chosenWallet = cand; break; }
      }

      return {
        ...tx,
        transaction_type: tType || undefined,
        transactionType: tType || undefined,
        base_token_amount: baseAmt,
        baseTokenAmount: baseAmt,
        quote_token_amount: quoteAmt,
        quoteTokenAmount: quoteAmt,
        base_token_price_usd: priceUsd || undefined,
        baseTokenPriceUsd: priceUsd || undefined,
        total_value_usd: totalUsd || undefined,
        totalValueUsd: totalUsd || undefined,
        base_quote_price: baseQuotePrice || (priceUsd && quotePriceUsd ? priceUsd / quotePriceUsd : undefined),
        baseQuotePrice: baseQuotePrice || (priceUsd && quotePriceUsd ? priceUsd / quotePriceUsd : undefined),
        maker_wallet: chosenWallet || undefined,
        makerWallet: chosenWallet || undefined,
      };
    });
  };

  // Fetch initial transactions
  const fetchTransactions = async () => {
    if (!pair || !pair.baseToken?.address) {
      console.log("Missing pair or address:", { pair, address: pair?.baseToken?.address });
      setError("No valid token address available for this coin");
      setLoading(false);
      return;
    }

    console.log("Fetching transactions for:", {
      symbol: pair.baseToken.symbol,
      address: pair.baseToken.address,
      chainId: chainId
    });

    setLoading(true);
    setError(null);
    
    try {
      // Determine chain from chainId (use Moralis chain ids)
      let chain = 'bsc'; // default
      if (chainId === '0x1' || chainId === '1') chain = 'eth';
      else if (chainId === '0x38' || chainId === '56') chain = 'bsc';
      else if (chainId === '0x89' || chainId === '137') chain = 'polygon';
      else if (chainId === '0xa86a' || chainId === '43114') chain = 'avalanche';
      else if (chainId === '0xa4b1' || chainId === '42161') chain = 'arbitrum';
      else if (chainId === '0xa' || chainId === '10') chain = 'optimism';
      
      // Force BSC for specific tokens that we know are on BSC
      const symbol = pair.baseToken.symbol?.toLowerCase();
      if (symbol === 'doge' || symbol === 'dogecoin' || symbol === 'cake' || symbol === 'bnb') {
        chain = 'bsc';
        console.log(`Forcing BSC chain for ${symbol}`);
      }
      
      console.log(`Using ${chain} chain for ${symbol} (chainId: ${chainId})`);
      
      // Resolve correct DEX pair address (pool) if the provided pairAddress looks like a token contract
      const maybeTokenAddress = (pair.pairAddress || '').toLowerCase();
      const baseAddress = (pair.baseToken.address || '').toLowerCase();
      let pairAddressToUse = resolvedPairAddress || (maybeTokenAddress && maybeTokenAddress !== baseAddress ? maybeTokenAddress : null);

      // If the candidate is not a valid EVM address (e.g., a tx hash), discard it
      if (pairAddressToUse && !isAddress(pairAddressToUse)) {
        pairAddressToUse = null;
      }

      if (!pairAddressToUse) {
        try {
          const dexChainMap = { eth: 'ethereum', bsc: 'bsc', polygon: 'polygon', avalanche: 'avalanche', arbitrum: 'arbitrum', optimism: 'optimism', base: 'base' };
          const dsChain = dexChainMap[chain] || 'ethereum';
          const url = `/api/dexscreener/pairs?tokenAddress=${pair.baseToken.address}&chain=${dsChain}`;
          console.log('Resolving pair address via DexScreener:', url);
          const res = await fetch(url);
          if (res.ok) {
            const js = await res.json();
            const pairs = js?.data?.pairs || [];
            if (pairs.length > 0) {
              // Try to match the header quote symbol first
              const targetQuote = (getQuoteFromPair({ pair, fallback: 'USDT' }) || '').toUpperCase();
              const preferred = pairs.filter(p => (p.quoteToken?.symbol || '').toUpperCase() === targetQuote);
              const list = preferred.length > 0 ? preferred : pairs;
              // Prefer highest liquidity among the selected list
              list.sort((a, b) => ((b.liquidity?.usd || 0) - (a.liquidity?.usd || 0)));
              const chosen = list[0];
              pairAddressToUse = chosen?.pairAddress || null;
            }
          }
        } catch (e) {
          console.warn('Failed to resolve pair address from DexScreener:', e);
        }
      }

      if (pairAddressToUse) {
        setResolvedPairAddress(pairAddressToUse);
      }

      // Helper: attempt Moralis token-swaps
      const attemptTokenSwaps = async () => {
      try {
        const apiUrl = `/api/moralis/token-swaps?tokenAddress=${pair.baseToken.address}&chain=${chain}&order=DESC&limit=100`;
        console.log(`Trying Moralis Token Swaps: ${apiUrl}`);
        const response = await fetch(apiUrl);
          if (!response.ok) return false;
          const data = await response.json();
          if (data.success && Array.isArray(data.transactions) && data.transactions.length > 0) {
            const filtered = normalizeTransactions(data.transactions).filter(isBuySellTx);
            const initial = sortByTimeDesc(filtered).slice(0, 60);
            setTransactions(initial);
            console.log(`Transactions loaded from ${data.source || 'moralis-token-swaps'}`);
            setLoading(false);
            return true;
          }
          return false;
        } catch {
          return false;
        }
      };

      // Helper: attempt Moralis pair-swaps by pool address
      const attemptPairSwaps = async () => {
        try {
          const candidate = pairAddressToUse || pair.pairAddress;
          const addr = isAddress(candidate) ? candidate : null;
          if (!addr) return false;
          const apiUrl = `/api/moralis/pair-swaps?pairAddress=${addr}&chain=${chain}&order=DESC&limit=100`;
          console.log(`Trying Moralis Pair Swaps: ${apiUrl}`);
          const response = await fetch(apiUrl);
          if (!response.ok) return false;
          const data = await response.json();
          if (data.success && Array.isArray(data.transactions) && data.transactions.length > 0) {
            const filtered = normalizeTransactions(data.transactions).filter(isBuySellTx);
            const initial = sortByTimeDesc(filtered).slice(0, 60);
            setTransactions(initial);
            console.log(`Transactions loaded from ${data.source || 'moralis-pair-swaps'}`);
            setLoading(false);
            return true;
          }
          return false;
        } catch {
          return false;
        }
      };

      // Helper: attempt server real-time endpoint (DexScreener-backed)
      const attemptServerRealtime = async () => {
        try {
          const url = `/api/real-time/transactions?address=${pair.baseToken.address}&chain=${chain}&limit=100`;
          console.log('Trying server real-time transactions:', url);
          const res = await fetch(url);
          if (!res.ok) return false;
          const data = await res.json();
          if (!data?.success || !Array.isArray(data?.transactions) || data.transactions.length === 0) return false;
          const filtered = normalizeTransactions(data.transactions).filter(isBuySellTx);
          const initial = sortByTimeDesc(filtered).slice(0, 60);
          setTransactions(initial);
          console.log(`Transactions loaded from ${data.source || 'server-realtime'}`);
          setLoading(false);
          return true;
        } catch {
          return false;
        }
      };

      // Try in order: token-swaps → pair-swaps → server realtime
      const okToken = await attemptTokenSwaps();
      if (okToken) return;
      const okPair = await attemptPairSwaps();
      if (okPair) return;
      const okRealtime = await attemptServerRealtime();
      if (okRealtime) return;
      
      // If all APIs fail, show error
      console.log("All APIs failed, showing error");
      setError("No transactions available for this pair at the moment");
      setLoading(false);
      
    } catch (error) {
      console.error("Blockchain API error:", error);
      setError("Failed to load transactions from Blockchain API");
      setLoading(false);
    }
  };

  // Fallback: fetch via server real-time endpoint (DexScreener-backed)
  const fetchNewTransactionsFallback = async (chain) => {
    try {
      const url = `/api/real-time/transactions?address=${pair.baseToken.address}&chain=${chain}&limit=100`;
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();
      if (!data?.success || !Array.isArray(data?.transactions) || data.transactions.length === 0) return;

      const currentTransactionIds = new Set(
        transactions.map((tx) => tx.transaction_hash || tx.transactionHash)
      );

      const newTxs = normalizeTransactions(data.transactions)
        .filter(isBuySellTx)
        .filter((tx) => !currentTransactionIds.has(tx.transaction_hash || tx.transactionHash));

      if (newTxs.length > 0) {
        setTransactions((prev) => {
          const merged = [...newTxs, ...prev];
          return reduceOnePerMinute(merged);
        });
        const newIds = new Set(newTxs.map((tx) => tx.transaction_hash || tx.transactionHash));
        setNewTransactionIds(newIds);
        setTimeout(() => setNewTransactionIds(new Set()), 5000);
      }
    } catch (e) {
      console.warn('Fallback real-time transactions fetch failed', e);
    }
  };

  // Fetch new transactions for real-time updates
  const fetchNewTransactions = async () => {
    if (!pair || !pair.baseToken?.address) return;

    try {
      // Determine chain from chainId (Moralis ids)
      let chain = 'bsc';
      if (chainId === '0x1' || chainId === '1') chain = 'eth';
      else if (chainId === '0x38' || chainId === '56') chain = 'bsc';
      else if (chainId === '0x89' || chainId === '137') chain = 'polygon';
      else if (chainId === '0xa86a' || chainId === '43114') chain = 'avalanche';
      else if (chainId === '0xa4b1' || chainId === '42161') chain = 'arbitrum';
      else if (chainId === '0xa' || chainId === '10') chain = 'optimism';
      
      // Force BSC for specific tokens
      const symbol = pair.baseToken.symbol?.toLowerCase();
      if (symbol === 'doge' || symbol === 'dogecoin' || symbol === 'cake' || symbol === 'bnb') {
        chain = 'bsc';
      }

      // Poll Moralis Token Swaps for new transactions
      try {
        const url = `/api/moralis/token-swaps?tokenAddress=${pair.baseToken.address}&chain=${chain}&order=DESC&limit=100`;
        const response = await fetch(url);

        if (!response.ok) {
          console.warn(`Real-time API non-OK ${response.status} — using fallback`);
          await fetchNewTransactionsFallback(chain);
          // backoff a bit on failure
          setPollMs((prev) => Math.min(prev * 1.5, 120000));
          return;
        }

        const data = await response.json();

        if (data.success && data.transactions && data.transactions.length > 0) {
          // Check if there are new transactions
          const currentTransactionIds = new Set(
            transactions.map((tx) => tx.transaction_hash || tx.transactionHash)
          );

          const newTxs = normalizeTransactions(data.transactions)
            .filter(isBuySellTx)
            .filter((tx) => !currentTransactionIds.has(tx.transaction_hash || tx.transactionHash));

          if (newTxs.length > 0) {
            console.log("New real-time transactions found:", newTxs.length);
            setTransactions((prev) => {
              const merged = [...newTxs, ...prev];
              // After initial load, enforce 1 tx per minute (newest wins)
              return reduceOnePerMinute(merged);
            });
            
            // Highlight new transactions
            const newIds = new Set(newTxs.map((tx) => tx.transaction_hash || tx.transactionHash));
            setNewTransactionIds(newIds);
            
            // Remove highlight after 5 seconds
            setTimeout(() => {
              setNewTransactionIds(new Set());
            }, 5000);
          }
          // success: gently reduce backoff to baseline
          setPollMs((prev) => Math.max(45000, Math.floor(prev / 1.2)));
        }
      } catch (error) {
        console.warn("Error polling for new real-time transactions (using fallback)", error);
        await fetchNewTransactionsFallback(chain);
        setPollMs((prev) => Math.min(prev * 1.5, 120000));
      }
    } catch (err) {
      console.warn("Error polling for new Blockchain transactions:", err);
      setPollMs((prev) => Math.min(prev * 1.5, 120000));
    }
  };

  // Format time ago
  const formatTimeAgo = (dateString) => {
    if (!dateString) return "";

    // Handle different timestamp formats
    let date;
    if (typeof dateString === 'number') {
      // If it's a Unix timestamp (seconds), convert to milliseconds
      date = new Date(dateString * 1000);
    } else if (typeof dateString === 'string') {
      // If it's already a date string
      date = new Date(dateString);
    } else {
      // If it's already a Date object
      date = dateString;
    }

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.warn("Invalid date format:", dateString);
      return "Invalid date";
    }

    const now = currentTime; // Use the currentTime state instead of new Date()

    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    // Calculate years, months, and days more accurately
    const years = Math.floor(diffDay / 365.25);
    const remainingDaysAfterYears = diffDay % 365.25;
    const months = Math.floor(remainingDaysAfterYears / 30.44);
    const days = Math.floor(remainingDaysAfterYears % 30.44);
    
    // For very short periods, show seconds/minutes/hours
    if (diffSec < 60) return `${diffSec}s`;
    if (diffMin < 60) return `${diffMin}m`;
    if (diffHour < 24) return `${diffHour}h`;
    if (diffDay < 30) return `${diffDay}d`;
    
    // For periods less than a year, show months and days
    if (years === 0) {
      if (months === 0) return `${days}d`;
      if (days === 0) return `${months}m`;
      return `${months}m ${days}d`;
    }
    
    // For periods of a year or more, show years, months, and days
    if (months === 0 && days === 0) return `${years}y`;
    if (days === 0) return `${years}y ${months}m`;
    return `${years}y ${months}m ${days}d`;
  };

  // Format numbers with commas
  const formatNumber = (num, decimals = 0) => {
    if (num === undefined || num === null) return "0";

    const parsedNum = parseFloat(num);
    return parsedNum.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  // Format prices with appropriate decimal places
  const formatPrice = (price) => {
    if (!price) return "$0.00";

    const numPrice = typeof price === "string" ? parseFloat(price) : price;

    if (numPrice < 0.0001) {
      return "$" + numPrice.toFixed(8);
    } else if (numPrice < 1) {
      return "$" + numPrice.toFixed(6);
    } else if (numPrice < 10000) {
      return "$" + numPrice.toFixed(5);
    } else {
      return (
        "$" +
        numPrice.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      );
    }
  };

  // If Moralis price missing, use current coin price as fallback
  const ensurePriceUsd = (txPrice) => {
    const p = parseFloat(txPrice || 0);
    if (isFinite(p) && p > 0) return p;
    const cp = parseFloat(currentPriceUsd || 0);
    return isFinite(cp) && cp > 0 ? cp : 0;
  };

  // Get explorer URL for the transaction
  const getExplorerUrl = (txHash) => {
    const explorer = blockExplorers[chainId] || "";

    if (!explorer) return "#";

    if (isSolana) {
      return `${explorer}/tx/${txHash}`;
    } else {
      return `${explorer}/tx/${txHash}`;
    }
  };

  // Get wallet explorer URL (force address page, not tx)
  const getWalletExplorerUrl = (walletAddress) => {
    const explorer = blockExplorers[chainId] || "";

    if (!explorer) return "#";

    if (isSolana) return `${explorer}/account/${walletAddress}`;
    return `${explorer}/address/${walletAddress}`;
  };

  // Format wallet address (truncate)
  const formatWalletAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Basic EVM validators
  const isHex = (s, len) => typeof s === 'string' && /^0x[0-9a-fA-F]+$/.test(s) && s.length === len;
  const isAddress = (s) => isHex(s, 42);
  const isTxHash = (s) => isHex(s, 66);

  // Get transaction direction text and color
  const getTransactionType = (type) => {
    if (!type) return { text: "Unknown", color: "text-gray-500" };

    switch (type.toLowerCase()) {
      case "buy":
        return { text: "Buy", color: "text-green-500" };
      case "sell":
        return { text: "Sell", color: "text-red-500" };
      case "addliquidity":
        return { text: "Add Liquidity", color: "text-green-500" };
      case "removeliquidity":
        return { text: "Remove Liquidity", color: "text-red-500" };
      default:
        return {
          text: type.charAt(0).toUpperCase() + type.slice(1),
          color: "text-gray-500",
        };
    }
  };

  // Get value for base token column
  const getBaseTokenValue = ({ baseTokenAmount, tx }) => {
    let value = parseFloat(baseTokenAmount || 0);
    if (!value) {
      const totalUsd = parseFloat(tx?.total_value_usd || tx?.totalValueUsd || 0);
      const price = ensurePriceUsd(tx?.base_token_price_usd || tx?.baseTokenPriceUsd);
      if (totalUsd && price) value = totalUsd / price;
    }
    const symbol = pair?.baseToken?.symbol || "";
    return { value, symbol };
  };

  // Get value for quote token column
  const getQuoteTokenValue = ({ quoteTokenAmount, tx }) => {
    let value = parseFloat(quoteTokenAmount || 0);
    const headerSymbol = getQuoteFromPair({ pair, fallback: "USDT" });
    const stable = ["USDT","USDC","BUSD","FDUSD","TUSD","DAI"]; 
    const symbol = headerSymbol || pair?.quoteToken?.symbol || "USDT";
    if (stable.includes((symbol || '').toUpperCase())) {
      let usd = parseFloat(tx?.total_value_usd || tx?.totalValueUsd || 0);
      if (!usd) {
        const baseAmt = parseFloat(tx?.base_token_amount || tx?.baseTokenAmount || 0);
        const priceUsd = ensurePriceUsd(tx?.base_token_price_usd || tx?.baseTokenPriceUsd);
        if (baseAmt && priceUsd) usd = baseAmt * priceUsd;
      }
      return { value: Math.abs(usd || value), symbol };
    }

    return { value: Math.abs(value || 0), symbol };
  };

  // Format price with appropriate color
  const formatPriceWithColor = (price) => {
    if (!price) return { text: "-", color: "text-gray-500" };

    const formattedPrice = formatPrice(price);
    return {
      text: formattedPrice,
      color: "text-gray-200", // Default color
    };
  };

  // Format value with color based on transaction type
  const formatValueWithColor = (value, txType) => {
    if (!value) return { text: "-", color: "text-gray-500" };

    const formattedValue = formatNumber(value, 2);
    const color =
      txType.toLowerCase() === "buy" ? "text-green-500" : "text-red-500";

    return {
      text: formattedValue,
      color,
    };
  };

  if (!pair) {
    return (
      <div className="p-4 text-center text-dex-text-secondary">
        No pair data available
      </div>
    );
  }

  if (loading && transactions.length === 0) {
    return (
      <div className="p-4 text-center text-dex-text-secondary">
        Loading transactions...
      </div>
    );
  }

  if (error && transactions.length === 0) {
    return (
      <div className="p-4 text-center text-dex-text-secondary">
        <div className="mb-4">
          <div className="text-2xl mb-2">⚠️</div>
          <div className="text-lg font-medium mb-2">Failed to load transactions</div>
          <div className="text-sm opacity-75 mb-4">{error}</div>
          <button
            onClick={fetchTransactions}
            className="px-4 py-2 bg-dex-blue text-white rounded hover:bg-dex-blue/80 transition-colors"
          >
            Retry
          </button>
        </div>
        <div className="text-xs opacity-50 space-y-1">
          <div>Token: {pair?.baseToken?.symbol || 'Unknown'}</div>
          <div>Address: {pair?.baseToken?.address || 'No address'}</div>
          <div>Chain: {chainId || 'Unknown'}</div>
          <div className="mt-2 text-xs">
            <div>💡 Tips:</div>
            <div>• Check if the token has trading activity on this chain</div>
            <div>• Verify the token contract address is correct</div>
            <div>• APIs might be temporarily unavailable</div>
          </div>
        </div>
      </div>
    );
  }

  if (transactions.length === 0 && !loading && !error) {
    return (
      <div className="p-4 text-center text-dex-text-secondary">
        <div className="mb-4">
          <div className="text-2xl mb-2">📊</div>
          <div className="text-lg font-medium mb-2">No transactions found</div>
          <div className="text-sm opacity-75 mb-4">
            No recent transactions for this token on the selected chain.
          </div>
          <button
            onClick={fetchTransactions}
            className="px-4 py-2 bg-dex-blue text-white rounded hover:bg-dex-blue/80 transition-colors"
          >
            Refresh
          </button>
        </div>
        <div className="text-xs opacity-50 space-y-1">
          <div>Token: {pair?.baseToken?.symbol || 'Unknown'}</div>
          <div>Address: {pair?.baseToken?.address || 'No address'}</div>
          <div>Chain: {chainId || 'Unknown'}</div>
          <div className="mt-2 text-xs">
            <div>💡 Possible reasons:</div>
            <div>• Token has no recent trading activity</div>
            <div>• Token is not traded on this blockchain</div>
            <div>• Contract address might be incorrect</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      
      <div
        className="overflow-auto border border-dex-border bg-dex-bg-primary"
        style={{ height: `${height}px` }}
      >
        <table
          ref={tableRef}
          className="w-full text-sm text-left border-collapse"
        >
          <thead className="text-xs uppercase bg-dex-bg-secondary sticky top-0 z-10">
            <tr className="border-b border-dex-border">
              <th className="px-4 py-3 whitespace-nowrap">DATE</th>
              <th className="px-4 py-3 whitespace-nowrap">TYPE</th>
              <th className="px-4 py-3 text-right whitespace-nowrap">USD</th>
              <th className="px-4 py-3 text-right whitespace-nowrap">
                {pair?.baseToken?.symbol || "TOKEN"}
              </th>
              <th className="px-4 py-3 text-right whitespace-nowrap">
                {getQuoteFromPair({ pair, fallback: "USDT" })}
              </th>
              <th className="px-4 py-3 text-right whitespace-nowrap">PRICE</th>
              <th className="px-4 py-3 whitespace-nowrap">MAKER</th>
              <th className="px-4 py-3 text-right whitespace-nowrap">TXN</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => {
              // Handle both API response formats (snake_case and camelCase)
              const txHash = tx.transaction_hash || tx.transactionHash;
              // Ensure maker shows a wallet (never a tx hash)
              let walletAddress = tx.maker_wallet || tx.makerWallet || tx.wallet_address || tx.walletAddress || '';
              if (!walletAddress) {
                walletAddress = tx.from_address || tx.fromAddress || tx.to_address || tx.toAddress || '';
              }
              // Final guard: if still looks like a tx hash or invalid, blank it to avoid wrong links
              if (!isAddress(walletAddress)) {
                walletAddress = '';
              }
              const txType = tx.transaction_type || tx.transactionType;
              const baseTokenAmount = tx.base_token_amount || tx.baseTokenAmount;
              const quoteTokenAmount = tx.quote_token_amount || tx.quoteTokenAmount;
              const totalValueUsd = tx.total_value_usd || tx.totalValueUsd;
              const baseTokenPriceUsd = tx.base_token_price_usd || tx.baseTokenPriceUsd;
              const blockTimestamp = tx.block_timestamp || tx.blockTimestamp;

              const transactionType = getTransactionType(txType);
              const baseToken = getBaseTokenValue({ baseTokenAmount: baseTokenAmount, tx });
              const quoteToken = getQuoteTokenValue({ quoteTokenAmount: quoteTokenAmount, tx });
              const usdValue = formatValueWithColor(totalValueUsd, txType);
              const price = formatPriceWithColor(ensurePriceUsd(baseTokenPriceUsd));
              const isNew = newTransactionIds.has(txHash);

              // Create a unique key using transaction hash and index
              const uniqueKey = `${txHash}_${index}`;

              const rowFlash = transactionType.text === 'Buy' ? 'animate-flash-green' : (transactionType.text === 'Sell' ? 'animate-flash-red' : '');

              return (
                <tr
                  key={uniqueKey}
                  className={`border-b border-dex-border hover:bg-dex-bg-secondary/50 ${rowFlash}`}
                >
                  <td className="px-4 py-3 text-dex-text-secondary whitespace-nowrap">
                    {formatTimeAgo(blockTimestamp)}
                  </td>
                  <td
                    className={`px-4 py-3 ${transactionType.color} font-medium whitespace-nowrap`}
                  >
                    {transactionType.text}
                  </td>
                  <td
                    className={`px-4 py-3 text-right ${usdValue.color} whitespace-nowrap`}
                  >
                    {usdValue.text}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {baseToken.value ? formatNumber(baseToken.value, 4) : "-"}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {quoteToken.value ? formatNumber(quoteToken.value, 4) : "-"}
                  </td>
                  <td
                    className={`px-4 py-3 text-right ${price.color} whitespace-nowrap`}
                  >
                    {price.text}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {walletAddress ? (
                      <a
                        href={getWalletExplorerUrl(walletAddress)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono hover:text-dex-blue flex items-center"
                      >
                        <span className="bg-dex-bg-tertiary text-dex-text-primary px-1 rounded mr-1">🦊</span>
                        {formatWalletAddress(walletAddress)}
                      </a>
                    ) : (
                      <span className="text-dex-text-secondary">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <a
                      href={getExplorerUrl(txHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-dex-text-secondary hover:text-dex-blue"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Resize handle */}
      <div
        ref={resizeRef}
        className="h-2 bg-dex-bg-secondary hover:bg-dex-blue cursor-ns-resize flex items-center justify-center"
      >
        <div className="w-10 h-1 bg-gray-600 rounded-full"></div>
      </div>
    </div>
  );
};

export default DexScreenerTokenTransactions;
