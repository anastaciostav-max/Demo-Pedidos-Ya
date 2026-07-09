import { useLocalSearchParams, useRouter } from 'expo-router';
import { Trash2 } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { SupplierForm } from '@/components/domain/SupplierForm';
import { AppText, Avatar, Card, Divider, IconButton, ScreenContainer, ScreenHeader } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/format';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { usePurchaseStore } from '@/stores/usePurchaseStore';
import { useSupplierStore } from '@/stores/useSupplierStore';
import { palette, spacing } from '@/theme';

export default function ProveedorDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const supplier = useSupplierStore((s) => s.suppliers.find((sup) => sup.id === id));
  const updateSupplier = useSupplierStore((s) => s.updateSupplier);
  const removeSupplier = useSupplierStore((s) => s.removeSupplier);
  const purchases = usePurchaseStore((s) => s.purchases);
  const business = useBusinessStore((s) => s.business);
  const [saved, setSaved] = useState(false);

  const supplierPurchases = useMemo(
    () => purchases.filter((p) => p.supplierId === id).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [purchases, id],
  );
  const totalPurchased = supplierPurchases.reduce((s, p) => s + p.total, 0);

  if (!supplier) {
    return (
      <ScreenContainer>
        <ScreenHeader title="Proveedor" />
        <AppText variant="body">Este proveedor ya no existe.</AppText>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScreenHeader
        title={supplier.name}
        right={
          <IconButton
            onPress={() =>
              Alert.alert('Eliminar proveedor', `¿Eliminar a "${supplier.name}"?`, [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Eliminar', style: 'destructive', onPress: () => { removeSupplier(supplier.id); router.back(); } },
              ])
            }
          >
            <Trash2 size={18} color={palette.danger} />
          </IconButton>
        }
      />

      <Card style={styles.headerCard}>
        <Avatar name={supplier.name} size={56} />
        <View style={{ marginLeft: spacing.sm, flex: 1 }}>
          <AppText variant="headline">{supplier.name}</AppText>
          <AppText variant="caption">{supplier.contactName ?? 'Sin contacto asignado'}</AppText>
          <AppText variant="caption">{supplier.phone ?? supplier.email ?? ''}</AppText>
        </View>
      </Card>

      <Card style={{ marginTop: spacing.md }}>
        <AppText variant="caption">Total comprado histórico</AppText>
        <AppText variant="title">{formatCurrency(totalPurchased, business?.currency)}</AppText>
      </Card>

      <AppText variant="headline" style={styles.sectionTitle}>
        Historial de compras ({supplierPurchases.length})
      </AppText>
      <Card>
        {supplierPurchases.length === 0 && <AppText variant="caption">Sin compras registradas.</AppText>}
        {supplierPurchases.slice(0, 8).map((p, idx) => (
          <View key={p.id}>
            <View style={styles.row}>
              <View>
                <AppText variant="bodySemibold">Folio {p.folio}</AppText>
                <AppText variant="caption">{formatDate(p.createdAt)}</AppText>
              </View>
              <AppText variant="bodySemibold">{formatCurrency(p.total, business?.currency)}</AppText>
            </View>
            {idx < Math.min(supplierPurchases.length, 8) - 1 && <Divider />}
          </View>
        ))}
      </Card>

      <AppText variant="headline" style={styles.sectionTitle}>
        Editar información
      </AppText>
      <SupplierForm
        initial={supplier}
        submitLabel={saved ? 'Guardado ✓' : 'Guardar cambios'}
        onSubmit={(values) => {
          updateSupplier(supplier.id, values);
          setSaved(true);
          setTimeout(() => setSaved(false), 1500);
        }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerCard: { flexDirection: 'row', alignItems: 'center' },
  sectionTitle: { marginTop: spacing.lg, marginBottom: spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm },
});
