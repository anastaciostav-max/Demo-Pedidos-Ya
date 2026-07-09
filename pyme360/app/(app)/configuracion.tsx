import { Bell, Info, Palette, Store } from 'lucide-react-native';
import React, { useState } from 'react';
import { Switch, View } from 'react-native';
import { AppText, Button, Card, Input, Logo, ScreenContainer, ScreenHeader } from '@/components/ui';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { palette, spacing } from '@/theme';

export default function ConfiguracionScreen() {
  const business = useBusinessStore((s) => s.business);
  const updateBusiness = useBusinessStore((s) => s.updateBusiness);

  const [name, setName] = useState(business?.name ?? '');
  const [address, setAddress] = useState(business?.address ?? '');
  const [phone, setPhone] = useState(business?.phone ?? '');
  const [ivaRate, setIvaRate] = useState(business ? String(business.ivaRate * 100) : '16');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const [notifLowStock, setNotifLowStock] = useState(true);
  const [notifOrders, setNotifOrders] = useState(true);

  return (
    <ScreenContainer>
      <ScreenHeader title="Configuración" />

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg }}>
        <Store size={18} color={palette.blue600} />
        <AppText variant="headline">Datos del negocio</AppText>
      </View>
      <Card>
        <Input label="Nombre del negocio" value={name} onChangeText={setName} containerStyle={{ marginBottom: spacing.sm }} />
        <Input label="Dirección" value={address} onChangeText={setAddress} containerStyle={{ marginBottom: spacing.sm }} />
        <Input label="Teléfono" keyboardType="phone-pad" value={phone} onChangeText={setPhone} containerStyle={{ marginBottom: spacing.sm }} />
        <Input label="IVA (%)" keyboardType="decimal-pad" value={ivaRate} onChangeText={setIvaRate} containerStyle={{ marginBottom: spacing.sm }} />
        {error && (
          <AppText variant="caption" color={palette.danger} style={{ marginBottom: spacing.sm }}>
            {error}
          </AppText>
        )}
        <Button
          label={saved ? 'Guardado ✓' : 'Guardar cambios'}
          onPress={() => {
            if (!name.trim()) return setError('El nombre del negocio es obligatorio.');
            const iva = parseFloat(ivaRate);
            if (ivaRate.trim() && (Number.isNaN(iva) || iva < 0 || iva > 100)) {
              return setError('El IVA debe ser un porcentaje entre 0 y 100.');
            }
            setError(undefined);
            updateBusiness({
              name: name.trim(),
              address,
              phone,
              ivaRate: Math.max(0, Math.min(100, iva || 0)) / 100,
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 1500);
          }}
        />
      </Card>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xl, marginBottom: spacing.md }}>
        <Bell size={18} color={palette.blue600} />
        <AppText variant="headline">Notificaciones</AppText>
      </View>
      <Card>
        <SwitchRow label="Alertas de poco stock" value={notifLowStock} onChange={setNotifLowStock} />
        <SwitchRow label="Nuevos pedidos" value={notifOrders} onChange={setNotifOrders} last />
      </Card>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xl, marginBottom: spacing.md }}>
        <Palette size={18} color={palette.blue600} />
        <AppText variant="headline">Apariencia</AppText>
      </View>
      <Card style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <AppText variant="body">Tema</AppText>
        <AppText variant="bodySemibold" color={palette.blue600}>
          Claro
        </AppText>
      </Card>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xl, marginBottom: spacing.md }}>
        <Info size={18} color={palette.blue600} />
        <AppText variant="headline">Acerca de</AppText>
      </View>
      <Card style={{ alignItems: 'center', paddingVertical: spacing.lg }}>
        <Logo size={56} />
        <AppText variant="bodySemibold" style={{ marginTop: spacing.sm }}>
          Pyme360
        </AppText>
        <AppText variant="caption">Versión 1.0.0</AppText>
        <AppText variant="caption" style={{ marginTop: 4 }}>
          Tu negocio, 360° bajo control
        </AppText>
      </Card>
    </ScreenContainer>
  );
}

function SwitchRow({ label, value, onChange, last }: { label: string; value: boolean; onChange: (v: boolean) => void; last?: boolean }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.xs,
        marginBottom: last ? 0 : spacing.xs,
      }}
    >
      <AppText variant="body">{label}</AppText>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ true: palette.blue600, false: palette.gray200 }}
      />
    </View>
  );
}
