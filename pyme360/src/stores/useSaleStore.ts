import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId, generateFolio } from '@/lib/id';
import { asyncJSONStorage, STORAGE_KEYS } from '@/lib/persist';
import { useProductStore } from './useProductStore';
import { useInventoryStore } from './useInventoryStore';
import type { Sale, SaleItem } from '@/types/models';

interface NewSaleInput {
  clientId?: string;
  clientName: string;
  items: SaleItem[];
  discount: number;
  ivaRate: number;
  paymentMethod: Sale['paymentMethod'];
}

interface SaleState {
  sales: Sale[];
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  seed: (sales: Sale[]) => void;
  addSale: (input: NewSaleInput) => Sale;
}

export const useSaleStore = create<SaleState>()(
  persist(
    (set, get) => ({
      sales: [],
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),
      seed: (sales) => set({ sales }),
      addSale: (input) => {
        const subtotal = input.items.reduce((s, it) => s + it.unitPrice * it.quantity, 0);
        const itemDiscounts = input.items.reduce((s, it) => s + Math.max(0, it.discount), 0);
        const totalDiscount = itemDiscounts + Math.max(0, input.discount);
        const taxableBase = Math.max(0, subtotal - totalDiscount);
        const iva = Math.round(taxableBase * input.ivaRate * 100) / 100;
        const total = Math.round((taxableBase + iva) * 100) / 100;
        const sale: Sale = {
          id: generateId('sale_'),
          folio: generateFolio('V', get().sales.length + 1),
          clientId: input.clientId,
          clientName: input.clientName,
          items: input.items,
          subtotal: Math.round(subtotal * 100) / 100,
          discount: Math.round(totalDiscount * 100) / 100,
          iva,
          total,
          paymentMethod: input.paymentMethod,
          createdAt: new Date().toISOString(),
        };
        input.items.forEach((it) => {
          useInventoryStore.getState().registerSalida(it.productId, it.quantity, 'venta', `Venta ${sale.folio}`);
        });
        set((s) => ({ sales: [sale, ...s.sales] }));
        return sale;
      },
    }),
    { name: STORAGE_KEYS.sales, storage: asyncJSONStorage, onRehydrateStorage: () => (state) => state?.setHasHydrated(true) },
  ),
);

// keep product references fresh (not persisted here, just a helper for screens)
export const getProductForSale = (id: string) => useProductStore.getState().products.find((p) => p.id === id);
