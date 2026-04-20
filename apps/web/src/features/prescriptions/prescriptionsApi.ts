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

