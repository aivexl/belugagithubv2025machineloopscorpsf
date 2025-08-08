import { Suspense } from 'react';
import SearchClient from '../../components/SearchClient';

export default async function SearchPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ q?: string }> 
}) {
  const params = await searchParams;
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchClient query={params.q || ''} />
    </Suspense>
  );
} 