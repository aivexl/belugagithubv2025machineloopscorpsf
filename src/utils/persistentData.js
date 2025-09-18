// Data management dengan localStorage untuk persistence
import { useState, useEffect } from 'react';
import { 
  exchangesData as defaultExchangesData, 
  airdropData as defaultAirdropData, 
  icoIdoData as defaultIcoIdoData, 
  fundraisingData as defaultFundraisingData, 
  web3GlossaryData as defaultWeb3GlossaryData 
} from '@/data/cryptoData';

// Keys untuk localStorage
const STORAGE_KEYS = {
  exchanges: 'crypto_exchanges_data',
  airdrop: 'crypto_airdrop_data',
  icoIdo: 'crypto_ico_ido_data',
  fundraising: 'crypto_fundraising_data',
  glossary: 'crypto_glossary_data'
};

// Function untuk mendapatkan data dari localStorage atau default
const getStoredData = (key, defaultData) => {
  if (typeof window === 'undefined') {
    return defaultData; // Server-side rendering
  }
  
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error);
  }
  
  return defaultData;
};

// Function untuk menyimpan data ke localStorage
const saveStoredData = (key, data) => {
  if (typeof window === 'undefined') {
    return; // Server-side rendering
  }
  
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Function untuk mendapatkan data dengan persistence
export const getPersistentData = (category) => {
  switch (category) {
    case 'exchanges':
      return getStoredData(STORAGE_KEYS.exchanges, defaultExchangesData);
    case 'airdrop':
      return getStoredData(STORAGE_KEYS.airdrop, defaultAirdropData);
    case 'icoIdo':
    case 'ico-ido': // Support both formats
      return getStoredData(STORAGE_KEYS.icoIdo, defaultIcoIdoData);
    case 'fundraising':
      return getStoredData(STORAGE_KEYS.fundraising, defaultFundraisingData);
    case 'glossary':
      return getStoredData(STORAGE_KEYS.glossary, defaultWeb3GlossaryData);
    default:
      return [];
  }
};

// Function untuk menyimpan data dengan persistence
export const savePersistentData = (category, data) => {
  switch (category) {
    case 'exchanges':
      saveStoredData(STORAGE_KEYS.exchanges, data);
      break;
    case 'airdrop':
      saveStoredData(STORAGE_KEYS.airdrop, data);
      break;
    case 'icoIdo':
    case 'ico-ido': // Support both formats
      saveStoredData(STORAGE_KEYS.icoIdo, data);
      break;
    case 'fundraising':
      saveStoredData(STORAGE_KEYS.fundraising, data);
      break;
    case 'glossary':
      saveStoredData(STORAGE_KEYS.glossary, data);
      break;
  }
};

// CRUD functions dengan persistence
export const addPersistentItem = (category, itemData) => {
  const currentData = getPersistentData(category);
  const newId = Math.max(...currentData.map(item => item.id), 0) + 1;
  const newItem = { id: newId, ...itemData };
  
  const updatedData = [...currentData, newItem];
  savePersistentData(category, updatedData);
  
  return newItem;
};

export const updatePersistentItem = (category, id, updateData) => {
  const currentData = getPersistentData(category);
  const index = currentData.findIndex(item => item.id === id);
  
  if (index !== -1) {
    currentData[index] = { ...currentData[index], ...updateData };
    savePersistentData(category, currentData);
    return currentData[index];
  }
  
  return null;
};

export const deletePersistentItem = (category, id) => {
  const currentData = getPersistentData(category);
  const index = currentData.findIndex(item => item.id === id);
  
  if (index !== -1) {
    const deletedItem = currentData[index];
    currentData.splice(index, 1);
    savePersistentData(category, currentData);
    return deletedItem;
  }
  
  return null;
};

// Function untuk reset data ke default
export const resetToDefault = (category) => {
  switch (category) {
    case 'exchanges':
      savePersistentData(category, defaultExchangesData);
      break;
    case 'airdrop':
      savePersistentData(category, defaultAirdropData);
      break;
    case 'icoIdo':
    case 'ico-ido': // Support both formats
      savePersistentData(category, defaultIcoIdoData);
      break;
    case 'fundraising':
      savePersistentData(category, defaultFundraisingData);
      break;
    case 'glossary':
      savePersistentData(category, defaultWeb3GlossaryData);
      break;
  }
};

// Function untuk clear all data
export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  });
};

// Hook untuk menggunakan persistent data
export const usePersistentData = (category) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      const persistentData = getPersistentData(category);
      setData(persistentData);
      setLoading(false);
    };

    loadData();
  }, [category]);

  const addItem = (itemData) => {
    const newItem = addPersistentItem(category, itemData);
    setData(prev => [...prev, newItem]);
    return newItem;
  };

  const updateItem = (id, updateData) => {
    const updatedItem = updatePersistentItem(category, id, updateData);
    if (updatedItem) {
      setData(prev => prev.map(item => item.id === id ? updatedItem : item));
    }
    return updatedItem;
  };

  const deleteItem = (id) => {
    const deletedItem = deletePersistentItem(category, id);
    if (deletedItem) {
      setData(prev => prev.filter(item => item.id !== id));
    }
    return deletedItem;
  };

  const refreshData = () => {
    const persistentData = getPersistentData(category);
    setData(persistentData);
  };

  return {
    data,
    loading,
    addItem,
    updateItem,
    deleteItem,
    refreshData
  };
};
