// stores/socketStore.ts
import { create } from "zustand";

interface SocketStore {
  socketReady: boolean;
  setSocketReady: (value: boolean) => void;
}

export const useSocketStore = create<SocketStore>((set) => ({
  socketReady: false,
  setSocketReady: (value) => set({ socketReady: value }),
}));
