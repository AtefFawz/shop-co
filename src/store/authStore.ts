import { create } from "zustand";

interface AuthState {
  token: string | null;
  role: string | null;
  setToken: (token: string | null) => void;
  setRole: (role: string | null) => void;
  clearToken: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  role: null,
  setToken: (token) =>
    set({
      token,
    }),
  setRole: (role) => {
    set({
      role,
    });
  },
  clearToken: () =>
    set({
      token: null,
    }),
}));
