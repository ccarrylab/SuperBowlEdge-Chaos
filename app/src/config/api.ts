// API Configuration
export const API_BASE_URL = 'https://ke2z9vq7tk.execute-api.us-east-1.amazonaws.com/prod';

export const API_ENDPOINTS = {
  cloudfront: `${API_BASE_URL}/metrics/cloudfront`,
  alb: `${API_BASE_URL}/metrics/alb`,
  infrastructure: `${API_BASE_URL}/metrics/infrastructure`,
  chaos: `${API_BASE_URL}/chaos/experiments`,
};

// Refresh interval (milliseconds)
export const REFRESH_INTERVAL = 10000; // 10 seconds
