import { useState, useEffect } from 'react';
import { metricsAPI } from '../lib/api';
import type { CloudFrontMetrics, CloudFrontRegionalData, ALBMetrics, InfrastructureMetrics, ChaosMetrics } from '../lib/api';
import { REFRESH_INTERVAL } from '../config/api';

interface MetricsState {
  cloudfront: CloudFrontMetrics | null;
  regions: CloudFrontRegionalData | null;
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
    regions: null,
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
        regions: data.regions,
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
    fetchMetrics();
    const interval = setInterval(fetchMetrics, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return { ...metrics, refresh: fetchMetrics };
}
