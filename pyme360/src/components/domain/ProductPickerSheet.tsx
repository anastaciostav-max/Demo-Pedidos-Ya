import { Package } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { AppText, SearchBar, Sheet } from '@/components/ui';
import { useProductStore } from '@/stores/useProductStore';
import { palette, radius, spacing } from '@/theme';
import type { Product } from '@/types/models';

interface ProductPickerSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (product: Product) => void;
  onlyInStock?: boolean;
}

export function ProductPickerSheet({ visible, onClose, onSelect, onlyInStock }: ProductPickerSheetProps) {
  const products = useProductStore((s) => s.products);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (onlyInStock && p.stock <= 0) return false;
      if (!query) return true;
      return `${p.name} ${p.sku} ${p.barcode}`.toLowerCase().includes(query.toLowerCase());
    });
  }, [products, query, onlyInStock]);

  return (
    <Sheet visible={visible} onClose={onClose} title="Selecciona un producto">
      <SearchBar value={query} onChangeText={setQuery} placeholder="Buscar producto..." />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        style={{ marginTop: spacing.sm }}
        renderItem={({ item }) => (
          <Pressable
            style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, gap: spacing.sm }}
            onPress={() => {
              onSelect(item);
              onClose();
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: radius.md,
                backgroundColor: palette.gray50,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Package size={18} color={palette.gray400} />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <AppText variant="bodyMedium" numberOfLines={1}>
                {item.name}
              </AppText>
              <AppText variant="caption">
                Stock: {item.stock} · ${item.salePrice.toFixed(2)}
              </AppText>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={<AppText variant="caption">No se encontraron productos.</AppText>}
      />
    </Sheet>
  );
}
