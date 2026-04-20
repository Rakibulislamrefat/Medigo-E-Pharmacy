export function apiBaseUrl() {
  const v = (import.meta as { env?: Record<string, string> }).env?.VITE_API_BASE_URL;
  return v && v.trim() ? v.trim().replace(/\/$/, "") : "http://localhost:5000";
}

