import { useRouter } from 'expo-router';
import { Mail, Settings, ShieldCheck } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Avatar, Button, Card, Input, ScreenContainer, ScreenHeader } from '@/components/ui';
import { confirmAction } from '@/lib/confirm';
import { useAuthStore } from '@/stores/useAuthStore';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { palette, spacing } from '@/theme';

const ROLE_LABEL: Record<string, string> = { admin: 'Administrador', vendedor: 'Vendedor' };

export default function PerfilScreen() {
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.currentUser());
  const updateCurrentUser = useAuthStore((s) => s.updateCurrentUser);
  const logout = useAuthStore((s) => s.logout);
  const business = useBusinessStore((s) => s.business);

  const [name, setName] = useState(currentUser?.name ?? '');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | undefined>();

  return (
    <ScreenContainer>
      <ScreenHeader title="Perfil" />

      <Card style={styles.headerCard}>
        <Avatar name={currentUser?.name ?? 'U'} size={64} />
        <AppText variant="title" style={{ marginTop: spacing.sm }}>
          {currentUser?.name}
        </AppText>
        <View style={styles.roleBadge}>
          <ShieldCheck size={14} color={palette.blue600} />
          <AppText variant="captionMedium" color={palette.blue600} style={{ marginLeft: 4 }}>
            {ROLE_LABEL[currentUser?.role ?? 'vendedor']}
          </AppText>
        </View>
      </Card>

      <Card style={{ marginTop: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        <Mail size={18} color={palette.gray500} />
        <AppText variant="body">{currentUser?.email}</AppText>
      </Card>

      <AppText variant="headline" style={styles.sectionTitle}>
        Negocio
      </AppText>
      <Card>
        <AppText variant="caption">Nombre del negocio</AppText>
        <AppText variant="bodySemibold" style={{ marginBottom: spacing.sm }}>
          {business?.name}
        </AppText>
        <AppText variant="caption">Propietario</AppText>
        <AppText variant="bodySemibold">{business?.ownerName}</AppText>
      </Card>

      <AppText variant="headline" style={styles.sectionTitle}>
        Editar nombre
      </AppText>
      <Card>
        <Input label="Nombre completo" value={name} onChangeText={setName} containerStyle={{ marginBottom: spacing.sm }} />
        {error && (
          <AppText variant="caption" color={palette.danger} style={{ marginBottom: spacing.sm }}>
            {error}
          </AppText>
        )}
        <Button
          label={saved ? 'Guardado ✓' : 'Guardar cambios'}
          onPress={() => {
            if (!name.trim()) return setError('El nombre no puede estar vacío.');
            setError(undefined);
            updateCurrentUser({ name: name.trim() });
            setSaved(true);
            setTimeout(() => setSaved(false), 1500);
          }}
        />
      </Card>

      <Button
        label="Ir a configuración"
        variant="outline"
        icon={<Settings size={16} color={palette.blue600} />}
        fullWidth
        onPress={() => router.push('/configuracion')}
        style={{ marginTop: spacing.lg }}
      />

      <Button
        label="Cerrar sesión"
        variant="ghost"
        fullWidth
        onPress={() =>
          confirmAction('Cerrar sesión', '¿Seguro que deseas salir?', 'Cerrar sesión', logout, {
            destructive: true,
          })
        }
        style={{ marginTop: spacing.sm }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerCard: { alignItems: 'center', paddingVertical: spacing.xl },
  roleBadge: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs, backgroundColor: palette.infoBg, paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: 999 },
  sectionTitle: { marginTop: spacing.lg, marginBottom: spacing.sm },
});
