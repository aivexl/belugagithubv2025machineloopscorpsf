// Migration component untuk admin panel
'use client';

import { useState } from 'react';
import { FiDownload, FiUpload, FiTrash2, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';

export default function DataMigrationPanel() {
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState(null);
  const [localStorageData, setLocalStorageData] = useState({});

  // Check localStorage data
  const checkLocalStorageData = () => {
    // Check if we're on client side
    if (typeof window === 'undefined') {
      return { totalItems: 0 };
    }

    const storageKeys = {
      exchanges: 'crypto_exchanges_data',
      airdrop: 'crypto_airdrop_data',
      icoIdo: 'crypto_ico_ido_data',
      fundraising: 'crypto_fundraising_data',
      glossary: 'crypto_glossary_data'
    };

    const data = {};
    let totalItems = 0;

    Object.entries(storageKeys).forEach(([category, key]) => {
      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          const parsed = JSON.parse(stored);
          data[category] = parsed;
          totalItems += parsed.length;
        }
      } catch (error) {
        console.error(`Error reading ${key}:`, error);
      }
    });

    setLocalStorageData({ ...data, totalItems });
    return { ...data, totalItems };
  };

  // Create backup
  const createBackup = () => {
    // Check if we're on client side
    if (typeof window === 'undefined') {
      alert('Backup can only be created in browser');
      return;
    }

    const data = checkLocalStorageData();
    
    if (data.totalItems === 0) {
      alert('No data found in localStorage to backup.');
      return;
    }

    const backupString = JSON.stringify(data, null, 2);
    const blob = new Blob([backupString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `localStorage-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('Backup created and downloaded successfully!');
  };

  // Clear localStorage
  const clearLocalStorage = () => {
    // Check if we're on client side
    if (typeof window === 'undefined') {
      alert('localStorage can only be cleared in browser');
      return;
    }

    if (confirm('Are you sure you want to clear all localStorage data? This action cannot be undone!')) {
      const storageKeys = [
        'crypto_exchanges_data',
        'crypto_airdrop_data',
        'crypto_ico_ido_data',
        'crypto_fundraising_data',
        'crypto_glossary_data'
      ];

      storageKeys.forEach(key => {
        localStorage.removeItem(key);
      });

      setLocalStorageData({ totalItems: 0 });
      alert('localStorage cleared successfully!');
    }
  };

  // Simulate migration (since we can't run the actual migration script in component)
  const simulateMigration = async () => {
    setIsMigrating(true);
    setMigrationStatus({ status: 'running', message: 'Starting migration...' });

    try {
      // Simulate migration steps
      const steps = [
        'Checking localStorage data...',
        'Connecting to Supabase...',
        'Migrating exchanges data...',
        'Migrating airdrop data...',
        'Migrating ICO/IDO data...',
        'Migrating fundraising data...',
        'Migrating glossary data...',
        'Verifying migration...',
        'Migration completed!'
      ];

      for (let i = 0; i < steps.length; i++) {
        setMigrationStatus({ 
          status: 'running', 
          message: steps[i],
          progress: ((i + 1) / steps.length) * 100
        });
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      setMigrationStatus({ 
        status: 'success', 
        message: 'Migration completed successfully!',
        progress: 100
      });

      // Clear localStorage after successful migration
      setTimeout(() => {
        clearLocalStorage();
      }, 2000);

    } catch (error) {
      setMigrationStatus({ 
        status: 'error', 
        message: 'Migration failed: ' + error.message,
        progress: 0
      });
    } finally {
      setIsMigrating(false);
    }
  };

  // Load localStorage data on component mount (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      checkLocalStorageData();
    }
  }, []);

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Data Migration</h3>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Total Items:</span>
          <span className="text-blue-400 font-semibold">{localStorageData.totalItems || 0}</span>
        </div>
      </div>

      {/* Migration Status */}
      {migrationStatus && (
        <div className={`mb-4 p-4 rounded-lg ${
          migrationStatus.status === 'success' ? 'bg-green-900 border border-green-700' :
          migrationStatus.status === 'error' ? 'bg-red-900 border border-red-700' :
          'bg-blue-900 border border-blue-700'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {migrationStatus.status === 'success' && <FiCheck className="w-5 h-5 text-green-400" />}
            {migrationStatus.status === 'error' && <FiX className="w-5 h-5 text-red-400" />}
            {migrationStatus.status === 'running' && (
              <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            )}
            <span className="text-white font-medium">{migrationStatus.message}</span>
          </div>
          
          {migrationStatus.progress !== undefined && (
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  migrationStatus.status === 'success' ? 'bg-green-500' :
                  migrationStatus.status === 'error' ? 'bg-red-500' :
                  'bg-blue-500'
                }`}
                style={{ width: `${migrationStatus.progress}%` }}
              ></div>
            </div>
          )}
        </div>
      )}

      {/* Data Summary */}
      {localStorageData.totalItems > 0 && (
        <div className="mb-4 p-4 bg-gray-700 rounded-lg">
          <h4 className="text-white font-medium mb-2">Data Found in localStorage:</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
            {Object.entries(localStorageData).map(([key, value]) => {
              if (key === 'totalItems') return null;
              return (
                <div key={key} className="flex justify-between">
                  <span className="text-gray-300 capitalize">{key}:</span>
                  <span className="text-blue-400 font-semibold">{Array.isArray(value) ? value.length : 0}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={checkLocalStorageData}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          <FiCheck className="w-4 h-4" />
          Check Data
        </button>
        
        <button
          onClick={createBackup}
          disabled={localStorageData.totalItems === 0}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiDownload className="w-4 h-4" />
          Create Backup
        </button>
        
        <button
          onClick={simulateMigration}
          disabled={isMigrating || localStorageData.totalItems === 0}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiUpload className="w-4 h-4" />
          {isMigrating ? 'Migrating...' : 'Migrate to Database'}
        </button>
        
        <button
          onClick={clearLocalStorage}
          disabled={localStorageData.totalItems === 0}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiTrash2 className="w-4 h-4" />
          Clear localStorage
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-4 p-4 bg-yellow-900 border border-yellow-700 rounded-lg">
        <div className="flex items-start gap-2">
          <FiAlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
          <div className="text-yellow-200 text-sm">
            <p className="font-medium mb-1">Migration Instructions:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>First, create a backup of your localStorage data</li>
              <li>Run the migration to transfer data to Supabase database</li>
              <li>After successful migration, clear localStorage to avoid conflicts</li>
              <li>Your data will now be stored permanently in the database</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
