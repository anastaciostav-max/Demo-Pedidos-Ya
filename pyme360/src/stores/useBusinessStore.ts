import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { asyncJSONStorage, STORAGE_KEYS } from '@/lib/persist';
import type { Business } from '@/types/models';

interface BusinessState {
  business: Business | null;
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  setBusiness: (business: Business) => void;
  updateBusiness: (patch: Partial<Business>) => void;
}

export const useBusinessStore = create<BusinessState>()(
  persist(
    (set) => ({
      business: null,
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),
      setBusiness: (business) => set({ business }),
      updateBusiness: (patch) => set((s) => ({ business: s.business ? { ...s.business, ...patch } : s.business })),
    }),
    { name: STORAGE_KEYS.business, storage: asyncJSONStorage, onRehydrateStorage: () => (state) => state?.setHasHydrated(true) },
  ),
);
