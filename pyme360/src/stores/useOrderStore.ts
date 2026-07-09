import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId, generateFolio } from '@/lib/id';
import { asyncJSONStorage, STORAGE_KEYS } from '@/lib/persist';
import type { Order, OrderItem, OrderStatus } from '@/types/models';

interface NewOrderInput {
  clientId?: string;
  clientName: string;
  items: OrderItem[];
  deliveryAddress?: string;
  notes?: string;
}

interface OrderState {
  orders: Order[];
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  seed: (orders: Order[]) => void;
  addOrder: (input: NewOrderInput) => Order;
  setStatus: (id: string, status: OrderStatus) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),
      seed: (orders) => set({ orders }),
      addOrder: (input) => {
        const total = input.items.reduce((s, it) => s + it.unitPrice * it.quantity, 0);
        const now = new Date().toISOString();
        const order: Order = {
          id: generateId('ord_'),
          folio: generateFolio('PED', get().orders.length + 1),
          clientId: input.clientId,
          clientName: input.clientName,
          items: input.items,
          total: Math.round(total * 100) / 100,
          status: 'pendiente',
          history: [{ status: 'pendiente', at: now }],
          deliveryAddress: input.deliveryAddress,
          notes: input.notes,
          createdAt: now,
        };
        set((s) => ({ orders: [order, ...s.orders] }));
        return order;
      },
      setStatus: (id, status) => {
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === id
              ? { ...o, status, history: [...o.history, { status, at: new Date().toISOString() }] }
              : o,
          ),
        }));
      },
    }),
    { name: STORAGE_KEYS.orders, storage: asyncJSONStorage, onRehydrateStorage: () => (state) => state?.setHasHydrated(true) },
  ),
);

export const ORDER_STATUS_FLOW: OrderStatus[] = ['pendiente', 'preparando', 'enviado', 'entregado'];
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pendiente: 'Pendiente',
  preparando: 'Preparando',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};
