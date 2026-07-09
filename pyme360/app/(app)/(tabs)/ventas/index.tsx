import { useRouter } from 'expo-router';
import { Receipt } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { AppText, Badge, Card, EmptyState, FAB, ScreenContainer, SearchBar } from '@/components/ui';
import { formatCurrency, formatDateTime } from '@/lib/format';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useSaleStore } from '@/stores/useSaleStore';
import { palette, spacing } from '@/theme';

const PAYMENT_LABEL: Record<string, string> = {
  efectivo: 'Efectivo',
  tarjeta: 'Tarjeta',
  transferencia: 'Transferencia',
  credito: 'Crédito',
};

export default function VentasScreen() {
  const router = useRouter();
  const sales = useSaleStore((s) => s.sales);
  const business = useBusinessStore((s) => s.business);
  const [query, setQuery] = useState('');

  const sorted = useMemo(() => {
    const list = [...sales].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if (!query) return list;
    return list.filter((s) => `${s.folio} ${s.clientName}`.toLowerCase().includes(query.toLowerCase()));
  }, [sales, query]);

  const todayTotal = sales
    .filter((s) => new Date(s.createdAt).toDateString() === new Date().toDateString())
    .reduce((s, sale) => s + sale.total, 0);

  return (
    <ScreenContainer floating={<FAB onPress={() => router.push('/ventas/nueva')} />}>
      <View style={{ paddingTop: spacing.md, paddingHorizontal: spacing.lg }}>
        <AppText variant="title">Ventas</AppText>
        <AppText variant="caption" style={{ marginTop: 2, marginBottom: spacing.sm }}>
          Hoy: {formatCurrency(todayTotal, business?.currency)} · {sales.length} ventas totales
        </AppText>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Buscar por folio o cliente..." />
      </View>

      {sorted.length === 0 ? (
        <EmptyState
          icon={<Receipt size={30} color={palette.gray400} />}
          title="Sin ventas"
          subtitle="Registra tu primera venta rápida."
          actionLabel="Nueva venta"
          onAction={() => router.push('/ventas/nueva')}
        />
      ) : (
        <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.sm }}>
          {sorted.slice(0, 60).map((sale) => (
            <Pressable key={sale.id} onPress={() => router.push(`/ventas/${sale.id}`)}>
              <Card style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <AppText variant="bodySemibold" numberOfLines={1}>
                    {sale.clientName}
                  </AppText>
                  <AppText variant="caption">
                    Folio {sale.folio} · {formatDateTime(sale.createdAt)}
                  </AppText>
                  <Badge label={PAYMENT_LABEL[sale.paymentMethod]} fg={palette.blue600} bg={palette.infoBg} />
                </View>
                <AppText variant="headline">{formatCurrency(sale.total, business?.currency)}</AppText>
              </Card>
            </Pressable>
          ))}
        </View>
      )}
    </ScreenContainer>
  );
}
