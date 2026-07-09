import { useRouter } from 'expo-router';
import { Package } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import {
  AppText,
  Badge,
  Card,
  EmptyState,
  FAB,
  ScreenContainer,
  ScreenHeader,
  SearchBar,
  SegmentedControl,
} from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import { useProductStore } from '@/stores/useProductStore';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { palette, radius, spacing } from '@/theme';

export default function ProductosScreen() {
  const router = useRouter();
  const products = useProductStore((s) => s.products);
  const categories = useProductStore((s) => s.categories);
  const business = useBusinessStore((s) => s.business);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const segments = useMemo(
    () => [{ key: 'all', label: 'Todas' }, ...categories.map((c) => ({ key: c.id, label: c.name }))],
    [categories],
  );

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (categoryFilter !== 'all' && p.categoryId !== categoryFilter) return false;
      if (query && !`${p.name} ${p.sku} ${p.barcode} ${p.brand}`.toLowerCase().includes(query.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [products, query, categoryFilter]);

  return (
    <ScreenContainer floating={<FAB onPress={() => router.push('/productos/nuevo')} />}>
      <ScreenHeader title="Productos" subtitle={`${products.length} en catálogo`} />
      <View style={{ paddingHorizontal: spacing.lg, gap: spacing.sm }}>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Buscar por nombre, SKU o código..." />
        <SegmentedControl segments={segments} value={categoryFilter} onChange={setCategoryFilter} scrollable />
      </View>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Package size={30} color={palette.gray400} />}
          title="Sin productos"
          subtitle="Agrega tu primer producto para comenzar a vender."
          actionLabel="Nuevo producto"
          onAction={() => router.push('/productos/nuevo')}
        />
      ) : (
        <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.sm }}>
          {filtered.map((p) => {
            const lowStock = p.stock <= p.minStock;
            const margin = p.salePrice > 0 ? ((p.salePrice - p.purchasePrice) / p.salePrice) * 100 : 0;
            return (
              <Pressable key={p.id} onPress={() => router.push(`/productos/${p.id}`)}>
                <Card style={styles.row}>
                  <View style={styles.thumb}>
                    {p.photoUri ? (
                      <Image source={{ uri: p.photoUri }} style={styles.thumbImage} />
                    ) : (
                      <Package size={22} color={palette.gray400} />
                    )}
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <AppText variant="bodySemibold" numberOfLines={1}>
                      {p.name}
                    </AppText>
                    <AppText variant="caption" numberOfLines={1}>
                      {p.brand} · SKU {p.sku}
                    </AppText>
                    <View style={styles.metaRow}>
                      <AppText variant="captionMedium" color={palette.blue600}>
                        {formatCurrency(p.salePrice, business?.currency)}
                      </AppText>
                      <AppText variant="caption"> · margen {margin.toFixed(0)}%</AppText>
                    </View>
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 6 }}>
                    {lowStock && (
                      <Badge label="Poco stock" fg={palette.warning} bg={palette.warningBg} dot />
                    )}
                    <AppText variant="bodySemibold">{p.stock}</AppText>
                    <AppText variant="caption">{p.unit}</AppText>
                  </View>
                </Card>
              </Pressable>
            );
          })}
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: palette.gray50,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumbImage: {
    width: 48,
    height: 48,
  },
  metaRow: {
    flexDirection: 'row',
    marginTop: 2,
  },
});
