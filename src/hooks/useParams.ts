'use client';

import { use } from 'react';

/**
 * Custom hook to handle Next.js route params in a future-proof way
 * 
 * This hook provides a consistent way to access route params that will work
 * with both the current Next.js version and future versions that require
 * unwrapping params with React.use()
 * 
 * @param params - The params object from Next.js page props
 * @returns The unwrapped params object
 */
export function useParams<T>(params: T): T {
  try {
    // Check if params is a Promise (future Next.js versions)
    if (params && typeof (params as any).then === 'function') {
      return use(params as any);
    }
    // Current Next.js version - params is already unwrapped
    return params;
  } catch (error) {
    // Fallback to direct access if use() fails
    console.warn('Failed to unwrap params with React.use()', error);
    return params;
  }
} 