import { create } from "zustand";

export interface CurrentUser {
  _id?: string;
  fullName?: string;
  email?: string;
  avatar?: string;
  role?: string;
  [key: string]: unknown;
}

interface UserStore {
  user: CurrentUser | null;
  isAuthenticated: boolean;
  setUser: (user: CurrentUser | null) => void;
  clearUser: () => void;
}

/** Dedicated user state. Socket connection status lives in socketStore.ts. */
export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: Boolean(user) }),
  clearUser: () => set({ user: null, isAuthenticated: false }),
}));
