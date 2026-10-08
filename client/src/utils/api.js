/**
 * Frontend API URL Resolver
 * 
 * In production (Netlify):
 * Resolves to same-origin relative endpoints ('/api/...') routed via netlify.toml redirects.
 * 
 * In local development:
 * Resolves to '/api/...' which is transparently proxied by Vite to http://127.0.0.1:5000.
 * 
 * Supports an optional VITE_API_URL override if external backend hosting is ever used.
 */

const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export function getApiUrl(endpoint) {
  const normalized = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${BASE_URL}${normalized}`;
}
