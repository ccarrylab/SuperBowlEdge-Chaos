// API Configuration
export const API_BASE_URL = 'https://ke2z9vq7tk.execute-api.us-east-1.amazonaws.com/prod';

export const API_ENDPOINTS = {
  cloudfront: `${API_BASE_URL}/metrics/cloudfront`,
  cloudfrontRegions: `${API_BASE_URL}/metrics/cloudfront/regions`,
  alb: `${API_BASE_URL}/metrics/alb`,
  infrastructure: `${API_BASE_URL}/metrics/infrastructure`,
  chaos: `${API_BASE_URL}/chaos/experiments`,
};

// Refresh interval (milliseconds)
export const REFRESH_INTERVAL = 5000; // 5 seconds for more live feel
