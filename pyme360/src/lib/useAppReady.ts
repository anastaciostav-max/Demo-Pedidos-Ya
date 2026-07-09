import { useEffect, useState } from 'react';
import { ensureSeeded } from '@/lib/bootstrap';
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

export function useAppReady() {
  const authHydrated = useAuthStore((s) => s.hasHydrated);
  const businessHydrated = useBusinessStore((s) => s.hasHydrated);
  const productHydrated = useProductStore((s) => s.hasHydrated);
  const inventoryHydrated = useInventoryStore((s) => s.hasHydrated);
  const clientHydrated = useClientStore((s) => s.hasHydrated);
  const supplierHydrated = useSupplierStore((s) => s.hasHydrated);
  const saleHydrated = useSaleStore((s) => s.hasHydrated);
  const purchaseHydrated = usePurchaseStore((s) => s.hasHydrated);
  const orderHydrated = useOrderStore((s) => s.hasHydrated);
  const metaHydrated = useAppMetaStore((s) => s.hasHydrated);

  const allHydrated =
    authHydrated &&
    businessHydrated &&
    productHydrated &&
    inventoryHydrated &&
    clientHydrated &&
    supplierHydrated &&
    saleHydrated &&
    purchaseHydrated &&
    orderHydrated &&
    metaHydrated;

  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    if (!allHydrated) return;
    ensureSeeded().finally(() => setSeeded(true));
  }, [allHydrated]);

  return allHydrated && seeded;
}
