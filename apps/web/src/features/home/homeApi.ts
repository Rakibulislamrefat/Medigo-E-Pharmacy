import { api } from "../../lib/api";
import type { Medicine } from "../../types/domain";

export type HomeBannerDto = {
  key: string;
  title: string;
  subtitle: string;
  imageUrl?: string;
};

export type HomeDto = {
  banners: HomeBannerDto[];
  categories: string[];
  featuredMedicines: Medicine[];
};

export async function getHome(): Promise<HomeDto | null> {
  try {
    const data = await api.getJson<HomeDto>("/home");
    return data;
  } catch {
    return null;
  }
}
