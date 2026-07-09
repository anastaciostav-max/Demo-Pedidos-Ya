import { hashPassword } from '@/lib/auth';
import {
  business,
  categories,
  clients,
  demoUser,
  inventoryMovements,
  orders,
  products,
  purchases,
  sales,
  suppliers,
} from '@/data/seed';
import { useAppMetaStore } from '@/stores/useAppMetaStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useClientStore } from '@/stores/useClientStore';
import { useInventoryStore } from '@/stores/useInventoryStore';
import { useOrderStore } from '@/stores/useOrderStore';
import { useProductStore } from '@/stores/useProductStore';
import { usePurchaseStore } from '@/stores/usePurchaseStore';
import { useSaleStore } from '@/stores/useSaleStore';
import { useSupplierStore } from '@/stores/useSupplierStore';

export async function ensureSeeded() {
  if (useAppMetaStore.getState().seeded) return;

  const passwordHash = await hashPassword(demoUser.passwordHash);
  useAuthStore.getState().seedUsers([{ ...demoUser, passwordHash }]);
  useBusinessStore.getState().setBusiness(business);
  useProductStore.getState().seed(products, categories);
  useInventoryStore.getState().seed(inventoryMovements);
  useClientStore.getState().seed(clients);
  useSupplierStore.getState().seed(suppliers);
  useSaleStore.getState().seed(sales);
  usePurchaseStore.getState().seed(purchases);
  useOrderStore.getState().seed(orders);
  useAppMetaStore.getState().markSeeded();
}

export const DEMO_CREDENTIALS = { email: 'demo@pyme360.com', password: 'demo1234' };
