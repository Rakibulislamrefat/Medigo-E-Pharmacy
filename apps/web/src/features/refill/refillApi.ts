import type { RefillRequest } from "../../types/domain";
import { api } from "../../lib/api";

export function createRefillRequest(input: { userEmail?: string; phone: string; text: string }) {
  return api.postJson<RefillRequest>("/refill-requests", input);
}

