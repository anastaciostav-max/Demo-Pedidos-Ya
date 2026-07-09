import { useRouter } from 'expo-router';
import { ChevronDown, Package } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { notify } from '@/lib/confirm';
import { ProductPickerSheet } from '@/components/domain/ProductPickerSheet';
import { AppText, Button, Card, Input, ScreenContainer, ScreenHeader, SegmentedControl } from '@/components/ui';
import { useInventoryStore } from '@/stores/useInventoryStore';
import { palette, radius, spacing } from '@/theme';
import type { MovementReason, Product } from '@/types/models';

const REASONS: { key: MovementReason; label: string }[] = [
  { key: 'compra', label: 'Compra' },
  { key: 'devolucion', label: 'Devolución' },
  { key: 'ajuste_manual', label: 'Otro' },
];

export default function EntradaScreen() {
  const router = useRouter();
  const registerEntrada = useInventoryStore((s) => s.registerEntrada);
  const [product, setProduct] = useState<Product | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState<MovementReason>('compra');
  const [note, setNote] = useState('');

  function handleSubmit() {
    const qty = parseInt(quantity, 10);
    if (!product) return notify('Selecciona un producto');
    if (!qty || qty <= 0) return notify('Ingresa una cantidad válida');
    registerEntrada(product.id, qty, reason, note.trim() || undefined);
    router.back();
  }

  return (
    <ScreenContainer>
      <ScreenHeader title="Entrada de inventario" />
      <Pressable onPress={() => setPickerOpen(true)}>
        <Card style={styles.selector}>
          <View style={styles.thumb}>
            <Package size={20} color={palette.gray400} />
          </View>
          <View style={{ flex: 1 }}>
            <AppText variant="caption">Producto</AppText>
            <AppText variant="bodySemibold">{product?.name ?? 'Selecciona un producto'}</AppText>
          </View>
          <ChevronDown size={18} color={palette.gray400} />
        </Card>
      </Pressable>

      {product && (
        <AppText variant="caption" style={{ marginTop: spacing.xs }}>
          Stock actual: {product.stock} {product.unit}
        </AppText>
      )}

      <Input
        label="Cantidad a ingresar"
        keyboardType="number-pad"
        placeholder="0"
        value={quantity}
        onChangeText={setQuantity}
        containerStyle={{ marginTop: spacing.md }}
      />

      <AppText variant="captionMedium" style={{ marginTop: spacing.md, marginBottom: spacing.xs }}>
        Motivo
      </AppText>
      <SegmentedControl segments={REASONS.map((r) => ({ key: r.key, label: r.label }))} value={reason} onChange={(k) => setReason(k as MovementReason)} />

      <Input label="Nota (opcional)" placeholder="Ej. Recepción de proveedor" value={note} onChangeText={setNote} containerStyle={{ marginTop: spacing.md }} />

      <Button label="Registrar entrada" onPress={handleSubmit} fullWidth style={{ marginTop: spacing.xl }} />

      <ProductPickerSheet visible={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={setProduct} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  thumb: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: palette.gray50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
