import { API_ENDPOINTS } from '../config/api';

export interface CloudFrontMetrics {
  requests: number;
  bandwidth: number;
  errorRate4xx: number;
  errorRate5xx: number;
  timestamp: string;
}

export interface RegionalMetrics {
  region: string;
  requests: number;
  bandwidth: number;
  latency: number;
  hitRate: number;
  timestamp: string;
}

export interface CloudFrontRegionalData {
  regions: RegionalMetrics[];
  totalRequests: number;
  totalBandwidth: number;
  timestamp: string;
}

export interface ALBMetrics {
  healthyTargets: number;
  totalTargets: number;
  healthPercentage: number;
  averageResponseTime: number;
  requestCount: number;
  timestamp: string;
}

export interface InfrastructureMetrics {
  haproxy: {
    runningInstances: number;
    healthyInstances: number;
    totalInstances: number;
    desiredCapacity: number;
    minSize: number;
    maxSize: number;
    instances: Array<{
      id: string;
      state: string;
      health: string;
      az: string;
    }>;
  };
  timestamp: string;
}

export interface ChaosExperiment {
  id: string;
  status: string;
  creationTime: string;
  templateId: string;
}

export interface ChaosMetrics {
  total: number;
  completed: number;
  failed: number;
  running: number;
  successRate: number;
  experiments: ChaosExperiment[];
  timestamp: string;
}

class MetricsAPI {
  async fetchCloudFront(): Promise<CloudFrontMetrics> {
    const response = await fetch(API_ENDPOINTS.cloudfront);
    if (!response.ok) throw new Error('Failed to fetch CloudFront metrics');
    return response.json();
  }

  async fetchCloudFrontRegions(): Promise<CloudFrontRegionalData> {
    const response = await fetch(API_ENDPOINTS.cloudfrontRegions);
    if (!response.ok) throw new Error('Failed to fetch regional metrics');
    return response.json();
  }

  async fetchALB(): Promise<ALBMetrics> {
    const response = await fetch(API_ENDPOINTS.alb);
    if (!response.ok) throw new Error('Failed to fetch ALB metrics');
    return response.json();
  }

  async fetchInfrastructure(): Promise<InfrastructureMetrics> {
    const response = await fetch(API_ENDPOINTS.infrastructure);
    if (!response.ok) throw new Error('Failed to fetch infrastructure metrics');
    return response.json();
  }

  async fetchChaos(): Promise<ChaosMetrics> {
    const response = await fetch(API_ENDPOINTS.chaos);
    if (!response.ok) throw new Error('Failed to fetch chaos metrics');
    return response.json();
  }

  async fetchAll() {
    const [cloudfront, regions, alb, infrastructure, chaos] = await Promise.all([
      this.fetchCloudFront(),
      this.fetchCloudFrontRegions(),
      this.fetchALB(),
      this.fetchInfrastructure(),
      this.fetchChaos(),
    ]);

    return { cloudfront, regions, alb, infrastructure, chaos };
  }
}

export const metricsAPI = new MetricsAPI();
