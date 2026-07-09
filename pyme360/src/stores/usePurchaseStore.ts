import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId, generateFolio } from '@/lib/id';
import { asyncJSONStorage, STORAGE_KEYS } from '@/lib/persist';
import { useInventoryStore } from './useInventoryStore';
import type { Purchase, PurchaseItem } from '@/types/models';

interface NewPurchaseInput {
  supplierId: string;
  supplierName: string;
  items: PurchaseItem[];
}

interface PurchaseState {
  purchases: Purchase[];
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  seed: (purchases: Purchase[]) => void;
  addPurchase: (input: NewPurchaseInput) => Purchase;
}

export const usePurchaseStore = create<PurchaseState>()(
  persist(
    (set, get) => ({
      purchases: [],
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),
      seed: (purchases) => set({ purchases }),
      addPurchase: (input) => {
        const total = input.items.reduce((s, it) => s + it.quantity * it.unitCost, 0);
        const purchase: Purchase = {
          id: generateId('pur_'),
          folio: generateFolio('COM', get().purchases.length + 1),
          supplierId: input.supplierId,
          supplierName: input.supplierName,
          items: input.items,
          total: Math.round(total * 100) / 100,
          createdAt: new Date().toISOString(),
        };
        input.items.forEach((it) => {
          useInventoryStore.getState().registerEntrada(it.productId, it.quantity, 'compra', `Compra ${purchase.folio}`);
        });
        set((s) => ({ purchases: [purchase, ...s.purchases] }));
        return purchase;
      },
    }),
    { name: STORAGE_KEYS.purchases, storage: asyncJSONStorage, onRehydrateStorage: () => (state) => state?.setHasHydrated(true) },
  ),
);
