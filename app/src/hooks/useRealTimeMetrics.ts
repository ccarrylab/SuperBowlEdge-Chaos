import { useState, useEffect } from 'react';
import { metricsAPI } from '../lib/api';
import type { CloudFrontMetrics, ALBMetrics, InfrastructureMetrics, ChaosMetrics } from '../lib/api';
import { REFRESH_INTERVAL } from '../config/api';

interface MetricsState {
  cloudfront: CloudFrontMetrics | null;
  alb: ALBMetrics | null;
  infrastructure: InfrastructureMetrics | null;
  chaos: ChaosMetrics | null;
  loading: boolean;
  error: string | null;
  lastUpdate: Date | null;
}

export function useRealTimeMetrics() {
  const [metrics, setMetrics] = useState<MetricsState>({
    cloudfront: null,
    alb: null,
    infrastructure: null,
    chaos: null,
    loading: true,
    error: null,
    lastUpdate: null,
  });

  const fetchMetrics = async () => {
    try {
      setMetrics(prev => ({ ...prev, loading: true, error: null }));
      
      const data = await metricsAPI.fetchAll();
      
      setMetrics({
        cloudfront: data.cloudfront,
        alb: data.alb,
        infrastructure: data.infrastructure,
        chaos: data.chaos,
        loading: false,
        error: null,
        lastUpdate: new Date(),
      });
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
      setMetrics(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch metrics',
      }));
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchMetrics();

    // Set up polling
    const interval = setInterval(fetchMetrics, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return { ...metrics, refresh: fetchMetrics };
}
