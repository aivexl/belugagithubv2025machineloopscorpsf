// Test component untuk memverifikasi useSupabaseData hook
'use client';

import { useSupabaseData } from '@/utils/useSupabaseData';

export default function TestSupabaseHook() {
  const { data, loading, error, stats } = useSupabaseData('exchanges');

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="mt-2 text-gray-400">Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500 font-semibold">Error:</div>
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Supabase Hook Test</h2>
      
      <div className="mb-4">
        <div className="text-green-500 font-semibold">✅ Hook loaded successfully!</div>
        <div className="text-gray-400">Data count: {data.length}</div>
        <div className="text-gray-400">Stats: {JSON.stringify(stats)}</div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="font-semibold mb-2">Sample Data:</h3>
        {data.length > 0 ? (
          <div className="text-sm">
            <div>Name: {data[0].name}</div>
            <div>Country: {data[0].country}</div>
            <div>Type: {data[0].type}</div>
            <div>Status: {data[0].status}</div>
          </div>
        ) : (
          <div className="text-gray-400">No data found</div>
        )}
      </div>
    </div>
  );
}
















