// config.ts
/**
 * Application Configuration
 * Centralized configuration using environment variables
 */

// Environment validation
const requiredEnvVars = {
  API_URL: process.env.NEXT_PUBLIC_API_URL,
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
} as const;

// Check for missing required environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVars.join(', ')}
` +
    'Please check your .env file or environment configuration.'
  );
}

// API Configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL!;
export const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL || 'https://res.cloudinary.com';
export const ASSETS_URL = process.env.NEXT_PUBLIC_ASSETS_URL || 'https://assets.jeepedia.in';

// Website Configuration
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!;
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'jeepedia.in@gmail.com';
export const DEV_TUNNEL_URL = process.env.NEXT_PUBLIC_DEV_TUNNEL_URL;

// Social Media Links
export const SOCIAL_LINKS = {
  discord: process.env.NEXT_PUBLIC_DISCORD_URL || 'https://discord.gg/Z8s9JECw4C',
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/jeepedia.in',
  github: process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/J2J-App',
} as const;

// Analytics Configuration
export const ANALYTICS = {
  umamiWebsiteId: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
  umamiScriptUrl: process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL || 'https://cloud.umami.is/script.js',
  googleAdsenseId: process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID,
} as const;

// Feature Flags
export const FEATURES = {
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  enableConsoleLogs: process.env.NEXT_PUBLIC_ENABLE_CONSOLE_LOGS === 'true',
  maintenanceMode: process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true',
} as const;

// Performance Configuration
export const PERFORMANCE = {
  apiTimeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000', 10),
  maxRetries: parseInt(process.env.NEXT_PUBLIC_MAX_RETRIES || '3', 10),
} as const;

// Environment Information
export const ENV = {
  nodeEnv: process.env.NODE_ENV || 'development',
  appEnv: process.env.NEXT_PUBLIC_APP_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const;

// Helper function for development logging
export const devLog = (...args: any[]) => {
  if (FEATURES.enableConsoleLogs && ENV.isDevelopment) {
    console.log('[DEV]', ...args);
  }
};
