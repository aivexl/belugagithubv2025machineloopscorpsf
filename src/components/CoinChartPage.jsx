"use client";

import React, { useState, useEffect } from 'react';
import CleanTradingViewChart from './CleanTradingViewChart';

const CoinChartPage = ({ coinId, coinData, detailedData }) => {


  return (
    <div className="space-y-6">
      {/* Chart Section */}
      <div className="bg-duniacrypto-panel rounded-lg border border-gray-700">
        <CleanTradingViewChart 
          symbol={coinData?.symbol}
          coinData={coinData}
          className="w-full h-full"
          height="600px"
        />
      </div>
    </div>
  );
};

export default CoinChartPage; 