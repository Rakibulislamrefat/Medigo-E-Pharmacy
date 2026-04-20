import { create } from "zustand";

import type { Feedback } from "../../types/domain";

type FeedbackState = {
  items: Feedback[];
  add: (f: Omit<Feedback, "id" | "createdAt">) => void;
};

const STORAGE_KEY = "medigo.feedback";

function load(): Feedback[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Feedback[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(items: Feedback[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

export const useFeedbackStore = create<FeedbackState>((set, get) => ({
  items: load(),
  add: (f) => {
    const next: Feedback = { ...f, id: makeId(), createdAt: new Date().toISOString() };
    const items = [next, ...get().items];
    save(items);
    set({ items });
  },
}));

