// Database service untuk CRUD operations dengan API route (bypass RLS)
const API_BASE_URL = '/api/admin';

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
    if (!TABLE_MAPPING[category]) {
      throw new Error(`Unknown category: ${category}`);
    }

    const response = await fetch(`${API_BASE_URL}?category=${category}&t=${Date.now()}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch data');
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

// Function untuk menambah data ke database
export const addDatabaseItem = async (category, itemData) => {
  try {
    if (!TABLE_MAPPING[category]) {
      throw new Error(`Unknown category: ${category}`);
    }

    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ category, itemData }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to add item');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

// Function untuk update data di database
export const updateDatabaseItem = async (category, id, updateData) => {
  try {
    if (!TABLE_MAPPING[category]) {
      throw new Error(`Unknown category: ${category}`);
    }

    const response = await fetch(API_BASE_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ category, id, updateData }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update item');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

// Function untuk delete data dari database
export const deleteDatabaseItem = async (category, id) => {
  try {
    if (!TABLE_MAPPING[category]) {
      throw new Error(`Unknown category: ${category}`);
    }

    const response = await fetch(`${API_BASE_URL}?category=${category}&id=${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete item');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

// Function untuk bulk insert (migrasi data)
export const bulkInsertData = async (category, items) => {
  try {
    if (!TABLE_MAPPING[category]) {
      throw new Error(`Unknown category: ${category}`);
    }

    // Insert items satu per satu untuk menghindari error bulk
    const results = [];
    for (const item of items) {
      try {
        const result = await addDatabaseItem(category, item);
        results.push(result);
      } catch (error) {
        console.error('Error inserting item:', error);
        // Continue with next item
      }
    }

    return results;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

// Function untuk search data
export const searchDatabaseData = async (category, searchTerm, filters = {}) => {
  try {
    // Untuk sementara, ambil semua data dan filter di client side
    const allData = await getDatabaseData(category);
    
    let filteredData = allData;

    // Apply search term
    if (searchTerm) {
      filteredData = filteredData.filter(item => {
        switch (category) {
          case 'exchanges':
            return item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   item.country?.toLowerCase().includes(searchTerm.toLowerCase());
          case 'airdrop':
          case 'ico-ido':
            return item.project?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   item.token?.toLowerCase().includes(searchTerm.toLowerCase());
          case 'fundraising':
            return item.project?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   item.category?.toLowerCase().includes(searchTerm.toLowerCase());
          case 'glossary':
            return item.term?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   item.definition?.toLowerCase().includes(searchTerm.toLowerCase());
          default:
            return true;
        }
      });
    }

    // Apply filters
    Object.keys(filters).forEach(key => {
      if (filters[key] && filters[key] !== 'All') {
        filteredData = filteredData.filter(item => item[key] === filters[key]);
      }
    });

    return filteredData;
  } catch (error) {
    console.error('Database search error:', error);
    throw error;
  }
};

// Function untuk mendapatkan data dengan pagination
export const getDatabaseDataPaginated = async (category, page = 1, limit = 10) => {
  try {
    if (!TABLE_MAPPING[category]) {
      throw new Error(`Unknown category: ${category}`);
    }

    const response = await fetch(`${API_BASE_URL}?category=${category}&page=${page}&limit=${limit}&t=${Date.now()}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch data');
    }

    const result = await response.json();
    const data = result.data || [];
    const total = result.total || 0;
    
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error('Database pagination error:', error);
    throw error;
  }
};

// Function untuk mendapatkan statistik data
export const getDatabaseStats = async (category) => {
  try {
    const data = await getDatabaseData(category);
    
    return {
      total: data.length,
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
    if (!TABLE_MAPPING[category]) {
      throw new Error(`Unknown category: ${category}`);
    }

    // Get all items first
    const allData = await getDatabaseData(category);
    
    // Delete all items
    for (const item of allData) {
      await deleteDatabaseItem(category, item.id);
    }

    return true;
  } catch (error) {
    console.error('Database clear error:', error);
    throw error;
  }
};
