import type { Medicine } from "../../types/domain";
import { api } from "../../lib/api";

import { demoMedicines } from "./demoMedicines";

export async function listMedicines(): Promise<Medicine[]> {
  try {
    const data = await api.getJson<unknown>("/medicines");
    if (!Array.isArray(data)) return demoMedicines;
    return data as Medicine[];
  } catch {
    return demoMedicines;
  }
}

export async function getMedicine(id: string): Promise<Medicine | null> {
  const all = await listMedicines();
  return all.find((m) => m.id === id) ?? null;
}

