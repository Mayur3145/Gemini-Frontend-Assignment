'use client'

import { use } from 'react';

export function useParams<T extends Record<string, string>>(
  params: T | Promise<T>
): T {
  if (typeof params === 'object' && params !== null && 'then' in params) {
    return use(params as Promise<T>);
  }
  return params as T;
}
