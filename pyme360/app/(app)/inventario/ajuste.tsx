import { useRouter } from 'expo-router';
import { ChevronDown, Package } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { ProductPickerSheet } from '@/components/domain/ProductPickerSheet';
import { AppText, Button, Card, Input, ScreenContainer, ScreenHeader } from '@/components/ui';
import { useInventoryStore } from '@/stores/useInventoryStore';
import { palette, radius, spacing } from '@/theme';
import type { Product } from '@/types/models';

export default function AjusteScreen() {
  const router = useRouter();
  const registerAjuste = useInventoryStore((s) => s.registerAjuste);
  const [product, setProduct] = useState<Product | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [newStock, setNewStock] = useState('');
  const [note, setNote] = useState('');

  function handleSubmit() {
    const value = parseInt(newStock, 10);
    if (!product) return Alert.alert('Selecciona un producto');
    if (Number.isNaN(value) || value < 0) return Alert.alert('Ingresa un valor de stock válido');
    registerAjuste(product.id, value, note.trim() || undefined);
    router.back();
  }

  return (
    <ScreenContainer>
      <ScreenHeader title="Ajuste de inventario" />
      <Pressable
        onPress={() => setPickerOpen(true)}
      >
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
          Stock registrado actualmente: {product.stock} {product.unit}
        </AppText>
      )}

      <Input
        label="Nuevo stock real"
        keyboardType="number-pad"
        placeholder="0"
        value={newStock}
        onChangeText={setNewStock}
        containerStyle={{ marginTop: spacing.md }}
      />

      <Input
        label="Motivo del ajuste"
        placeholder="Ej. Conteo físico de fin de mes"
        value={note}
        onChangeText={setNote}
        containerStyle={{ marginTop: spacing.md }}
      />

      <Button label="Aplicar ajuste" onPress={handleSubmit} fullWidth style={{ marginTop: spacing.xl }} />

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
