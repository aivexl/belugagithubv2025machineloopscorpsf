// API utility functions untuk data management
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-vercel-app.vercel.app/api' 
  : '/api';

// Generic API functions
export const apiCall = async (endpoint, method = 'GET', data = null) => {
  try {
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data && method !== 'GET') {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API call error for ${endpoint}:`, error);
    throw error;
  }
};

// Exchanges API
export const exchangesAPI = {
  getAll: () => apiCall('/exchanges'),
  create: (data) => apiCall('/exchanges', 'POST', data),
  update: (data) => apiCall('/exchanges', 'PUT', data),
  delete: (id) => apiCall('/exchanges', 'DELETE', { id }),
};

// Airdrops API
export const airdropsAPI = {
  getAll: () => apiCall('/airdrops'),
  create: (data) => apiCall('/airdrops', 'POST', data),
  update: (data) => apiCall('/airdrops', 'PUT', data),
  delete: (id) => apiCall('/airdrops', 'DELETE', { id }),
};

// ICO/IDO API
export const icoIdoAPI = {
  getAll: () => apiCall('/ico-ido'),
  create: (data) => apiCall('/ico-ido', 'POST', data),
  update: (data) => apiCall('/ico-ido', 'PUT', data),
  delete: (id) => apiCall('/ico-ido', 'DELETE', { id }),
};

// Fundraising API
export const fundraisingAPI = {
  getAll: () => apiCall('/fundraising'),
  create: (data) => apiCall('/fundraising', 'POST', data),
  update: (data) => apiCall('/fundraising', 'PUT', data),
  delete: (id) => apiCall('/fundraising', 'DELETE', { id }),
};

// Get API functions based on category
export const getAPIForCategory = (category) => {
  switch (category) {
    case 'exchanges':
      return exchangesAPI;
    case 'airdrop':
      return airdropsAPI;
    case 'ico-ido':
      return icoIdoAPI;
    case 'fundraising':
      return fundraisingAPI;
    default:
      throw new Error(`Unknown category: ${category}`);
  }
};
