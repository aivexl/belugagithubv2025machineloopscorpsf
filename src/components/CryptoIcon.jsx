import React from 'react';

const CryptoIcon = ({ symbol, size = 24, className = '' }) => {
  // Default crypto icon colors
  const getIconColor = (symbol) => {
    const colors = {
      'BTC': '#F7931A', // Bitcoin orange
      'ETH': '#627EEA', // Ethereum blue
      'USDT': '#26A17B', // Tether green
      'USDC': '#2775CA', // USD Coin blue
      'BNB': '#F3BA2F', // Binance Coin yellow
      'XRP': '#23292F', // Ripple black
      'ADA': '#0033AD', // Cardano blue
      'SOL': '#14F195', // Solana green
      'DOT': '#E6007A', // Polkadot pink
      'MATIC': '#8247E5', // Polygon purple
      'LINK': '#2A5ADA', // Chainlink blue
      'UNI': '#FF007A', // Uniswap pink
      'AVAX': '#E84142', // Avalanche red
      'ATOM': '#2E3148', // Cosmos dark
      'LTC': '#BFBB7E', // Litecoin silver
      'BCH': '#0AC18E', // Bitcoin Cash green
      'XLM': '#000000', // Stellar black
      'FIL': '#0090FF', // Filecoin blue
      'VET': '#15BDFF', // VeChain blue
      'TRX': '#FF060A', // TRON red
    };
    
    return colors[symbol.toUpperCase()] || '#6B7280'; // Default gray
  };

  // Generate initials for the icon
  const getInitials = (symbol) => {
    return symbol.slice(0, 2).toUpperCase();
  };

  const iconColor = getIconColor(symbol);
  const initials = getInitials(symbol);

  return (
    <div
      className={`flex items-center justify-center rounded-full font-bold text-white ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: iconColor,
        fontSize: Math.max(size * 0.4, 10),
        minWidth: size,
        minHeight: size
      }}
      title={`${symbol} icon`}
    >
      {initials}
    </div>
  );
};

export default CryptoIcon;
