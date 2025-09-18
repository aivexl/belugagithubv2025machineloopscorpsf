// Hook untuk mengelola data crypto yang tersinkronisasi
import { useState, useEffect } from 'react';
import { 
  exchangesData, 
  airdropData, 
  icoIdoData, 
  fundraisingData, 
  web3GlossaryData 
} from '@/data/cryptoData';

// Global state untuk data crypto
let globalCryptoData = {
  exchanges: [...exchangesData],
  airdrop: [...airdropData],
  icoIdo: [...icoIdoData],
  fundraising: [...fundraisingData],
  glossary: [...web3GlossaryData]
};

// Listeners untuk perubahan data
const dataChangeListeners = new Set();

// Function untuk notify listeners
const notifyDataChange = (category) => {
  dataChangeListeners.forEach(listener => listener(category));
};

// Function untuk update data
export const updateCryptoData = (category, newData) => {
  globalCryptoData[category] = [...newData];
  notifyDataChange(category);
};

// Hook untuk menggunakan data crypto
export const useCryptoData = (category) => {
  const [data, setData] = useState(globalCryptoData[category] || []);

  useEffect(() => {
    const handleDataChange = (changedCategory) => {
      if (changedCategory === category) {
        setData([...globalCryptoData[category]]);
      }
    };

    dataChangeListeners.add(handleDataChange);

    return () => {
      dataChangeListeners.delete(handleDataChange);
    };
  }, [category]);

  return data;
};

// Function untuk refresh data dari source
export const refreshCryptoData = () => {
  globalCryptoData = {
    exchanges: [...exchangesData],
    airdrop: [...airdropData],
    icoIdo: [...icoIdoData],
    fundraising: [...fundraisingData],
    glossary: [...web3GlossaryData]
  };
  
  // Notify all listeners
  Object.keys(globalCryptoData).forEach(category => {
    notifyDataChange(category);
  });
};

// Function untuk menambah data baru
export const addCryptoData = (category, newItem) => {
  const currentData = globalCryptoData[category] || [];
  const newId = Math.max(...currentData.map(item => item.id), 0) + 1;
  const itemWithId = { id: newId, ...newItem };
  
  globalCryptoData[category] = [...currentData, itemWithId];
  notifyDataChange(category);
  
  return itemWithId;
};

// Function untuk update data existing
export const updateCryptoDataItem = (category, id, updateData) => {
  const currentData = globalCryptoData[category] || [];
  const index = currentData.findIndex(item => item.id === id);
  
  if (index !== -1) {
    currentData[index] = { ...currentData[index], ...updateData };
    globalCryptoData[category] = [...currentData];
    notifyDataChange(category);
    return currentData[index];
  }
  
  return null;
};

// Function untuk menghapus data
export const deleteCryptoDataItem = (category, id) => {
  const currentData = globalCryptoData[category] || [];
  const index = currentData.findIndex(item => item.id === id);
  
  if (index !== -1) {
    const deletedItem = currentData[index];
    currentData.splice(index, 1);
    globalCryptoData[category] = [...currentData];
    notifyDataChange(category);
    return deletedItem;
  }
  
  return null;
};

// Export data getters
export const getCryptoData = (category) => globalCryptoData[category] || [];
export const getExchangeData = () => globalCryptoData.exchanges;
export const getAirdropData = () => globalCryptoData.airdrop;
export const getIcoIdoData = () => globalCryptoData.icoIdo;
export const getFundraisingData = () => globalCryptoData.fundraising;
export const getGlossaryData = () => globalCryptoData.glossary;
