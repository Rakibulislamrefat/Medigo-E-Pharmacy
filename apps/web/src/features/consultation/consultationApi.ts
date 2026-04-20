import type { ConsultationRequest } from "../../types/domain";
import { api } from "../../lib/api";

export function createConsultation(input: {
  userEmail?: string;
  fullName: string;
  phone: string;
  notes: string;
  preferredTime?: string;
  scheduledTime?: string;
}) {
  return api.postJson<ConsultationRequest>("/consultations", input);
}

export function listConsultations() {
  return api.getJson<ConsultationRequest[]>("/consultations");
}

export function updateConsultation(id: string, patch: Partial<Pick<ConsultationRequest, "status" | "scheduledTime">>) {
  return api.patchJson<ConsultationRequest>(`/consultations/${encodeURIComponent(id)}`, patch);
}
