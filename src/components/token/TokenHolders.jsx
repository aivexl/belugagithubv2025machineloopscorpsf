"use client";

import React from "react";

const TokenHolders = ({ token, chainId }) => {
  return (
    <div className="p-4">
      <div className="text-center text-gray-400">
        <h3 className="text-lg font-semibold mb-2">Token Holders</h3>
        <p>Holder data will be displayed here</p>
        <p className="text-sm mt-2">
          Token: {token?.address || "No token selected"}
        </p>
        <p className="text-sm">Chain: {chainId}</p>
      </div>
    </div>
  );
};

export default TokenHolders; 