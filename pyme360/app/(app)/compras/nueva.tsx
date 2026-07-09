import { useRouter } from 'expo-router';
import { ChevronDown, Package, Plus, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { notify } from '@/lib/confirm';
import { ProductPickerSheet } from '@/components/domain/ProductPickerSheet';
import { SupplierPickerSheet } from '@/components/domain/SupplierPickerSheet';
import { AppText, Button, Card, IconButton, Input, ScreenContainer, ScreenHeader } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { usePurchaseStore } from '@/stores/usePurchaseStore';
import { palette, spacing } from '@/theme';
import type { PurchaseItem, Supplier } from '@/types/models';

export default function NuevaCompraScreen() {
  const router = useRouter();
  const addPurchase = usePurchaseStore((s) => s.addPurchase);
  const business = useBusinessStore((s) => s.business);

  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [supplierPickerOpen, setSupplierPickerOpen] = useState(false);
  const [productPickerOpen, setProductPickerOpen] = useState(false);
  const [items, setItems] = useState<PurchaseItem[]>([]);

  const total = items.reduce((s, it) => s + it.quantity * it.unitCost, 0);

  function updateQty(productId: string, delta: number) {
    setItems((prev) =>
      prev.map((it) => (it.productId === productId ? { ...it, quantity: Math.max(1, it.quantity + delta) } : it)),
    );
  }

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((it) => it.productId !== productId));
  }

  function handleSubmit() {
    if (!supplier) return notify('Selecciona un proveedor');
    if (items.length === 0) return notify('Agrega al menos un producto');
    addPurchase({ supplierId: supplier.id, supplierName: supplier.name, items });
    router.back();
  }

  return (
    <ScreenContainer>
      <ScreenHeader title="Nueva compra" />

      <Pressable onPress={() => setSupplierPickerOpen(true)}>
        <Card style={styles.selector}>
          <View style={{ flex: 1 }}>
            <AppText variant="caption">Proveedor</AppText>
            <AppText variant="bodySemibold">{supplier?.name ?? 'Selecciona un proveedor'}</AppText>
          </View>
          <ChevronDown size={18} color={palette.gray400} />
        </Card>
      </Pressable>

      <View style={styles.itemsHeader}>
        <AppText variant="headline">Productos</AppText>
        <Button label="Agregar" size="sm" variant="outline" icon={<Plus size={14} color={palette.blue600} />} onPress={() => setProductPickerOpen(true)} />
      </View>

      {items.length === 0 && (
        <Card style={{ alignItems: 'center', paddingVertical: spacing.lg }}>
          <Package size={24} color={palette.gray400} />
          <AppText variant="caption" style={{ marginTop: spacing.xs }}>
            Aún no agregas productos.
          </AppText>
        </Card>
      )}

      {items.map((it) => (
        <Card key={it.productId} style={styles.itemCard}>
          <View style={{ flex: 1 }}>
            <AppText variant="bodySemibold" numberOfLines={1}>
              {it.productName}
            </AppText>
            <AppText variant="caption">Costo unitario: {formatCurrency(it.unitCost, business?.currency)}</AppText>
          </View>
          <View style={styles.qtyControls}>
            <IconButton size={30} onPress={() => updateQty(it.productId, -1)}>
              <AppText variant="bodySemibold">-</AppText>
            </IconButton>
            <AppText variant="bodySemibold" style={{ width: 28, textAlign: 'center' }}>
              {it.quantity}
            </AppText>
            <IconButton size={30} onPress={() => updateQty(it.productId, 1)}>
              <AppText variant="bodySemibold">+</AppText>
            </IconButton>
          </View>
          <IconButton size={30} onPress={() => removeItem(it.productId)}>
            <Trash2 size={16} color={palette.danger} />
          </IconButton>
        </Card>
      ))}

      {items.length > 0 && (
        <Card style={[styles.totalCard]}>
          <AppText variant="headline">Total</AppText>
          <AppText variant="title">{formatCurrency(total, business?.currency)}</AppText>
        </Card>
      )}

      <Button label="Registrar compra" onPress={handleSubmit} fullWidth style={{ marginTop: spacing.lg }} />

      <SupplierPickerSheet visible={supplierPickerOpen} onClose={() => setSupplierPickerOpen(false)} onSelect={setSupplier} />
      <ProductPickerSheet
        visible={productPickerOpen}
        onClose={() => setProductPickerOpen(false)}
        onSelect={(product) => {
          setItems((prev) => {
            if (prev.some((it) => it.productId === product.id)) return prev;
            return [...prev, { productId: product.id, productName: product.name, quantity: 1, unitCost: product.purchasePrice }];
          });
        }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  totalCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: palette.gray50,
  },
});
