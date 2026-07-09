import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { asyncJSONStorage, STORAGE_KEYS } from '@/lib/persist';

interface AppMetaState {
  seeded: boolean;
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  markSeeded: () => void;
}

export const useAppMetaStore = create<AppMetaState>()(
  persist(
    (set) => ({
      seeded: false,
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),
      markSeeded: () => set({ seeded: true }),
    }),
    { name: STORAGE_KEYS.meta, storage: asyncJSONStorage, onRehydrateStorage: () => (state) => state?.setHasHydrated(true) },
  ),
);
