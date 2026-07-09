import { useRouter } from 'expo-router';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Boxes,
  ScanLine,
  SlidersHorizontal,
  TriangleAlert,
} from 'lucide-react-native';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText, Badge, Card, ScreenContainer } from '@/components/ui';
import { formatRelative } from '@/lib/format';
import { useInventoryStore } from '@/stores/useInventoryStore';
import { useProductStore } from '@/stores/useProductStore';
import { palette, radius, spacing } from '@/theme';

const REASON_LABEL: Record<string, string> = {
  compra: 'Compra',
  venta: 'Venta',
  ajuste_manual: 'Ajuste',
  devolucion: 'Devolución',
  merma: 'Merma',
  inicial: 'Inventario inicial',
};

export default function InventarioScreen() {
  const router = useRouter();
  const products = useProductStore((s) => s.products);
  const movements = useInventoryStore((s) => s.movements);

  const lowStock = useMemo(
    () => products.filter((p) => p.active && p.stock <= p.minStock).sort((a, b) => a.stock - b.stock),
    [products],
  );
  const recent = useMemo(
    () => [...movements].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 20),
    [movements],
  );
  const productMap = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);

  return (
    <ScreenContainer contentStyle={{ paddingTop: spacing.md }}>
      <AppText variant="title" style={{ marginBottom: spacing.lg }}>
        Inventario
      </AppText>

      <View style={styles.actionsRow}>
        <ActionTile
          icon={<ArrowDownCircle size={20} color={palette.success} />}
          label="Entrada"
          bg={palette.successBg}
          onPress={() => router.push('/inventario/entrada')}
        />
        <ActionTile
          icon={<ArrowUpCircle size={20} color={palette.danger} />}
          label="Salida"
          bg={palette.dangerBg}
          onPress={() => router.push('/inventario/salida')}
        />
        <ActionTile
          icon={<SlidersHorizontal size={20} color={palette.blue600} />}
          label="Ajuste"
          bg={palette.infoBg}
          onPress={() => router.push('/inventario/ajuste')}
        />
        <ActionTile
          icon={<ScanLine size={20} color={palette.navy700} />}
          label="Escanear"
          bg={palette.gray100}
          onPress={() => router.push('/inventario/escaner')}
        />
      </View>

      {lowStock.length > 0 && (
        <Card style={{ marginTop: spacing.lg }}>
          <View style={styles.sectionHeader}>
            <TriangleAlert size={18} color={palette.warning} />
            <AppText variant="headline" style={{ marginLeft: 6 }}>
              Poco stock ({lowStock.length})
            </AppText>
          </View>
          {lowStock.slice(0, 6).map((p) => (
            <Pressable key={p.id} onPress={() => router.push(`/inventario/${p.id}`)} style={styles.lowStockRow}>
              <AppText variant="bodyMedium" numberOfLines={1} style={{ flex: 1 }}>
                {p.name}
              </AppText>
              <Badge label={`${p.stock} / mín. ${p.minStock}`} fg={palette.warning} bg={palette.warningBg} />
            </Pressable>
          ))}
        </Card>
      )}

      <Card style={{ marginTop: spacing.lg }}>
        <View style={styles.sectionHeader}>
          <Boxes size={18} color={palette.blue600} />
          <AppText variant="headline" style={{ marginLeft: 6 }}>
            Movimientos recientes
          </AppText>
        </View>
        {recent.length === 0 && <AppText variant="caption">Sin movimientos todavía.</AppText>}
        {recent.map((m) => {
          const product = productMap.get(m.productId);
          const isIn = m.type === 'entrada';
          return (
            <Pressable
              key={m.id}
              style={styles.movementRow}
              onPress={() => router.push(`/inventario/${m.productId}`)}
            >
              <View
                style={[
                  styles.movementIcon,
                  { backgroundColor: isIn ? palette.successBg : m.type === 'salida' ? palette.dangerBg : palette.infoBg },
                ]}
              >
                {isIn ? (
                  <ArrowDownCircle size={16} color={palette.success} />
                ) : m.type === 'salida' ? (
                  <ArrowUpCircle size={16} color={palette.danger} />
                ) : (
                  <SlidersHorizontal size={16} color={palette.blue600} />
                )}
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <AppText variant="bodyMedium" numberOfLines={1}>
                  {product?.name ?? 'Producto'}
                </AppText>
                <AppText variant="caption">
                  {REASON_LABEL[m.reason] ?? m.reason} · {formatRelative(m.createdAt)}
                </AppText>
              </View>
              <AppText variant="bodySemibold" color={isIn ? palette.success : m.type === 'salida' ? palette.danger : palette.navy900}>
                {isIn ? '+' : m.type === 'salida' ? '-' : ''}
                {m.quantity}
              </AppText>
            </Pressable>
          );
        })}
      </Card>
    </ScreenContainer>
  );
}

function ActionTile({ icon, label, bg, onPress }: { icon: React.ReactNode; label: string; bg: string; onPress: () => void }) {
  return (
    <Pressable style={styles.actionTile} onPress={onPress}>
      <View style={[styles.actionIcon, { backgroundColor: bg }]}>{icon}</View>
      <AppText variant="captionMedium" style={{ marginTop: 6 }}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionTile: {
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  lowStockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  movementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    gap: spacing.sm,
  },
  movementIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
