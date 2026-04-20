import { api } from "../../lib/api";

export type Banner = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  isActive: boolean;
  sortOrder: number;
  updatedAt: string;
};

export function listBanners() {
  return api.getJson<Banner[]>("/banners");
}

export function createBanner(input: Omit<Banner, "id" | "updatedAt">) {
  return api.postJson<Banner>("/banners", input);
}

export function updateBanner(id: string, patch: Partial<Omit<Banner, "id" | "updatedAt">>) {
  return api.patchJson<Banner>(`/banners/${id}`, patch);
}

export function deleteBanner(id: string) {
  return api.deleteJson<{ ok: true }>(`/banners/${id}`);
}

