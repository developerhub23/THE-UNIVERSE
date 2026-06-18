import { useState, useEffect, useCallback } from 'react';
import { fetchSpaceNews } from '../utils/api';

export const useSpaceNews = (limit = 12, autoRefresh = true) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchSpaceNews(limit);
      setNews(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => { fetchNews(); }, [fetchNews]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchNews, 10800000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchNews]);

  return { news, loading, error, lastUpdated, refresh: fetchNews };
};