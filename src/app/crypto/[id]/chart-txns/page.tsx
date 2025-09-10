import DexScreenerChartTxnsLayout from '@/components/DexScreenerChartTxnsLayout';

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

export default async function ChartTxnsPage({ params }: ChartTxnsPageProps) {
  const { id } = await params;
  const coinData = await fetchCoinData(id);
  
  return (
    <div className="min-h-screen bg-dex-bg-primary flex flex-col">
      <div className="flex-1 p-4">
        <DexScreenerChartTxnsLayout
          coinData={coinData}
          symbol={coinData?.symbol || id}
        />
        {/* Debug info */}
        <div className="text-xs text-gray-500 mt-2">
          Debug: ID={id}, Symbol={coinData?.symbol}, Name={coinData?.name}
        </div>
      </div>
    </div>
  );
} 