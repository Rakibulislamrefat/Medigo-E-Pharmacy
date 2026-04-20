import { create } from "zustand";

import type { CartItem, Medicine } from "../../types/domain";

type CartState = {
  items: CartItem[];
  add: (medicine: Medicine, qty: number) => void;
  remove: (medicineId: string) => void;
  setQty: (medicineId: string, qty: number) => void;
  clear: () => void;
  subtotal: () => number;
  totalItems: () => number;
};

const STORAGE_KEY = "medigo.cart";

function loadItems(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveItems(items: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export const useCartStore = create<CartState>((set, get) => ({
  items: loadItems(),
  add: (medicine, qty) => {
    const items = [...get().items];
    const found = items.find((i) => i.medicineId === medicine.id);
    if (found) found.qty += qty;
    else items.push({ medicineId: medicine.id, name: medicine.name, unitPrice: medicine.price, qty });
    saveItems(items);
    set({ items });
  },
  remove: (medicineId) => {
    const items = get().items.filter((i) => i.medicineId !== medicineId);
    saveItems(items);
    set({ items });
  },
  setQty: (medicineId, qty) => {
    const safeQty = Math.max(1, Math.min(99, qty));
    const items = get().items.map((i) => (i.medicineId === medicineId ? { ...i, qty: safeQty } : i));
    saveItems(items);
    set({ items });
  },
  clear: () => {
    saveItems([]);
    set({ items: [] });
  },
  subtotal: () => get().items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0),
  totalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),
}));

