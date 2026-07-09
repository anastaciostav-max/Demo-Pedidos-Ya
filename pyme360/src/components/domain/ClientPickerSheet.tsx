import { User } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { AppText, Avatar, SearchBar, Sheet } from '@/components/ui';
import { useClientStore } from '@/stores/useClientStore';
import { palette, radius, spacing } from '@/theme';
import type { Client } from '@/types/models';

interface ClientPickerSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (client: Client | null) => void;
}

export function ClientPickerSheet({ visible, onClose, onSelect }: ClientPickerSheetProps) {
  const clients = useClientStore((s) => s.clients);
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () => clients.filter((c) => !query || c.name.toLowerCase().includes(query.toLowerCase())),
    [clients, query],
  );

  return (
    <Sheet visible={visible} onClose={onClose} title="Selecciona un cliente">
      <SearchBar value={query} onChangeText={setQuery} placeholder="Buscar cliente..." />
      <Pressable
        style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, gap: spacing.sm }}
        onPress={() => {
          onSelect(null);
          onClose();
        }}
      >
        <View style={{ width: 36, height: 36, borderRadius: radius.pill, backgroundColor: palette.gray100, alignItems: 'center', justifyContent: 'center' }}>
          <User size={16} color={palette.gray500} />
        </View>
        <AppText variant="bodyMedium">Público general</AppText>
      </Pressable>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
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
              {item.phone && <AppText variant="caption">{item.phone}</AppText>}
            </View>
          </Pressable>
        )}
      />
    </Sheet>
  );
}
