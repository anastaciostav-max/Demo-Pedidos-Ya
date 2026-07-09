import { FileDown, FileSpreadsheet } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { notify } from '@/lib/confirm';
import { BarTrend } from '@/components/charts/BarTrend';
import { AppText, Button, Card, ScreenContainer, ScreenHeader, SegmentedControl } from '@/components/ui';
import {
  lowStockProducts,
  salesByDay,
  salesInRange,
  sumProfit,
  sumTotal,
  topClients,
  topProducts,
  unitsSold,
} from '@/lib/analytics';
import { buildCsv, shareCsv } from '@/lib/csv';
import { formatCurrency, formatCurrencyCompact, formatDate } from '@/lib/format';
import { buildReportHtml, shareHtmlAsPdf } from '@/lib/pdf';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useProductStore } from '@/stores/useProductStore';
import { useSaleStore } from '@/stores/useSaleStore';
import { palette, spacing } from '@/theme';

const PERIODS = [
  { key: '7', label: '7 días' },
  { key: '30', label: '30 días' },
  { key: '90', label: '90 días' },
  { key: 'all', label: 'Todo' },
];

export default function ReportesScreen() {
  const sales = useSaleStore((s) => s.sales);
  const products = useProductStore((s) => s.products);
  const business = useBusinessStore((s) => s.business);
  const [period, setPeriod] = useState('30');
  const [exporting, setExporting] = useState<'pdf' | 'csv' | null>(null);

  const rangedSales = useMemo(() => {
    if (period === 'all') return sales;
    const now = new Date();
    const from = new Date(now);
    from.setDate(from.getDate() - parseInt(period, 10));
    return salesInRange(sales, from, now);
  }, [sales, period]);

  const stats = useMemo(() => {
    const total = sumTotal(rangedSales);
    const profit = sumProfit(rangedSales);
    const units = unitsSold(rangedSales);
    const ticket = rangedSales.length > 0 ? total / rangedSales.length : 0;
    return { total, profit, units, ticket, count: rangedSales.length };
  }, [rangedSales]);

  const trend = useMemo(() => salesByDay(sales, period === 'all' ? 30 : Math.min(30, parseInt(period, 10) || 30)), [sales, period]);
  const top = useMemo(() => topProducts(rangedSales, 8), [rangedSales]);
  const bestClients = useMemo(() => topClients(rangedSales, 5), [rangedSales]);
  const lowStock = useMemo(() => lowStockProducts(products), [products]);

  async function handleExportPdf() {
    try {
      setExporting('pdf');
      const html = buildReportHtml({
        title: 'Reporte de ventas',
        subtitle: `Periodo: ${PERIODS.find((p) => p.key === period)?.label}`,
        business,
        stats: [
          { label: 'Ventas totales', value: formatCurrency(stats.total, business?.currency) },
          { label: 'Utilidad', value: formatCurrency(stats.profit, business?.currency) },
          { label: 'Unidades vendidas', value: String(stats.units) },
          { label: 'Ticket promedio', value: formatCurrency(stats.ticket, business?.currency) },
        ],
        tableTitle: 'Productos más vendidos',
        headers: ['Producto', 'Unidades', 'Ingresos'],
        rows: top.map((p) => [p.productName, p.quantity, formatCurrency(p.revenue, business?.currency)]),
      });
      await shareHtmlAsPdf(html, 'Reporte Pyme360');
    } catch {
      notify('No se pudo generar el PDF');
    } finally {
      setExporting(null);
    }
  }

  async function handleExportCsv() {
    try {
      setExporting('csv');
      const csv = buildCsv(
        ['Folio', 'Fecha', 'Cliente', 'Subtotal', 'Descuento', 'IVA', 'Total', 'Pago'],
        rangedSales.map((s) => [s.folio, formatDate(s.createdAt), s.clientName, s.subtotal, s.discount, s.iva, s.total, s.paymentMethod]),
      );
      await shareCsv(csv, `ventas_pyme360_${period}.csv`);
    } catch {
      notify('No se pudo generar el archivo');
    } finally {
      setExporting(null);
    }
  }

  return (
    <ScreenContainer>
      <ScreenHeader title="Reportes" />

      <SegmentedControl segments={PERIODS} value={period} onChange={setPeriod} scrollable />

      <View style={styles.statsGrid}>
        <StatMini label="Ventas" value={formatCurrencyCompact(stats.total, business?.currency)} />
        <StatMini label="Utilidad" value={formatCurrencyCompact(stats.profit, business?.currency)} />
        <StatMini label="Unidades" value={String(stats.units)} />
        <StatMini label="Ticket prom." value={formatCurrencyCompact(stats.ticket, business?.currency)} />
      </View>

      <Card style={{ marginTop: spacing.lg }}>
        <AppText variant="headline" style={{ marginBottom: spacing.sm }}>
          Tendencia de ventas
        </AppText>
        <BarTrend data={trend} />
      </Card>

      <AppText variant="headline" style={styles.sectionTitle}>
        Productos más vendidos
      </AppText>
      <Card>
        {top.length === 0 && <AppText variant="caption">Sin ventas en este periodo.</AppText>}
        {top.map((p, idx) => (
          <View key={p.productId} style={styles.row}>
            <AppText variant="bodyMedium" style={{ flex: 1 }} numberOfLines={1}>
              {idx + 1}. {p.productName}
            </AppText>
            <AppText variant="caption">{p.quantity} u.</AppText>
            <AppText variant="bodySemibold" style={{ marginLeft: spacing.sm }}>
              {formatCurrency(p.revenue, business?.currency)}
            </AppText>
          </View>
        ))}
      </Card>

      <AppText variant="headline" style={styles.sectionTitle}>
        Mejores clientes
      </AppText>
      <Card>
        {bestClients.length === 0 && <AppText variant="caption">Sin datos en este periodo.</AppText>}
        {bestClients.map((c, idx) => (
          <View key={c.clientId ?? c.clientName} style={styles.row}>
            <AppText variant="bodyMedium" style={{ flex: 1 }} numberOfLines={1}>
              {idx + 1}. {c.clientName}
            </AppText>
            <AppText variant="bodySemibold">{formatCurrency(c.total, business?.currency)}</AppText>
          </View>
        ))}
      </Card>

      <AppText variant="headline" style={styles.sectionTitle}>
        Inventario con poco stock ({lowStock.length})
      </AppText>
      <Card>
        {lowStock.length === 0 && <AppText variant="caption">Todo tu inventario está en niveles saludables.</AppText>}
        {lowStock.slice(0, 6).map((p) => (
          <View key={p.id} style={styles.row}>
            <AppText variant="bodyMedium" style={{ flex: 1 }} numberOfLines={1}>
              {p.name}
            </AppText>
            <AppText variant="caption" color={palette.warning}>
              {p.stock} / mín. {p.minStock}
            </AppText>
          </View>
        ))}
      </Card>

      <View style={styles.exportRow}>
        <Button
          label="Exportar PDF"
          variant="outline"
          icon={<FileDown size={16} color={palette.blue600} />}
          onPress={handleExportPdf}
          loading={exporting === 'pdf'}
          style={{ flex: 1 }}
        />
        <Button
          label="Exportar Excel"
          variant="outline"
          icon={<FileSpreadsheet size={16} color={palette.blue600} />}
          onPress={handleExportCsv}
          loading={exporting === 'csv'}
          style={{ flex: 1 }}
        />
      </View>
    </ScreenContainer>
  );
}

function StatMini({ label, value }: { label: string; value: string }) {
  return (
    <Card style={styles.statMini}>
      <AppText variant="caption">{label}</AppText>
      <AppText variant="headline">{value}</AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  statMini: {
    flexBasis: '47%',
    flexGrow: 1,
  },
  sectionTitle: { marginTop: spacing.lg, marginBottom: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.xs },
  exportRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xl, marginBottom: spacing.md },
});
