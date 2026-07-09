import { useLocalSearchParams } from 'expo-router';
import { ArrowDownCircle, ArrowUpCircle, SlidersHorizontal } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Card, ScreenContainer, ScreenHeader } from '@/components/ui';
import { formatDateTime } from '@/lib/format';
import { useInventoryStore } from '@/stores/useInventoryStore';
import { useProductStore } from '@/stores/useProductStore';
import { palette, radius, spacing } from '@/theme';

const REASON_LABEL: Record<string, string> = {
  compra: 'Compra',
  venta: 'Venta',
  ajuste_manual: 'Ajuste manual',
  devolucion: 'Devolución',
  merma: 'Merma',
  inicial: 'Inventario inicial',
};

export default function KardexScreen() {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const product = useProductStore((s) => s.products.find((p) => p.id === productId));
  const allMovements = useInventoryStore((s) => s.movements);

  const sorted = useMemo(
    () =>
      allMovements
        .filter((m) => m.productId === productId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [allMovements, productId],
  );

  return (
    <ScreenContainer>
      <ScreenHeader title="Kardex" subtitle={product?.name} />

      <Card style={styles.summary}>
        <View>
          <AppText variant="caption">Stock actual</AppText>
          <AppText variant="title">{product?.stock ?? 0}</AppText>
        </View>
        <View>
          <AppText variant="caption">Stock mínimo</AppText>
          <AppText variant="headline">{product?.minStock ?? 0}</AppText>
        </View>
        <View>
          <AppText variant="caption">Movimientos</AppText>
          <AppText variant="headline">{sorted.length}</AppText>
        </View>
      </Card>

      <AppText variant="headline" style={{ marginTop: spacing.lg, marginBottom: spacing.sm }}>
        Historial
      </AppText>

      {sorted.length === 0 && <AppText variant="caption">Sin movimientos registrados.</AppText>}

      {sorted.map((m, idx) => {
        const isIn = m.type === 'entrada';
        return (
          <Card key={m.id} style={[styles.row, idx === sorted.length - 1 && { marginBottom: 0 }]}>
            <View
              style={[
                styles.icon,
                { backgroundColor: isIn ? palette.successBg : m.type === 'salida' ? palette.dangerBg : palette.infoBg },
              ]}
            >
              {isIn ? (
                <ArrowDownCircle size={18} color={palette.success} />
              ) : m.type === 'salida' ? (
                <ArrowUpCircle size={18} color={palette.danger} />
              ) : (
                <SlidersHorizontal size={18} color={palette.blue600} />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <AppText variant="bodySemibold">{REASON_LABEL[m.reason] ?? m.reason}</AppText>
              <AppText variant="caption">{formatDateTime(m.createdAt)}</AppText>
              {m.note && <AppText variant="caption">{m.note}</AppText>}
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <AppText variant="bodySemibold" color={isIn ? palette.success : m.type === 'salida' ? palette.danger : palette.navy900}>
                {isIn ? '+' : m.type === 'salida' ? '-' : '='}
                {m.quantity}
              </AppText>
              <AppText variant="caption">saldo: {m.stockAfter}</AppText>
            </View>
          </Card>
        );
      })}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
