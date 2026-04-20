import type { PrescriptionRequest } from "../../types/domain";
import { api } from "../../lib/api";

export function createPrescription(input: {
  userEmail?: string;
  fullName: string;
  phone: string;
  fileName: string;
  fileMime: string;
  fileSize: number;
  fileDataUrl?: string;
}) {
  return api.postJson<PrescriptionRequest>("/prescriptions", input);
}

export function listPrescriptions() {
  return api.getJson<PrescriptionRequest[]>("/prescriptions");
}

export function updatePrescription(id: string, patch: Partial<Pick<PrescriptionRequest, "status">>) {
  return api.patchJson<PrescriptionRequest>(`/prescriptions/${encodeURIComponent(id)}`, patch);
}
