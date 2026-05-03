const raw = import.meta.env.VITE_APP_BASE_URL?.trim();
const origin = raw ? raw.replace(/\/$/, "") : "";

/**
 * Full URL for API calls. Without VITE_APP_BASE_URL (local dev), returns a path
 * so Vite's `/api` proxy forwards to the backend.
 */
export function apiUrl(path) {
  let p = path.startsWith("/") ? path : `/${path}`;
  if (!p.startsWith("/api/")) p = `/api${p}`;
  return origin ? `${origin}${p}` : p;
}

/** RTK Query base path: `/api` in dev (proxied), or `https://host/api` in production. */
export const API_ROOT = origin ? `${origin}/api` : "/api";
