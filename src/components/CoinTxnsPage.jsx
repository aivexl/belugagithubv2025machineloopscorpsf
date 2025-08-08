"use client";

import React from 'react';
import EnhancedTransactionPage from './EnhancedTransactionPage';

const CoinTxnsPage = ({ coinId, coinData, detailedData }) => {
  return (
    <EnhancedTransactionPage 
      coinId={coinId}
      coinData={coinData}
      detailedData={detailedData}
    />
  );
};

export default CoinTxnsPage; 