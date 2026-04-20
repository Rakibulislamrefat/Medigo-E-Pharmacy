import type { ConsultationRequest } from "../../types/domain";
import { api } from "../../lib/api";

export function createConsultation(input: { userEmail?: string; fullName: string; phone: string; notes: string; preferredTime?: string }) {
  return api.postJson<ConsultationRequest>("/consultations", input);
}

