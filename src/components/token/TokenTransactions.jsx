"use client";

import React from "react";

const TokenTransactions = ({ pair, chainId }) => {
  return (
    <div className="p-4">
      <div className="text-center text-gray-400">
        <h3 className="text-lg font-semibold mb-2">Transactions</h3>
        <p>Transaction data will be displayed here</p>
        <p className="text-sm mt-2">
          Pair: {pair?.pairAddress || "No pair selected"}
        </p>
        <p className="text-sm">Chain: {chainId}</p>
      </div>
    </div>
  );
};

export default TokenTransactions; 