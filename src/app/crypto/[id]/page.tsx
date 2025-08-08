import React from 'react';
import CryptoDetailClient from '../../../components/CryptoDetailClient';

export default async function CryptoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CryptoDetailClient cryptoId={id} />;
} 