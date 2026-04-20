import type { RefillRequest } from "../../types/domain";
import { api } from "../../lib/api";

export function createRefillRequest(input: { userEmail?: string; phone: string; text: string }) {
  return api.postJson<RefillRequest>("/refill-requests", input);
}

export function listRefillRequests() {
  return api.getJson<RefillRequest[]>("/refill-requests");
}

export function updateRefillRequest(id: string, patch: Partial<Pick<RefillRequest, "status">>) {
  return api.patchJson<RefillRequest>(`/refill-requests/${encodeURIComponent(id)}`, patch);
}
