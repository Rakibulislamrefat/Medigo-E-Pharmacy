import type { Feedback } from "../../types/domain";
import { api } from "../../lib/api";

export function listFeedback(userEmail?: string) {
  const q = userEmail ? `?userEmail=${encodeURIComponent(userEmail)}` : "";
  return api.getJson<Feedback[]>(`/feedback${q}`);
}

export function createFeedback(input: Omit<Feedback, "id" | "createdAt">) {
  return api.postJson<Feedback>("/feedback", input);
}

