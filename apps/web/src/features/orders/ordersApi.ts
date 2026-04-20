import type { Order } from "../../types/domain";
import { api } from "../../lib/api";

export type OrderDto = Order;

export function listOrders(userEmail?: string) {
  const q = userEmail ? `?userEmail=${encodeURIComponent(userEmail)}` : "";
  return api.getJson<OrderDto[]>(`/orders${q}`);
}

export function getOrder(id: string) {
  return api.getJson<OrderDto>(`/orders/${encodeURIComponent(id)}`);
}

export function createOrder(input: { userEmail: string; address: Order["address"]; items: Order["items"] }) {
  return api.postJson<OrderDto>("/orders", input);
}

export function updateOrder(id: string, patch: Partial<Pick<Order, "status" | "paymentStatus">>) {
  return api.patchJson<OrderDto>(`/orders/${encodeURIComponent(id)}`, patch);
}

