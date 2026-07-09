import { useLocalSearchParams } from 'expo-router';
import { CircleCheck, FileDown, MessageCircle } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { AppText, Badge, Card, Divider, ScreenContainer, ScreenHeader } from '@/components/ui';
import { formatCurrency, formatDateTime } from '@/lib/format';
import { buildSaleReceiptHtml, shareHtmlAsPdf } from '@/lib/pdf';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useSaleStore } from '@/stores/useSaleStore';
import { palette, spacing } from '@/theme';

const PAYMENT_LABEL: Record<string, string> = {
  efectivo: 'Efectivo',
  tarjeta: 'Tarjeta',
  transferencia: 'Transferencia',
  credito: 'Crédito',
};

export default function VentaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const sale = useSaleStore((s) => s.sales.find((sl) => sl.id === id));
  const business = useBusinessStore((s) => s.business);
  const [sharing, setSharing] = useState(false);

  if (!sale) {
    return (
      <ScreenContainer>
        <ScreenHeader title="Venta" />
        <AppText variant="body">Esta venta ya no existe.</AppText>
      </ScreenContainer>
    );
  }

  async function handleShare() {
    try {
      setSharing(true);
      const html = buildSaleReceiptHtml(sale!, business);
      await shareHtmlAsPdf(html, `Venta ${sale!.folio}`);
    } catch (e) {
      Alert.alert('No se pudo generar el PDF', 'Intenta nuevamente.');
    } finally {
      setSharing(false);
    }
  }

  return (
    <ScreenContainer>
      <ScreenHeader title={`Folio ${sale.folio}`} subtitle={formatDateTime(sale.createdAt)} />

      <Card style={styles.statusCard}>
        <CircleCheck size={20} color={palette.success} />
        <AppText variant="bodySemibold" style={{ marginLeft: spacing.xs }}>
          Venta completada
        </AppText>
        <View style={{ flex: 1 }} />
        <Badge label={PAYMENT_LABEL[sale.paymentMethod]} fg={palette.blue600} bg={palette.infoBg} />
      </Card>

      <Card style={{ marginTop: spacing.md }}>
        <AppText variant="caption">Cliente</AppText>
        <AppText variant="headline">{sale.clientName}</AppText>
      </Card>

      <AppText variant="headline" style={styles.sectionTitle}>
        Productos
      </AppText>
      <Card>
        {sale.items.map((it, idx) => (
          <View key={it.productId}>
            <View style={styles.itemRow}>
              <View style={{ flex: 1 }}>
                <AppText variant="bodyMedium" numberOfLines={1}>
                  {it.productName}
                </AppText>
                <AppText variant="caption">
                  {it.quantity} × {formatCurrency(it.unitPrice, business?.currency)}
                </AppText>
              </View>
              <AppText variant="bodySemibold">
                {formatCurrency(it.unitPrice * it.quantity - it.discount, business?.currency)}
              </AppText>
            </View>
            {idx < sale.items.length - 1 && <Divider />}
          </View>
        ))}
      </Card>

      <Card style={[styles.totalsCard, { marginTop: spacing.md }]}>
        <Row label="Subtotal" value={formatCurrency(sale.subtotal, business?.currency)} />
        <Row label="Descuento" value={`-${formatCurrency(sale.discount, business?.currency)}`} />
        <Row label="IVA" value={formatCurrency(sale.iva, business?.currency)} />
        <Row label="Total" value={formatCurrency(sale.total, business?.currency)} big />
      </Card>

      <View style={styles.actionsRow}>
        <ActionButton icon={<FileDown size={18} color={palette.blue600} />} label="Exportar PDF" onPress={handleShare} loading={sharing} />
        <ActionButton icon={<MessageCircle size={18} color={palette.success} />} label="Compartir WhatsApp" onPress={handleShare} loading={sharing} />
      </View>
    </ScreenContainer>
  );
}

function Row({ label, value, big }: { label: string; value: string; big?: boolean }) {
  return (
    <View style={styles.row}>
      <AppText variant={big ? 'headline' : 'body'}>{label}</AppText>
      <AppText variant={big ? 'title' : 'bodySemibold'} color={big ? palette.blue600 : palette.navy900}>
        {value}
      </AppText>
    </View>
  );
}

function ActionButton({ icon, label, onPress, loading }: { icon: React.ReactNode; label: string; onPress: () => void; loading?: boolean }) {
  return (
    <Pressable onPress={loading ? undefined : onPress} style={styles.actionButton}>
      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, paddingVertical: 2 }}>
          {icon}
          <AppText variant="bodySemibold">{loading ? 'Generando...' : label}</AppText>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  statusCard: { flexDirection: 'row', alignItems: 'center' },
  sectionTitle: { marginTop: spacing.lg, marginBottom: spacing.sm },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm },
  totalsCard: { backgroundColor: palette.gray50 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  actionsRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  actionButton: { flex: 1 },
});
