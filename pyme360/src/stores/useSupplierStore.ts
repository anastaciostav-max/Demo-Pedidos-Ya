import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '@/lib/id';
import { asyncJSONStorage, STORAGE_KEYS } from '@/lib/persist';
import type { Supplier } from '@/types/models';

interface SupplierState {
  suppliers: Supplier[];
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  seed: (suppliers: Supplier[]) => void;
  addSupplier: (input: Omit<Supplier, 'id' | 'createdAt'>) => Supplier;
  updateSupplier: (id: string, patch: Partial<Supplier>) => void;
  removeSupplier: (id: string) => void;
}

export const useSupplierStore = create<SupplierState>()(
  persist(
    (set) => ({
      suppliers: [],
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),
      seed: (suppliers) => set({ suppliers }),
      addSupplier: (input) => {
        const supplier: Supplier = { ...input, id: generateId('sup_'), createdAt: new Date().toISOString() };
        set((s) => ({ suppliers: [supplier, ...s.suppliers] }));
        return supplier;
      },
      updateSupplier: (id, patch) => {
        set((s) => ({ suppliers: s.suppliers.map((sup) => (sup.id === id ? { ...sup, ...patch } : sup)) }));
      },
      removeSupplier: (id) => {
        set((s) => ({ suppliers: s.suppliers.filter((sup) => sup.id !== id) }));
      },
    }),
    { name: STORAGE_KEYS.suppliers, storage: asyncJSONStorage, onRehydrateStorage: () => (state) => state?.setHasHydrated(true) },
  ),
);
