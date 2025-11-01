// Database service untuk CRUD operations dengan Supabase
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

// Mapping kategori ke tabel database
const TABLE_MAPPING = {
  exchanges: 'crypto_exchanges',
  airdrop: 'crypto_airdrop',
  'ico-ido': 'crypto_ico_ido',
  fundraising: 'crypto_fundraising',
  glossary: 'crypto_glossary'
};

// Function untuk mendapatkan data dari database
export const getDatabaseData = async (category) => {
  try {
    const tableName = TABLE_MAPPING[category];
    if (!tableName) {
      throw new Error(`Unknown category: ${category}`);
    }

    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching data:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

// Function untuk menambah data ke database
export const addDatabaseItem = async (category, itemData) => {
  try {
    const tableName = TABLE_MAPPING[category];
    if (!tableName) {
      throw new Error(`Unknown category: ${category}`);
    }

    const { data, error } = await supabase
      .from(tableName)
      .insert([itemData])
      .select()
      .single();

    if (error) {
      console.error('Error adding item:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

// Function untuk update data di database
export const updateDatabaseItem = async (category, id, updateData) => {
  try {
    const tableName = TABLE_MAPPING[category];
    if (!tableName) {
      throw new Error(`Unknown category: ${category}`);
    }

    const { data, error } = await supabase
      .from(tableName)
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating item:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

// Function untuk delete data dari database
export const deleteDatabaseItem = async (category, id) => {
  try {
    const tableName = TABLE_MAPPING[category];
    if (!tableName) {
      throw new Error(`Unknown category: ${category}`);
    }

    const { data, error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error deleting item:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

// Function untuk bulk insert (migrasi data)
export const bulkInsertData = async (category, items) => {
  try {
    const tableName = TABLE_MAPPING[category];
    if (!tableName) {
      throw new Error(`Unknown category: ${category}`);
    }

    const { data, error } = await supabase
      .from(tableName)
      .insert(items)
      .select();

    if (error) {
      console.error('Error bulk inserting:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

// Function untuk search data
export const searchDatabaseData = async (category, searchTerm, filters = {}) => {
  try {
    const tableName = TABLE_MAPPING[category];
    if (!tableName) {
      throw new Error(`Unknown category: ${category}`);
    }

    let query = supabase
      .from(tableName)
      .select('*');

    // Apply search term
    if (searchTerm) {
      switch (category) {
        case 'exchanges':
          query = query.or(`name.ilike.%${searchTerm}%,country.ilike.%${searchTerm}%`);
          break;
        case 'airdrop':
        case 'ico-ido':
          query = query.or(`project.ilike.%${searchTerm}%,token.ilike.%${searchTerm}%`);
          break;
        case 'fundraising':
          query = query.or(`project.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`);
          break;
        case 'glossary':
          query = query.or(`term.ilike.%${searchTerm}%,definition.ilike.%${searchTerm}%`);
          break;
      }
    }

    // Apply filters
    Object.keys(filters).forEach(key => {
      if (filters[key] && filters[key] !== 'All') {
        query = query.eq(key, filters[key]);
      }
    });

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching data:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Database search error:', error);
    throw error;
  }
};

// Function untuk mendapatkan data dengan pagination
export const getDatabaseDataPaginated = async (category, page = 1, limit = 10) => {
  try {
    const tableName = TABLE_MAPPING[category];
    if (!tableName) {
      throw new Error(`Unknown category: ${category}`);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error fetching paginated data:', error);
      throw error;
    }

    return {
      data: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    };
  } catch (error) {
    console.error('Database pagination error:', error);
    throw error;
  }
};

// Function untuk mendapatkan statistik data
export const getDatabaseStats = async (category) => {
  try {
    const tableName = TABLE_MAPPING[category];
    if (!tableName) {
      throw new Error(`Unknown category: ${category}`);
    }

    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error getting stats:', error);
      throw error;
    }

    return {
      total: count || 0,
      category
    };
  } catch (error) {
    console.error('Database stats error:', error);
    throw error;
  }
};

// Function untuk clear all data dari tabel
export const clearDatabaseTable = async (category) => {
  try {
    const tableName = TABLE_MAPPING[category];
    if (!tableName) {
      throw new Error(`Unknown category: ${category}`);
    }

    const { error } = await supabase
      .from(tableName)
      .delete()
      .neq('id', 0); // Delete all rows

    if (error) {
      console.error('Error clearing table:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Database clear error:', error);
    throw error;
  }
};













