import { create } from "zustand";

import type { AddressSnapshot, Order, OrderStatus, PaymentStatus } from "../../types/domain";

type OrdersState = {
  orders: Order[];
  create: (params: { userEmail: string; items: Order["items"]; address: AddressSnapshot; totalAmount: number }) => Order;
  setStatus: (orderId: string, status: OrderStatus) => void;
  setPaymentStatus: (orderId: string, status: PaymentStatus) => void;
};

const STORAGE_KEY = "medigo.orders";

function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Order[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveOrders(orders: Order[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: loadOrders(),
  create: ({ userEmail, items, address, totalAmount }) => {
    const next: Order = {
      id: makeId(),
      userEmail,
      status: "created",
      paymentStatus: "unpaid",
      totalAmount,
      address,
      items,
      createdAt: new Date().toISOString(),
    };
    const orders = [next, ...get().orders];
    saveOrders(orders);
    set({ orders });
    return next;
  },
  setStatus: (orderId, status) => {
    const orders = get().orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    saveOrders(orders);
    set({ orders });
  },
  setPaymentStatus: (orderId, status) => {
    const orders = get().orders.map((o) => (o.id === orderId ? { ...o, paymentStatus: status } : o));
    saveOrders(orders);
    set({ orders });
  },
}));

