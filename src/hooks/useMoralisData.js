import { useState, useEffect, useCallback } from 'react';
import { getCryptoMapping, isCryptoSupported } from '../utils/cryptoMapping';

export const useMoralisData = (cryptoId, dataType = 'transactions') => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 50,
    offset: 0,
  });

  const cryptoMapping = getCryptoMapping(cryptoId);
  const isSupported = isCryptoSupported(cryptoId);

    const fetchData = useCallback(async (offset = 0, limit = 50) => {
    if (!cryptoId) {
      setError('No cryptocurrency ID provided');
      return;
    }

    if (!isSupported) {
      setError(`Transaction data is not available for ${cryptoId.toUpperCase()}`);
      return;
    }

    if (!cryptoMapping) {
      setError('Unable to map cryptocurrency to blockchain data');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let url;
      const params = new URLSearchParams({
        chain: cryptoMapping.chain.toString(),
        limit: limit.toString(),
      });

      switch (dataType) {
        case 'transactions':
          // For native tokens, use a popular address, for tokens use token-transfers endpoint
          if (cryptoMapping.type === 'native') {
            const address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'; // Vitalik's address for testing
            url = `/api/moralis/transactions?address=${address}&${params}`;
          } else {
            // For tokens, use token-transfers endpoint
            if (!cryptoMapping.contractAddress) {
              throw new Error('No contract address available for token transfers');
            }
            url = `/api/moralis/token-transfers?tokenAddress=${cryptoMapping.contractAddress}&${params}`;
          }
          break;
        
        case 'token-transfers':
          if (!cryptoMapping.contractAddress) {
            throw new Error('No contract address available for token transfers');
          }
          url = `/api/moralis/token-transfers?tokenAddress=${cryptoMapping.contractAddress}&${params}`;
          break;
        
        case 'contract-events':
          if (!cryptoMapping.contractAddress) {
            throw new Error('No contract address available for contract events');
          }
          url = `/api/moralis/contract-events?contractAddress=${cryptoMapping.contractAddress}&${params}`;
          break;
        
        default:
          throw new Error(`Unknown data type: ${dataType}`);
      }

      const response = await fetch(url);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Failed to fetch data: ${response.status}`);
      }

      // Handle both transactions and token transfers
      const responseData = result.transactions || result.transfers || result.data || [];
      setData(responseData);
      setPagination(result.pagination || {
        total: result.total || 0,
        page: Math.floor(offset / limit) + 1,
        limit,
        offset,
      });

    } catch (err) {
      console.error('Error fetching Moralis data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [cryptoId, dataType, cryptoMapping, isSupported]);

  const loadMore = useCallback(() => {
    const nextOffset = pagination.offset + pagination.limit;
    fetchData(nextOffset, pagination.limit);
  }, [fetchData, pagination]);

  const refresh = useCallback(() => {
    fetchData(0, pagination.limit);
  }, [fetchData, pagination.limit]);

  useEffect(() => {
    if (cryptoId && isSupported) {
      fetchData();
    }
  }, [cryptoId, dataType, fetchData, isSupported]);

  return {
    data,
    loading,
    error,
    pagination,
    loadMore,
    refresh,
    isSupported,
    cryptoMapping,
  };
};

// Hook specifically for transaction data
export const useTransactionData = (cryptoId) => {
  return useMoralisData(cryptoId, 'transactions');
};

// Hook specifically for token transfer data
export const useTokenTransferData = (cryptoId) => {
  return useMoralisData(cryptoId, 'token-transfers');
};

// Hook specifically for contract events
export const useContractEventData = (cryptoId) => {
  return useMoralisData(cryptoId, 'contract-events');
}; 