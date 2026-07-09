import { useRouter } from 'expo-router';
import { ChevronDown, Package, Plus, Trash2, User } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { notify } from '@/lib/confirm';
import { ClientPickerSheet } from '@/components/domain/ClientPickerSheet';
import { ProductPickerSheet } from '@/components/domain/ProductPickerSheet';
import { AppText, Button, Card, IconButton, Input, ScreenContainer, ScreenHeader, SegmentedControl } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useSaleStore } from '@/stores/useSaleStore';
import { palette, radius, spacing } from '@/theme';
import type { Client, PaymentMethod, SaleItem } from '@/types/models';

const PAYMENT_METHODS: { key: PaymentMethod; label: string }[] = [
  { key: 'efectivo', label: 'Efectivo' },
  { key: 'tarjeta', label: 'Tarjeta' },
  { key: 'transferencia', label: 'Transfer.' },
  { key: 'credito', label: 'Crédito' },
];

export default function NuevaVentaScreen() {
  const router = useRouter();
  const addSale = useSaleStore((s) => s.addSale);
  const business = useBusinessStore((s) => s.business);

  const [client, setClient] = useState<Client | null>(null);
  const [clientPickerOpen, setClientPickerOpen] = useState(false);
  const [productPickerOpen, setProductPickerOpen] = useState(false);
  const [items, setItems] = useState<SaleItem[]>([]);
  const [discount, setDiscount] = useState('0');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('efectivo');

  const ivaRate = business?.ivaRate ?? 0.16;

  const totals = useMemo(() => {
    const subtotal = items.reduce((s, it) => s + it.unitPrice * it.quantity, 0);
    const itemDiscounts = items.reduce((s, it) => s + it.discount, 0);
    const globalDiscount = parseFloat(discount) || 0;
    const totalDiscount = itemDiscounts + globalDiscount;
    const taxable = Math.max(0, subtotal - totalDiscount);
    const iva = taxable * ivaRate;
    return { subtotal, totalDiscount, iva, total: taxable + iva };
  }, [items, discount, ivaRate]);

  function updateQty(productId: string, delta: number) {
    setItems((prev) =>
      prev.map((it) => (it.productId === productId ? { ...it, quantity: Math.max(1, it.quantity + delta) } : it)),
    );
  }

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((it) => it.productId !== productId));
  }

  function handleSubmit() {
    if (items.length === 0) return notify('Agrega al menos un producto');
    const sale = addSale({
      clientId: client?.id,
      clientName: client?.name ?? 'Público General',
      items,
      discount: parseFloat(discount) || 0,
      ivaRate,
      paymentMethod,
    });
    router.replace(`/ventas/${sale.id}`);
  }

  return (
    <ScreenContainer>
      <ScreenHeader title="Venta rápida" />

      <Pressable onPress={() => setClientPickerOpen(true)}>
        <Card style={styles.selector}>
          <View style={styles.thumb}>
            <User size={18} color={palette.gray400} />
          </View>
          <View style={{ flex: 1 }}>
            <AppText variant="caption">Cliente</AppText>
            <AppText variant="bodySemibold">{client?.name ?? 'Público General'}</AppText>
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
            Escanea o busca productos para agregarlos.
          </AppText>
        </Card>
      )}

      {items.map((it) => (
        <Card key={it.productId} style={styles.itemCard}>
          <View style={{ flex: 1 }}>
            <AppText variant="bodySemibold" numberOfLines={1}>
              {it.productName}
            </AppText>
            <AppText variant="caption">{formatCurrency(it.unitPrice, business?.currency)} c/u</AppText>
          </View>
          <View style={styles.qtyControls}>
            <IconButton size={30} onPress={() => updateQty(it.productId, -1)}>
              <AppText variant="bodySemibold">-</AppText>
            </IconButton>
            <AppText variant="bodySemibold" style={{ width: 26, textAlign: 'center' }}>
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

      <View style={styles.itemsHeader}>
        <AppText variant="headline">Forma de pago</AppText>
      </View>
      <SegmentedControl segments={PAYMENT_METHODS.map((p) => ({ key: p.key, label: p.label }))} value={paymentMethod} onChange={(k) => setPaymentMethod(k as PaymentMethod)} scrollable />

      <Input
        label={`Descuento adicional (${business?.currency ?? 'USD'})`}
        keyboardType="decimal-pad"
        value={discount}
        onChangeText={setDiscount}
        containerStyle={{ marginTop: spacing.md }}
      />

      <Card style={[styles.totalsCard, { marginTop: spacing.lg }]}>
        <Row label="Subtotal" value={formatCurrency(totals.subtotal, business?.currency)} />
        <Row label="Descuento" value={`-${formatCurrency(totals.totalDiscount, business?.currency)}`} />
        <Row label={`IVA (${(ivaRate * 100).toFixed(0)}%)`} value={formatCurrency(totals.iva, business?.currency)} />
        <Row label="Total" value={formatCurrency(totals.total, business?.currency)} big />
      </Card>

      <Button label="Registrar venta" onPress={handleSubmit} fullWidth style={{ marginTop: spacing.lg }} />

      <ClientPickerSheet visible={clientPickerOpen} onClose={() => setClientPickerOpen(false)} onSelect={setClient} />
      <ProductPickerSheet
        visible={productPickerOpen}
        onClose={() => setProductPickerOpen(false)}
        onlyInStock
        onSelect={(product) => {
          setItems((prev) => {
            if (prev.some((it) => it.productId === product.id)) return prev;
            return [
              ...prev,
              {
                productId: product.id,
                productName: product.name,
                quantity: 1,
                unitPrice: product.salePrice,
                unitCost: product.purchasePrice,
                discount: 0,
              },
            ];
          });
        }}
      />
    </ScreenContainer>
  );
}

function Row({ label, value, big }: { label: string; value: string; big?: boolean }) {
  return (
    <View style={styles.row}>
      <AppText variant={big ? 'headline' : 'body'}>{label}</AppText>
      <AppText variant={big ? 'title' : 'bodySemibold'} color={big ? palette.blue600 : palette.navy900}>
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  selector: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  thumb: { width: 36, height: 36, borderRadius: radius.md, backgroundColor: palette.gray50, alignItems: 'center', justifyContent: 'center' },
  itemsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.lg, marginBottom: spacing.sm },
  itemCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  qtyControls: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  totalsCard: { backgroundColor: palette.gray50 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
});
