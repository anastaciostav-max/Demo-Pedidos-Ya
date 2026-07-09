import { useLocalSearchParams, useRouter } from 'expo-router';
import { Trash2 } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { ClientForm } from '@/components/domain/ClientForm';
import { AppText, Avatar, Card, Divider, IconButton, ScreenContainer, ScreenHeader } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/format';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useClientStore } from '@/stores/useClientStore';
import { useSaleStore } from '@/stores/useSaleStore';
import { palette, spacing } from '@/theme';

export default function ClienteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const client = useClientStore((s) => s.clients.find((c) => c.id === id));
  const updateClient = useClientStore((s) => s.updateClient);
  const removeClient = useClientStore((s) => s.removeClient);
  const sales = useSaleStore((s) => s.sales);
  const business = useBusinessStore((s) => s.business);
  const [saved, setSaved] = useState(false);

  const clientSales = useMemo(
    () => sales.filter((s) => s.clientId === id).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [sales, id],
  );
  const totalPurchased = clientSales.reduce((s, sale) => s + sale.total, 0);
  const creditOwed = clientSales.filter((s) => s.paymentMethod === 'credito').reduce((s, sale) => s + sale.total, 0);

  if (!client) {
    return (
      <ScreenContainer>
        <ScreenHeader title="Cliente" />
        <AppText variant="body">Este cliente ya no existe.</AppText>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScreenHeader
        title={client.name}
        right={
          <IconButton
            onPress={() =>
              Alert.alert('Eliminar cliente', `¿Eliminar a "${client.name}"?`, [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Eliminar', style: 'destructive', onPress: () => { removeClient(client.id); router.back(); } },
              ])
            }
          >
            <Trash2 size={18} color={palette.danger} />
          </IconButton>
        }
      />

      <Card style={styles.headerCard}>
        <Avatar name={client.name} size={56} />
        <View style={{ marginLeft: spacing.sm, flex: 1 }}>
          <AppText variant="headline">{client.name}</AppText>
          <AppText variant="caption">{client.phone ?? 'Sin teléfono'}</AppText>
          <AppText variant="caption">{client.email ?? 'Sin correo'}</AppText>
        </View>
      </Card>

      <AppText variant="headline" style={styles.sectionTitle}>
        Estado de cuenta
      </AppText>
      <Card style={styles.accountRow}>
        <View>
          <AppText variant="caption">Total comprado</AppText>
          <AppText variant="title">{formatCurrency(totalPurchased, business?.currency)}</AppText>
        </View>
        <View>
          <AppText variant="caption">Crédito usado</AppText>
          <AppText variant="headline" color={creditOwed > 0 ? palette.warning : palette.navy900}>
            {formatCurrency(creditOwed, business?.currency)}
          </AppText>
        </View>
        <View>
          <AppText variant="caption">Límite</AppText>
          <AppText variant="headline">{formatCurrency(client.creditLimit, business?.currency)}</AppText>
        </View>
      </Card>

      <AppText variant="headline" style={styles.sectionTitle}>
        Historial de compras ({clientSales.length})
      </AppText>
      <Card>
        {clientSales.length === 0 && <AppText variant="caption">Sin compras registradas.</AppText>}
        {clientSales.slice(0, 8).map((sale, idx) => (
          <Pressable key={sale.id} onPress={() => router.push(`/ventas/${sale.id}`)}>
            <View style={styles.saleRow}>
              <View>
                <AppText variant="bodySemibold">Folio {sale.folio}</AppText>
                <AppText variant="caption">{formatDate(sale.createdAt)}</AppText>
              </View>
              <AppText variant="bodySemibold">{formatCurrency(sale.total, business?.currency)}</AppText>
            </View>
            {idx < Math.min(clientSales.length, 8) - 1 && <Divider />}
          </Pressable>
        ))}
      </Card>

      {client.notes ? (
        <>
          <AppText variant="headline" style={styles.sectionTitle}>
            Notas
          </AppText>
          <Card>
            <AppText variant="body">{client.notes}</AppText>
          </Card>
        </>
      ) : null}

      <AppText variant="headline" style={styles.sectionTitle}>
        Editar información
      </AppText>
      <ClientForm
        initial={client}
        submitLabel={saved ? 'Guardado ✓' : 'Guardar cambios'}
        onSubmit={(values) => {
          updateClient(client.id, values);
          setSaved(true);
          setTimeout(() => setSaved(false), 1500);
        }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
});
