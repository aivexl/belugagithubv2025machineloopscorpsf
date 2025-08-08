"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { tradingViewService } from '../utils/tradingview';
import type { TradingViewSearchResult } from '../utils/tradingview';

interface TradingViewSearchProps {
  onSymbolSelect: (symbol: string) => void;
  placeholder?: string;
}

export default function TradingViewSearch({ 
  onSymbolSelect, 
  placeholder = "Search for crypto symbols..." 
}: TradingViewSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<TradingViewSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchSymbols = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const searchResults = await tradingViewService.searchSymbols(searchQuery);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        searchSymbols(query);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, searchSymbols]);

  const handleSymbolSelect = (symbol: string) => {
    onSymbolSelect(symbol);
    setQuery('');
    setShowResults(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {showResults && (results.length > 0 || loading) && (
        <div className="absolute z-50 w-full mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-400">
              Searching...
            </div>
          ) : results.length > 0 ? (
            <div>
              {results.map((result, index) => (
                <button
                  key={`${result.symbol}-${index}`}
                  onClick={() => handleSymbolSelect(result.symbol)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-700 border-b border-gray-600 last:border-b-0 focus:outline-none focus:bg-gray-700"
                >
                  <div className="flex items-center space-x-3">
                    {result.logo_urls?.dark && (
                      <img 
                        src={result.logo_urls.dark} 
                        alt={result.full_name}
                        className="w-8 h-8 rounded"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-white font-semibold">{result.full_name}</h4>
                        <span className="text-gray-400 text-sm">{result.exchange}</span>
                      </div>
                      <p className="text-gray-400 text-sm">{result.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-blue-400 text-xs font-mono">{result.symbol}</span>
                        <span className="text-gray-500 text-xs">•</span>
                        <span className="text-gray-500 text-xs capitalize">{result.type}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : query.trim() && (
            <div className="p-4 text-center text-gray-400">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}

      {/* Click outside to close results */}
      {showResults && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  );
} 