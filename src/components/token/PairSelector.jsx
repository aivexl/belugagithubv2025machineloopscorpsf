"use client";

import React, { useState } from "react";

const PairSelector = ({ pairs, selectedPair, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!pairs || pairs.length === 0) {
    return null;
  }

  const handleSelect = (pair) => {
    onSelect(pair.pairAddress);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-gray-700 rounded-lg text-white hover:bg-gray-600 transition-colors"
      >
        <div className="flex items-center">
          <img
            src={selectedPair?.exchangeLogo || "/images/exchanges/default-exchange.svg"}
            alt={selectedPair?.exchangeName}
            className="w-5 h-5 mr-2 rounded-full"
            onError={(e) => {
              e.target.onError = null;
              e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzM0Mzk0NyIvPjwvc3ZnPg==";
            }}
          />
          <span className="font-medium">{selectedPair?.pairLabel}</span>
        </div>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
          {pairs.map((pair) => (
            <button
              key={pair.pairAddress}
              onClick={() => handleSelect(pair)}
              className={`w-full flex items-center p-3 text-left hover:bg-gray-700 transition-colors ${
                selectedPair?.pairAddress === pair.pairAddress
                  ? "bg-blue-600 text-white"
                  : "text-gray-300"
              }`}
            >
              <img
                src={pair.exchangeLogo || "/images/exchanges/default-exchange.svg"}
                alt={pair.exchangeName}
                className="w-5 h-5 mr-2 rounded-full"
                onError={(e) => {
                  e.target.onError = null;
                  e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzM0Mzk0NyIvPjwvc3ZnPg==";
                }}
              />
              <div className="flex-1">
                <div className="font-medium">{pair.pairLabel}</div>
                <div className="text-sm text-gray-400">
                  {pair.exchangeName} • ${(pair.liquidityUsd || 0).toLocaleString()}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PairSelector; 