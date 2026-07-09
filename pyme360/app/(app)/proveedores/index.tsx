import { useRouter } from 'expo-router';
import { Truck } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { AppText, Avatar, Card, EmptyState, FAB, ScreenContainer, ScreenHeader, SearchBar } from '@/components/ui';
import { useSupplierStore } from '@/stores/useSupplierStore';
import { palette, spacing } from '@/theme';

export default function ProveedoresScreen() {
  const router = useRouter();
  const suppliers = useSupplierStore((s) => s.suppliers);
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () => suppliers.filter((s) => !query || `${s.name} ${s.contactName ?? ''}`.toLowerCase().includes(query.toLowerCase())),
    [suppliers, query],
  );

  return (
    <ScreenContainer scroll={false} contentStyle={{ flex: 1 }}>
      <ScreenHeader title="Proveedores" subtitle={`${suppliers.length} registrados`} />
      <View style={{ paddingHorizontal: spacing.lg }}>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Buscar proveedor..." />
      </View>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Truck size={30} color={palette.gray400} />}
          title="Sin proveedores"
          subtitle="Registra tus proveedores para llevar el control de compras."
          actionLabel="Nuevo proveedor"
          onAction={() => router.push('/proveedores/nuevo')}
        />
      ) : (
        <View style={{ flex: 1, paddingHorizontal: spacing.lg, marginTop: spacing.sm }}>
          {filtered.map((s) => (
            <Pressable key={s.id} onPress={() => router.push(`/proveedores/${s.id}`)}>
              <Card style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm, gap: spacing.sm }}>
                <Avatar name={s.name} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <AppText variant="bodySemibold" numberOfLines={1}>
                    {s.name}
                  </AppText>
                  <AppText variant="caption" numberOfLines={1}>
                    {s.contactName ?? s.phone ?? 'Sin contacto'}
                  </AppText>
                </View>
              </Card>
            </Pressable>
          ))}
        </View>
      )}

      <FAB onPress={() => router.push('/proveedores/nuevo')} />
    </ScreenContainer>
  );
}
