import { apiBaseUrl } from "./env";

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${apiBaseUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }

  return (await res.json()) as T;
}

export const api = {
  getJson: fetchJson,
  postJson: <T>(path: string, body: unknown) =>
    fetchJson<T>(path, { method: "POST", body: JSON.stringify(body) }),
  patchJson: <T>(path: string, body: unknown) =>
    fetchJson<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  deleteJson: <T>(path: string) => fetchJson<T>(path, { method: "DELETE" }),
  health: () => fetchJson<{ ok: boolean }>("/health"),
};
