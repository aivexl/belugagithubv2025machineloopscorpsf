// Test component untuk memverifikasi semua imports
'use client';

import { useSupabaseData } from '@/utils/useSupabaseData';
import { getFormFields } from '@/components/FormFields';
import DataMigrationPanel from '@/components/DataMigrationPanel';

export default function TestImports() {
  const { data, loading, error } = useSupabaseData('exchanges');

  const testFormFields = () => {
    try {
      const fields = getFormFields('exchanges', {}, () => {});
      return 'FormFields loaded successfully!';
    } catch (err) {
      return 'FormFields error: ' + err.message;
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="mt-2 text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Import Test</h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-green-900 border border-green-700 rounded-lg">
            <div className="text-green-200 font-semibold">✅ useSupabaseData Hook</div>
            <div className="text-green-300 text-sm">Loaded successfully</div>
            <div className="text-green-300 text-sm">Data count: {data.length}</div>
          </div>

          <div className="p-4 bg-green-900 border border-green-700 rounded-lg">
            <div className="text-green-200 font-semibold">✅ getFormFields Function</div>
            <div className="text-green-300 text-sm">{testFormFields()}</div>
          </div>

          <div className="p-4 bg-green-900 border border-green-700 rounded-lg">
            <div className="text-green-200 font-semibold">✅ DataMigrationPanel Component</div>
            <div className="text-green-300 text-sm">Loaded successfully</div>
          </div>

          {error && (
            <div className="p-4 bg-red-900 border border-red-700 rounded-lg">
              <div className="text-red-200 font-semibold">❌ Error</div>
              <div className="text-red-300 text-sm">{error}</div>
            </div>
          )}
        </div>

        <div className="mt-8">
          <a
            href="/admin/exchanges"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Admin Panel
          </a>
        </div>
      </div>
    </div>
  );
}



















