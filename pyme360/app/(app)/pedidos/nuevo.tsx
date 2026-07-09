import { useRouter } from 'expo-router';
import { ChevronDown, Package, Plus, Trash2, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { ClientPickerSheet } from '@/components/domain/ClientPickerSheet';
import { ProductPickerSheet } from '@/components/domain/ProductPickerSheet';
import { AppText, Button, Card, IconButton, Input, ScreenContainer, ScreenHeader } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useOrderStore } from '@/stores/useOrderStore';
import { palette, radius, spacing } from '@/theme';
import type { Client, OrderItem } from '@/types/models';

export default function NuevoPedidoScreen() {
  const router = useRouter();
  const addOrder = useOrderStore((s) => s.addOrder);
  const business = useBusinessStore((s) => s.business);

  const [client, setClient] = useState<Client | null>(null);
  const [clientPickerOpen, setClientPickerOpen] = useState(false);
  const [productPickerOpen, setProductPickerOpen] = useState(false);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const total = items.reduce((s, it) => s + it.unitPrice * it.quantity, 0);

  function updateQty(productId: string, delta: number) {
    setItems((prev) => prev.map((it) => (it.productId === productId ? { ...it, quantity: Math.max(1, it.quantity + delta) } : it)));
  }

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((it) => it.productId !== productId));
  }

  function handleSubmit() {
    if (items.length === 0) return Alert.alert('Agrega al menos un producto');
    const order = addOrder({
      clientId: client?.id,
      clientName: client?.name ?? 'Público General',
      items,
      deliveryAddress: address.trim() || client?.address,
      notes: notes.trim() || undefined,
    });
    router.replace(`/pedidos/${order.id}`);
  }

  return (
    <ScreenContainer>
      <ScreenHeader title="Nuevo pedido" />

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
            Agrega los productos del pedido.
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

      <Input
        label="Dirección de entrega"
        placeholder="Opcional"
        value={address}
        onChangeText={setAddress}
        containerStyle={{ marginTop: spacing.md }}
      />
      <Input
        label="Notas"
        placeholder="Instrucciones especiales..."
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={2}
        containerStyle={{ marginTop: spacing.sm }}
      />

      {items.length > 0 && (
        <Card style={[styles.totalCard, { marginTop: spacing.lg }]}>
          <AppText variant="headline">Total</AppText>
          <AppText variant="title">{formatCurrency(total, business?.currency)}</AppText>
        </Card>
      )}

      <Button label="Crear pedido" onPress={handleSubmit} fullWidth style={{ marginTop: spacing.lg }} />

      <ClientPickerSheet visible={clientPickerOpen} onClose={() => setClientPickerOpen(false)} onSelect={setClient} />
      <ProductPickerSheet
        visible={productPickerOpen}
        onClose={() => setProductPickerOpen(false)}
        onSelect={(product) => {
          setItems((prev) => {
            if (prev.some((it) => it.productId === product.id)) return prev;
            return [...prev, { productId: product.id, productName: product.name, quantity: 1, unitPrice: product.salePrice }];
          });
        }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  selector: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  thumb: { width: 36, height: 36, borderRadius: radius.md, backgroundColor: palette.gray50, alignItems: 'center', justifyContent: 'center' },
  itemsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.lg, marginBottom: spacing.sm },
  itemCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  qtyControls: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  totalCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: palette.gray50 },
});
