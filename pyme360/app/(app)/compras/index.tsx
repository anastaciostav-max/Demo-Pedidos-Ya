import { useRouter } from 'expo-router';
import { ShoppingBag } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import { AppText, Card, EmptyState, FAB, ScreenContainer, ScreenHeader } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/format';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { usePurchaseStore } from '@/stores/usePurchaseStore';
import { palette, spacing } from '@/theme';

export default function ComprasScreen() {
  const router = useRouter();
  const purchases = usePurchaseStore((s) => s.purchases);
  const business = useBusinessStore((s) => s.business);
  const sorted = [...purchases].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <ScreenContainer scroll={sorted.length > 0}>
      <ScreenHeader title="Compras" subtitle={`${purchases.length} registradas`} />

      {sorted.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag size={30} color={palette.gray400} />}
          title="Sin compras"
          subtitle="Registra una compra a tu proveedor y el inventario se actualizará automáticamente."
          actionLabel="Nueva compra"
          onAction={() => router.push('/compras/nueva')}
        />
      ) : (
        <View style={{ paddingHorizontal: spacing.lg }}>
          {sorted.map((p) => (
            <Card key={p.id} style={{ marginBottom: spacing.sm }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                  <AppText variant="bodySemibold">{p.supplierName}</AppText>
                  <AppText variant="caption">
                    Folio {p.folio} · {formatDate(p.createdAt)}
                  </AppText>
                  <AppText variant="caption">{p.items.length} productos</AppText>
                </View>
                <AppText variant="headline">{formatCurrency(p.total, business?.currency)}</AppText>
              </View>
            </Card>
          ))}
        </View>
      )}

      <FAB onPress={() => router.push('/compras/nueva')} />
    </ScreenContainer>
  );
}
