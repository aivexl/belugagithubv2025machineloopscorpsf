import CryptoDetailClient from '../../../../components/CryptoDetailClient';

export default async function ChartPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CryptoDetailClient cryptoId={id} />;
} 