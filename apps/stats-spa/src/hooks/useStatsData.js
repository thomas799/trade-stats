import { useEffect, useState } from 'react';

import { API_ENDPOINT } from '../utils/config';

export function useStatsData() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error('Error loading data');
      }

      const data = await response.json();
      setStats(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err.message);
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return { error, loading, refresh: loadStats, stats };
}
