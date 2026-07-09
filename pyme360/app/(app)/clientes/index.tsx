import { useRouter } from 'expo-router';
import { Users } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { AppText, Avatar, Card, EmptyState, FAB, ScreenContainer, ScreenHeader, SearchBar } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import { useClientStore } from '@/stores/useClientStore';
import { useSaleStore } from '@/stores/useSaleStore';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { palette, spacing } from '@/theme';

export default function ClientesScreen() {
  const router = useRouter();
  const clients = useClientStore((s) => s.clients);
  const sales = useSaleStore((s) => s.sales);
  const business = useBusinessStore((s) => s.business);
  const [query, setQuery] = useState('');

  const totalsByClient = useMemo(() => {
    const map = new Map<string, number>();
    sales.forEach((s) => {
      if (!s.clientId) return;
      map.set(s.clientId, (map.get(s.clientId) ?? 0) + s.total);
    });
    return map;
  }, [sales]);

  const filtered = useMemo(
    () =>
      clients.filter((c) => !query || `${c.name} ${c.email ?? ''} ${c.phone ?? ''}`.toLowerCase().includes(query.toLowerCase())),
    [clients, query],
  );

  return (
    <ScreenContainer scroll={false} contentStyle={{ flex: 1 }}>
      <ScreenHeader title="Clientes" subtitle={`${clients.length} registrados`} />
      <View style={{ paddingHorizontal: spacing.lg }}>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Buscar cliente..." />
      </View>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users size={30} color={palette.gray400} />}
          title="Sin clientes"
          subtitle="Agrega tu primer cliente para llevar su historial."
          actionLabel="Nuevo cliente"
          onAction={() => router.push('/clientes/nuevo')}
        />
      ) : (
        <View style={{ flex: 1, paddingHorizontal: spacing.lg, marginTop: spacing.sm }}>
          {filtered.map((c) => (
            <Pressable key={c.id} onPress={() => router.push(`/clientes/${c.id}`)}>
              <Card style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm, gap: spacing.sm }}>
                <Avatar name={c.name} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <AppText variant="bodySemibold" numberOfLines={1}>
                    {c.name}
                  </AppText>
                  <AppText variant="caption" numberOfLines={1}>
                    {c.phone ?? c.email ?? 'Sin contacto'}
                  </AppText>
                </View>
                <AppText variant="bodySemibold">
                  {formatCurrency(totalsByClient.get(c.id) ?? 0, business?.currency)}
                </AppText>
              </Card>
            </Pressable>
          ))}
        </View>
      )}

      <FAB onPress={() => router.push('/clientes/nuevo')} />
    </ScreenContainer>
  );
}
