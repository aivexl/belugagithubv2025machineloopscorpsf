// Test page untuk memverifikasi koneksi Supabase
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function SupabaseTestPage() {
  const [connectionStatus, setConnectionStatus] = useState('Testing...');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    testSupabaseConnection();
  }, []);

  const testSupabaseConnection = async () => {
    try {
      setConnectionStatus('Connecting...');
      setError(null);

      const supabase = createClient();
      
      // Test connection dengan mengambil data dari tabel crypto_exchanges
      const { data: exchanges, error: exchangesError } = await supabase
        .from('crypto_exchanges')
        .select('*')
        .limit(5);

      if (exchangesError) {
        throw exchangesError;
      }

      // Test connection dengan mengambil data dari tabel crypto_airdrop
      const { data: airdrops, error: airdropsError } = await supabase
        .from('crypto_airdrop')
        .select('*')
        .limit(5);

      if (airdropsError) {
        throw airdropsError;
      }

      // Test connection dengan mengambil data dari tabel crypto_ico_ido
      const { data: icoIdos, error: icoIdosError } = await supabase
        .from('crypto_ico_ido')
        .select('*')
        .limit(5);

      if (icoIdosError) {
        throw icoIdosError;
      }

      // Test connection dengan mengambil data dari tabel crypto_fundraising
      const { data: fundraisings, error: fundraisingsError } = await supabase
        .from('crypto_fundraising')
        .select('*')
        .limit(5);

      if (fundraisingsError) {
        throw fundraisingsError;
      }

      // Test connection dengan mengambil data dari tabel crypto_glossary
      const { data: glossaries, error: glossariesError } = await supabase
        .from('crypto_glossary')
        .select('*')
        .limit(5);

      if (glossariesError) {
        throw glossariesError;
      }

      setConnectionStatus('Connected Successfully!');
      setData({
        exchanges: exchanges || [],
        airdrops: airdrops || [],
        icoIdos: icoIdos || [],
        fundraisings: fundraisings || [],
        glossaries: glossaries || []
      });

    } catch (err) {
      console.error('Supabase connection error:', err);
      setConnectionStatus('Connection Failed');
      setError(err.message);
    }
  };

  const testInsertOperation = async () => {
    try {
      const supabase = createClient();
      
      // Test insert operation
      const { data: newItem, error } = await supabase
        .from('crypto_exchanges')
        .insert([{
          name: 'Test Exchange',
          country: 'Test Country',
          type: 'Centralized',
          status: 'Active',
          description: 'Test exchange for connection testing'
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      alert('Insert test successful! Item created with ID: ' + newItem.id);
      
      // Clean up - delete the test item
      await supabase
        .from('crypto_exchanges')
        .delete()
        .eq('id', newItem.id);

      alert('Test item cleaned up successfully!');

    } catch (err) {
      console.error('Insert test error:', err);
      alert('Insert test failed: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Supabase Connection Test</h1>
        
        {/* Connection Status */}
        <div className="mb-8 p-6 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <div className={`p-4 rounded-lg ${
            connectionStatus === 'Connected Successfully!' 
              ? 'bg-green-900 border border-green-700' 
              : connectionStatus === 'Connection Failed'
              ? 'bg-red-900 border border-red-700'
              : 'bg-blue-900 border border-blue-700'
          }`}>
            <div className="flex items-center gap-2">
              {connectionStatus === 'Connected Successfully!' && (
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              )}
              {connectionStatus === 'Connection Failed' && (
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              )}
              {connectionStatus.includes('Testing') && (
                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              )}
              <span className="font-medium">{connectionStatus}</span>
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-800 rounded text-red-200">
                <strong>Error:</strong> {error}
              </div>
            )}
          </div>
          
          <button
            onClick={testSupabaseConnection}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Test Connection Again
          </button>
        </div>

        {/* Data Display */}
        {data && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Database Data</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-blue-400 mb-2">Exchanges</h3>
                <p className="text-sm text-gray-300">Count: {data.exchanges.length}</p>
                {data.exchanges.length > 0 && (
                  <div className="mt-2 text-xs text-gray-400">
                    <p>Sample: {data.exchanges[0].name}</p>
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-green-400 mb-2">Airdrops</h3>
                <p className="text-sm text-gray-300">Count: {data.airdrops.length}</p>
                {data.airdrops.length > 0 && (
                  <div className="mt-2 text-xs text-gray-400">
                    <p>Sample: {data.airdrops[0].project}</p>
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-yellow-400 mb-2">ICO/IDO</h3>
                <p className="text-sm text-gray-300">Count: {data.icoIdos.length}</p>
                {data.icoIdos.length > 0 && (
                  <div className="mt-2 text-xs text-gray-400">
                    <p>Sample: {data.icoIdos[0].project}</p>
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-purple-400 mb-2">Fundraising</h3>
                <p className="text-sm text-gray-300">Count: {data.fundraisings.length}</p>
                {data.fundraisings.length > 0 && (
                  <div className="mt-2 text-xs text-gray-400">
                    <p>Sample: {data.fundraisings[0].project}</p>
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-pink-400 mb-2">Glossary</h3>
                <p className="text-sm text-gray-300">Count: {data.glossaries.length}</p>
                {data.glossaries.length > 0 && (
                  <div className="mt-2 text-xs text-gray-400">
                    <p>Sample: {data.glossaries[0].term}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Test Operations */}
        <div className="mb-8 p-6 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Test Operations</h2>
          <div className="flex gap-4">
            <button
              onClick={testInsertOperation}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Test Insert Operation
            </button>
            
            <a
              href="/admin/exchanges"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Admin Panel
            </a>
          </div>
        </div>

        {/* Environment Info */}
        <div className="p-6 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Environment Information</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Supabase URL:</span>
              <span className="text-gray-300 font-mono">
                {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Supabase Key:</span>
              <span className="text-gray-300 font-mono">
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
























