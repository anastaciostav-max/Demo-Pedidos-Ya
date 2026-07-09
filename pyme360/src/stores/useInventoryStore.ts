import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '@/lib/id';
import { asyncJSONStorage, STORAGE_KEYS } from '@/lib/persist';
import { useProductStore } from './useProductStore';
import type { InventoryMovement, MovementReason } from '@/types/models';

interface InventoryState {
  movements: InventoryMovement[];
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  seed: (movements: InventoryMovement[]) => void;
  registerEntrada: (productId: string, quantity: number, reason: MovementReason, note?: string) => void;
  registerSalida: (productId: string, quantity: number, reason: MovementReason, note?: string) => void;
  registerAjuste: (productId: string, newStock: number, note?: string) => void;
  movementsForProduct: (productId: string) => InventoryMovement[];
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      movements: [],
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),
      seed: (movements) => set({ movements }),
      registerEntrada: (productId, quantity, reason, note) => {
        const stockAfter = useProductStore.getState().adjustStock(productId, Math.abs(quantity));
        const movement: InventoryMovement = {
          id: generateId('mov_'),
          productId,
          type: 'entrada',
          reason,
          quantity: Math.abs(quantity),
          stockAfter,
          note,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ movements: [movement, ...s.movements] }));
      },
      registerSalida: (productId, quantity, reason, note) => {
        const stockAfter = useProductStore.getState().adjustStock(productId, -Math.abs(quantity));
        const movement: InventoryMovement = {
          id: generateId('mov_'),
          productId,
          type: 'salida',
          reason,
          quantity: Math.abs(quantity),
          stockAfter,
          note,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ movements: [movement, ...s.movements] }));
      },
      registerAjuste: (productId, newStock, note) => {
        const stockAfter = useProductStore.getState().setStock(productId, newStock);
        const movement: InventoryMovement = {
          id: generateId('mov_'),
          productId,
          type: 'ajuste',
          reason: 'ajuste_manual',
          quantity: newStock,
          stockAfter,
          note,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ movements: [movement, ...s.movements] }));
      },
      movementsForProduct: (productId) => get().movements.filter((m) => m.productId === productId),
    }),
    {
      name: STORAGE_KEYS.inventory,
      storage: asyncJSONStorage,
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    },
  ),
);
