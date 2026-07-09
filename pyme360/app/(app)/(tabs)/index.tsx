import { useRouter } from 'expo-router';
import {
  AlarmClockCheck,
  Boxes,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  UserPlus,
  Wallet,
} from 'lucide-react-native';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText, Avatar, Card, ScreenContainer, StatCard } from '@/components/ui';
import { BarTrend } from '@/components/charts/BarTrend';
import {
  lowStockProducts,
  monthSales,
  newClientsInRange,
  pendingOrders,
  salesByDay,
  sumProfit,
  sumTotal,
  todaySales,
  topProducts,
  unitsSold,
} from '@/lib/analytics';
import { formatCurrency, formatCurrencyCompact, formatNumber } from '@/lib/format';
import { useAuthStore } from '@/stores/useAuthStore';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useClientStore } from '@/stores/useClientStore';
import { useOrderStore } from '@/stores/useOrderStore';
import { useProductStore } from '@/stores/useProductStore';
import { useSaleStore } from '@/stores/useSaleStore';
import { palette, spacing } from '@/theme';

export default function DashboardScreen() {
  const router = useRouter();
  const business = useBusinessStore((s) => s.business);
  const currentUser = useAuthStore((s) => s.currentUser());
  const sales = useSaleStore((s) => s.sales);
  const products = useProductStore((s) => s.products);
  const orders = useOrderStore((s) => s.orders);
  const clients = useClientStore((s) => s.clients);

  const now = new Date();

  const stats = useMemo(() => {
    const today = todaySales(sales, now);
    const month = monthSales(sales, now);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    return {
      todayTotal: sumTotal(today),
      monthTotal: sumTotal(month),
      profit: sumProfit(month),
      units: unitsSold(month),
      lowStock: lowStockProducts(products),
      pending: pendingOrders(orders),
      newClients: newClientsInRange(clients, monthStart, now),
      top: topProducts(month, 5),
      trend: salesByDay(sales, 14, now),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sales, products, orders, clients]);

  const firstName = currentUser?.name?.split(' ')[0] ?? '';
  const greeting = now.getHours() < 12 ? 'Buenos días' : now.getHours() < 19 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <ScreenContainer contentStyle={{ paddingTop: spacing.md }}>
      <View style={styles.header}>
        <View>
          <AppText variant="caption">
            {greeting}
          </AppText>
          <AppText variant="title">{firstName || business?.name}</AppText>
        </View>
        <Pressable onPress={() => router.push('/perfil')}>
          <Avatar name={currentUser?.name ?? 'U'} size={44} />
        </Pressable>
      </View>

      <View style={styles.grid}>
        <View style={styles.tileFlex}>
          <StatCard
            icon={<DollarSign size={20} color={palette.blue600} />}
            label="Ventas del día"
            value={formatCurrencyCompact(stats.todayTotal, business?.currency)}
          />
        </View>
        <View style={styles.tileFlex}>
          <StatCard
            icon={<TrendingUp size={20} color={palette.teal500} />}
            label="Ventas del mes"
            value={formatCurrencyCompact(stats.monthTotal, business?.currency)}
            accentBg={palette.successBg}
          />
        </View>
        <View style={styles.tileFlex}>
          <StatCard
            icon={<Wallet size={20} color={palette.blue600} />}
            label="Utilidad del mes"
            value={formatCurrencyCompact(stats.profit, business?.currency)}
          />
        </View>
        <View style={styles.tileFlex}>
          <StatCard
            icon={<Package size={20} color={palette.navy700} />}
            label="Productos vendidos"
            value={formatNumber(stats.units)}
            accentBg={palette.gray100}
          />
        </View>
        <Pressable style={styles.tileFlex} onPress={() => router.push('/inventario')}>
          <StatCard
            icon={<Boxes size={20} color={palette.warning} />}
            label="Poco stock"
            value={String(stats.lowStock.length)}
            accentBg={palette.warningBg}
          />
        </Pressable>
        <Pressable style={styles.tileFlex} onPress={() => router.push('/(app)/(tabs)/pedidos')}>
          <StatCard
            icon={<AlarmClockCheck size={20} color={palette.blue600} />}
            label="Pedidos pendientes"
            value={String(stats.pending.length)}
          />
        </Pressable>
        <Pressable style={styles.tileFlex} onPress={() => router.push('/clientes')}>
          <StatCard
            icon={<UserPlus size={20} color={palette.teal500} />}
            label="Clientes nuevos"
            value={String(stats.newClients.length)}
            accentBg={palette.successBg}
          />
        </Pressable>
        <Pressable style={styles.tileFlex} onPress={() => router.push('/(app)/ventas/nueva')}>
          <StatCard
            icon={<ShoppingCart size={20} color={palette.white} />}
            label="Nueva venta"
            value="Registrar"
            accent={palette.white}
            accentBg={palette.blue600}
          />
        </Pressable>
      </View>

      <Card style={{ marginTop: spacing.lg }}>
        <View style={styles.sectionHeader}>
          <AppText variant="headline">Ventas — últimos 14 días</AppText>
        </View>
        <BarTrend data={stats.trend} formatValue={(v) => formatCurrency(v, business?.currency)} />
      </Card>

      <Card style={{ marginTop: spacing.lg }}>
        <View style={styles.sectionHeader}>
          <AppText variant="headline">Productos más vendidos</AppText>
        </View>
        {stats.top.length === 0 && (
          <AppText variant="caption">Aún no hay ventas este mes.</AppText>
        )}
        {stats.top.map((p, i) => (
          <View key={p.productId} style={styles.rankRow}>
            <View style={styles.rankBadge}>
              <AppText variant="bodySemibold" color={palette.blue600}>
                {i + 1}
              </AppText>
            </View>
            <View style={{ flex: 1 }}>
              <AppText variant="bodySemibold" numberOfLines={1}>
                {p.productName}
              </AppText>
              <AppText variant="caption">{p.quantity} unidades vendidas</AppText>
            </View>
            <AppText variant="bodySemibold">{formatCurrency(p.revenue, business?.currency)}</AppText>
          </View>
        ))}
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  tileFlex: {
    flexBasis: '47%',
    flexGrow: 1,
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    gap: spacing.sm,
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: palette.infoBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
