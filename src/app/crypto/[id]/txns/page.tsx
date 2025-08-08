import CryptoDetailClient from '../../../../components/CryptoDetailClient';

export default async function TxnsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CryptoDetailClient cryptoId={id} />;
} 