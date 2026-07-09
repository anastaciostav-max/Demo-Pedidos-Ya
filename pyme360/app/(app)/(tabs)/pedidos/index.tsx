import { useRouter } from 'expo-router';
import { ClipboardList } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { AppText, Card, EmptyState, FAB, ScreenContainer, SegmentedControl, StatusPill } from '@/components/ui';
import { formatCurrency, formatDateTime } from '@/lib/format';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useOrderStore } from '@/stores/useOrderStore';
import { palette, spacing } from '@/theme';
import type { OrderStatus } from '@/types/models';

const FILTERS: { key: OrderStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'pendiente', label: 'Pendiente' },
  { key: 'preparando', label: 'Preparando' },
  { key: 'enviado', label: 'Enviado' },
  { key: 'entregado', label: 'Entregado' },
  { key: 'cancelado', label: 'Cancelado' },
];

export default function PedidosScreen() {
  const router = useRouter();
  const orders = useOrderStore((s) => s.orders);
  const business = useBusinessStore((s) => s.business);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');

  const filtered = useMemo(() => {
    const list = [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if (filter === 'all') return list;
    return list.filter((o) => o.status === filter);
  }, [orders, filter]);

  return (
    <ScreenContainer scroll={false} contentStyle={{ flex: 1 }}>
      <View style={{ paddingTop: spacing.md, paddingHorizontal: spacing.lg }}>
        <AppText variant="title" style={{ marginBottom: spacing.sm }}>
          Pedidos
        </AppText>
        <SegmentedControl segments={FILTERS} value={filter} onChange={(k) => setFilter(k as OrderStatus | 'all')} scrollable />
      </View>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<ClipboardList size={30} color={palette.gray400} />}
          title="Sin pedidos"
          subtitle="Registra un pedido para darle seguimiento a su entrega."
          actionLabel="Nuevo pedido"
          onAction={() => router.push('/pedidos/nuevo')}
        />
      ) : (
        <View style={{ flex: 1, paddingHorizontal: spacing.lg, marginTop: spacing.sm }}>
          {filtered.map((o) => (
            <Pressable key={o.id} onPress={() => router.push(`/pedidos/${o.id}`)}>
              <Card style={{ marginBottom: spacing.sm }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <AppText variant="bodySemibold" numberOfLines={1}>
                      {o.clientName}
                    </AppText>
                    <AppText variant="caption">
                      {o.folio} · {formatDateTime(o.createdAt)}
                    </AppText>
                  </View>
                  <StatusPill status={o.status} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs }}>
                  <AppText variant="caption">{o.items.length} productos</AppText>
                  <AppText variant="bodySemibold">{formatCurrency(o.total, business?.currency)}</AppText>
                </View>
              </Card>
            </Pressable>
          ))}
        </View>
      )}

      <FAB onPress={() => router.push('/pedidos/nuevo')} />
    </ScreenContainer>
  );
}
