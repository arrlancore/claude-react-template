/**
 * Utility functions for environment-specific operations
 */

/**
 * Check if the application is running in development mode
 */
export const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Check if the application is running in production mode
 */
export const isProduction = process.env.NODE_ENV === 'production';
