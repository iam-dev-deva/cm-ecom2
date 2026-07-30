import { useCallback, useEffect, useState } from 'react';
import productService from '@/services/productService';
import useDidMount from './useDidMount';

const useDashboardData = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const didMount = useDidMount(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const apiData = await productService.getDashboardData();
      const nextData = apiData?.data ?? apiData;

      if (didMount) {
        setDashboardData(nextData || null);
        setLoading(false);
      }
    } catch (e) {
      if (didMount) {
        setDashboardData(null);
        setError('Failed to fetch dashboard data');
        setLoading(false);
      }
    }
  }, [didMount]);

  useEffect(() => {
    if (didMount) {
      fetchDashboardData();
    }
  }, [didMount, fetchDashboardData]);

  return {
    dashboardData,
    fetchDashboardData,
    isLoading,
    error,
  };
};

export default useDashboardData;