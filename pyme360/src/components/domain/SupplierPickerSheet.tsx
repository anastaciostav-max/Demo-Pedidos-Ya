import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { AppText, Avatar, SearchBar, Sheet } from '@/components/ui';
import { useSupplierStore } from '@/stores/useSupplierStore';
import { spacing } from '@/theme';
import type { Supplier } from '@/types/models';

interface SupplierPickerSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (supplier: Supplier) => void;
}

export function SupplierPickerSheet({ visible, onClose, onSelect }: SupplierPickerSheetProps) {
  const suppliers = useSupplierStore((s) => s.suppliers);
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () => suppliers.filter((s) => !query || s.name.toLowerCase().includes(query.toLowerCase())),
    [suppliers, query],
  );

  return (
    <Sheet visible={visible} onClose={onClose} title="Selecciona un proveedor">
      <SearchBar value={query} onChangeText={setQuery} placeholder="Buscar proveedor..." />
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
            <Avatar name={item.name} size={36} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <AppText variant="bodyMedium" numberOfLines={1}>
                {item.name}
              </AppText>
              {item.contactName && <AppText variant="caption">{item.contactName}</AppText>}
            </View>
          </Pressable>
        )}
        ListEmptyComponent={<AppText variant="caption">No hay proveedores registrados.</AppText>}
      />
    </Sheet>
  );
}
