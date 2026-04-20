import { create } from "zustand";

import type { Role, User } from "../../types/domain";

type AuthState = {
  user: User | null;
  login: (params: { email: string; role: Role }) => void;
  logout: () => void;
};

const STORAGE_KEY = "medigo.auth";

function loadUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as User;
    if (!parsed?.email || !parsed?.role) return null;
    return parsed;
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: loadUser(),
  login: ({ email, role }) => {
    const next: User = { email, role };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    set({ user: next });
  },
  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ user: null });
  },
}));

