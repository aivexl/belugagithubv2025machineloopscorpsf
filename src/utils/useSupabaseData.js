// Custom hook untuk Supabase data management
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { 
  getDatabaseData, 
  addDatabaseItem, 
  updateDatabaseItem, 
  deleteDatabaseItem,
  searchDatabaseData,
  getDatabaseDataPaginated,
  getDatabaseStats,
  clearDatabaseTable
} from './databaseServiceAPI';

// Hook untuk menggunakan Supabase data
export const useSupabaseData = (category) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ total: 0 });

  // Load data dari database
  const loadData = useCallback(async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading data for category:', category, 'retry:', retryCount);
      const [dataResult, statsResult] = await Promise.all([
        getDatabaseData(category),
        getDatabaseStats(category)
      ]);
      
      console.log('Loaded data:', dataResult.length, 'items');
      console.log('Data result:', dataResult);
      console.log('Stats result:', statsResult);
      
      // Ensure data is properly formatted
      const formattedData = Array.isArray(dataResult) ? dataResult : [];
      const formattedStats = statsResult || { total: 0 };
      
      setData(formattedData);
      setStats(formattedStats);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message);
      
      // Retry mechanism for network errors
      if (retryCount < 2 && (err.message.includes('fetch') || err.message.includes('network'))) {
        console.log('Retrying data load...');
        setTimeout(() => {
          loadData(retryCount + 1);
        }, 1000 * (retryCount + 1));
        return;
      }
      
      // Set empty data on error to prevent blank state
      setData([]);
      setStats({ total: 0 });
    } finally {
      setLoading(false);
    }
  }, [category]);

  // Load data saat component mount atau category berubah
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Add item
  const addItem = useCallback(async (itemData) => {
    try {
      setError(null);
      const newItem = await addDatabaseItem(category, itemData);
      setData(prev => [newItem, ...prev]);
      setStats(prev => ({ ...prev, total: prev.total + 1 }));
      return newItem;
    } catch (err) {
      console.error('Error adding item:', err);
      setError(err.message);
      throw err;
    }
  }, [category]);

  // Update item
  const updateItem = useCallback(async (id, updateData) => {
    try {
      setError(null);
      const updatedItem = await updateDatabaseItem(category, id, updateData);
      setData(prev => prev.map(item => item.id === id ? updatedItem : item));
      return updatedItem;
    } catch (err) {
      console.error('Error updating item:', err);
      setError(err.message);
      throw err;
    }
  }, [category]);

  // Delete item
  const deleteItem = useCallback(async (id) => {
    try {
      setError(null);
      const deletedItem = await deleteDatabaseItem(category, id);
      setData(prev => prev.filter(item => item.id !== id));
      setStats(prev => ({ ...prev, total: prev.total - 1 }));
      return deletedItem;
    } catch (err) {
      console.error('Error deleting item:', err);
      setError(err.message);
      throw err;
    }
  }, [category]);

  // Refresh data
  const refreshData = useCallback(async () => {
    console.log('Refreshing data for category:', category);
    await loadData();
  }, [loadData, category]);

  // Search data
  const searchData = useCallback(async (searchTerm, filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const searchResult = await searchDatabaseData(category, searchTerm, filters);
      setData(searchResult);
    } catch (err) {
      console.error('Error searching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [category]);

  // Clear all data
  const clearAllData = useCallback(async () => {
    try {
      setError(null);
      await clearDatabaseTable(category);
      setData([]);
      setStats({ total: 0 });
    } catch (err) {
      console.error('Error clearing data:', err);
      setError(err.message);
      throw err;
    }
  }, [category]);

  return {
    data,
    loading,
    error,
    stats,
    addItem,
    updateItem,
    deleteItem,
    refreshData,
    searchData,
    clearAllData
  };
};

// Hook untuk paginated data
export const useSupabaseDataPaginated = (category, page = 1, limit = 10) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Load paginated data
  const loadData = useCallback(async (pageNum = page, limitNum = limit) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getDatabaseDataPaginated(category, pageNum, limitNum);
      
      setData(result.data);
      setPagination({
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages
      });
    } catch (err) {
      console.error('Error loading paginated data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [category, page, limit]);

  // Load data saat component mount atau parameters berubah
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Go to specific page
  const goToPage = useCallback(async (pageNum) => {
    await loadData(pageNum, pagination.limit);
  }, [loadData, pagination.limit]);

  // Change page size
  const changePageSize = useCallback(async (newLimit) => {
    await loadData(1, newLimit);
  }, [loadData]);

  // Refresh data
  const refreshData = useCallback(async () => {
    await loadData(pagination.page, pagination.limit);
  }, [loadData, pagination.page, pagination.limit]);

  return {
    data,
    loading,
    error,
    pagination,
    goToPage,
    changePageSize,
    refreshData
  };
};

// Hook untuk search dengan debouncing
export const useSupabaseSearch = (category, debounceMs = 300) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchTerm || Object.keys(filters).length > 0) {
        try {
          setLoading(true);
          setError(null);
          const searchResult = await searchDatabaseData(category, searchTerm, filters);
          setData(searchResult);
        } catch (err) {
          console.error('Error searching:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      } else {
        // If no search term, load all data
        try {
          setLoading(true);
          setError(null);
          const allData = await getDatabaseData(category);
          setData(allData);
        } catch (err) {
          console.error('Error loading data:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filters, category, debounceMs]);

  // Update search term
  const updateSearchTerm = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setFilters({});
  }, []);

  return {
    data,
    loading,
    error,
    searchTerm,
    filters,
    updateSearchTerm,
    updateFilters,
    clearSearch
  };
};

// Hook untuk real-time updates (optional)
export const useSupabaseRealtime = (category) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load initial data
    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError(null);
        const initialData = await getDatabaseData(category);
        setData(initialData);
      } catch (err) {
        console.error('Error loading initial data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();

    // Setup real-time subscription
    const supabase = createClient();
    const tableName = {
      exchanges: 'crypto_exchanges',
      airdrop: 'crypto_airdrop',
      'ico-ido': 'crypto_ico_ido',
      fundraising: 'crypto_fundraising',
      glossary: 'crypto_glossary'
    }[category];

    if (tableName) {
      const subscription = supabase
        .channel(`${tableName}_changes`)
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: tableName 
          }, 
          (payload) => {
            console.log('Real-time update:', payload);
            
            // Update local state based on the change
            if (payload.eventType === 'INSERT') {
              setData(prev => [payload.new, ...prev]);
            } else if (payload.eventType === 'UPDATE') {
              setData(prev => prev.map(item => 
                item.id === payload.new.id ? payload.new : item
              ));
            } else if (payload.eventType === 'DELETE') {
              setData(prev => prev.filter(item => item.id !== payload.old.id));
            }
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [category]);

  return {
    data,
    loading,
    error
  };
};
