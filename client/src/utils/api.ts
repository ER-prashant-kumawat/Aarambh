/**
 * Centralized API URL resolver for the Aarambhh frontend.
 *
 * Rules:
 * 1. On localhost → always use http://localhost:5000/api
 * 2. In production → use VITE_API_URL env var, with /api appended if missing
 * 3. Fallback → hardcoded Vercel backend URL
 *
 * Returns a clean URL ending in /api (no trailing slash).
 */
export const getApiUrl = (): string => {
  // Local development override
  if (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ) {
    return 'http://localhost:5000/api';
  }

  // Production: read from env or use fallback
  let url = import.meta.env.VITE_API_URL || 'https://server-dun-six-65.vercel.app';

  // Sanitize: trim whitespace, remove trailing slashes
  url = url.trim().replace(/\/+$/, '');

  // Ensure it ends with /api
  if (!url.endsWith('/api')) {
    url = url + '/api';
  }

  return url;
};

export const API_URL = getApiUrl();
