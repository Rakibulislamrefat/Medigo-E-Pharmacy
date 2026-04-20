import { api } from "../../lib/api";

export type DeliveryStatus = "assigned" | "picked_up" | "on_the_way" | "delivered";

export type Delivery = {
  id: string;
  orderId: string;
  assignedToEmail: string | null;
  status: DeliveryStatus;
  updatedAt: string;
};

export function listDeliveries(assignedToEmail?: string) {
  const q = assignedToEmail ? `?assignedToEmail=${encodeURIComponent(assignedToEmail)}` : "";
  return api.getJson<Delivery[]>(`/deliveries${q}`);
}

export function getDelivery(id: string) {
  return api.getJson<Delivery>(`/deliveries/${encodeURIComponent(id)}`);
}

export function createDelivery(input: { orderId: string; assignedToEmail?: string }) {
  return api.postJson<Delivery>("/deliveries", input);
}

export function updateDelivery(id: string, patch: Partial<Pick<Delivery, "status" | "assignedToEmail">>) {
  return api.patchJson<Delivery>(`/deliveries/${encodeURIComponent(id)}`, patch);
}

