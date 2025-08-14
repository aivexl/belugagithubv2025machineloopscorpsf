"use client";

import { useState } from 'react';

export default function TestMoralisPage() {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testMoralisAPI = async () => {
    setLoading(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/moralis/test');
      const data = await response.json();
      
      setTestResult({
        success: response.ok,
        data: data,
        status: response.status
      });
    } catch (error) {
      setTestResult({
        success: false,
        error: error.message,
        status: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-duniacrypto-bg-darker text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Moralis API Test</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">API Configuration</h2>
          
          <button
            onClick={testMoralisAPI}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {loading ? 'Testing...' : 'Test Moralis API'}
          </button>
        </div>

        {testResult && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            
            <div className={`p-4 rounded-lg mb-4 ${
              testResult.success ? 'bg-green-900/30 border border-green-600' : 'bg-red-900/30 border border-red-600'
            }`}>
              <div className="flex items-center mb-2">
                <span className={`text-lg mr-2 ${testResult.success ? 'text-green-400' : 'text-red-400'}`}>
                  {testResult.success ? '✅' : '❌'}
                </span>
                <span className="font-medium">
                  {testResult.success ? 'API Connected Successfully' : 'API Connection Failed'}
                </span>
              </div>
              
              <div className="text-sm text-gray-300">
                <p>Status: {testResult.status}</p>
                {testResult.data?.message && <p>Message: {testResult.data.message}</p>}
                {testResult.error && <p>Error: {testResult.error}</p>}
              </div>
            </div>

            {testResult.data?.testData && (
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Sample Data:</h3>
                <div className="text-sm space-y-1">
                  <p><span className="text-gray-400">Address:</span> {testResult.data.testData.address}</p>
                  <p><span className="text-gray-400">Transactions Found:</span> {testResult.data.testData.transactions}</p>
                  
                  {testResult.data.testData.sampleTransaction && (
                    <div className="mt-3 p-3 bg-gray-600 rounded">
                      <p className="font-medium mb-2">Sample Transaction:</p>
                      <div className="text-xs space-y-1">
                        <p><span className="text-gray-400">Hash:</span> {testResult.data.testData.sampleTransaction.hash}</p>
                        <p><span className="text-gray-400">From:</span> {testResult.data.testData.sampleTransaction.from}</p>
                        <p><span className="text-gray-400">To:</span> {testResult.data.testData.sampleTransaction.to}</p>
                        <p><span className="text-gray-400">Value:</span> {testResult.data.testData.sampleTransaction.value}</p>
                        <p><span className="text-gray-400">Timestamp:</span> {testResult.data.testData.sampleTransaction.timestamp}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mt-4 p-4 bg-blue-900/30 border border-blue-600 rounded-lg">
              <h3 className="font-semibold mb-2">Next Steps:</h3>
              <ul className="text-sm space-y-1">
                <li>• Jika API berhasil, transaksi akan muncul di halaman coin detail</li>
                <li>• Pilih coin seperti BTC, ETH, atau DOGE untuk melihat transaksi</li>
                <li>• Transaksi akan auto-refresh setiap 3 detik</li>
                <li>• Layout transaksi sudah stabil dan tidak glitch</li>
              </ul>
            </div>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Setup Instructions</h2>
          <div className="text-sm space-y-2">
            <p>1. Pastikan file <code className="bg-gray-700 px-2 py-1 rounded">.env.local</code> sudah dibuat di root project</p>
            <p>2. Tambahkan API key Moralis ke file tersebut</p>
            <p>3. Restart development server dengan <code className="bg-gray-700 px-2 py-1 rounded">npm run dev</code></p>
            <p>4. Test API dengan tombol di atas</p>
            <p>5. Jika berhasil, buka halaman coin detail untuk melihat transaksi</p>
          </div>
        </div>
      </div>
    </div>
  );
} 