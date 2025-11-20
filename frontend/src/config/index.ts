/**
 * Application configuration loaded from environment variables
 * Use .env file for local development
 */

export const config = {
  api: {
    url: process.env.REACT_APP_API_URL || 'http://localhost:5253/api',
    timeout: Number(process.env.REACT_APP_API_TIMEOUT) || 30000,
  },
  signalr: {
    hubUrl: process.env.REACT_APP_SIGNALR_HUB_URL || 'http://localhost:5253/messaginghub',
  },
  auth: {
    tokenKey: process.env.REACT_APP_TOKEN_STORAGE_KEY || 'hotelminierp_token',
    userKey: process.env.REACT_APP_USER_STORAGE_KEY || 'hotelminierp_user',
  },
  features: {
    enableMockData: process.env.REACT_APP_ENABLE_MOCK_DATA === 'true',
    enableDebug: process.env.REACT_APP_ENABLE_DEBUG === 'true',
  },
  ui: {
    itemsPerPage: Number(process.env.REACT_APP_ITEMS_PER_PAGE) || 10,
    maxFileSize: Number(process.env.REACT_APP_MAX_FILE_SIZE) || 5242880, // 5MB
  },
} as const;

export default config;
