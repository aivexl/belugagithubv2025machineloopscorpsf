import { useState, useEffect } from 'react';
import useInterval from './useInterval';

function fetchWithTimeout(resource, options = {}) {
  const { timeout = 10000 } = options;
  return Promise.race([
    fetch(resource),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout)),
  ]);
}

export default function useFetch(url, { refreshInterval = null, timeout = 10000 } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWithTimeout(url, { timeout });
      if (!res.ok) throw new Error('Network response was not ok');
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  useInterval(() => {
    fetchData();
  }, refreshInterval);

  return { data, loading, error };
} 