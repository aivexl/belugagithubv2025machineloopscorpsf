import React from 'react';

interface TradingViewChartProps {
  symbol: string;
  theme?: 'light' | 'dark';
}

declare const TradingViewChart: React.FC<TradingViewChartProps>;

export default TradingViewChart; 