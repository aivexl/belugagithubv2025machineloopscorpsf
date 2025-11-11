import DexScreenerChartTxnsLayout from '@/components/DexScreenerChartTxnsLayout';
import CryptoHeader from '@/components/CryptoHeader';

interface ChartTxnsPageProps {
  params: Promise<{ id: string }>;
}

async function fetchCoinData(id: string) {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&x_cg_demo_api_key=CG-jrJUt1cGARECPAnb9TUeCdqE`,
      { next: { revalidate: 60 } }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch coin data: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching coin data:', error);
    return null;
  }
}

async function fetchCoinMarkets(id: string) {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${id}&order=market_cap_desc&per_page=1&page=1&price_change_percentage=1h,24h,7d,30d,1y&x_cg_demo_api_key=CG-jrJUt1cGARECPAnb9TUeCdqE`,
      { next: { revalidate: 60 } }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch coin markets: ${response.status}`);
    }
    
    const data = await response.json();
    return data[0] || null;
  } catch (error) {
    console.error('Error fetching coin markets:', error);
    return null;
  }
}

export default async function ChartTxnsPage({ params }: ChartTxnsPageProps) {
  const { id } = await params;
  const [coinData, marketData] = await Promise.all([
    fetchCoinData(id),
    fetchCoinMarkets(id)
  ]);
  
  // Merge market data (which has current_price and price_change_percentage_24h) with coin data
  // Ensure image is properly mapped from coinData
  // CoinGecko API can return image as: string, or object with {large, small, thumb}
  const getImageUrl = () => {
    if (!coinData?.image) return marketData?.image || null;
    
    // If image is a string, use it directly
    if (typeof coinData.image === 'string') {
      return coinData.image;
    }
    
    // If image is an object, try large, small, then thumb
    if (typeof coinData.image === 'object') {
      return coinData.image.large || coinData.image.small || coinData.image.thumb || null;
    }
    
    return null;
  };

  const mergedCoinData = {
    ...coinData,
    image: getImageUrl(),
    current_price: marketData?.current_price || coinData?.market_data?.current_price?.usd,
    price_change_percentage_24h: marketData?.price_change_percentage_24h || coinData?.market_data?.price_change_percentage_24h_in_currency?.usd,
  };
  
  return (
    <div className="min-h-screen bg-dex-bg-primary flex flex-col">
      <CryptoHeader 
        coinData={mergedCoinData}
        detailedData={coinData}
      />
      <div className="flex-1 p-4">
        <DexScreenerChartTxnsLayout
          coinData={coinData}
          symbol={coinData?.symbol || id}
        />
      </div>
    </div>
  );
} 