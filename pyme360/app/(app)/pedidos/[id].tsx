import { useLocalSearchParams } from 'expo-router';
import { Ban, Check, MapPin } from 'lucide-react-native';
import React from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { AppText, Badge, Button, Card, Divider, ScreenContainer, ScreenHeader, StatusPill } from '@/components/ui';
import { formatCurrency, formatDateTime } from '@/lib/format';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABELS, useOrderStore } from '@/stores/useOrderStore';
import { palette, radius, spacing } from '@/theme';
import type { OrderStatus } from '@/types/models';

export default function PedidoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = useOrderStore((s) => s.orders.find((o) => o.id === id));
  const setStatus = useOrderStore((s) => s.setStatus);
  const business = useBusinessStore((s) => s.business);

  if (!order) {
    return (
      <ScreenContainer>
        <ScreenHeader title="Pedido" />
        <AppText variant="body">Este pedido ya no existe.</AppText>
      </ScreenContainer>
    );
  }

  const currentIdx = ORDER_STATUS_FLOW.indexOf(order.status);
  const nextStatus: OrderStatus | undefined =
    order.status === 'cancelado' ? undefined : ORDER_STATUS_FLOW[currentIdx + 1];

  return (
    <ScreenContainer>
      <ScreenHeader title={`Pedido ${order.folio}`} subtitle={formatDateTime(order.createdAt)} />

      <Card style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View>
          <AppText variant="caption">Cliente</AppText>
          <AppText variant="headline">{order.clientName}</AppText>
        </View>
        <StatusPill status={order.status} />
      </Card>

      {order.status !== 'cancelado' && (
        <Card style={{ marginTop: spacing.md }}>
          <View style={styles.stepperRow}>
            {ORDER_STATUS_FLOW.map((s, idx) => {
              const done = idx <= currentIdx;
              return (
                <View key={s} style={styles.stepWrap}>
                  <View style={[styles.stepDot, done && styles.stepDotDone]}>
                    {done && <Check size={12} color={palette.white} />}
                  </View>
                  {idx < ORDER_STATUS_FLOW.length - 1 && (
                    <View style={[styles.stepLine, idx < currentIdx && styles.stepLineDone]} />
                  )}
                </View>
              );
            })}
          </View>
          <View style={styles.stepLabelsRow}>
            {ORDER_STATUS_FLOW.map((s) => (
              <AppText key={s} variant="caption" style={styles.stepLabel}>
                {ORDER_STATUS_LABELS[s]}
              </AppText>
            ))}
          </View>
        </Card>
      )}

      {order.deliveryAddress && (
        <Card style={{ marginTop: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
          <MapPin size={16} color={palette.gray500} />
          <AppText variant="body" style={{ flex: 1 }}>
            {order.deliveryAddress}
          </AppText>
        </Card>
      )}

      <AppText variant="headline" style={styles.sectionTitle}>
        Productos
      </AppText>
      <Card>
        {order.items.map((it, idx) => (
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
              <AppText variant="bodySemibold">{formatCurrency(it.unitPrice * it.quantity, business?.currency)}</AppText>
            </View>
            {idx < order.items.length - 1 && <Divider />}
          </View>
        ))}
        <Divider my={spacing.xs} />
        <View style={styles.itemRow}>
          <AppText variant="headline">Total</AppText>
          <AppText variant="title">{formatCurrency(order.total, business?.currency)}</AppText>
        </View>
      </Card>

      {order.notes && (
        <>
          <AppText variant="headline" style={styles.sectionTitle}>
            Notas
          </AppText>
          <Card>
            <AppText variant="body">{order.notes}</AppText>
          </Card>
        </>
      )}

      {order.status !== 'cancelado' && order.status !== 'entregado' && (
        <View style={styles.actionsRow}>
          {nextStatus && (
            <Button
              label={`Marcar como ${ORDER_STATUS_LABELS[nextStatus].toLowerCase()}`}
              onPress={() => setStatus(order.id, nextStatus)}
              fullWidth
              style={{ flex: 1 }}
            />
          )}
        </View>
      )}
      {order.status !== 'cancelado' && order.status !== 'entregado' && (
        <Pressable
          style={{ marginTop: spacing.sm, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 }}
          onPress={() =>
            Alert.alert('Cancelar pedido', '¿Deseas cancelar este pedido?', [
              { text: 'No', style: 'cancel' },
              { text: 'Sí, cancelar', style: 'destructive', onPress: () => setStatus(order.id, 'cancelado') },
            ])
          }
        >
          <Ban size={16} color={palette.danger} />
          <AppText variant="bodyMedium" color={palette.danger}>
            Cancelar pedido
          </AppText>
        </Pressable>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { marginTop: spacing.lg, marginBottom: spacing.sm },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm },
  stepperRow: { flexDirection: 'row', alignItems: 'center' },
  stepWrap: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  stepDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: palette.gray200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotDone: { backgroundColor: palette.blue600 },
  stepLine: { flex: 1, height: 3, backgroundColor: palette.gray200, borderRadius: 2 },
  stepLineDone: { backgroundColor: palette.blue600 },
  stepLabelsRow: { flexDirection: 'row', marginTop: 6 },
  stepLabel: { flex: 1, fontSize: 10, textAlign: 'center' },
  actionsRow: { flexDirection: 'row', marginTop: spacing.lg },
});
