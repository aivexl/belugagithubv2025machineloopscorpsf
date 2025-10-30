// Script untuk migrasi data dari localStorage ke Supabase database
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://sqjqirkrcfczypxygdtm.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxanFpcmtyY2ZjenlweHlnZHRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5NzE5MDAsImV4cCI6MjA3MTU0NzkwMH0.7Tnurb-zS8n_KeuE_K2rA_RlLSVsk2E4S3YiTf9MfhI';

const supabase = createClient(supabaseUrl, supabaseKey);

// Mapping kategori ke tabel database
const TABLE_MAPPING = {
  exchanges: 'crypto_exchanges',
  airdrop: 'crypto_airdrop',
  'ico-ido': 'crypto_ico_ido',
  fundraising: 'crypto_fundraising',
  glossary: 'crypto_glossary'
};

// Keys untuk localStorage
const STORAGE_KEYS = {
  exchanges: 'crypto_exchanges_data',
  airdrop: 'crypto_airdrop_data',
  icoIdo: 'crypto_ico_ido_data',
  fundraising: 'crypto_fundraising_data',
  glossary: 'crypto_glossary_data'
};

// Function untuk mendapatkan data dari localStorage
const getLocalStorageData = (key) => {
  if (typeof window === 'undefined') {
    return [];
  }
  
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error);
  }
  
  return [];
};

// Function untuk migrasi data ke database
const migrateDataToDatabase = async (category, localData) => {
  try {
    const tableName = TABLE_MAPPING[category];
    if (!tableName) {
      throw new Error(`Unknown category: ${category}`);
    }

    console.log(`📦 Migrating ${category} data to ${tableName}...`);
    console.log(`Found ${localData.length} items in localStorage`);

    if (localData.length === 0) {
      console.log(`ℹ️ No data to migrate for ${category}`);
      return { success: true, migrated: 0 };
    }

    // Remove id field untuk auto-generate di database
    const dataToInsert = localData.map(item => {
      const { id, ...itemWithoutId } = item;
      return itemWithoutId;
    });

    // Insert data ke database
    const { data, error } = await supabase
      .from(tableName)
      .insert(dataToInsert)
      .select();

    if (error) {
      console.error(`❌ Error migrating ${category}:`, error);
      throw error;
    }

    console.log(`✅ Successfully migrated ${data.length} items for ${category}`);
    return { success: true, migrated: data.length };
  } catch (error) {
    console.error(`❌ Error migrating ${category}:`, error);
    return { success: false, error: error.message };
  }
};

// Function untuk clear localStorage setelah migrasi berhasil
const clearLocalStorage = (key) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
    console.log(`🗑️ Cleared localStorage for key: ${key}`);
  }
};

// Function untuk backup data sebelum clear
const backupLocalStorageData = () => {
  const backup = {};
  
  Object.entries(STORAGE_KEYS).forEach(([category, key]) => {
    const data = getLocalStorageData(key);
    if (data.length > 0) {
      backup[category] = data;
    }
  });

  if (Object.keys(backup).length > 0) {
    const backupString = JSON.stringify(backup, null, 2);
    const blob = new Blob([backupString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `localStorage-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('💾 Backup created and downloaded');
  }
};

// Main migration function
const migrateAllData = async () => {
  console.log('🚀 Starting data migration from localStorage to Supabase...');
  
  const results = {};
  let totalMigrated = 0;
  let totalErrors = 0;

  // Migrate each category
  for (const [category, storageKey] of Object.entries(STORAGE_KEYS)) {
    try {
      const localData = getLocalStorageData(storageKey);
      const result = await migrateDataToDatabase(category, localData);
      
      results[category] = result;
      
      if (result.success) {
        totalMigrated += result.migrated;
      } else {
        totalErrors++;
      }
    } catch (error) {
      console.error(`❌ Failed to migrate ${category}:`, error);
      results[category] = { success: false, error: error.message };
      totalErrors++;
    }
  }

  // Summary
  console.log('\n📊 Migration Summary:');
  console.log('==================');
  Object.entries(results).forEach(([category, result]) => {
    if (result.success) {
      console.log(`✅ ${category}: ${result.migrated} items migrated`);
    } else {
      console.log(`❌ ${category}: Failed - ${result.error}`);
    }
  });
  
  console.log(`\n🎯 Total: ${totalMigrated} items migrated, ${totalErrors} errors`);

  if (totalErrors === 0 && totalMigrated > 0) {
    console.log('\n🎉 Migration completed successfully!');
    
    // Ask user if they want to clear localStorage
    const shouldClear = confirm(
      `Migration completed successfully!\n\n` +
      `Migrated ${totalMigrated} items to database.\n\n` +
      `Would you like to clear localStorage data? (Recommended)`
    );
    
    if (shouldClear) {
      // Create backup first
      backupLocalStorageData();
      
      // Clear localStorage
      Object.values(STORAGE_KEYS).forEach(key => {
        clearLocalStorage(key);
      });
      
      console.log('🗑️ localStorage cleared successfully');
      alert('Migration completed and localStorage cleared!');
    } else {
      console.log('ℹ️ localStorage preserved (user choice)');
      alert('Migration completed! localStorage data preserved.');
    }
  } else if (totalErrors > 0) {
    console.log('\n⚠️ Migration completed with errors. Please check the logs.');
    alert('Migration completed with errors. Please check the console for details.');
  } else {
    console.log('\nℹ️ No data found to migrate.');
    alert('No data found in localStorage to migrate.');
  }

  return results;
};

// Function untuk rollback (restore dari backup)
const rollbackFromBackup = async (backupData) => {
  console.log('🔄 Starting rollback from backup...');
  
  try {
    for (const [category, data] of Object.entries(backupData)) {
      const storageKey = STORAGE_KEYS[category];
      if (storageKey && typeof window !== 'undefined') {
        localStorage.setItem(storageKey, JSON.stringify(data));
        console.log(`✅ Restored ${data.length} items for ${category}`);
      }
    }
    
    console.log('🎉 Rollback completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Rollback failed:', error);
    return false;
  }
};

// Export functions untuk digunakan di browser console
if (typeof window !== 'undefined') {
  window.migrateToSupabase = migrateAllData;
  window.backupLocalStorage = backupLocalStorageData;
  window.rollbackFromBackup = rollbackFromBackup;
  
  console.log('🔧 Migration tools loaded!');
  console.log('Available commands:');
  console.log('- migrateToSupabase() - Migrate all data to Supabase');
  console.log('- backupLocalStorage() - Create backup of localStorage');
  console.log('- rollbackFromBackup(backupData) - Restore from backup');
}

// Auto-run migration jika dipanggil langsung
if (typeof window !== 'undefined' && window.location.pathname.includes('/admin')) {
  console.log('🔍 Admin panel detected. Migration tools ready.');
  console.log('Run migrateToSupabase() to start migration.');
}

export { migrateAllData, backupLocalStorageData, rollbackFromBackup };











